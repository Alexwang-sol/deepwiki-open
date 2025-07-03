# syntax=harbor-yctest.huya.info/harbor_docker/dockerfile:1-labs

# Build argument for custom certificates directory
ARG CUSTOM_CERT_DIR="certs"

FROM harbor-yctest.huya.info/harbor_docker/node:20-alpine AS node_base

FROM node_base AS node_deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

FROM node_base AS node_builder
WORKDIR /app
COPY --from=node_deps /app/node_modules ./node_modules
# Copy only necessary files for Next.js build
COPY package.json package-lock.json next.config.ts tsconfig.json tailwind.config.js postcss.config.mjs ./
COPY src/ ./src/
COPY public/ ./public/
# Increase Node.js memory limit for build and disable telemetry
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1
RUN NODE_ENV=production npm run build

# Final stage: create a minimal production image
FROM harbor-yctest.huya.info/harbor_docker/node:20-alpine
WORKDIR /app

# Install necessary packages
RUN apk update && apk add --no-cache procps net-tools

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Update certificates if custom ones were provided and copied successfully
RUN if [ -n "${CUSTOM_CERT_DIR}" ]; then \
        mkdir -p /usr/local/share/ca-certificates && \
        if [ -d "${CUSTOM_CERT_DIR}" ]; then \
            cp -r ${CUSTOM_CERT_DIR}/* /usr/local/share/ca-certificates/ 2>/dev/null || true; \
            update-ca-certificates; \
            echo "Custom certificates installed successfully."; \
        else \
            echo "Warning: ${CUSTOM_CERT_DIR} not found. Skipping certificate installation."; \
        fi \
    fi

# Copy only the necessary artifacts from the builder stage
COPY --from=node_builder /app/public ./public
COPY --from=node_builder /app/.next/standalone ./
COPY --from=node_builder /app/.next/static ./.next/static

# Create empty .env file to ensure the start script doesn't fail if no .env is mounted.
RUN touch .env

# Create a robust start script
RUN printf '#!/bin/sh\n\
set -e\n\
echo "==> Checking for .env file..."\n\
if [ -f .env ]; then\n\
  echo "==> Loading environment variables from .env file"\n\
  set -a\n\
  . ./.env\n\
  set +a\n\
fi\n\
echo "==> Starting Node.js server..."\n\
node server.js' > /app/start.sh && chmod +x /app/start.sh

# DEBUG: Verify that start.sh was created correctly
RUN ls -la /app

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application.
# This CMD is designed for debugging. If start.sh exists, it runs it.
# If not, it keeps the container alive so you can exec into it.
CMD ["sh", "-c", "if [ -f /app/start.sh ]; then /app/start.sh; else echo 'Error: /app/start.sh not found. Keeping container alive for debugging.' && sleep infinity; fi"]

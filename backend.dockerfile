# syntax=harbor-yctest.huya.info/harbor_docker/dockerfile:1-labs

# Build argument for custom certificates directory
ARG CUSTOM_CERT_DIR="certs"

FROM harbor-yctest.huya.info/harbor_docker/python:3.11-slim AS py_deps
WORKDIR /app
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY api/requirements.txt ./api/
RUN pip install --no-cache -r api/requirements.txt

# Use Python 3.11 as final image
FROM harbor-yctest.huya.info/harbor_docker/python:3.11-slim

# Set working directory
WORKDIR /app

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

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

ENV PATH="/opt/venv/bin:$PATH"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    procps \    
    net-tools && \ 
    rm -rf /var/lib/apt/lists/*
    
# Copy Python dependencies
COPY --from=py_deps /opt/venv /opt/venv
COPY api/ ./api/

# Expose the port the app runs on
EXPOSE ${PORT:-8001}

# Create a script to run the backend
RUN echo '#!/bin/bash\n\
# Load environment variables from .env file if it exists\n\
if [ -f .env ]; then\n\
  export $(grep -v "^#" .env | xargs -r)\n\
fi\n\
\n\
# Check for required environment variables\n\
if [ -z "$OPENAI_API_KEY" ] || [ -z "$GOOGLE_API_KEY" ]; then\n\
  echo "Warning: OPENAI_API_KEY and/or GOOGLE_API_KEY environment variables are not set."\n\
  echo "These are required for DeepWiki to function properly."\n\
  echo "You can provide them via a mounted .env file or as environment variables when running the container."\n\
fi\n\
\n\
# Start the API server with the configured port\n\
python -m api.main --port ${PORT:-8001}' > /app/start.sh && chmod +x /app/start.sh

# Set environment variables
ENV PORT=8001
ENV SERVER_BASE_URL=http://localhost:${PORT:-8001}

# Create empty .env file (will be overridden if one exists at runtime)
RUN touch .env

# Command to run the application
CMD ["/app/start.sh"]

#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v "^#" .env | xargs -r)
fi

# Check for required environment variables
if [ -z "$OPENAI_API_KEY" ] || [ -z "$GOOGLE_API_KEY" ]; then
  echo "Warning: OPENAI_API_KEY and/or GOOGLE_API_KEY environment variables are not set."
  echo "These are required for DeepWiki to function properly."
  echo "You can provide them via a mounted .env file or as environment variables when running the container."
fi

# Start the API server in the background with the configured port
python -m api.main --port ${PORT:-8001} &
PORT=3000 HOSTNAME=0.0.0.0 node server.js &
wait -n
exit $?
#!/bin/bash
set -e

# AFUPM Migration — Environment Setup
# Idempotent: safe to run multiple times

cd /root/afupm-migration

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
NEXT_PUBLIC_SANITY_PROJECT_ID=d67qfgu8
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
EOF
    echo "Created .env.local — add your SANITY_API_TOKEN"
fi

echo "Setup complete."

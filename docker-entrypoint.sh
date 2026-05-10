#!/bin/sh

# Wait for database to be ready (optional but recommended)
echo "Waiting for database to be ready..."
# npx prisma migrate deploy # Apply migrations without resetting data
npx prisma db push --accept-data-loss # Faster for dev/demo

# Start the application
echo "Starting application..."
npm start

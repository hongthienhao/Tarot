#!/bin/sh

# Wait for database to be ready (optional but recommended)
echo "Waiting for database to be ready..."
until nc -z db 5432; do
  echo "Database is not ready yet, sleeping..."
  sleep 1
done
echo "Database is ready! Running migrations and seeding..."

# npx prisma migrate deploy # Apply migrations without resetting data
npx prisma db push --accept-data-loss # Faster for dev/demo
npm run seed:cards # Seed the Tarot cards data automatically

# Start the application
echo "Starting application..."
npm start

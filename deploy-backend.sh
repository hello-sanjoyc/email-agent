#!/bin/bash

#setting if some error comes, stop the script right away
set -e
echo "========================"
echo "DEPLOYMENT PROCESS START"
echo "========================"
echo ""
echo "Pulling latest code from git repo"
git pull origin main
echo ""
echo "Entering to the backend folder"
cd /var/www/email-agent/backend
echo ""
echo "Installing npm dependencies"
npm install
echo ""
echo "Running Prisma migrations"
npx prisma migrate deploy
echo ""
echo "Building from ts to js and placing prisma client"
npm run build
echo ""
echo "Starting or restarting pm2 instances"
pm2 startOrRestart ecosystem.config.js --update-env
echo "Saving pm2 processes"
pm2 save
echo "========================="
echo "DEPLOYMENT PROCESS END"
echo "========================="
pm2 status

#!/bin/bash

# Install dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/splash-screen @capacitor/status-bar

# Initialize Capacitor
npx cap init "Ghost Hunter" "com.ghosthunter.app" --web-dir=out

# Build the Next.js app for static export
npm run export

# Add Android platform
npx cap add android

# Sync the web code to the native project
npx cap sync

# Open Android Studio to build the APK
npx cap open android

echo "Now in Android Studio:"
echo "1. Go to Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo "2. The APK will be generated in android/app/build/outputs/apk/debug/"

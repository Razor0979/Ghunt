#!/bin/bash

# Make sure the script exits if any command fails
set -e

echo "=== Building Ghost Hunter Native APK ==="

# Check if React Native CLI is installed
if ! command -v react-native &> /dev/null; then
    echo "React Native CLI not found. Installing..."
    npm install -g react-native-cli
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create android/local.properties if it doesn't exist
if [ ! -f android/local.properties ]; then
    echo "Creating android/local.properties..."
    echo "sdk.dir=$ANDROID_HOME" > android/local.properties
fi

# Build the APK
echo "Building APK..."
cd android
./gradlew clean
./gradlew assembleRelease

# Check if build was successful
if [ -f app/build/outputs/apk/release/app-release.apk ]; then
    echo "=== Build Successful! ==="
    echo "APK location: $(pwd)/app/build/outputs/apk/release/app-release.apk"
    
    # Copy APK to project root for easier access
    cp app/build/outputs/apk/release/app-release.apk ../ghost-hunter.apk
    echo "APK copied to project root as ghost-hunter.apk"
else
    echo "=== Build Failed! ==="
    exit 1
fi

cd ..
echo "Done!"

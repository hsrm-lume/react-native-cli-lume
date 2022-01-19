#!/bin/bash

set -ex

cd $HOME

VERSION=7583922_latest

sudo apt-get install -y unzip
wget https://dl.google.com/android/repository/commandlinetools-linux-$VERSION.zip
unzip commandlinetools-linux-$VERSION.zip -d Android
rm commandlinetools-linux-$VERSION.zip
mv Android/cmdline-tools Android/$VERSION
mkdir Android/cmdline-tools
mv Android/$VERSION Android/cmdline-tools
export ANDROID_SDK_ROOT=$HOME/Android

sudo apt-get install -y lib32z1 openjdk-8-jdk

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin

export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/cmdline-tools/$VERSION/bin

yes | sdkmanager "platform-tools" "platforms;android-31" "build-tools;26.0.3"
yes | sdkmanager --licenses

export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools

echo "export ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT" >> ~/.bashrc
echo "export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64" >> ~/.bashrc
echo "export PATH=\$PATH:\$JAVA_HOME/bin" >> ~/.bashrc
echo "export PATH=\$PATH:\$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:\$ANDROID_SDK_ROOT/cmdline-tools/$VERSION/bin" >> ~/.bashrc
echo "export PATH=\$PATH:\$ANDROID_SDK_ROOT/platform-tools" >> ~/.bashrc
echo "export REACT_EDITOR=code" >> ~/.bashrc

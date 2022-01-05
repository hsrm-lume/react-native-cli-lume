#!/bin/bash

set -ex

cd $HOME

sudo apt-get install -y unzip
wget https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip
unzip sdk-tools-linux-4333796.zip -d Android
rm sdk-tools-linux-4333796.zip

sudo apt-get install -y lib32z1 openjdk-8-jdk

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin
printf "\n\nexport JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64\nexport PATH=\$PATH:\$JAVA_HOME/bin" >> ~/.bashrc

~/Android/tools/bin/sdkmanager
~/Android/tools/bin/sdkmanager "platform-tools" "platforms;android-31" "build-tools;26.0.3"
yes | ~/Android/tools/bin/sdkmanager --licenses

export ANDROID_HOME=$HOME/Android
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
printf "\n\nexport ANDROID_HOME=$HOME/Android\nexport PATH=\$PATH:\$ANDROID_HOME/tools\nexport PATH=\$PATH:\$ANDROID_HOME/platform-tools\n" >> ~/.bashrc

echo "\nexport REACT_EDITOR=code" >> ~/.bashrc

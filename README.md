# LUME React-Native App

## Run the App on WSL

```bash
yarn install
yarn run start   # <- this shell will be blocked
yarn run android
```

---

## Installation (on WSL)

1.  ```bash
    cd $HOME
    sudo apt-get install unzip
    wget https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip
    unzip sdk-tools-linux-4333796.zip -d Android
    rm sdk-tools-linux-4333796.zip
    sudo apt-get install -y lib32z1 openjdk-8-jdk
    export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
    export PATH=$PATH:$JAVA_HOME/bin
    printf "\n\nexport JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64\nexport PATH=\$PATH:\$JAVA_HOME/bin" >> ~/.bashrc
    cd Android/tools/bin
    ./sdkmanager "platform-tools" "platforms;android-26" "build-tools;26.0.3"
    export ANDROID_HOME=$HOME/Android
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    printf "\n\nexport ANDROID_HOME=$HOME/Android\nexport PATH=\$PATH:\$ANDROID_HOME/tools\nexport PATH=\$PATH:\$ANDROID_HOME/platform-tools" >> ~/.bashrc
    android update sdk --no-ui
    echo "export REACT_EDITOR=code" >> ~/.bashrc
    ```

2.  clone the repo

    ```bash
    git clone git@github.com:hsrm-lume/react-native-cli-lume.git
    ```

3.  install sdk

    ```bash
    ~/Android/tools/bin/sdkmanager
    ~/Android/tools/bin/sdkmanager "platform-tools" "platforms;android-31"
    yes | ~/Android/tools/bin/sdkmanager --licenses
    ```

4.  establish connection via ADB  
    Android >= 11:
    ```bash
    adb pair <ip>:<port>     # from wifi adb PAIR menu in dev options
    adb connect <ip>:<port>  # from wifi adb in dev options
    ```
    Android <= 10:
    - [download](https://developer.android.com/studio/releases/platform-tools) platform-tools.zip & unzip on windows host
    - connect android device to PC via USB
    - enable USB-Debugging on Android device
    - launch PS in directory where adb.exe is located
        ```powershell
        .\adb.exe devices     # should list your device
        .\adb.exe tcpip 5555  # forwards the connection on port 5555
        ```  
    - lauch terminal in wsl  
    
        ```bash
        adb connect <phone ip>:5555
        ```  
        (if prompted for debug-permission run `adb kill-server` and repeat last two steps)


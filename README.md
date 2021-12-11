# LUME React-Native App

## Run the App on WSL

```bash
yarn install
yarn run start   # <- this shell will be blocked
yarn run android
```

---

## Installation (on WSL)

1.  clone the repo
    ```bash
    git clone git@github.com:hsrm-lume/react-native-cli-lume.git
    ```

2.  ```bash
    cd react-native-cli-lume
    ./install.sh
    ```

3.  establish connection via ADB  
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


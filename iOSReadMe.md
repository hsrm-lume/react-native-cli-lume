# Setup iOS Development
How to setup for iOS development:

### Prerequisites
- (ARM) M1 Mac 
- Apple XCode installed
- `brew` is available and updated(`brew update`)



### Download `xcode command line tools` via terminal
this is as simple as

``xcode-select --install``

**DO NOT USE A VERSION OF THE TERMINAL OPENED WITH ROSETTA!**

### Configure xcode to use Command Line Tools
To do this, launch Xcode, then open the preferences menu in the macOS Menubar.
There, go to locations and select the downloaded version of the CLI-Tools in the Drop Down menu.

![](https://miro.medium.com/max/1400/1*ybx4Dzm1lmFBblzP6ibWDQ.png)


### Install/update ruby
MacOS ships with an old version of Ruby for backwards compatibility reasons.
Update or install the newest version with:

``brew install ruby``

### make sure ~/.zsrc is set up correctly
usually after installing Ruby it should set up the appropirate ENV variables.
Sometimes it doesn't. Therfore verify, that .zshrc contains the following lines

```
export PATH=/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/3.0.0/bin:$PATH
export LDFLAGS="-L/opt/homebrew/opt/ruby/lib"
export CPPFLAGS="-I/opt/homebrew/opt/ruby/include"
```
_Remember to restart you shell now_

###  install watchman, ffi, node, yarn and CocoaPods
we need these to install and run the app. follow any instructions that 
the terminal gives you!

`` brew install node``

 then install yarn globally, in order to be able to use it with the 
react project

```
npm install -g yarn
brew install watchman
gem install ffi
gem install cocoapods
```

### Clone the project Repo
If you haven't done it yet, clone our project Repo.

``git clone git@github.com:hsrm-lume/react-native-cli-lume.git``

### get all NPM dependecies with yarn

``yarn``

### pod install
navigate to the `ios` folder and 
use the pod gem, to install all Pods.

``cd ios && pod install``


### Setup an iOS Simulator

Navigate to Xcode's `preferences` panel from the 
MacOS Menubar. This time choose the `Components` Panel.

From there, download a Simulator of your liking. (>= iOS 11) 

![](https://miro.medium.com/max/1400/1*nnppm4Okv10mQB9yVMLFxw.png)


## Good Job!
You have done it! You should now be able to build the react app !

![](https://medium.com/@davidjasonharding/developing-a-react-native-app-on-an-m1-mac-without-rosetta-29fcc7314d70)
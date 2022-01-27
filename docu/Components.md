## Graphic components

We display error messages can in one of three possible ways:
Inside, an error bar at the bottom of the screen that only shows the icon.
Inside of an error window. This window shows the icon for the error as well as a description. If the user can dismiss the error, an 'x' will pop up, making it possible to remove the error.

A full-screen display preventing the user from using the app. This is used for errors that significantly affect the function of the app.

##### `errorbar.tsx`

This component contains a variable called "bigSize", which controls whether the user wants to see the maximized error window or the smaller error bar. With a click on the bar or the "X" on the error window, the variable "bigSize" is switched between true and false.

##### `errorIcon.tsx`

The ErrorIcon receives the error type as a message key, action and style attributes and transfers the appropriate icon depending on the error type. We then pass the icon, action, and style attributes to another Icon component.

##### `icon.tsx`

The icon gets an SVG, an action, and style attributes as parameters. It packages them into a formatted graphic that can perform any action when clicked.

##### `errorWindow.tsx`

This component iterates through all error messages (except fullscreen errors) and displays them in a scrollable window. The errorItem component is called for each error message.

##### `errorItem.tsx`

An "errorItem" consists of an error description (text field) and an icon.

##### `fullScreenErrors.tsx`

This file selects the first from the list of full-screen error messages and calls the fullErrorView for it.

##### `fullErrorWindow.tsx`

The "fullErrorWindow" forms a full-screen display of the error message and shows a retry button that allows the user to reload the view.

# GUI

The basic structure of the graphical user interface consists of screens (to be found in the `react-native-cli-lume/src/screens/` folder).
There are three screens for the app, which in turn organize other React Native components and contain the logic behind them. One controls when which components are accessed and constantly update the interface.

### `fireScreen.tsx`

The fireScreen checks for the following errors:

- was the permission for location access given
- Is NFC enabled
- Is there an internet connection

If one of these errors occurs, the FullErrorView will be displayed. The user can no longer use the main functionality of passing the fire on. The user must then correct the error to be able to use the app normally again.

The View component then generates the QRGenerator, QRScanner and FireView components depending on the Fire and QR statuses.

The FireView obtains the fire status to control whether the torch should be displayed lit or without a flame.

### `introScreen.tsx`

We invoke the intro screen the first time the app is started. We achieve this by loading the userData from the Realm the first time. The user data object reports the `firstAppUse` variable as accurate by default. This prompts the firescreen to use its React Navigation `navigation` object and navigate the Intro Screen. To learn more about the implementation of the Intro screen, read the part on React Navigation in this documentation. The Intro screen displays a couple of slides explaining the app's functionality. We construct the slides dynamically through the "Slideview" component. The "Slideview" takes three parameters. We use two of those parameters when the previous and next buttons are pressed, respectively. The third parameter consists of the current data set for the displayed slide. The copy for the slides is contained in two different arrays. We choose this approach as it makes it possible to differentiate between the iOS and Android intro-experience. Each time the component gets rerendered, the `Plattform.OS` variable is evaluated, and the slide array is set accordingly. As An example of one slide of the intro, we will take a look at the following:

```typescript
…
{
title: 'the torch',
image: Torch,
explanation:
'You always start here.\nWith the torch view you can light your torch, see if your torch is lit and also receive your flame',
},
…
```

Here one can see the structure of one slide.

The title is a string that gets displayed on top of the slide. Image is an illustration that we include into the "introScreen" as an SVG. The explanation is a complete text describing a feature.

In order to rerender a Slide when it is needed, we use two state variables. The advance and retreat functions are implemented such that the first check is if the next/previous slide is available. If this is the case, we update the two used state variables and render a new Slide through React Native's render cycle.

When the next button of the last slide is pressed, the Realm service is invoked. Here, the `firstAppUse` variable gets set to false, making the intro screen never appear again.

Subsequently, we use React Navigation's `navigation` object to navigate the fire screen and start the typical user experience. At this point, the first permission requests are invoked.

### `webScreen.tsx`

The web screen consists only of a web view. This web view is responsible for accessing the map via the URL. The map's functionality and design are implemented inside the web application.

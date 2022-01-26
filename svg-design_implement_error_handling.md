# Scalable Vector Graphics (SVG)

In order to create our design for the app, it was necessary to create a set of icons. The icons were created using Adobe Illustrator and exported to SVG format.

React-Native does not offer a direct way to integrate SVGs, as would have been possible for PNG or JPG. In order to be able to use the icons, there are two options. Either one converts the icons from SVG to PNG format or use an additional package. In order to utilize the advantages of the SVG format, such as better scalability and lower memory requirements, we decided to install the react-native-SVG package through the yarn package manager. This package offers the possibility to integrate an SVG via a URI, an XML string or an SVG file.

Since we integrated the SVG's using SVG files, the following describes how the react-native-svg package works for this purpose. In order to embed an SVG via a URI or an XML string, it is favourable to read the documentation on Github:
https://github.com/react-native-svg/react-native-svg

### Embedding an SVG

Embedding an SVG file requires an import of the icon as a React Native component. E.g., if one wanted to integrate the 'warning 'icon for error messages, the specification would look like the following:

```typescript
import WarningIcon from '../../assets/warning.svg';
```

Following this component declaration, the icon is ready to be used in the JSX part of the specifying component as such:

```typescript
<WarningIcon height={'50%'} width={'50%'} />
```

### Keeping the SVG variable

This unusual form of integration into the JSX leads to a problem if one wants to display SVGs depending on the program flow and, therefore, keep them variable.

This is because the label of a React Native component cannot be passed as a variable. Therefore, our first approach was a switch case statement that, depending on a variable, executes a return statement for the corresponding icon. With four error icons and several style components (Views, TouchableHighlight, etc.), this approach leads to a lot of code redundancy (see the following code snippet).

```typescript
case "internetWarning":
  return(
    <View style={styles.message} key = {i}>
      <View style={styles.icon}>
        <InternetWarning width={'100%'} height={'100%'}/>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}>{item.message}</Text>
      </View>
      <TouchableHighlight style={styles.closeMsg}
      underlayColor="#ffffff"
      onPress={() => {props.remMsg(item)}} >
        <CloseMsg width={15} height={15}/>
      </TouchableHighlight>
    </View>
  );
case "locationError":
  return(
    <View style={styles.message} key = {i}>
      <View style={styles.icon}>
        <LocationError width={'100%'} height={'100%'}/>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}>{item.message}</Text>
      </View>
      <TouchableHighlight style={styles.closeMsg}
      underlayColor="#ffffff"
      onPress={() => {props.remMsg(item)}} >
        <CloseMsg width={15} height={15}/>
      </TouchableHighlight>
    </View>
  );
```

Although the code only differs in the parameter marked in yellow, the complete view must be adopted.

In order to avoid this code redundancy, we created another file called `icon.tsx`. Here, a wrapping component is created that receives an SVG component, style parameters and an action as parameters:

```typescript
export const Icon = (props: {
  icon: React.FC<SvgProps>;
  action?: (x?: any) => void;
  style?: StyleProp<ViewStyle>;
}) => (…);
```

The usage of the new "icon" component allows us to replace the previously shown switch case statement with the following return statement:

```typescript
return (
	<Icon
		icon={getIcon(props.errType)}
		action={props.action}
		style={props.style}
	/>
);
```

Depending on the passed parameter, the getIcon() function returns an SVG component that we imported beforehand as described above:

```typescript
function getIcon(t: MessageKey) {
	switch (true) {
		case t.startsWith('loading'):
			return LoadingIcon;
		case t.startsWith('internet'):
			return InternetWarningIcon;
		case t.startsWith('location'):
			return LocationWarningIcon;
		default:
			return WarningIcon;
	}
}
```

# Error-Handling

Error handling essentially consists of three components:
|file location |description |
|-|-|
|`react-native-cli-lume/src/components/error/`|The files for the graphical representation of the error messages are displayed in this folder.|
|`react-native-cli-lume/src/services/ErrorHandler.tsx`|Contains the list of error messages and functions to edit them|
|`react-native-cli-lume/src/services/Errors.tsx`|Contains a dictionary with all error codes and the associated error descriptions|

#### Errors.tsx

We use this file to provide an overview of the existing error messages and associate a uniform description to the error messages. The goal was to treat the same errors in the same way. As well as having a unified error handling, we wanted to establish a design pattern in which there is central handling of errors. Handling the errors in a central place was the cleaner choice because the properties of an error message relate to the error description and the way the error is displayed (size, icon, removable).

#### MessageKey

In order to create this central handling, we declared a message key that uniquely identifies an error and can be used by typescript dictionaries, switch-case statements and functions.

All MessageKeys follow the same naming convention. We give increasingly specific descriptions of the error after a period. Using this pattern enables actions (e.g. deletion or display control) to be carried out on a group of errors by addressing them with the keyword internet, for example.
The following section explains error properties and MessageKey mapping used in `errors.tsx`.

```typescript
export type MessageKey =
// internet
| 'internet.device'
| 'internet.api'
| 'internet.map'
// gps
| 'location.device'
| 'location.accuracy'
| 'location.permission'
…
```

The `errors.tsx` file also contains a dictionary for the MessageKeys, in which we associate a user-friendly error description to each MessageKey:

```typescript
private static messages: {[key in MessageKey]: MessageDetails} = {
// internet
'internet.device': {
msg: "Can't connect to the internet",
desc: 'Please check your internet connection.',
},
'internet.api': {
msg: "Can't connect to lume servers",
desc: 'The lume servers seem to be offline. Please check back soon.',
},
…
```

We query this dictionary using the getMessage(messageType: MessageKey) method.
Furthermore, we declare whether the user can remove an error message or not and whether it is displayed over the entire screen or inside of the error bar. All errors that the user can remove are specified via the constant isDismissableError. The remaining error messages cannot be removed and displayed over the entire screen.

##### `errorhandler.tsx`

The core of this file is the errorList variable. This variable contains a list of message keys, i.e. all error messages that currently exist. Error messages can be added to or removed from the list using the handleError() and remError() methods.

##### handleError()

This function only requires the MessageKey as a parameter. It checks whether the passed error message is already in the list and adds it if need be.

##### remError()

Like handleError(), this function only needs the MessageKey to delete the error message and delete all subordinate error messages with the optional parameter includeSubtypes (errType='internet', includeSubtypes=true would delete all internet error messages).

#### Graphic components

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

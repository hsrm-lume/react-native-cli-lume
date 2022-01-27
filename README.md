# LUME React-Native App

This is the repository of the lume App for Android and iOS.

For instructions on how to get setup development environment, please refer to the Guides for [Android](documentation/Android.md) and [iOS](documentation/iOS.md).
For more general documentation on specific components used throughout the app, please consult the [documentation folder](documentation/).

## Project structure

Common code (cross platform) is located in the [src](./src) directory, platform specific code and configuration files can be found in the respective [android](./android) and [ios](./ios) directories.

Main parts of the app are separated into further subdirectories of src:

| Name       | Description                                             |
| ---------- | ------------------------------------------------------- |
| assets     | Media files like svg, png and fonts go here             |
| components | Reusable UI and fuctional pieces of the app             |
| env        | configuration for the app                               |
| screens    | Screens the user can navigate to, using ReactNavigation |
| types      | Types and classes that serve as utilities for the app   |

The project got bootstrapped with `react-native-cli`.

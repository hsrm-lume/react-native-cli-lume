# LUME React-Native App

Whis is the repository of the lume App for Android and iOS.

For instructions on how to get setup development environment, please refer to the Guides for [Android](README-Android.md) and [iOS](README-iOD.md).

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

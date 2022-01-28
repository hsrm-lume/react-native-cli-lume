## Embedding an SVG

React-Native does not offer a direct way to integrate SVGs, as would have been possible for PNG or JPG. In order to be able to use the icons, there are two options. Either one converts the icons from SVG to PNG format or use an additional package. In order to utilize the advantages of the SVG format, such as better scalability and lower memory requirements, we decided to install the react-native-SVG package through the yarn package manager. This package offers the possibility to integrate an SVG via a URI, an XML string or an SVG file.

Since we integrated the SVG's using SVG files, the following describes how the react-native-svg package works for this purpose. In order to embed an SVG via a URI or an XML string, it is favourable to read the documentation on Github:
https://github.com/react-native-svg/react-native-svg

## Example

Embedding an SVG file requires an import of the icon as a React Native component. E.g., if one wanted to integrate the 'warning 'icon for error messages, the specification would look like the following:

```ts
import WarningIcon from '../../assets/warning.svg';
```

Following this component declaration, the icon is ready to be used in the JSX part of the specifying component as such:

```tsx
<WarningIcon height={'50%'} width={'50%'} />
```

## Wrapper component

In order to avoid code redundancy, there exists a wrapper component [`icon.tsx`](../components/icon.tsx).
There, we created a wrapping component receiving an SVG component, JSX-style attributes and a click-action as parameters:

**Usage**:

```tsx
<Icon icon={getIcon(props.errType)} action={props.action} style={props.style} />
```

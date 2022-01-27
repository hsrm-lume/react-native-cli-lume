# QR-Code Scanner

## About

This component is used by the [`fireScreen.tsx`](src/screens/fireScreen.tsx) to open the camera and scan valid QR-Codes. This QRScanner receives the uuid and the position of the current user to post it to the REST API in case of success. Further this component receives a callback (e.g. to close the QRScanner) which is called when you scan a valid QR-Code or you press the cross in the top right corner.

First the scanner asks for camera permission. Until the permission is granted a loading screen will be shown. If the camera is ready and permission is granted the scanner becomes active. With the help of Frame Processors the frames are being handled every second. When a new QR-Code is detected by the Frame Processors, we check if the QR-Code has valid data and if the timestamp is not older than 10 seconds. If the QR-Code is valid we post the data to the REST API, we update the fireStatus to realm and we close the QRScanner.

## Usage

```typescript
import QRScanner from '../components/qr/qrScanner';

<QRScanner
	uid={userData.uuid}
	position={pos}
	updateQrStatus={switchQrStatus}
/>;
```

## Dependencies

For the camera we use [react-native-vision-camera](https://mrousavy.com/react-native-vision-camera). We also need to use Frame Processors because we want to scan QR-Codes. Therefore we had to install [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated). Further we use [vision-camera-code-scanner](https://github.com/rodgomesc/vision-camera-code-scanner) which is a VisionCamera Frame Processor Plugin to read QR-Codes.

# QR-Code Generator

## About

This component is used by the [`fireScreen.tsx`](src/screens/fireScreen.tsx) to generate dynamic QR-Codes. This QRGenerator receives the uuid and the position of the current user and loads this data together with a timestamp into a generated QR-Code. Further this component receives a callback (e.g. to close the QRGenerator) which is called when you press the cross in the top right corner.

## Usage

```typescript
import QRGenerator from '../components/qr/qrGenerator';

<QRGenerator
	uid={userData.uuid}
	position={pos}
	updateQrStatus={switchQrStatus}
/>;
```

## Dependencies

This QR-Code Generator is based on [react-native-qrcode-svg](https://github.com/awesomejerry/react-native-qrcode-svg). For that you also need the [react-native-svg](https://github.com/react-native-svg/react-native-svg) package.

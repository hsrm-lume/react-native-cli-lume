# NFC Reading

## About

NFC is lume's main technology to share lit flames. To boot, the [`fireScreen.tsx`](src/screens/fireScreen.tsx) spawn the [fireOffLogic](src/components/fire/fireOffLogic.tsx) component. This component utilizes react-natives useState and useEffect hooks to render a stricly logical component, that manages reading NFC Tags. As soon as the NFC-Reader reads a lume-NFC-enabled device in writing mode, it reads the data from the companion devices and starts the flame-lighting process, utilizing the features of the [`RestClient`](src/services/RestClient.tsx).

## Usage

```typescript
import {useEffect} from 'react';
import {nfcReadNext} from '../../services';

    useEffect(() => {
        nfcReadNext()
        …
    }
```

The `nfcReadNext` function returns the data read by the companion phone. If the data transmission was successful, we then compute this data into the necessary format and start informing the backend of the new user.

```typescript
import {useEffect} from 'react';
import {nfcReadNext} from '../../services';

useEffect(() => {
    …
    .then(
        ([received, self]) =>
            new HandledPromise<void>('internet.api', res => {
                RestClient.postContact(
                    received.uuid,
                    self.uuid,
                    self.location.accuracy < received.location.accuracy
                        ? self.location
                        : received.location
                ).then(res);
            })
    )
    …
}
```

If contacting the backend was successful, the Realm sets the fire status to true and re-renders the app, showing the lit torch.

In order to cause a controlled reading loop, we use a `finally` statement at the end of the promise chain inside the useEffect.

```typescript
.finally(() => {
    …
    // trigger rerender of NFC reader loop
    updateRead(!nfcReaderLoop);
});

```

Flipping this useState variable starts the whole reading process repeatedly until the user successfully reads some data.

## Dependencies

In order to read nfc data, lume relies on [react-native-nfc-manager](https://github.com/revtel/react-native-nfc-manager).

# NFC Writing

## About

In order to share lume's flame, we needed to harness the capabilities of a phone's Host-Card-Emulation(HCE) mode. HCE is one of the modes typically used to emulate the NFC capabilities of bank cards. lume uses this technology to transmit two things:

1. An App Bundle Tag, used to tell the Android OS to open the app as soon as another phone reads a lume-created NFC tag.
2. User data used to authenticate a legitimate new user to the backend

In order to address an android phone's NFC-Host-Card-Emulation system, we initially wanted to use [react-native-hce](https://github.com/appidea/react-native-hce). This library made it possible to share data over HCE. While using it, an issue occurred. The library intended only to share a single piece of data, which meant we would not send the two parts we wanted over NFC. In order to achieve this, we forked the library. The resulting fork is located [here](https://github.com/hsrm-lume/react-native-hce). We altered the usage of the library slightly to function as follows.

## Usage

```typescript
import HCESession, {
	NFCContentType,
	NFCTagType4,
} from '@hsrm-lume/react-native-hce';

let simulation;

const startSimulation = async () => {
	const tag1 = new NFCTagType4(NFCContentType.Text, 'Hello world');
	const tag2 = new NFCTagType4(NFCContentType.APP, 'com.myapp');

	simulation = new HCESession();
	await simulation.addTag(tag1);
	await simulation.addTag(tag2);
	await simulation.start();
};

startSimulation();
```

This is piece of software is invoked inside of the [`fireScreen.tsx`](src/screens/fireScreen.tsx) where the [fireOnLogic](src/components/fire/fireOnLogic.tsx) component loads up the HCE-Module of the phone with the correct data.

Find more documentation on the HCE-Fork [here](https://github.com/hsrm-lume/react-native-hce).

## Dependencies

NFC writing depends on our [fork](https://github.com/hsrm-lume/react-native-hce) of [react-native-hce](https://github.com/appidea/react-native-hce)

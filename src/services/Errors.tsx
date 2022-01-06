// The available error types
export type MessageKey =
	// internet
	| 'internet.device'
	| 'internet.api'
	| 'internet.map'
	// gps
	| 'location.device'
	| 'location.accuracy'
	| 'location.permission'
	// nfc
	| 'nfc.off'
	| 'nfc.empty'
	| 'nfc.invalid'
	| 'nfc.write'
	// storage
	| 'storage'
	// camera
	| 'camera.permission'
	// qr
	| 'qr.invalid'
	// misc
	| 'loading'
	| 'loading.map';

export const isFullscreenError = (x: MessageKey): boolean =>
	!isDismissableError(x);
// make the collowing errors dismissable, others not
export const isDismissableError = (x: MessageKey): boolean =>
	[
		'nfc.empty',
		'nfc.invalid',
		'nfc.write',
		'camera.permission',
		'qr.invalid',
	].includes(x);

/**
 * @member msg Message as string
 * 	e.g.
 * 	"Error reading from touched device" or
 * 	"Loading..."
 * @member desc Description for msg
 * 	e.g.
 * 	"Try holding your phone still while transferring the fire" or
 * 	"Please be patient while the map view is being prepared"
 */
interface MessageDetails {
	msg: string;
	desc: string;
}

export class Errors {
	// mapping from error type to message
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
		// internet.map (only shown in the map view)
		'internet.map': {
			msg: "Can't show the lume Map",
			desc: 'The Map service seems to be offline. Please check back soon',
		},
		// gps
		'location.device': {
			msg: 'GPS is turned off',
			desc: 'Please turn on your devices GPS for lume to work properly.',
		},
		'location.accuracy': {
			msg: 'GPS signal too weak',
			desc: "Your position can't be determined accurate enough. Please wait a moment or move to a spot with better GPS connectivity.",
		},
		'location.permission': {
			msg: 'No GPS permission',
			desc: 'Please grant GPS permission for lume to work properly',
		},
		// nfc
		'nfc.off': {
			msg: 'NFC is turned off',
			desc: 'Please turn on the NFC functions of your device.',
		},
		'nfc.empty': {
			msg: 'Fire could not be retrieved',
			desc: 'The touched device seems not to be a compatible lume device. Please check your peers device to have the app opened.',
		},
		'nfc.invalid': {
			msg: 'Fire could not be retrieved',
			desc: 'The touched device could not properly transfer the fire. Please retry and hold the devices steady.',
		},
		'nfc.write': {
			msg: 'Lume yould not expose your fire via NFC',
			desc: 'Maybe try to use the QR-Code scanner',
		},
		// camera
		'camera.permission': {
			msg: 'No permission for camera',
			desc: 'Please check your camera permission for lume!',
		},
		// qr
		'qr.invalid': {
			msg: 'Scanned qr code is invalid',
			desc: 'Please retry and make sure you are scanning a qr code of another lume device.',
		},
		// storage
		storage: {
			msg: 'Your profile Data could not be created',
			desc: 'Please restart the app and try again.',
		},
		// misc
		loading: {
			msg: 'Loading...',
			desc: 'Please be patient while the app is being prepared.',
		},
		'loading.map': {
			msg: 'Loading...',
			desc: 'Please be patient while the map is being prepared.',
		},
	};

	// helper method to get message to message type
	static getMessage(messageType: MessageKey): MessageDetails {
		return (
			this.messages[messageType] || {
				// use the message from dict or fallback to unknown error
				msg: 'Unknown Error!',
				desc: 'An unknown error occoured. Please try restarting the app.',
				fullscreen: true,
			}
		);
	}
}

/**
 * Interface that describes an errorMessage
 * @member errorType with pattern like `error.internet.api`
 * @member message the text to display
 * @member dismissable wether the message can be dismissed by the user
 */
export interface ErrorMessage {
	errorType: MessageKey;
	dissmisable: boolean;
}

// The available error types
export type MessageKey =
	| 'error.internet.api'
	| 'error.internet.map'
	| 'error.location'
	| 'error.location.device'
	| 'error.nfc.read.empty'
	| 'error.nfc.read.invalid'
	| 'error.nfc.process.valuableContent'
	| 'error.nfc.process.empty'
	| 'error.qr.device.camera.functionality'
	| 'error.qr.device.camera.permission'
	| 'error.storage.write'
	| 'error.storage.create'
	| 'warning.internet.device'
	| 'warning.internet.map.loading'
	| 'warning.location.accuracy'
	| 'warning.qr.device.camera.functionality';

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
	desc?: string;
}

export class Errors {
	// mapping from error type to message
	static messages: {[key in MessageKey]: MessageDetails} = {
		// *** Errors ***
		// internet
		'error.internet.api': {msg: 'Sorry, API is offline!'},
		'error.internet.map': {msg: 'Sorry, map is offline!'},
		// location
		'error.location': {msg: 'Error @ Location determination'},
		'error.location.device': {
			msg: 'GPS seems to be disabled',
			desc: 'Please turn on your devices GPS for lume to work properly.',
		},
		// nfc
		'error.nfc.read.empty': {
			msg: 'Fire could not be retrieved',
			desc: 'The touched device seems not to be a compatible lume device. Please check your peers device to have the app opened.',
		},
		'error.nfc.read.invalid': {
			msg: 'Fire could not be retrieved',
			desc: 'The touched device could not properly transfer the fire. Please retry and hold the devices steady.',
		},
		'error.nfc.process.valuableContent': {
			msg: 'Fire could not be retrieved',
			desc: 'The touched device could not properly transfer the fire. Please retry and hold the devices steady.',
		},
		'error.nfc.process.empty': {
			msg: 'Fire could not be retrieved',
			desc: 'The touched device seems not to be a compatible lume device. Please check your peers device to have the app opened.',
		},
		// qr
		'error.qr.device.camera.functionality': {
			msg: 'QR-Capturing failed',
			desc: 'Lume has trouble talking to your devices camera.',
		},
		'error.qr.device.camera.permission': {
			msg: 'No permission for camera',
			desc: 'Please check your camera permission for lume!',
		},
		// storage
		'error.storage.write': {msg: 'Could not write user'},
		'error.storage.create': {
			msg: 'Error while creating your lume profile',
			desc: 'Please try to restart the app',
		},
		// *** Warnings ***
		// internet
		'warning.internet.device': {
			msg: "Can't connect to the internet",
			desc: 'Please check your internet connection.',
		},
		'warning.internet.map.loading': {
			msg: 'Loading...',
			desc: 'Please be patient while the map is being prepared.',
		},
		// location
		'warning.location.accuracy': {
			msg: 'Poor GPS-location accuracy.',
			desc: 'Your location cannot be determined exactly enough for lume to work properly.',
		},
		// qr
		'warning.qr.device.camera.functionality': {
			msg: 'Error acessing the devices camera.',
		},
	};

	// helper method to get message to message type
	static getMessage(messageType: MessageKey): MessageDetails {
		return (
			this.messages[messageType] || {
				// use the message from dict or fallback to unknown error
				msg: 'Unknown Error!',
				desc: 'An unknown error occoured. Please try restarting the app.',
			}
		);
	}
}

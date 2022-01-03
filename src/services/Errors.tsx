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
		'error.location.device': {msg: 'Please check your GPS is enabled'},
		// nfc
		'error.nfc.read.empty': {msg: 'NFC-Tag empty'},
		'error.nfc.read.invalid': {msg: 'NFC-Tag invalid'},
		'error.nfc.process.valuableContent': {
			msg: 'NFC Tag does not contain valuable content',
		},
		'error.nfc.process.empty': {msg: 'NFC-Tag empty'},
		// qr
		'error.qr.device.camera.functionality': {
			msg: 'Please check your camera is working!',
		},
		'error.qr.device.camera.permission': {
			msg: 'Please check your camera permission for this app!',
		},
		// storage
		'error.storage.write': {msg: 'Could not write user'},
		'error.storage.create': {msg: 'Could not create user data'},
		// *** Warnings ***
		// internet
		'warning.internet.device': {msg: 'Please check your internet connection.'},
		'warning.internet.map.loading': {
			msg: 'Loading...',
			desc: 'Please be patient while the map is being prepared.',
		},
		// location
		'warning.location.accuracy': {msg: 'Bad location accuracy.'},
		// qr
		'warning.qr.device.camera.functionality': {
			msg: 'Please hold your phone still.',
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

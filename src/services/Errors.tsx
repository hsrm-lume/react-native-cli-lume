export class Errors {
	static msgDic = [
		//*****Errors*****
		//Internet
		{
			key: 'error.internet.api',
			value: 'Sorry, API is offline!',
		},
		{
			key: 'error.internet.map',
			value: 'Sorry, map is offline!',
		},
		//Location
		{
			key: 'error.location',
			value: 'Error @ Location determination',
		},
		{
			key: 'error.location.device',
			value: 'Please check your GPS is enabled',
		},
		//NFC
		{
			key: 'error.nfc.read.empty',
			value: 'NFC-Tag empty',
		},
		{
			key: 'error.nfc.read.invalid',
			value: 'NFC-Tag invalid',
		},
		{
			key: 'error.nfc.process.valuableContent',
			value: 'NFC Tag does not contain valuable content',
		},
		{
			key: 'error.nfc.process.empty',
			value: 'NFC-Tag empty',
		},
		//QR
		{
			key: 'error.qr.device.camera.functionality',
			value: 'Please check your camera is working!',
		},
		{
			key: 'error.qr.device.camera.permission',
			value: 'Please check your camera permission for these app!',
		},
		//Storage
		{
			key: 'error.storage.write.user',
			value: 'Could not write user',
		},
		{
			key: 'error.storage.create.user',
			value: 'Could not create user data',
		},

		//*****Warnings*****
		//Internet
		{
			key: 'warning.internet.device',
			value: 'Please check your internet connection.',
		},
		//Location
		{
			key: 'warning.location.accuracy',
			value: 'Bad location accuracy.',
		},
		/** Please add NFC here */
		//QR
		{
			key: 'warning.qr.device.camera.functionality',
			value: 'Please hold your phone still.',
		},
		/** Please add Storage here */
	];

	static getMessage(key: string) {
		const msg = this.msgDic.find(x => x.key == key)?.value;
		return msg == undefined ? 'Undefinded Error!' : msg;
	}
}

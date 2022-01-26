import HCESession, {
	NFCContentType,
	NFCTagType4,
} from '@hsrm-lume/react-native-hce';
import NfcManager, {NfcTech, TagEvent} from 'react-native-nfc-manager';
import {HandledPromise} from '../types/HandledPromise';
import {TransmissionData} from '../types/TranmissionData';

/**
 * NdefRecord with mime type and payload
 */
type SlimNdefRecord = {
	payload: string;
	type: string;
};

/**
 * Helper function, that collects chars by char code in a string
 * @param acc accumulator
 * @param curr current char code
 * @returns accumulated string
 */
const collectToString = (acc: string, curr: number) =>
	(acc += String.fromCharCode(curr));

/**
 * Wrapper class to close a HCE session
 */
export class CloseableHCESession {
	constructor(private session: HCESession) {}
	close(): HandledPromise<void> {
		if (this.session.active)
			return HandledPromise.from('nfc.write', this.session.terminate());
		else return HandledPromise.from(undefined, Promise.resolve());
	}
	isOpen(): boolean {
		return this.session.active;
	}
}

/**
 * @param tmd TransmissionData to be written to NFC tag
 * @returns Promise of Session, which has to be closed afterwards
 */
export const nfcStartWrite = (
	tmd: TransmissionData,
	oldSession?: CloseableHCESession
): HandledPromise<CloseableHCESession> =>
	new HandledPromise('nfc.write', (resolve, reject) => {
		new Promise<void>(res => {
			// if there is no old session, resolve immediately
			if (!oldSession || !oldSession.isOpen()) res();
			// if there is one, close it
			else oldSession.close().then(res).catch(reject);
		})
			// setup a new session
			.then(() => new HCESession())
			// set the tag data to be written
			.then(s =>
				// torch data
				s.addTag(new NFCTagType4(NFCContentType.JSON, JSON.stringify(tmd)))
			)
			// app-tag to open lume on the touched device if its not open
			.then(s => s.addTag(new NFCTagType4(NFCContentType.APP, 'com.lume')))
			// start the session
			.then(s => s.start())
			// wrap the session in a closeable session
			.then(s => new CloseableHCESession(s))
			.then(resolve)
			.catch(reject);
	});

/**
 * @returns Promise of TransmissionData recieved from NFC tag
 */
export const nfcReadNext = (): HandledPromise<TransmissionData> =>
	HandledPromise.from<NfcTech | null>(
		// do not report this error to the user, because usual
		// cancelation makes the promise reject but thats intended
		undefined,
		new Promise<NfcTech | null>(async resolve => {
			try {
				await NfcManager.cancelTechnologyRequest();
			} catch {}
			resolve(NfcManager.requestTechnology([NfcTech.Ndef]));
		})
	)
		// await the next tag touched
		.then(() => NfcManager.getTag())
		.then(
			data =>
				// wrap this processing in a HandledPromise to ensure error handling on the processing part
				new HandledPromise('nfc.empty', resolve => {
					if (!data) throw new Error('No nfc data read');
					const tag = processNfcTag(data);
					if (tag.uuid === undefined || tag.location === undefined)
						throw new Error('Read invalid nfc data:' + tag);
					resolve(tag);
				})
		);

/**
 * reading Cleanup function, that closes the read session
 */
export const nfcCleanupRead = () => {
	return NfcManager.cancelTechnologyRequest();
};

/**
 * Function that checks if the nfc technology is turned on
 * @returns  a Promise that resolves if NFC is turned on
 */
export const isNfcEnabled = (): HandledPromise<void> =>
	new HandledPromise('nfc.off', (resolve, reject) => {
		NfcManager.isEnabled()
			.then(enabled => {
				if (enabled) return resolve();
				else return reject(new Error('NFC is not enabled'));
			})
			.catch(reject);
	});

/**
 * Helper procedure to process a nfc tag
 * @param tag NFC-Tag data to be processed
 * @returns TransmissionData Object from NFC-Tag
 */
const processNfcTag = (tag: TagEvent): TransmissionData => {
	const msg = tag.ndefMessage;

	if (msg === undefined) throw new Error('recieved NFC Message was undefined');

	//Only returns 'application/json' payloads if found.
	const res = msg
		.map(
			elm =>
				({
					payload: elm.payload.reduce(collectToString, ''),
					type:
						typeof elm.type === 'string'
							? elm.type
							: elm.type.reduce(collectToString, ''),
				} as SlimNdefRecord)
		)
		.filter(x => {
			return x.type === 'application/json';
		});
	// process the first application/json payload
	if (res.length === 0 || res[0].payload === undefined)
		throw new Error('No valid payload found');

	return JSON.parse(res[0].payload) as TransmissionData;
};

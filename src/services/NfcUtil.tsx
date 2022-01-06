import HCESession, {
	NFCContentType,
	NFCTagType4,
} from '@hsrm-lume/react-native-hce';
import NfcManager, {
	NdefRecord,
	NfcTech,
	TagEvent,
} from 'react-native-nfc-manager';
import {HandledPromise} from '../types/HandledPromise';
import {TransmissionData} from '../types/TranmissionData';
type SlimNdefRecord = {
	payload: string;
	type: string;
};
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
		new Promise<void>((resolve, reject) => {
			if (!oldSession || !oldSession.isOpen()) resolve();
			else oldSession.close().then(resolve).catch(reject);
		})
			.then(() => new HCESession())
			.then(s =>
				s.addTag(new NFCTagType4(NFCContentType.JSON, JSON.stringify(tmd)))
			)
			.then(s => s.addTag(new NFCTagType4(NFCContentType.APP, 'com.lume')))
			.then(s => s.start())
			.then(s => new CloseableHCESession(s))
			.then(resolve)
			.catch(reject);
	});

/**
 * @returns Promise of TransmissionData recieved from NFC tag
 */
export const nfcReadNext = (): HandledPromise<TransmissionData> =>
	HandledPromise.from<NfcTech | null>(
		undefined,
		new Promise<NfcTech | null>(async resolve => {
			try {
				await NfcManager.cancelTechnologyRequest();
			} catch {}
			resolve(NfcManager.requestTechnology([NfcTech.Ndef]));
		})
	)
		.then(() => NfcManager.getTag())
		.then(
			data =>
				new HandledPromise('nfc.empty', resolve => {
					if (!data) throw new Error('No nfc data read');
					const tag = processNfcTag(data);
					if (tag.uuid === undefined || tag.location === undefined)
						throw new Error('Read invalid nfc data:' + tag);
					resolve(tag);
				})
		);

/**
 * reading Cleanup function, to be run whe the "parent" component is unmounted
 */
export const nfcCleanupRead = () => {
	return NfcManager.cancelTechnologyRequest();
};

/**
 *
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
			return x.type == 'application/json';
		});
	// process the first application/json payload
	if (res.length == 0 || res[0].payload === undefined)
		throw new Error('No valid payload found');

	return JSON.parse(res[0].payload) as TransmissionData;
};

const collectToString = (acc: string, curr: number) =>
	(acc += String.fromCharCode(curr));

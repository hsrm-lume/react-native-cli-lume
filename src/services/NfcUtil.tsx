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
			return HandledPromise.from(this.session.terminate());
		else return HandledPromise.from(Promise.resolve());
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
	new HandledPromise((resolve, reject) => {
		new Promise<void>((resolve, reject) => {
			if (!oldSession || !oldSession.isOpen()) resolve();
			else oldSession.close().then(resolve, reject);
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
	new HandledPromise<TransmissionData>((resolve, reject) => {
		NfcManager.requestTechnology([NfcTech.Ndef])
			.then(() => NfcManager.getTag())
			.then(async data => {
				await NfcManager.cancelTechnologyRequest();
				if (!data) throw new Error('NFC-Tag empty');

				const tag = processNfcTag(data);

				if (tag.uuid === undefined || tag.location === undefined)
					throw new Error('NFC-Tag invalid');

				return tag;
			})
			.then(resolve)
			.catch(reject);
	});

/**
 * reading Cleanup function, to be run whe the "parent" component is unmounted
 */
export const nfcCleanupRead = (): void => {
	NfcManager.cancelTechnologyRequest();
};

/**
 * @param tag NFC-Tag data to be processed
 * @returns TransmissionData Object from NFC-Tag
 */
const processNfcTag = (tag: TagEvent): TransmissionData => {
	const msg = tag.ndefMessage;

	if (msg === undefined) throw new Error('NFC tag is empty');

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
			console.log(x.type);
			return x.type == 'application/json';
		});
	// process the first application/json payload
	if (res.length == 0 || res[0].payload === undefined)
		throw new Error('NFC Tag does not contain valuable content');

	return JSON.parse(res[0].payload) as TransmissionData;
};

const collectToString = (acc: string, curr: number) =>
	(acc += String.fromCharCode(curr));

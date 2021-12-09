import HCESession, {NFCContentType, NFCTagType4} from 'react-native-hce';
import NfcManager, {NfcTech, TagEvent} from 'react-native-nfc-manager';
import {HandledPromise} from '../types/HandledPromise';
import {TransmissionData} from '../types/TranmissionData';

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
		const tag = new NFCTagType4(NFCContentType.Text, JSON.stringify(tmd));
		new Promise<void>((resolve, reject) => {
			if (!oldSession || !oldSession.isOpen()) resolve();
			else oldSession.close().then(resolve, reject);
		})
			.then(() => new HCESession(tag).start())
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

	const res = msg
		.flatMap(element => element.payload as number[])
		.reduce((acc, curr) => (acc += String.fromCharCode(curr)), '')
		.substring(3);

	return JSON.parse(res) as TransmissionData;
};

import HCESession, {NFCContentType, NFCTagType4} from 'react-native-hce';
import NfcManager, {NfcTech, TagEvent} from 'react-native-nfc-manager';
import {HandledPromise} from '../types/HandledPromise';
import {TransmissionData} from '../types/TranmissionData';

/**
 * Wrapper class to close a HCE session
 */
class CloseableHCESession {
	constructor(private session: HCESession) {}
	close(): HandledPromise<void> {
		return new HandledPromise(this.session.terminate());
	}
}

/**
 * @param tmd TransmissionData to be written to NFC tag
 * @returns Promise of Session, which has to be closed afterwards
 */
export const nfcStartWrite = (
	tmd: TransmissionData
): HandledPromise<CloseableHCESession> =>
	new HandledPromise((resolve, reject) => {
		const tag = new NFCTagType4(NFCContentType.Text, JSON.stringify(tmd));
		new HCESession(tag)
			.start()
			.then(s => new CloseableHCESession(s))
			.then(resolve)
			.catch(reject);
	});

/**
 * @returns Promise of TransmissionData recieved from NFC tag
 */
export const nfcReadNext = (): HandledPromise<TransmissionData> =>
	new HandledPromise((resolve, reject) =>
		NfcManager.requestTechnology([NfcTech.Ndef])
			.then(() => NfcManager.getTag())
			.then(tag => {
				NfcManager.cancelTechnologyRequest();
				if (!tag) throw new Error('NFC-Tag empty');
				return processNfcTag(tag);
			})
			.then(resolve)
			.catch(reject)
	);

/**
 * @param tag NFC-Tag data to be processed
 * @returns TransmissionData Object from NFC-Tag
 */
const processNfcTag = (tag: TagEvent): TransmissionData => {
	const msg = tag.ndefMessage;
	// TODO: Error service
	if (msg == undefined) console.warn('NFC tag is empty');

	const res = msg
		.flatMap(element => element.payload as number[])
		.reduce((acc, curr) => (acc += String.fromCharCode(curr)), '')
		.substr(3);

	return JSON.parse(res) as TransmissionData;
};

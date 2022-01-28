import {GeoLocation} from './GeoLocation';

/**
 * Data interchange format between two devices
 */
export interface TransmissionData {
	uuid: string;
	location: GeoLocation;
}

/**
 * adds a timestamp to the transmission data for qr codes to expire
 * @member ts timestamp in seconds
 */
export interface QrCodeData extends TransmissionData {
	ts: number;
}

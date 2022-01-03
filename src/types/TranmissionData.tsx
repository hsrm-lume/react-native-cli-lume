import {GeoLocation} from './GeoLocation';

export interface TransmissionData {
	uuid: string;
	location: GeoLocation;
}

/**
 * @member ts timestamp in seconds
 */
export interface QrCodeData extends TransmissionData {
	ts: number;
}

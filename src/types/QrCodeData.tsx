import {GeoLocation} from './GeoLocation';

/**
 * @param ts timestamp in seconds
 */
export interface QrCodeData {
	ts: number;
	uuid: string;
	location: GeoLocation;
}

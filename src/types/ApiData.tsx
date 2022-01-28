import {GeoLocation} from './GeoLocation';

/**
 * Format of data pased to the REST API
 * @param uuidParent uuid of the flame that was already lit
 * @param uuidChild uuid of the flame that got lit in the process
 * @param position location of the flame that got lit
 */
export interface ApiData {
	uuidParent: string;
	uuidChild: string;
	position: GeoLocation;
}

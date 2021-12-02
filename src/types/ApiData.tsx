import {GeoLocation} from './GeoLocation';

export interface ApiData {
	uuidParent: string;
	uuidChild: string;
	position: GeoLocation;
}

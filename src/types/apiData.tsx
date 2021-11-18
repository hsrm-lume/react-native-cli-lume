import {GeoLocation} from './geoLocation';

export interface apiData {
    uuidParent: string;
    uuidChild: string;
    position: GeoLocation;
}

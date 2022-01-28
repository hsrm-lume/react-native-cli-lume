/**
 * @attribute [accuracy] - Accuracy of the location in meters
 * @attribute [lat] - Latitude of the location from 90 to -90
 * @attribute [lng] - Longitude of the location from -180 to 180
 */
export interface GeoLocation {
	accuracy: number;
	lat: number;
	lng: number;
}

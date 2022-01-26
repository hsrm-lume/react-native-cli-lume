export const environment = {
	API_BASE_DOMAIN: 'https://lume.cs.hs-rm.de:3000/v1/', // base url: where to report a flame passing
	API_CONTACT_PATH: 'new', // which path to use for contact reporting
	WEBVIEW_BASE_DOMAIN: 'https://lume.cs.hs-rm.de/?uuid=', // url of the angular-map-frontend
	STAGE: 'dev', // can be 'dev' or 'prod'
	GEO_THRESHOLD: 50, // threshold in meters; if above, error view pops up
};

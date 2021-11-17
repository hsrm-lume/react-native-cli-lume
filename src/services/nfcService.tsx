import {PermissionsAndroid} from 'react-native';
import HCESession, {NFCContentType, NFCTagType4} from 'react-native-hce';
import NfcManager, {
    NfcEvents,
    NfcTech,
    TagEvent,
} from 'react-native-nfc-manager';
import GeoService from './geoService';
import PermissonsService from './permissonsService';

class nfcService {
    session?: HCESession;
    PService: PermissonsService;
    GService: GeoService;
    constructor() {
        this.PService = new PermissonsService();
        NfcManager.start().catch(function (e) {
            console.log(e);
        });
        this.GService = new GeoService();
    }

    async startHCE() {
        this.PService.getPermissions(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            'Location',
            'Hey, lume needs your Location to function correctly. We will not publish any of this data '
        );
        let l = await this.GService.getLocation();
        //console.log('lol');
        console.log(l);
        let tag = new NFCTagType4(NFCContentType.Text, JSON.stringify(l));
        this.session = await new HCESession(tag).start();
    }

    async stopHCE() {
        console.log();
        if (this.session?.active) {
            await this.session.terminate().catch(function (e) {
                console.log(e);
            });
        }
    }
    async readNfcTag() {
        await NfcManager.requestTechnology([NfcTech.Ndef]);

        const tag = await NfcManager.getTag().catch(function (e) {
            console.log(e);
        });

        NfcManager.cancelTechnologyRequest();

        return tag;
    }

    processNfcTag(tag: TagEvent): string {
        // Add error handling if ndefMessage is undefined
        let msg = tag.ndefMessage;

        let res = '';

        if (msg == undefined) {
            return '';
        }

        msg!.forEach(element => {
            element.payload.forEach(e => (res += String.fromCharCode(e)));
        });

        res = res.substr(3, res.length);

        return res;
    }
}

export default nfcService;

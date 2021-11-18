import {v4 as uuid} from 'uuid';
import 'react-native-get-random-values';
import Realm, {User} from 'realm';
import {userDataSchema} from '../types/userDataSchema';
import {userData} from '../types/userData';
class storageService {
    realm?: Realm;
    async initRealm() {
        this.realm = await Realm.open({
            path: 'userOptions',
            schema: [userDataSchema],
            schemaVersion: 1,
        });
    }

    async closeRealm() {
        // use when main component gets unmounted
        return this.realm!.close();
    }
    async initializeUserData(): Promise<userData | undefined> {
        if (this.realm?.objects<userData>('userData')[0] != undefined)
            return {} as userData;
        return this.realm?.write(() => {
            this.realm!.create<userData>('userData', {
                uid: uuid(),
                fireStatus: false,
            });
            return this.realm?.objects<userData>('userData')[0] as userData;
        });
    }

    async getUserData(): Promise<userData> {
        let l = this.realm?.objects<userData>('userData')[0] as userData;
        return l == undefined ? ({} as userData) : l;
    }

    async removeAllData() {
        this.realm?.write(() => {
            this.realm!.deleteAll();
        });
    }

    async openRealm() {
        this.realm = await Realm.open({
            path: 'userOptions',
            schema: [userDataSchema],
        });
    }

    async writeUserData(data: userData) {
        const users = this.realm!.objects<userData>(
            userDataSchema.name
        ).filtered('uid == "' + data.uid + '"');
        this.realm!.write(() => {
            users[0].fireStatus = data.fireStatus;
        });
    }

    debug() {
        console.log('Full Realm');
        console.log(this.realm?.objects('userData'));
    }
    createAdmin(data: userData) {
        this.removeAllData();
        return this.realm?.write(() => {
            this.realm?.create<userData>('userData', {
                fireStatus: data.fireStatus,
                uid: data.uid,
            });
            return this.realm?.objects<userData>('userData')[0] as userData;
        });
    }
}
export default storageService;

import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import Realm from 'realm';
import {userDataSchema} from '../types/userDataSchema';
import {userData} from '../types/userData';
class storageService {
    constructor() {}

    async initializeUserData() {
        const realm = await Realm.open({
            path: 'userOptions',
            schema: [userDataSchema],
        }).then(function (r) {
            r.write(() => {
                r.create('userData', {
                    uid: uuid(),
                    firestatus: false,
                });
            });
            return r.objects('userData');
        });
    }

    async getUserData(): Promise<userData> {
        const realm = await Realm.open({
            path: 'userOptions',
            schema: [userDataSchema],
        });
        let data: userData = {
            fireStatus: realm.objects('userData')[0].firestatus,
            uid: realm.objects('userData')[0].uid,
        };
        console.log(data);
        return data;
    }

    async removeAllData() {
        const realm = await Realm.open({
            path: 'userOptions',
            schema: [userDataSchema],
        }).then(function (r) {
            let data = r.objects('userData');

            r.write(() => {
                r.deleteAll();
            });
        });

        //realm.close();
    }

    async openRealm() {
        const realm = await Realm.open({
            path: 'userOptions',
            schema: [userDataSchema],
        });
    }

    async writeUserData() {}
}
export default storageService;

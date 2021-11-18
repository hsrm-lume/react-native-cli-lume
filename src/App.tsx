import React, {useCallback, useDebugValue, useState} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Button,
    Pressable,
    Text,
    useWindowDimensions,
} from 'react-native';
import CustomWebView from './components/webView';
import Menubar from './components/menubar';
import DebugBar from './components/debugBar';
import FireView from './components/fire';
import nfcService from './services/nfcService';
import storageService from './services/storageService';
import {userData} from './types/userData';
import {TagEvent} from 'react-native-nfc-manager';
import {transmissionData} from './types/tranmissionData';
import {GeoLocation} from './types/geoLocation';
import {apiData} from './types/apiData';

const webPage = 'https://lume.m-ptr.de';

export default function App() {
    var [fireState, setFire] = useState(false);
    var [uid, setUid] = useState('');
    var [startWebView, setWeb] = useState(false);

    //init data

    let nService = new nfcService();
    let sService = new storageService();

    const initUser = async () => {
        await sService.initRealm().then(async function (result) {
            await sService.getUserData().then(async function (res) {
                if (res.uid == undefined && res.fireStatus == undefined) {
                    await sService.initializeUserData().then(function (r) {
                        assignData(r as userData);
                    });
                } else {
                    assignData(res);
                }
            });
        });
    };

    const assignData = (data: userData) => {
        setUid(data.uid);
        setFire(data.fireStatus);
    };

    const startHCE = () => {
        console.log('HCE');
        nService.startHCE(uid);
    };
    const startNFCRead = async () => {
        console.log('Reading');
        await nService.readNfcTag().then(function (r) {
            if (r == undefined || r == null) return;
            console.log(r);
            let jTag = nService.processNfcTag(r);
            if (!testJSON(jTag)) return;
            let tagInfo = JSON.parse(jTag) as transmissionData;
            console.log(tagInfo);
            setFire(true);
            sService.writeUserData({fireStatus: true, uid: uid});
            //Contact Server
            let apiD: apiData = {
                uuidChild: uid,
                uuidParent: tagInfo.uid,
                position: tagInfo.location,
            };
        });
    };

    //ugly JSON Test
    const testJSON = (test: string) => {
        try {
            return JSON.parse(test) && !!test;
        } catch (e) {
            return false;
        }
    };

    const startWeb = useCallback(() => {
        setWeb(true);
    }, []);
    const startFire = useCallback(() => {
        setWeb(false);
    }, []);

    const adminHandler = useCallback(() => {
        console.log('making Admin');
        let data: userData = {
            fireStatus: true,
            uid: '00000000-0000-4000-A000-000000000000',
        };
        let l = sService.createAdmin(data);
        setFire(l!.fireStatus);
        setUid(l!.uid);
        console.log(l);
    }, []);

    initUser();

    if (!startWebView) {
        return (
            <View style={styles.container}>
                <DebugBar adminHandler={adminHandler} />
                <FireView fire={fireState} />
                <Pressable
                    style={styles.share}
                    onPress={() => (fireState ? startHCE() : startNFCRead())}>
                    <Text style={{color: '#ff7200'}}>
                        {fireState ? 'Feuer teilen' : 'Feuer empfangen'}
                    </Text>
                </Pressable>
                <Menubar webHandler={startWeb} fireHandler={startFire} />
            </View>
        );
    } else {
        return (
            <View style={styles.container2}>
                <CustomWebView url={webPage + '?uid=' + uid}></CustomWebView>
                <Menubar webHandler={startWeb} fireHandler={startFire} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    container2: {
        backgroundColor: '#001000',
        width: '100%',
        height: '100%',
    },

    fire: {
        width: '90%',
        height: '75%',
        resizeMode: 'center',
    },

    share: {
        height: '10%',
        width: '40%',
        backgroundColor: '#000000',
        zIndex: 5,
    },

    menu: {
        flex: 0.1,
        backgroundColor: 'red',
        width: '100%',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

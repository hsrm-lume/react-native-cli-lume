import React, {useCallback, useDebugValue, useState} from 'react';
import {StyleSheet, View, Pressable, Text} from 'react-native';
import CustomWebView from './components/webView';
import Menubar from './components/menubar';
import DebugBar from './components/debugBar';
import FireView from './components/fire';
import nfcService from './services/nfcService';
import storageService from './services/storageService';
import {userData} from './types/userData';
import {transmissionData} from './types/tranmissionData';
import {apiData} from './types/apiData';
import restClient from './services/RestClient';
import {environment} from './env/environment';

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
        try {
            console.log('Reading');
            await nService.readNfcTag().then(async function (r) {
                if (r == undefined || r == null) return;
                let jTag = nService.processNfcTag(r);
                if (!testJSON(jTag)) return;
                let tagInfo = JSON.parse(jTag) as transmissionData;

                //setFire(true);
                //sService.writeUserData({fireStatus: true, uid: uid});
                //Contact Server
                let apiD: apiData = {
                    uuidChild: uid,
                    uuidParent: tagInfo.uid,
                    position: tagInfo.location,
                };
                if (
                    (await restClient.postContact(
                        environment.API_BASE_DOMAIN + 'new',
                        apiD
                    )) < 300
                ) {
                    setFire(true);
                    sService.writeUserData({fireStatus: true, uid: uid});
                }
            });
        } catch (e) {
            console.warn(e);
        }
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
                <CustomWebView
                    url={environment.WEBVIEW_BASE_DOMAIN + uid}></CustomWebView>
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
        height: '85%',
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

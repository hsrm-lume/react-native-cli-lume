import React, {Component} from 'react';
import {
    Button,
    StyleSheet,
    Text,
    View,
    Pressable,
    PermissionsAndroid,
    AppState,
    NativeEventSubscription,
} from 'react-native';
import {Buffer} from 'buffer';
//DEPENDENCIES
import HCESession, {NFCContentType, NFCTagType4} from 'react-native-hce';
import NfcManager, {NfcEvents, NfcTech} from 'react-native-nfc-manager';
import Geolocation from 'react-native-geolocation-service';

interface fireState {
    fire: boolean;
}

interface contact {
    writerUID: string;
    location: string;
}

interface customTagInfo {
    id: string;
    payload: [];
}

class Fire extends Component {
    state = {
        fire: false,
        appState: AppState.currentState,
        reading: false,
    };
    contactInfo: contact;
    simulation: HCESession;
    appStateSub: any;
    constructor(props: fireState) {
        super(props);
        this.simulation = new HCESession(
            new NFCTagType4(NFCContentType.Text, 'lume')
        );
        this.contactInfo = {writerUID: new Date().toJSON(), location: ''};
    }

    componentDidMount() {
        /*this.appStateSub = AppState.addEventListener('change', state => {
            if (this.state.appState == 'inactive') {
                this.stopSimulation();
                this.stopRead();
            }
        });*/
    }

    componentWillUnmount() {
        // this.appStateSub.remove();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>
                    Your flame is{' '}
                    {this.state.fire
                        ? 'on'
                        : this.state.reading
                        ? 'reading'
                        : 'off'}
                    .{' '}
                </Text>
                <View style={styles.debug}>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            this.startSend();
                            //styles.container.backgroundColor = '#f00';
                        }}>
                        <Text style={styles.buttonText}>Fire On</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            this.stopSimulation();
                            this.startRead();
                            this.setState({fire: false});
                        }}>
                        <Text style={styles.buttonText}>Fire Off</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            console.log('Debug');
                        }}>
                        <Text style={styles.buttonText}>Make Debug</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    startSend = async () => {
        if (
            !(await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ))
        ) {
            this.requestLocationPermission();
        }
        if (
            await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
        ) {
            this.setState({fire: true});
            //GET 8 digits after . for accuracy
            Geolocation.getCurrentPosition(
                pos => {
                    this.contactInfo.location =
                        pos.coords.latitude + ',' + pos.coords.longitude;
                    console.log(this.contactInfo.location);
                    this.startSimulation();
                },
                e => {
                    console.log(e.code, e.message);
                }
            );
        } else {
            //printError
            console.log('User did not consent to location');
        }
    };

    startRead = async () => {
        this.state.reading = true;
        await NfcManager.start().catch(function (e) {
            console.log(e);
        });

        await NfcManager.requestTechnology([NfcTech.Ndef]);

        let tag = await NfcManager.getTag().catch(function (e) {
            console.log('Error:', e);
        });

        let msg = tag?.ndefMessage;

        let string = '';

        if (msg == undefined) {
            return 0;
        }

        msg!.forEach(element => {
            element.payload.forEach(e => (string += String.fromCharCode(e)));
        });

        console.log(JSON.parse(string.substr(3, string.length))); //cut off extra values from NFC

        NfcManager.cancelTechnologyRequest();
    };

    nfcCleanUp = () => {
        // cleanup
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        NfcManager.setEventListener(NfcEvents.SessionClosed, null);
    };

    stopRead = async () => {
        this.nfcCleanUp();
    };

    startSimulation = async () => {
        /*console.log(
            this.contactInfo,
            'current Location State: ' +
                (await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                ))
        );*/
        const tag = new NFCTagType4(
            NFCContentType.Text,
            JSON.stringify(this.contactInfo)
        );
        this.simulation = await new HCESession(tag).start();
    };
    stopSimulation = async () => {
        await this.simulation.terminate().catch(function (e) {
            console.log(e);
        });
    };
    requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message:
                        'Hey, lume needs your Location to function correctly. We will not publish any of this data ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('lessgoo');
                Geolocation.getCurrentPosition(s => {
                    console.log('location:' + s);
                });
            } else {
                console.log('fuck');
            }
        } catch (err) {
            console.log(err);
        }
    };
}

export default Fire;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
        backgroundColor: '#fff',
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16,
        height: '80%',
        color: '#000',
    },
    debug: {
        backgroundColor: '#11111155',
        width: '100%',
        height: '10%',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignContent: 'center',
        marginBottom: 30,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

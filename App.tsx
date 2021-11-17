import React, {Component} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
//DEPENDENCIES
import nfcService from './src/services/nfcService';
import {TagEvent} from 'react-native-nfc-manager';
import {GeoLocation} from './src/services/geoService';

class Fire extends Component {
    state = {
        fire: false,
        reading: false,
    };
    nService: nfcService;
    constructor(props: any) {
        super(props);
        this.nService = new nfcService();
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
                            this.nService.startHCE();
                            this.setState({fire: true});
                        }}>
                        <Text style={styles.buttonText}>Fire On</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={async () => {
                            let that = this;
                            this.setState({reading: true});
                            this.setState({fire: false});
                            await this.nService
                                .readNfcTag()
                                .then(function (r) {
                                    if (r == undefined && r == null) {
                                        return;
                                    } else if ((r.type = 'Ndef')) {
                                        r = r as TagEvent;
                                    }
                                    let res = JSON.parse(
                                        that.nService.processNfcTag(r)
                                    ) as GeoLocation;
                                    if (res.lat != '')
                                        that.setState({fire: true});
                                })
                                .catch(function (e) {
                                    console.log(e);
                                });
                        }}>
                        <Text style={styles.buttonText}>Fire Off</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            console.log('Debug');
                            this.nService.stopHCE();
                        }}>
                        <Text style={styles.buttonText}>Make Debug</Text>
                    </Pressable>
                </View>
            </View>
        );
    }
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

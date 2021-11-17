import React, {Component} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
//DEPENDENCIES
import nfcService from './src/services/nfcService';
import storageService from './src/services/storageService';
import {userData} from './src/types/userData';

class Fire extends Component {
    state = {
        fire: false,
        reading: false,
        uid: '',
    };
    sService: storageService;
    constructor(props: any) {
        super(props);
        this.sService = new storageService();
        this.initUserData();
    }

    async initUserData() {
        let that = this;
        await this.sService.initRealm().then(async function (result) {
            await that.sService.getUserData().then(async function (res) {
                console.log(that.sService.realm);
                if (res.uid == undefined && res.fireStatus == undefined) {
                    await that.sService.initializeUserData().then(function (r) {
                        //console.log(r);
                        that.assignData(r as userData);
                    });
                } else {
                    //console.log(res);
                    that.assignData(res);
                }
            });
        });
    }

    assignData(data: userData) {
        this.setState({uid: data.uid, fire: data.fireStatus});
    }
    async updateData() {
        let that = this;
        await this.sService.getUserData().then(function (r) {
            if (r.uid == undefined && r.fireStatus != undefined) {
                that.setState({uid: '', fire: false});
                return;
            }
            that.setState({uid: r.uid, fire: r.fireStatus});
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.status}>
                    <Text style={styles.headline}>
                        Your uuid is {this.state.uid}
                    </Text>
                    <Text style={styles.headline}>
                        Your fire is {this.state.fire ? 'on' : 'off'}
                    </Text>
                </View>
                <View style={styles.debug}>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            this.sService.removeAllData();
                            this.updateData();
                        }}>
                        <Text style={styles.buttonText}>RemoveAllData</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={async () => {
                            let l = this.sService.initializeUserData();
                            console.log(typeof l);
                        }}>
                        <Text style={styles.buttonText}>init Data</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            console.log('Debug');
                            console.log(this.state);

                            this.sService.debug();
                        }}>
                        <Text style={styles.buttonText}>Make Debug</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={async () => {
                            this.assignData(await this.sService.getUserData());
                        }}>
                        <Text style={styles.buttonText}>getData</Text>
                    </Pressable>

                    <Pressable
                        style={styles.button}
                        onPress={async () => {
                            this.sService.writeUserData({
                                fireStatus: true,
                                uid: this.state.uid,
                            });
                            this.assignData(await this.sService.getUserData());
                        }}>
                        <Text style={styles.buttonText}>Activate Fire</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={async () => {
                            this.sService.writeUserData({
                                fireStatus: false,
                                uid: this.state.uid,
                            });
                            this.assignData(await this.sService.getUserData());
                        }}>
                        <Text style={styles.buttonText}>Deactivate Fire</Text>
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
    status: {
        margin: 16,
        height: '80%',
    },
    headline: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    debug: {
        backgroundColor: '#11111155',
        width: '100%',
        height: '20%',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        flexWrap: 'wrap',
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

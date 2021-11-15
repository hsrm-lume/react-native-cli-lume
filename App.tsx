import React, {Component} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
//DEPENDENCIES
import nfcService from './src/services/nfcService';
import storageService from './src/services/storageService';

class Fire extends Component {
    state = {
        fire: false,
        reading: false,
        uid: '',
    };
    nService: nfcService;
    sService: storageService;
    constructor(props: any) {
        super(props);
        this.nService = new nfcService();
        this.sService = new storageService();
        this.initUserData();
    }

    async initUserData() {
        //this.sService.initializeUserData();
        //this.sService.removeAllData();
        let that = this;
        await this.sService.getUserData().then(async function (r) {
            if (r == undefined) {
                await that.sService
                    .initializeUserData()
                    .then(function (res) {});
            }
            console.log(r);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>
                    Your uuid is {this.state.uid}
                </Text>
                <View style={styles.debug}>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            this.sService.removeAllData();
                        }}>
                        <Text style={styles.buttonText}>RemoveAllData</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={async () => {
                            let l = this.sService.initializeUserData();
                            console.log();
                        }}>
                        <Text style={styles.buttonText}>init Data</Text>
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

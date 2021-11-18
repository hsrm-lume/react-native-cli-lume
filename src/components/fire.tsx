import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
const FireView = (props: {fire: boolean}) => {
    if (props.fire) {
        return (
            <View style={styles.fire}>
                <Image
                    source={require('../assets/2.png')}
                    style={{
                        resizeMode: 'contain',
                        height: '100%',
                        width: '100%',
                    }}
                />
            </View>
        );
    } else {
        return (
            <View style={styles.fire}>
                <Image
                    source={require('../assets/1.png')}
                    style={{
                        resizeMode: 'contain',
                        height: '100%',
                        width: '100%',
                    }}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    fire: {
        width: '90%',
        height: '75%',
        resizeMode: 'center',
    },
});

export default FireView;

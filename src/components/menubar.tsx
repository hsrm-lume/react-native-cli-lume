import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
const Menubar = (props: {webHandler: Function; fireHandler: Function}) => {
    return (
        <View style={styles.bar}>
            <View style={styles.pressableRow}>
                <Pressable
                    style={styles.pressable}
                    onPress={() => {
                        props.webHandler();
                    }}>
                    <Text style={styles.black}>WebView</Text>
                </Pressable>
                <Pressable
                    style={styles.pressable}
                    onPress={() => {
                        props.fireHandler();
                    }}>
                    <Text style={styles.black}>FireView</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bar: {
        backgroundColor: '#555555',
        height: '10%',
        width: '100%',
    },
    pressableRow: {height: '100%', flex: 1, flexDirection: 'row'},
    pressable: {
        height: '100%',
        width: '49.9%',
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
        borderLeftColor: '#000000',
    },
    black: {color: '#ff0000'},
});

export default Menubar;

import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
const DebugBar = (props: {adminHandler: Function}) => {
    return (
        <View>
            <Pressable
                style={styles.pressable}
                onPress={() => {
                    props.adminHandler();
                }}>
                <Text>MAKE first ADMIN</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    pressable: {
        position: 'absolute',
        width: 50,
        height: 50,
        right: '30%',
        backgroundColor: '#000000',
        zIndex: 5,
    },
    black: {
        color: '#000000',
    },
});
export default DebugBar;

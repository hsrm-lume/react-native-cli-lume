import React from 'react';
import {View, Text, StyleSheet, Pressable, Image, TouchableHighlight, TextPropTypes} from 'react-native';
import Fire from '../assets/fire.svg';
import Map from '../assets/map.svg';

const Menubar = (props: {webHandler: Function; fireHandler: Function, web: boolean}) => {
    return (
        <View style={styles.bar}>
                <TouchableHighlight 
                    style={props.web ? styles.barElement : styles.barElementActive} 
                    onPress={() => {props.fireHandler();}} 
                    underlayColor="#ffffff" 
                    activeOpacity={0.5}
                >
                    <Fire width={'100%'} height={'100%'} />
                </TouchableHighlight>
                <View style={styles.line}/>
                <TouchableHighlight 
                    style={props.web ? styles.barElementActive : styles.barElement} 
                    onPress={() => {props.webHandler();}}
                    underlayColor="#ffffff" 
                    activeOpacity={0.5}
                >
                    <Map width={'100%'} height={'100%'} />  
                </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    bar: {
        backgroundColor: '#ffffff',
        height: '9%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        flex: 1, 
        flexDirection: 'row',
    },

    barElementActive: {
        height: '100%',
        width: '49.5%',
        backgroundColor: '#ffffff',
        alignSelf: 'flex-end',
    },

    barElement: {
        height: '70%',
        width: '49.5%',
        backgroundColor: '#ffffff',
        alignSelf: 'flex-end',
        opacity: 0.7,
    },

    line: {
        alignSelf: 'center',
        height: '55%',
        width: '1%',
        backgroundColor: '#EEEEEE',
        borderRadius: 10,
    },

});

export default Menubar;

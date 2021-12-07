import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableHighlight, ScrollView} from 'react-native';
import ErrorHandler from '../services/ErrorHandler';
import Warning from '../assets/warning.svg';
import LocationWarning from '../assets/locationWarning.svg';
import LocationError from '../assets/locationError.svg';
import InternetWarning from '../assets/internetWarning.svg';
import Close from '../assets/close.svg';

const ErrorBar = (props: {bigSize: boolean; switchBigSize: Function} ) => {
    if (props.bigSize){
        return (
            <View style={styles.barBig}>
                <TouchableHighlight style={styles.closeWindow} underlayColor="#ffffff" onPress={() => {props.switchBigSize();}} >
                    <Close width={'100%'} height={'100%'}/>
                </TouchableHighlight>
                <ScrollView>
                    {ErrorHandler.errorList.map(function(item) {
                        switch(item.icon){
                            case "internetWarning":
                                return(
                                    <View style={styles.message}>
                                        <View style={styles.icon}>
                                            <InternetWarning width={'100%'} height={'100%'}/>
                                        </View>
                                        <View style={styles.textBox}>
                                            <Text style={styles.text}>{item.message}</Text>
                                        </View>
                                    </View>
                                );
                            case "locationError":
                                return(
                                    <View style={styles.message}>
                                        <View style={styles.icon}>
                                            <LocationError width={'100%'} height={'100%'}/>
                                        </View>
                                        <View style={styles.textBox}>
                                            <Text style={styles.text}>{item.message}</Text>
                                        </View>
                                    </View>
                                );
                            case "locationWarning":
                                return(
                                    <View style={styles.message}>
                                        <View style={styles.icon}>
                                            <LocationWarning width={'100%'} height={'100%'}/>
                                        </View>
                                        <View style={styles.textBox}>
                                            <Text style={styles.text}>{item.message}</Text>
                                        </View>
                                    </View>
                                );
                            default:
                                return(
                                    <View style={styles.message}>
                                        <View style={styles.icon}>
                                            <Warning width={'100%'} height={'100%'}/>
                                        </View>
                                        <View style={styles.textBox}>
                                            <Text style={styles.text}>{item.message}</Text>
                                        </View>
                                    </View>
                                );
                        }
                    })}   
                </ScrollView>
            </View>
        );
    } else {
        return (
            <View style={ErrorHandler.errorList.length > 3 ? styles.barSmall2 : styles.barSmall}>
                <ScrollView horizontal>
                    {ErrorHandler.errorList.map(function(item) {
                        switch(item.icon){
                            case "internetWarning":
                                return(
                                    <TouchableHighlight style={styles.icon} underlayColor="#ffffff" onPress={() => {props.switchBigSize();}} >  
                                            <InternetWarning width={'100%'} height={'100%'}/>
                                    </TouchableHighlight>
                                );
                            case "locationError":
                                return(
                                    <TouchableHighlight style={styles.icon} underlayColor="#ffffff" onPress={() => {props.switchBigSize();}} > 
                                        <LocationError width={'100%'} height={'100%'}/>
                                    </TouchableHighlight>
                                );
                            case "locationWarning":
                                return(
                                    <TouchableHighlight style={styles.icon} underlayColor="#ffffff" onPress={() => {props.switchBigSize();}} > 
                                        <LocationWarning width={'100%'} height={'100%'}/>
                                    </TouchableHighlight>
                                );
                            default:
                                return(
                                    <TouchableHighlight style={styles.icon} underlayColor="#ffffff" onPress={() => {props.switchBigSize();}} > 
                                        <Warning width={'100%'} height={'100%'}/>
                                    </TouchableHighlight>
                                );
                        }
                    })}  
                </ScrollView>
            </View>
        );
    }

};

const styles = StyleSheet.create({
    barSmall: {        
        backgroundColor: '#ffffff',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: '11%',
        right: 10,
        marginLeft: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },

    barSmall2: {         //Higher margin for scrolling
        backgroundColor: '#ffffff',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: '11%',
        right: 10,
        marginLeft: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },

    barBig: {
        bottom: '11%',  //menubar has 9%
        top: '2%',
        left: '4%',
        right: '4%',
        backgroundColor: '#ffffff',
        borderRadius: 30,
        position: 'absolute',
        opacity: 1,
        paddingBottom: 25,
    },

    closeWindow:{
        height: 50,
        width: 50,
        left: '83%',
        top: 10,
    },

    message:{
        flexDirection: 'row',
    },

    icon:{
        height: 50,
        width: 50,
        borderRadius: 25,
    },

    textBox:{
        justifyContent: 'center',
        paddingRight: 40,
        paddingLeft: 10,
    },

    text: {
        fontSize: 20,
        color: '#000000',
      },
});
export default ErrorBar;
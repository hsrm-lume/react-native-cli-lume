import React, { useState } from 'react';
import {View, Text, StyleSheet, Pressable, Image, TouchableHighlight, TextPropTypes, FlatList} from 'react-native';
import ErrorHandler from '../services/ErrorHandler';
import Warning from '../assets/warning.svg';
import LocationWarning from '../assets/locationWarning.svg';
import LocationError from '../assets/locationError.svg';
import InternetWarning from '../assets/internetWarning.svg';

data={[{ title: 'Title Text', key: 'item1' }]}



const Item = ({ title }) => (
      <Text>{title}</Text>
  );

const ErrorBar = (props: {bigSize: boolean; switchBigSize: Function} ) => {

    const renderItem = ({item }) => (
        <Item title={item.title} />
      );
    
    if (props.bigSize){
        return (
            <TouchableHighlight
                        style={styles.barBig}
                        
                        //activeOpacity={0.85}
                        underlayColor="#dddddd" 
                        onPress={() => {props.switchBigSize();}}
                    >
                        
                        <FlatList
                            data={[{ title: 'Title Text', key: 'item1' }]}
                            renderItem={({ item, index, separators }) => (
                                <Text>{item.title}</Text>
                              )}
                        /> 
            </TouchableHighlight>
        );
    } else {
        return (
            <TouchableHighlight
                        style={styles.barSmall}
                        //activeOpacity={0.85}
                        underlayColor="#dddddd" 
                        onPress={() => {props.switchBigSize();}}
                    >
                        <Text style={styles.text1}>
                            {ErrorHandler.errorList[1].message}
                        </Text>   

            </TouchableHighlight>
        );
    }

};

const styles = StyleSheet.create({
    barSmall: {
        height: '10%',
        width: '70%',
        backgroundColor: '#EEEEEE',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        opacity: 0.5,
        top: '50%',
    },
    barBig: {
        height: '70%',
        width: '90%',
        backgroundColor: '#EEEEEE',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        opacity: 0.5,
        top: '20%',
    },

    text1: {
      fontSize: 30,
      color: '#000000',
    },
});
export default ErrorBar;
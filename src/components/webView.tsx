import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
const CustomWebView = (props: {url: string}) => {
    return <WebView url={props.url} style={styles.WebView}></WebView>;
};

const styles = StyleSheet.create({
    WebView: {
        height: '100%',
    },
});

export default CustomWebView;

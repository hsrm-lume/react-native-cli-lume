import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const FireView = (props: {fire: boolean}) => {
    if (props.fire) {
        return (
            <View style={styles.container}>
                <View style={styles.headlineBox}>
                    <Text style={styles.headlineText}>
                        SHARE YOUR FIRE!
                    </Text>
                </View>    
                <View style={styles.fire}>
                    <Image
                        source={require('../assets/torch.png')}
                        style={{
                            resizeMode: 'contain',
                            height: '100%',
                            width: '100%',
                        }}  
                    />
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.headlineBox}>
                    <Text style={styles.headlineText}>
                        ILLUMINATE YOUR FIRE!
                    </Text>
                </View>
                <View style={styles.fire}>
                    <Image
                        source={require('../assets/torchOff.png')}
                        style={{
                            resizeMode: 'contain',
                            height: '100%',
                            width: '100%',
                        }}
                    />
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        height: '80%',
        width: '100%',
    },

    headlineBox: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },

    headlineText: {
      fontSize: 30,
      color: '#000000',
    },

    fire: {
        flex: 4,
    },
});

export default FireView;

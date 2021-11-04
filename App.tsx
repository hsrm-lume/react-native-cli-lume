import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import HCESession, {NFCContentType, NFCTagType4} from 'react-native-hce';

let simulation: HCESession;

const startSimulation = async () => {
    const tag = new NFCTagType4(NFCContentType.Text, 'Hello world');
    simulation = await new HCESession(tag).start();
};
const stopSimulation = async () => {
    await simulation.terminate().catch(function (e) {
        console.log(e);
    });
};

stopSimulation();

export type Props = {
    name: string;
    baseEnthusiasmLevel?: number;
};

const Hello: React.FC<Props> = ({name, baseEnthusiasmLevel = 0}) => {
    const [enthusiasmLevel, setEnthusiasmLevel] =
        React.useState(baseEnthusiasmLevel);

    const onIncrement = () => startSimulation();
    const onDecrement = () => stopSimulation();

    const getExclamationMarks = (numChars: number) =>
        numChars > 0 ? Array(numChars + 1).join('!') : '';

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>
                Hello {name}
                {getExclamationMarks(enthusiasmLevel)}
            </Text>
            <View>
                <Button
                    title="Increase enthusiasm"
                    accessibilityLabel="increment"
                    onPress={onIncrement}
                    color="blue"
                />
                <Button
                    title="Decrease enthusiasm"
                    accessibilityLabel="decrement"
                    onPress={onDecrement}
                    color="red"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16,
    },
});

export default Hello;

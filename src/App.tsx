import React, { useState } from "react";
import { StyleSheet, View, Image, Button } from "react-native";
import { WebView } from "react-native-webview";

const webPage = "https://www.google.de/";

export default function App() {
  var [fireState, setName] = useState(false);
  var [startWebView, setWeb] = useState(false);

  const clickHandlerFire = () => {
    setName(!fireState);
  };

  const clickHandlerWeb = () => {
    setWeb(!startWebView);
  };

  if (!startWebView) {
    return (
      <View style={styles.container}>
        <Fire fire={fireState} />
        <View style={styles.shareButton}>
          <Button title="Feuer teilen" onPress={clickHandlerFire} />
        </View>
        <View style={styles.menu}>
          <Button title="Web anzeige" onPress={clickHandlerWeb} />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container2}>
        <Web showWeb={startWebView}></Web>
        <View
          style={{
            backgroundColor: "red",
            width: "100%",
            height: "7%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button title="Zurück" onPress={clickHandlerWeb} />
        </View>
      </View>
    );
  }
}

function Fire(props: { fire: boolean }) {
  if (props.fire) {
    return (
      <View style={styles.fire}>
        <Image
          source={require("./assets/2.png")}
          style={{ resizeMode: "contain", height: "100%", width: "100%" }}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.fire}>
        <Image
          source={require("./assets/1.png")}
          style={{ resizeMode: "contain", height: "100%", width: "100%" }}
        />
      </View>
    );
  }
}

function Web(props: { showWeb: boolean }) {
  if (props.showWeb) {
    return (
      <View style={{ backgroundColor: "#000", height: "90%" }}>
        <WebView
          source={{ uri: webPage }}
          onLoad={() => console.log("WebView ist gestartet")}
        />
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cdcdcd",
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    flex: 1,
    backgroundColor: "#001000",
    width: "100%",
    height: "100%",
  },

  fire: {
    flex: 1,
    width: "90%",
    height: "75%",
    resizeMode: "center",
  },

  shareButton: {
    flex: 0.1,
    padding: 20,
  },

  menu: {
    flex: 0.1,
    backgroundColor: "red",
    width: "100%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
});

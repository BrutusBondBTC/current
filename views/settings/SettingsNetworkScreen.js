import { View, Text } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import { connectedRelayPool, relays } from "../../utils/nostrV2";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "../../components/CustomButton";

const RelayItem = ({ relay }) => {
    let status;
    if (relay.status === 1) {
        status = 'green'
    }
    if (relay.status === 0) {
        status = 'yellow'
    }
    if (relay.status === 2 || relay.status === 3) {
        status = 'red'
    }
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#222222",
                padding: 12,
                borderRadius: 10,
                marginBottom: 12,
                width: '100%'
            }}
        >
            <Ionicons
                name="cloud-circle"
                color={status}
            />
            <Text style={globalStyles.textBody}>{relay.url}</Text>
        </View>
    );
};

const SettingsNetworkScreen = ({navigation}) => {
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textBodyBold}>Relay Network</Text>
            <View style={{width: '80%'}}>
                {connectedRelayPool.map((relay) => (
                    <RelayItem relay={relay} key={relay.url} />
                ))}
            </View>
            <CustomButton text='Back' buttonConfig={{onPress: () => {navigation.goBack();}}}/>

            <Text style={globalStyles.textBody}>
                NOTE: Relay management is automatic. We will enable custom relays in future release.
            </Text>
        </View>
    );
};

export default SettingsNetworkScreen;

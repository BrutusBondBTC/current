import { View, Text, Switch, StyleSheet } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { colors, globalStyles } from '../../../styles';
import { changeRelayMode } from '../relaysSlice';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    padding: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
});

const RelayItem = ({ relay }) => {
  const dispatch = useDispatch();
  const relayObject = useSelector((state) => state.relays.relays[relay]);
  const switchReadHandler = (updatedValue) => {
    const newObject = { ...relayObject, read: updatedValue };
    dispatch(changeRelayMode({ [relay]: newObject }));
  };
  const switchWriteHandler = (updatedValue) => {
    const newObject = { ...relayObject, write: updatedValue };
    dispatch(changeRelayMode({ [relay]: newObject }));
  };
  return (
    <View style={style.container}>
      <Text style={globalStyles.textBody}>{relay}</Text>
      <View style={style.actionItems}>
        <View style={style.action}>
          <Text style={[globalStyles.textBodyS, { marginRight: 6 }]}>Read</Text>
          <Switch
            value={relayObject.read}
            trackColor={{ true: colors.primary500 }}
            onValueChange={switchReadHandler}
          />
        </View>
        <View style={style.action}>
          <Text style={[globalStyles.textBodyS, { marginRight: 6 }]}>
            Write
          </Text>
          <Switch
            value={relayObject.write}
            trackColor={{ true: colors.primary500 }}
            onValueChange={switchWriteHandler}
          />
        </View>
      </View>
    </View>
  );
};

export default RelayItem;

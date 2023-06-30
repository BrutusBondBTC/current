import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { useHeaderHeight } from '@react-navigation/elements';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import useChat from '../hooks/useChat';
import { globalStyles } from '../../../styles';
import { CustomButton, ExpandableInput } from '../../../components';
import MenuBottomSheetWithData from '../../../components/MenuBottomSheetWithData';
import { JoinPrompt, Message } from '../components';
import { useIsMember } from '../hooks';
import { publishCommunityMessage } from '../utils/nostr';

const CommunityView = ({ route }) => {
  const { communityObject } = route.params;
  const messages = useChat(communityObject);
  const modalRef = useRef();
  const isMember = useIsMember(communityObject);
  const ownPk = useSelector((state) => state.auth.pubKey);

  useEffect(() => {
    if (!isMember) {
      modalRef.current.present();
    }
  }, []);

  const submitHandler = useCallback(
    async (input) => {
      if (input.length > 0) {
        publishCommunityMessage(input, communityObject.communitySlug);
      }
    },
    [communityObject],
  );

  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={headerHeight}
    >
      <View style={globalStyles.screenContainer}>
        <View style={{ width: '100%', flex: 1 }}>
          <FlatList
            data={messages}
            renderItem={({ item }) => {
              if (item.pubkey === communityObject.relayKey) {
                return (
                  <View style={{ scaleY: -1 }}>
                    <Text style={globalStyles.textBodyG}>{item.content}</Text>
                  </View>
                );
              }
              if (item.pubkey === ownPk) {
                return <Message event={item} sent />;
              }
              return <Message event={item} />;
            }}
            keyExtractor={(item) => item.id}
            style={{ scaleY: -1 }}
          />
        </View>
        <View style={{ width: '100%', marginTop: 6 }}>
          {isMember ? (
            <ExpandableInput onSubmit={submitHandler} />
          ) : (
            <CustomButton
              text="Join Group"
              containerStyles={{ marginBottom: 12 }}
              buttonConfig={{
                onPress: () => {
                  modalRef.current.present();
                },
              }}
            />
          )}
        </View>
        <MenuBottomSheetWithData
          render={useCallback(
            () => (
              <JoinPrompt
                communityObject={communityObject}
                onClose={() => {
                  modalRef.current.dismiss();
                }}
              />
            ),
            [communityObject],
          )}
          ref={modalRef}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommunityView;

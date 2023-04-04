import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Image } from 'expo-image';
import HomeView from '../views/HomeView';
import TwitterModal from '../views/welcome/TwitterModal';
import colors from '../styles/colors';
import WalletNavigator from './WalletNavigator';
import SettingsNavigator from './SettingsNavigator';
import SearchScreen from '../views/SearchScreen';
import globalStyles from '../styles/globalStyles';
import { useGetWalletBalanceQuery } from '../services/walletApi';
import PostView from '../views/post/PostView';
import FullScreenImage from '../components/Images/FullScreenImage';
import ReadMoreModal from '../features/homefeed/components/ReadMoreModal';
import VerifyTwitterModal from '../views/welcome/VerifyTwitterModal';
import ProfileNavigator from './ProfileNavigator';
import ZapListModal from '../views/home/ZapListModal';
import PostMenuModal from '../views/post/PostMenuModal';
import ReportPostModal from '../features/reports/views/ReportPostModal';
import { useUpdateFollowing } from '../hooks/useUpdateFollowing';
import { BackHeader } from '../components';
import MentionsNavigator from '../features/mentions/nav/MentionsNavigator';
import { PlebhyNavigator } from '../features/plebhy';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = ({ navigation }) => {
  const { data } = useGetWalletBalanceQuery(null, {
    skip: !useIsFocused(),
  });

  const pubKey = useSelector((state) => state.auth.pubKey);
  const user = useSelector((state) => state.messages.users[pubKey]);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home-sharp' : 'home-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search-circle' : 'search-circle-outline';
          } else if (route.name === 'New') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerStyle: { backgroundColor: '#222222' },
        headerTitleStyle: {
          color: 'white',
          fontFamily: 'Montserrat-Bold',
        },
        headerTintColor: 'red',
        tabBarActiveTintColor: colors.primary500,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#222222',
          borderTopColor: colors.primary50,
        },
        tabBarShowLabel: false,
        headerShadowVisible: false,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                navigation.navigate('Wallet');
              }}
            >
              <Text style={globalStyles.textBody}>
                {data ? `${data.balance}` : '----'}{' '}
                <Text
                  style={[globalStyles.textBodyS, { color: colors.primary500 }]}
                >
                  SATS
                </Text>
              </Text>
            </Pressable>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.primary500}
              style={{ marginHorizontal: 12 }}
              onPress={() => {
                navigation.navigate('MentionsModal');
              }}
            />
          </View>
        ),
        headerLeft: () => (
          <Pressable
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 12,
            }}
            onPress={() => {
              navigation.navigate('Profile', {
                screen: 'ProfileScreen',
                params: { pubkey: pubKey, name: user?.name || undefined },
              });
            }}
          >
            {user?.picture ? (
              <Image
                source={
                  user?.picture || require('../assets/user_placeholder.jpg')
                }
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                }}
              />
            ) : (
              <Ionicons name="person-circle-outline" color="white" size={24} />
            )}
          </Pressable>
        ),
      })}
      // tabBar={props => <CustomTabBar {...props}/>}
    >
      <Tab.Screen name="Home" component={HomeView} />
      <Tab.Screen name="Wallet" component={WalletNavigator} />
      <Tab.Screen
        name="New"
        component={WalletNavigator}
        options={({ navigation }) => ({
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={() => navigation.navigate('PostView')}
            />
          ),
        })}
      />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
};

const AuthedNavigator = () => {
  useUpdateFollowing();
  return (
    <Stack.Navigator initialRouteName="MainTabNav">
      <Stack.Screen
        name="MainTabNav"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TwitterModal"
        component={TwitterModal}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="VerifyTwitterModal"
        component={VerifyTwitterModal}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="PostView"
        component={PostView}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileNavigator}
        options={() => ({
          presentation: 'modal',
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="ImageModal"
        component={FullScreenImage}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReadMoreModal"
        component={ReadMoreModal}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostMenuModal"
        component={PostMenuModal}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ZapListModal"
        component={ZapListModal}
        options={{
          presentation: 'transparentModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReportPostModal"
        component={ReportPostModal}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="MentionsModal"
        component={MentionsNavigator}
        options={{
          presentation: 'modal',
          header: ({ route }) => <BackHeader />,
        }}
      />
      <Stack.Screen
        name="PlebhyModal"
        component={PlebhyNavigator}
        options={{
          presentation: 'modal',
          header: ({ route }) => <BackHeader />,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthedNavigator;

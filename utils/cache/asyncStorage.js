import AsyncStorage from '@react-native-async-storage/async-storage';
import { setGetStartedItems, setTwitterModal } from '../../features/introSlice';
import { setZapAmount } from '../../features/userSlice';
import { setZapComment } from '../../features/userSlice';
import { setZapNoconf } from '../../features/userSlice';
import { store } from '../../store/store';

export const storeData = async (key, value) => {
    try {
        console.log(`Storing data for key: ${key}`)
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        throw new Error(`Error while storing item: ${e}`);
    }
};

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (e) {
        throw new Error(`Error while retrieving item: ${e}`);
    }
};

export const hydrateStore = async () => {
    const zapAmount = await getData('zapAmount')
    const zapComment = await getData('zapComment')
    const zapNoconf = await getData('zapNoconf')
    const twitterModalShown = await getData('twitterModalShown')
    const getStartedItemsShown = await getData('getStartedItemsShown')
    if (zapAmount) {
        store.dispatch(setZapAmount(zapAmount))
    }
    if (zapComment) {
        store.dispatch(setZapComment(zapComment))
    }
    if (zapNoconf) {
        store.dispatch(setZapNoconf(zapNoconf))
    }
    if (twitterModalShown) {
        store.dispatch(setTwitterModal(JSON.parse(twitterModalShown)))
    }
    if (getStartedItemsShown) {
        const array = JSON.parse(getStartedItemsShown)
        array.forEach(id => store.dispatch(setGetStartedItems(id)))
    }

};

export const getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
    } catch(e) {
    }

    console.log(keys)
  }

  export const removeData = async (keys) => {
    try {
      await AsyncStorage.multiRemove(keys)
    } catch(e) {
      // remove error
    }

    console.log(`Removed ${keys} from AsyncStorage`)
  }

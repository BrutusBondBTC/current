import { store } from "../../store/store";
import { Event } from "./Event";
import { connectedRelays } from "./relay";

export const updateFollowedUsers = async () => {
    const pubkeys = store.getState().user.followedPubkeys;
    return Promise.allSettled(
        connectedRelays.map(
            (relay) =>
                new Promise((resolve, reject) => {
                    let sub = relay.sub([
                        {
                            authors: pubkeys,
                            kinds: [0],
                        },
                    ]);
                    sub.on("event", (event) => {
                        const newEvent = new Event(event);
                        newEvent.save();
                    });
                    sub.on("eose", () => {
                        sub.unsub();
                        clearTimeout(timer);
                        return resolve();
                    });
                    let timer = setTimeout(() => {
                        console.log(`${relay.url} timed out after 5 sec...`);
                        return reject();
                    }, 5000);
                })
        )
    );
};

export const getUserData = async (pubkeysInHex) => {
    return Promise.allSettled(
        connectedRelays.map(
            (relay) =>
                new Promise((resolve, reject) => {
                    let sub = relay.sub([
                        {
                            authors: pubkeysInHex,
                            kinds: [0],
                        },
                    ]);
                    let timer = setTimeout(() => {
                        console.log(`${relay.url} timed out after 3 sec...`);
                        reject();
                        return;
                    }, 3000);
                    sub.on("event", (event) => {
                        const newEvent = new Event(event);
                        newEvent.save();
                    });
                    sub.on("eose", () => {
                        sub.unsub();
                        clearTimeout(timer);
                        resolve();
                        return;
                    });
                })
        )
    );
};

export const getOldKind0 = async (pubkeyInHex) => {
    return Promise.allSettled(
        connectedRelays.map(
            (relay) =>
                new Promise((resolve, reject) => {
                    const allEvents = [];
                    let sub = relay.sub([
                        {
                            authors: [pubkeyInHex],
                            kinds: [0],
                        },
                    ]);
                    let timer = setTimeout(() => {
                        console.log(`${relay.url} timed out after 5 sec...`);
                        reject();
                        return;
                    }, 5000);
                    sub.on("event", (event) => {
                        allEvents.push(event);
                    });
                    sub.on("eose", () => {
                        console.log("eose!");
                        sub.unsub();
                        clearTimeout(timer);
                        resolve(allEvents);
                        return;
                    });
                })
        )
    ).then((result) =>
        result
            .filter((promise) => promise.status === "fulfilled")
            .map((promise) => promise.value)
    );
};

export const getKind3Followers = async (pubkeyInHex) => {
    const events = await Promise.allSettled(
        connectedRelays.map(
            (relay) =>
                new Promise((resolve, reject) => {
                    const allEvents = [];
                    let sub = relay.sub([
                        {
                            authors: [pubkeyInHex],
                            kinds: [3],
                        },
                    ]);
                    let timer = setTimeout(() => {
                        console.log(`${relay.url} timed out after 5 sec...`);
                        reject();
                        return;
                    }, 5000);
                    sub.on("event", (event) => {
                        allEvents.push(event);
                    });
                    sub.on("eose", () => {
                        console.log("eose!");
                        sub.unsub();
                        clearTimeout(timer);
                        resolve(allEvents);
                        return;
                    });
                })
        )
    ).then((result) =>
        result
            .filter((promise) => promise.status === "fulfilled")
            .map((promise) => promise.value)
    );
    const array = [];
    try {
        events.forEach((event) =>
            event[0]?.tags.forEach((tag) => array.push(tag[1]))
        );
        const deduped = [];
        array.forEach((key) => {
            if (!deduped.includes(key)) {
                deduped.push(key);
            }
        });
        return deduped;
    } catch (e) {
        console.log(e);
    }
};

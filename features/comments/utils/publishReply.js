import { getEventHash, getPublicKey, signEvent } from 'nostr-tools';
import { getValue } from '../../../utils/secureStore';
import devLog from '../../../utils/internal';
import { getRelayUrls, getWriteRelays, pool } from '../../../utils/nostrV2/relays.ts';

export const publishReply = async (content, event) => {
  const writeUrls = getRelayUrls(getWriteRelays());
  let replyETags;
  let replyPTags;
  try {
    const oldETags = event.tags.filter((tag) => tag[0] === 'e');
    const oldPTags = event.tags.filter((tag) => tag[0] === 'p');

    if (oldETags.length > 0) {
      replyETags = [oldETags[0], ['e', event.id, 'reply']];
    } else {
      replyETags = [['e', event.id, 'reply']];
    }

    if (oldPTags.length > 0) {
      replyPTags = [...oldPTags, ['p', event.pubkey]];
    } else {
      replyPTags = [['p', event.pubkey]];
    }

    const sk = await getValue('privKey');
    const pk = getPublicKey(sk);

    const reply = {
      kind: 1,
      pubkey: pk,
      created_at: Math.floor(Date.now() / 1000),
      tags: [...replyETags, ...replyPTags],
      content,
    };
    reply.id = getEventHash(reply);
    reply.sig = signEvent(reply, sk);
    const success = await new Promise((resolve, reject) => {
      const pubs = pool.publish(writeUrls, reply);
      const timer = setTimeout(() => {
        resolve(true);
      }, 2500);
      pubs.on('ok', () => {
        clearTimeout(timer);
        resolve(true);
      });
      pubs.on('failed', () => {
        reject();
      });
    });
    return success;
  } catch (e) {
    devLog(e);
    return null;
  }
};

export default publishReply;
import { getEventHash, getPublicKey, nip04, signEvent } from 'nostr-tools';
import { publishGenericEvent } from '../../../utils/nostrV2';

async function publishMessage(sk, receiverPk, content) {
  const pk = getPublicKey(sk);
  const encryptedMessage = await nip04.encrypt(sk, receiverPk, content);
  const event = {
    pubkey: pk,
    kind: 4,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['p', receiverPk]],
    content: encryptedMessage,
  };
  event.id = getEventHash(event);
  event.sig = signEvent(event, sk);
  await publishGenericEvent(event);
}

export default publishMessage;

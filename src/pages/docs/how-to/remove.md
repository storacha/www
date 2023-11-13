# Removing data from your account

You might want to remove data from being associated with your account. You can do so using the JS client, CLI, or web app.

Note that there is a minimum 30 day retention period for uploaded data, and even once removed, the data might persist on the public IPFS network.

**CAUTION**

⚠️❗ Public Data 🌎: All data uploaded to w3up is available to anyone who requests it using the correct CID. Do not store any private or sensitive information in an unencrypted form using w3up.

⚠️❗ Permanent Data ♾️: Removing files from w3up will remove them from the file listing for your account, but that doesn't prevent nodes on the decentralized storage network from retaining copies of the data indefinitely. web3.storage itself generally retains and charges users for any uploaded data for a minimum of 30 days. Do not use w3up for data that may need to be permanently deleted in the future.

## Removing uploads (content CIDs) vs. stores (shard CIDs)

web3.storage tracks two different things for its users to support content addressing. These concepts were first introduced in the Upload section:

* Content CIDs: The CIDs used to reference and access uploads in the format generally useful to users (e.g., files, directories). These CIDs are generally prefixed by `bafy…`.
* Shard CIDs: The CID of the serialized shards of data itself (CAR files) that are produced client-side, sent to web3.storage, and stored. These CIDs are generally prefixed by `bag…`.

web3.storage tracks usage for payment (i.e., how much storage is utilized by a user) using the volume of data associated with shard CIDs. However, in general, most users will be interacting with content CIDs (this is how you fetch your data from the network), with shard CIDs more of an implementation detail (how data gets chunked, serialized into CAR files, and stored for uploads).

Fortunately, this shouldn't make things any more complicated - we go into more detail below, but in general, when you remove a content CID from your account, you'll want to remove the shard CIDs as well (e.g., in the client calling `Client.remove(contentCID, shards=True)`).

However, if you are a power user interacting with shard CIDs as well (e.g., using the client's `capability.store.*` or CLI's `w3 can store *` methods), then you need to be more cautious about removing shard CIDs from your account. (This is why the default for the client and CLI methods is for shards to be maintained after removing a content CID). You can read more about why you might want to interact with shard CIDs directly and the implications in the Upload vs. Store section.

\## Using the client or CLI

If you followed the Upload section, you should already have your client or CLI set up with an Agent for your Space. From there, to remove a content CID from your account, you'll generally be using:

* Client: `Client.remove(contentCID)`
* CLI: `w3 rm <contentCID>`

If you initially uploaded your content by using the recommended upload methods (e.g., used `Client.upload()` or `w3 up`) and didn't interact with CAR shards at all when uploading, we recommend removing the shard CIDs associated with the content CID from your account. Otherwise, you will still be paying for the data stored with web3.storage (as mentioned above). The easiest way to do that is to set the `shards` parameter as `True`:

* Client: `Client.remove(contentCID, shards=True)`
* CLI: `w3 rm <contentCID> --shards` in the CLI

A full example of this is:

```javascript
import { create } from '@web3-storage/w3up-client'
import * as Signer from '@ucanto/principal/ed25519' // Agents on Node should use Ed25519 keys

const principal = Signer.parse(process.env.KEY) // Agent private key
const client = await create({ principal })

async function main () {
  // Load client with specific private key
  const principal = Signer.parse(process.env.KEY)
  const client = await Client.create({ principal })
  
  // Add proof that this agent has been delegated capabilities on the space
  const proof = await parseProof(process.env.PROOF)
  const space = await client.addSpace(proof)
  await client.setCurrentSpace(space.did())
  
  // remove content previously uploaded, including the underlying shards
  client.remove('bafybeidd2gyhagleh47qeg77xqndy2qy3yzn4vkxmk775bg2t5lpuy7pcu', shards=True)
}

/** @param {string} data Base64 encoded CAR file */
async function parseProof (data) {
  const blocks = []
  const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return importDAG(blocks)
}

```

## Removing content CIDs and shard CIDs separately

If you have managed your shard CIDs and upload CIDs separately (e.g., used `Client.capability.store.add()` and `Client.capability.upload.add()` in the client or `w3 can store add` and `w3 can upload add` in the CLI), you'll want to remove the upload CIDs and underlying shard CIDs separately as well. You can read more about why you might want to interact with shard CIDs directly and the implications in the Upload vs. Store section.

To remove shard CIDs and upload CIDs separately, you'll generally do this by:

* Client:
  * If you registered a content CID you want to remove using `Client.capability.upload.add(contentCID)`…
    * (If you don't know which shard CIDs are associated with the content CID) Run `Client.capability.upload.listShards(contentCID)`, which returns a list of shard CIDs
    * Remove it using `Client.capability.upload.remove(contentCID)`
  * Remove the shard CIDs that you'd like to
    * For each shard CID, ensure no other uploaded content CIDs share the same shard (otherwise, the other content CIDs will no longer be fetchable)
    * Remove the shard CIDs one-by-one using `Client.capability.store.remove(shardCID)`
* CLI:
  * If you registered a content CID you want to remove using `w3 can upload add <contentCID>`…
    * (If you don't know which shard CIDs are associated with the content CID) Run `w3 can upload ls <contentCID> --shards`, which returns a list of shard CIDs
    * Remove it using `w3 can upload rm <contentCID>`
  * Remove the shard CIDs that you'd like to
    * For each shard CID, ensure no other uploaded content CIDs share the same shard (otherwise, the other content CIDs will no longer be fetchable)
    * Remove the shard CIDs one-by-one using `w3 can store rm <shardCID>`

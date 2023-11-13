## Concepts

## UCANs and web3.storage

How web3.storage uses UCAN

For authorization, w3up services use [ucanto](https://github.com/web3-storage/ucanto), a Remote Procedure Call (RPC) framework built around [UCAN](https://ucan.xzy/), or User Controlled Authorization Networks. UCANs are a powerful capability-based authorization system that allows fine-grained sharing of permissions through a process called _delegation_ on top of [public key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography).

You can think about UCAN replacing bearer tokens in traditional APIs for authorization with w3up. Since any actor can be represented by a cryptographic keypair and permissions can be delegated to them, users can interact with w3up directly in cases where a developer might have needed to previously run additional back-end infrastructure to keep API keys secure. This can be extended even to have end users using applications integrated with w3up using their own keypair-based identity.

### How w3up and w3up-client use UCANs

Our client and CLI use ucanto to take care of the details of UCANs for you, but a few of the underlying terms and concepts may "bubble up" to the surface of the API, so we'll cover the basics. We'll also go over some terms that are specific to web3.storage that you might not have encountered elsewhere.

UCAN-based APIs are centered around _capabilities_, which are comprised of an _ability_ and a _resource_. Together, the ability and resource determine what action a client can perform and what objects in the system can be acted upon. When invoking a service method, a client will present a UCAN token that includes an ability and resource, along with _proofs_ that verify that they should be allowed to exercise the capability. The proof might be signed directly by the capability owner, or have a chain of signatures (_delegations_) where the actor invoking the capability has been verifiably delegated permission to do so.

#### [Space](https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#space)

When you upload data to w3up, your uploads are linked to a unique _Space_ that acts as a "namespace" for the data you upload. Each Space corresponds to a _DID_, or [Decentralized Identity Document](https://www.w3.org/TR/did-core/). In web3.storage's implementation of w3up, these Space DIDs generally use the key DID method, of the form did:key:publicKey with a corresponding private signing key.

When creating a Space, it generates this private key and did:key for you locally. To use web3.storage, you then register a Space by associating it with your email address. From there, when invoking storage capabilities with web3.storage, the Space did:key is the "resource" portion of the capability, while the ability is an action like store/add or store/remove. (A Space registered with web3.storage is imperfectly analogous to an "account" with web3.storage.)

Under the hood in the email registration process, your Space delegates the capabilities needed to use w3up to your email address, and this delegation is stored by web3.storage. If you need access to your Space in the future from any device, web3.storage allows you to reclaim those capabilities the same way you would reset a password in other services - using an email verification process. This means you don't need to store or manage Space private keys to use w3up - just create a new space, register it with w3up and use it from as many devices as you like. More on this "sign in" process is detailed in the next section on Agents.

#### Agent

To invoke a capability like store/add on a Space using the client or CLI, the client must have an _Agent_. Like a Space, an Agent corresponds to a did:key whose private key is generated locally. An Agent is useful once the client or CLI has a UCAN delegation where a registered Space(s) delegates the Agent its capabilities. (An imperfect analogy is Agent to login session.)

The delegation from a Space to your Agent that w3up-client needs can be passed either by verifying the email address the Space is registered to and claiming the UCAN delegation (authorize(email) then capability.access.claim) or directly if you have the UCAN delegation available locally (addSpace(delegation)).

#### Delegation to other actors

Just like Spaces can delegate permissions to Agents you own, you can also delegate permissions to other actors' Agents. One common application of this could be you delegating permission to upload to your Space to your users. Here's a code snippet demonstrating this from the Upload section:

```
import { CarReader } from '@ipld/car';

import \* as DID from '@ipld/dag-ucan/did';

import \* as Delegation from '@ucanto/core/delegation';

import { importDAG } from '@ucanto/core/delegation';

import \* as Signer from '@ucanto/principal/ed25519';

import \* as Client from '@web3-storage/w3up-client';

async function backend(did: string) {

// Load client with specific private key

const principal = Signer.parse(process.env.KEY);

const client = await Client.create({ principal });

// Add proof that this agent has been delegated capabilities on the space

const proof = await parseProof(process.env.PROOF);

const space = await client.addSpace(proof);

await client.setCurrentSpace(space.did());

// Create a delegation for a specific DID

const audience = DID.parse(did);

const abilities = ['store/add', 'upload/add'];

const expiration = Math.floor(Date.now() / 1000) + 60 \* 60 \* 24; // 24 hours from now

const delegation = await client.createDelegation(audience, abilities, {

expiration,

});

// Serialize the delegation and send it to the client

const archive = await delegation.archive();

return archive.ok;

}

/\*\* @param {string} data Base64 encoded CAR file \*/

async function parseProof(data) {

const blocks = [];

const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'));

for await (const block of reader.blocks()) {

blocks.push(block);

}

return importDAG(blocks);

}

async function frontend() {

// Create a new client

const client = await Client.create();

// Fetch the delegation from the backend

const apiUrl = `/api/w3up-delegation/${client.agent().did()}`; // backend method is exposed at this API URL

const response = await fetch(apiUrl);

const data = await response.arrayBuffer();

// Deserialize the delegation

const delegation = await Delegation.extract(new Uint8Array(data));

if (!delegation.ok) {

throw new Error('Failed to extract delegation');

}

// Add proof that this agent has been delegated capabilities on the space

const space = await client.addSpace(delegation.ok);

client.setCurrentSpace(space.did());

// READY to go!

}
```

You can see the following flow:

- When `backend` function is called in the developer's backend:
  - It's passed the DID of the user's Agent
  - Backend client initializes with an Agent that has permission to the developer's Space
  - It then generates a UCAN delegated to the user Agent DID passed in with only the `store/add` and `upload/add` abilities (to give the user ability to upload) and set to expire in 24 hours
- When `frontend` function is called in the user's environment:
  - An Agent DID is created
  - The `backend` function hosted at an API endpoint is called, passing in the Agent DID
  - The client is set up with a UCAN delegating upload capabilties to the Agent
  - It's now ready to upload!

However, there's other interesting possibilities - for instance, you could create an app where your users make Spaces and delegate permission to your app to read their uploads. Read the Architecture options section to explore more.

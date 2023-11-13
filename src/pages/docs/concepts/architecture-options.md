# Possible architectures using web3.storage to upload

UCAN opens up a number of options in how to integrate with w3up: Should you, the developer, own the Space? Should you delegate permissions to your users? Or should your user own their own Space? Broadly, there are three ways to integrate:

- Client-server: You (the developer) own the Space, and your user uploads to your backend infra before you upload it to the service
- Delegated: You own the Space, but you give a delegated UCAN token to your user's Agent to upload directly to the service, rather than needing to proxy the upload through your backend (no egress from your infrastructure)
- User-owned: Your user owns the Space and registers it and they use it to upload directly with the service; if you want to instrument visibility into what they're uploading, you'll have to write separate code in your app for it

In the How-tos section of the docs, we focused on the first two options, as they are the most familiar today. However, you can implement each of these in a number of ways, but we talk through some considerations when implementing a given option.

## Client-server

```mermaid
sequenceDiagram
participant User
w3up-client in backend-\>\>w3up-client in backend: Client set with Agent with delegation from Space
User-\>\>w3up-client in backend: Upload data
w3up-client in backend-\>\>web3.storage w3up service: Upload data
```

- For your backend to be scalable, you might consider using serverless workers or a queue in front of a server
- In either case, you'll need a registered Space, and your client instance in your backend to have an Agent with a delegation from this Space
  - (Recommended) It's likely easiest to create and register your Space using [w3cli](https://github.com/web3-storage/w3cli) rather than using w3up-client to do so (especially if your backend isn't persistent); you can then generate your own Agent and delegate the ability to upload to your Space using something like [this example](https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#bringing-your-own-agent-and-delegation)
  - If your backend is persistent, you can do this or do everything in the client directly ([create Space](https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#creating-and-registering-spaces) and [get delegation](https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#delegating-from-space-to-agent))
- After this, once your user uploads data to your backend, you can run any of the upload methods

## Delegated

```mermaid
sequenceDiagram
participant w3up-client in user
participant w3up-client in backend
participant web3.storage w3up service
w3up-client in backend-\>\>w3up-client in backend: Client created with Agent and delegation from Space
w3up-client in user-\>\>w3up-client in user: Client instantiated with default Agent
w3up-client in user-\>\>w3up-client in backend: Request delegation with user's Agent DID
w3up-client in backend-\>\>w3up-client in user: Send delegation from Space to user's Agent DID
w3up-client in user-\>\>web3.storage w3up service: Upload data
```

- You will likely have w3up-client running in your end-user's client code, as well as backend code that's able to generate UCANs that delegate the ability to upload and pass them to your users (e.g., w3up-client running in a serverless worker)
- For your backend to be scalable, you might consider using serverless workers or a queue in front of a server
- As the developer, you'll need a registered Space, and your client instance in your backend to have an Agent with a delegation from this Space
  - (Recommended) It's likely easiest to create and register your Space using [w3cli](https://github.com/web3-storage/w3cli) rather than using w3up-client to do so (especially if your backend isn't persistent); you can then generate your own Agent and delegate the ability to upload to your Space using something like [this example](https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#bringing-your-own-agent-and-delegation)
  - If your backend is persistent, you can do this or do everything in the client directly ([create Space](https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#creating-and-registering-spaces) and [get delegation](https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#delegating-from-space-to-agent))
- Your user does not need a registered Space - just an Agent with a delegation from your Space
  - w3up-client in the end user environment should have a unique Agent for each user, which should happen by default (since when w3up-client is instantiated it creates a new Agent anyway, or uses the one in local Store)
  - From there, when your end user is ready to upload, they should request from your backend a delegation from your developer-owned Space to their Agent (which can be derived via [client.agent()](https://github.com/web3-storage/w3up/blob/main/packages/w3up-client/docs-Client#agent))
    - In your backend, you can call [client.createDelegation()](https://github.com/web3-storage/w3up/blob/main/packages/w3up-client/docs-Client#createDelegation) passing in the Agent object from client.agent() in your end user's instance, and passing through options? params to limit the scope of the delegation (e.g., store/add, upload/add, expiration time)
    - You can serialize this using delegation.archive() and send it to your user
    - The end user instance of the client should not need to call client.authorize(email), as it is not claiming any delegations via email address (but rather getting the delegation directly from your backend)
- Once your user receives the delegation, they can deserialize it using [ucanto.Delegation.extract()](https://github.com/web3-storage/ucanto/blob/c8999a59852b61549d163532a83bac62290b629d/packages/core/src/delegation.js#L399) and pass it in using client.addSpace(), and from there they can run any of the upload methods
  - Note that this alone does not give visibility into which of your end users are uploading what; to track this, you'll probably need them to send you that information separately (e.g., once they've run upload and get back a content CID, you can have them send that CID to you for tracking)
- A code example that does this can be found below

```js
import { CarReader } from '@ipld/car'
import * as DID from '@ipld/dag-ucan/did'
import * as Delegation from '@ucanto/core/delegation'
import { importDAG } from '@ucanto/core/delegation'
import * as Signer from '@ucanto/principal/ed25519'
import * as Client from '@web3-storage/w3up-client'

async function backend(did: string) {
  // Load client with specific private key
  const principal = Signer.parse(process.env.KEY)
  const client = await Client.create({ principal })

  // Add proof that this agent has been delegated capabilities on the space
  const proof = await parseProof(process.env.PROOF)
  const space = await client.addSpace(proof)
  await client.setCurrentSpace(space.did())

  // Create a delegation for a specific DID
  const audience = DID.parse(did)
  const abilities = ['store/add', 'upload/add']
  const expiration = Math.floor(Date.now() / 1000) + 60 \* 60 \* 24 // 24 hours from now
  const delegation = await client.createDelegation(audience, abilities, { expiration })

  // Serialize the delegation and send it to the client
  const archive = await delegation.archive()

  return archive.ok;
}

/** @param {string} data Base64 encoded CAR file */
async function parseProof(data) {
  const blocks = []
  const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return importDAG(blocks)
}

async function frontend() {
  // Create a new client
  const client = await Client.create()

  // Fetch the delegation from the backend
  const apiUrl = `/api/w3up-delegation/${client.agent().did()}`
  const response = await fetch(apiUrl)
  const data = await response.arrayBuffer();

  // Deserialize the delegation
  const delegation = await Delegation.extract(new Uint8Array(data));
  if (!delegation.ok) {
    throw new Error('Failed to extract delegation');
  }

  // Add proof that this agent has been delegated capabilities on the space
  const space = await client.addSpace(delegation.ok);
  client.setCurrentSpace(space.did())

  // READY to go!
}
```

## User-owned

```mermaid
sequenceDiagram
participant User
participant Application backend
participant web3.storage w3up service
Application backend-\>\>User: Front end code that includes w3up-client
User-\>\>web3.storage w3up service: (If needed) Create Space and register it
User-\>\>web3.storage w3up service: (If needed) Use Agent email verification to "log in" to Space
User-\>\>web3.storage w3up service: Upload data using w3up-client
```

- If you want your user to own their own Space, you'll likely be relying on the w3up-client methods to create a Space, authorize the Space, and authorize the Agent on the end user-side; from there they can run any of the upload methods
  - Doing this does take some of the UX out of your control; for instance, when web3.storage fully launches with w3up, your users will have to set up their payment methods with web3.storage
  - Note that this alone does not give visibility into which of your end users are uploading what; to track this, you'll probably need them to send you that information separately (e.g., once they've run upload and get back a content CID, you can have them send that CID to you for tracking)
- There is a world of possibilities with your users "bringing their own identity" for their Space; you could explore how crypto wallet private keys, Apple Passkey, and more might map to Space DIDs and have the client use those
- If you have code snippet(s) that works for you, please share them in a PR or [Github issue](https://github.com/web3-storage/www/issues) and we'll link them here!

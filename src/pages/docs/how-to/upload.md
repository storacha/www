# How to upload data using web3.storage

In this how-to guide, you'll learn how to store data programmatically for your development projects using the web3.storage client library in JavaScript using your (developer-owned) Space. This includes various architecture options for the data pipeline for your users to upload to web3.storage, which then makes your data available on the decentralized IPFS network with persistent long-term storage provided by Filecoin.

Later in this section, we also cover uploading data using the CLI or web console. If you just want to quickly store a few files using web3.storage rather than include upload functionality in an app or service you're building, you may want to hop down there.

**CAUTION**

⚠️❗ Public Data 🌎: All data uploaded to w3up is available to anyone who requests it using the correct CID. Do not store any private or sensitive information in an unencrypted form using w3up.

⚠️❗ Permanent Data ♾️: Removing files from w3up will remove them from the file listing for your account, but that doesn't prevent nodes on the decentralized storage network from retaining copies of the data indefinitely. web3.storage itself generally retains and charges users for any uploaded data for a minimum of 30 days. Do not use w3up for data that may need to be permanently deleted in the future.

## web3.storage API authorization

In the previous section, you created a Space that has a unique DID. To use the client to upload data to this Space, you need to give it permission to do so. This is done by passing an Agent into the client and a UCAN token delegating permissions to this Agent. An Agent has a DID with an underlying private key (like a Space), but can be thought of as parallel to a login session (whereas the Space can be thought of more like a bucket or account). To learn more about how UCAN works and how web3.storage uses it, read our docs on UCAN authorization.

## Using the Command line `w3cli`

If you followed the Create account and Space section, you will already have the CLI set up with a Space. However, you might be using the CLI on a new machine, in which case you can follow these instructions:

1. (If not yet installed) Install the CLI from npm using your command line: `npm install -g @web3-storage/w3cli`.
2. Run `w3 authorize [alice@example.com](mailto:alice@example.com)` in the command line using your email address. Click on the validation link sent to your email.
3. After successfully running `authorize`, your CLI Agent has been delegated access to all Spaces associated with your email address. You can see a list of these Spaces using `w3 space ls` and select the one you'd like to upload to using `w3 space use \<space_did\>`.

When the right Space is selected, you are ready to upload! You can do so by running `w3 up \<path\>`.

There are a few useful flags (check out the reference docs to see a full list):

```shell
--no-wrap    # Don't wrap input files with a directory.
-H, --hidden # Include paths that start with ".".
-c, --car    # File is a CAR file.
```

## Using the Javascript client

This section discusses using the web3.storage JavaScript client, w3up-client, with your (developer-owned) Space in your application. web3.storage's Javascript client provides a simple interface for storing data using syntax inspired by familiar web APIs such as [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)and [File](https://developer.mozilla.org/en-US/docs/Web/API/File).

```mermaid
flowchart TD
B[w3up-client instance] --\>|Automatic if specific Agent is not passed when client object created|B(Pass local Agent DID and key)
S --\> C(Get UCAN delegation from Space to Agent)
C --\> D(Upload to Space using Agent)
```

All uses of w3up-client to upload with web3.storage follow the flow above.

### Installing the client

In your JavaScript project, add the web3.storage package to your dependencies:

```sh
npm install @web3-storage/w3up-client
```

### Creating a server-side client instance

The package provides a [static](https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#create)[create](https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#create)[function](https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#create) that returns a [Client](https://web3-storage.github.io/w3up-client/classes/client.Client.html)[object](https://web3-storage.github.io/w3up-client/classes/client.Client.html). How you initialize it depends on the backend environment.

### Claim delegation via email validation: For persistent backend only

```mermaid
sequenceDiagram
Client-\>\>web3.storage service: Here is my email address and Agent DID
web3.storage service--\>\>Client: Please click the link to validate
Client--\>\>web3.storage service: Email address validated
web3.storage service-\>\>Client: Here is a UCAN delegating permission from Space DID to Agent DID
```

You can use web3.storage's email authorization flow to give permissions to your server-side client. This can be good if your backend environment will be persistent (otherwise it would be prohibitive to click an email validation link every time the client is re-instantiated.

```javascript
import { create } from '@web3-storage/w3up-client'
const client = await create()
```

By default, clients will create a new [Agent](https://web3-storage.github.io/w3protocol/classes/_web3_storage_access.Agent.html) and put it in a persistent local [Store](https://github.com/web3-storage/w3up/tree/main/packages/access-client) if it can't find an existing one to load (so the next time the client is initialized on the same device, it will use the same Agent).

Then you can authorize your Agent with your email address. Calling authorize will cause an email to be sent to the given address.

```javascript
await client.authorize('zaphod@beeblebrox.galaxy')
```

Once a user clicks the confirmation link in the email, the authorize method will resolve. Make sure to check for errors, as authorize will fail if the email is not confirmed within the expiration timeout. Authorization needs to happen only once per agent. This also claims all delegations available with your email address, so from there, you can select the Space you'd like to use.

```javascript
await client.setCurrentSpace(space.did()) # select the relevant Space DID that is associated with your account
```

### Bring your own Agent

For any backend (including non-persistent and/or serverless)

```mermaid
sequenceDiagram
Developer-\>\>Developer: Create Agent private key and DID
Developer-\>\>Developer: Delegate UCAN from Space to Agent
Developer-\>\>Client: Here is my Agent private key and UCAN delegating permissions
```

An option that works for any backend environment is to define an Agent and delegate a UCAN from your Space to this Agent before initializing the client. This is especially useful if you're using the client in a serverless Node environment (e.g., Lambda).

In your command line wherever the CLI is configured with the Space you want to use (e.g., where you created the Space):

```shell
# the following command returns what will be your Agent private key and DID
# store the private key in environment variable KEY
npx ucan-key ed --json

# the following command returns the UCAN that will delegate
# make sure `w3 space use` is set to the Space you intend on using
# if you want to limit permissions being passed to the Agent, you can specify which permissions to give, e.g., `--can 'store/add' --can 'upload/add'` limits to just being able to upload
w3 delegation create <did_from_ucan-key_command_above> | base64

# store the output in environment variable PROOF
```

Then, when you initialize and configure the client, you can pass in this Agent and UCAN.

```javascript
import { create } from '@web3-storage/w3up-client'
import * as Signer from '@ucanto/principal/ed25519' // Agents on Node should use Ed25519 keys

async function main () {
  // Load client with specific private key
  const principal = Signer.parse(process.env.KEY)
  const client = await Client.create({ principal })
  // Add proof that this agent has been delegated capabilities on the space
  const proof = await parseProof(process.env.PROOF)
  const space = await client.addSpace(proof)
  await client.setCurrentSpace(space.did())
  // READY to go!
}

/** @param {string} data Base64 encoded CAR file \*/
async function parseProof (data) {
  const blocks = []
  const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return importDAG(blocks)
}
```

If you're doing this in a non-persistent or serverless backend, you might consider using an in-memory [Store](https://github.com/web3-storage/w3up/tree/main/packages/access-client) for your Agent information rather than the default on-disk:

```javascript
import { StoreMemory } from '@web3-storage/access/stores/store-memory'
const client = await Client.create({ principal, store: new MemoryStore() })
```

### Uploading to web3.storage

Now that your backend client instance is set up with being able to interact with your Space, you're ready to upload! Call uploadFile to upload a single file, or uploadDirectory to upload multiple files.

There are two main options to getting content into your Space:

- Upload data to web3.storage from the backend client itself (e.g., you're storing data that your users are uploading to your backend)
- Upload data to web3.storage directly from your user's environment (like your application's user's browser) by delegating a UCAN that has permission to upload to your Space

### Upload from backend client directly

```mermaid
sequenceDiagram
User-\>\>w3up-client in backend: Upload data
w3up-client in backend-\>\>web3.storage service: Upload data
```

You are already set up to upload using your client instance as data becomes available to your backend - you can call uploadFile or uploadDirectory with it.

```javascript
import { create } from '@web3-storage/w3up-client'
import { filesFromPaths } from 'files-from-path'

// e.g "./best-gifs"
const path = process.env.PATH_TO_FILES
const files = await filesFromPaths([path])

const client = await create()
const directoryCid = await client.storeDirectory(files)
```

In the example above, `directoryCid` resolves to an IPFS directory.

\### Delegate UCAN for your user to upload directly

```mermaid
sequenceDiagram
participant w3up-client in user
participant w3up-client in backend
participant web3.storage service
w3up-client in user-\>\>w3up-client in user: Client instantiated with default Agent
w3up-client in user-\>\>w3up-client in backend: Request delegation with user's Agent DID
w3up-client in backend-\>\>w3up-client in user: Send delegation from Space to user's Agent DID
w3up-client in user-\>\>web3.storage service: Upload data
```

Your backend instance can also be used to delegate upload permissions directly to your user to upload. The code snippet below shows an example of how you might set up a client instance in your application frontend and how it might interact with your backend client. You can see how the frontend client Agent DID is used for the backend client to delegate permissions to; from there, it will be the frontend client that will call the `upload` method.

```javascript
import { CarReader } from '@ipld/car';
import * as DID from '@ipld/dag-ucan/did';
import * as Delegation from '@ucanto/core/delegation';
import { importDAG } from '@ucanto/core/delegation';
import * as Signer from '@ucanto/principal/ed25519';
import * as Client from '@web3-storage/w3up-client';

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
  const expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
  const delegation = await client.createDelegation(audience, abilities, {
    expiration,
  });

  // Serialize the delegation and send it to the client
  const archive = await delegation.archive();
  return archive.ok;
}

/** @param {string} data Base64 encoded CAR file */
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
  const apiUrl = `/api/w3up-delegation/${client.agent().did()}`;
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

### Preparing files and uploading

You are now ready to upload using the client! In general, the easiest way to upload data is using the uploadFile or uploadDirectory method.

uploadFile expects a "Blob like" input, which can be a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) or [File](https://developer.mozilla.org/en-US/docs/Web/API/File) when running in a browser. On node.js, see the [filesFromPath](https://github.com/web3-storage/files-from-path)[library](https://github.com/web3-storage/files-from-path), which can load compatible objects from the local filesystem. By default, files uploaded to web3.storage will be wrapped in an IPFS directory listing. This preserves the original filename and makes links more human-friendly than CID strings, which look like random gibberish.

uploadDirectory requires File-like objects instead of Blobs, as the file's name property is used to build the directory hierarchy.

**Tip** When uploading multiple files, give each file a unique name. All the files in a `storeDirectory` request will be bundled into one content archive, and linking to the files inside is much easier if each file has a unique, human-readable name.

You can control the directory layout and create nested directory structures by using / delimited paths in your filenames:

```javascript
const files = [
new File(['some-file-content'], 'readme.md'),
new File(['import foo'], 'src/main.py'),
new File([someBinaryData], 'images/example.png'),
]

const directoryCid = await client.storeDirectory(files)
```

In the example above, directoryCid resolves to an IPFS directory with the following layout:

```text
.
├──images
|  └──example.png
├──readme.md
└──src
└──main.py
```

There are a few different ways of creating `File` objects available, depending on your platform.

In the browser, you can use a [file input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file) to allow the user to select files for upload:

```javascript
function getFiles () {
  const fileInput = document.querySelector('input[type="file"]')
  return fileInput.files
}
```

You can also manually create File objects using the native File constructor provided by the browser runtime. This is useful when you want to store data created by your application, instead of files from the user's computer.

```javascript
function makeFileObjects () {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const obj = { hello: 'world' }
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

  const files = [
    new File(['contents-of-file-1'], 'plain-utf8.txt'),
    new File([blob], 'hello.json')
  ]
  return files
}
```

In Node.js, the [files-from-path](https://www.npmjs.com/package/files-from-path)[module](https://www.npmjs.com/package/files-from-path) module reads File objects from the local file system. The `getFilesFromPaths` helper asynchronously returns an array of Files that you can use directly with the put client method:

```javascript
import { getFilesFromPaths } from 'files-from-path'
```

If you expect to be loading a lot of large files, you may be better served by the [filesFromPath](https://github.com/web3-storage/files-from-path#filesfrompath)[helper](https://github.com/web3-storage/files-from-path#filesfrompath). It reduces memory pressure by yielding File objects one by one as they're loaded from disk, instead of loading everything into memory. You can then issue multiple put requests to send each file to web3.storage.

You can also manually create File objects by importing a Node.js implementation of File from the web3.storage package. This is useful when you want to store data created by your application, instead of files from the user's computer.

```javascript
async function getFiles (path) {
  const files = await getFilesFromPath(path)
  console.log(`read ${files.length} file(s) from ${path}`)
  return files
}

function makeFileObjects () {
  // You can create File objects from a Buffer of binary data
  // see: https://nodejs.org/api/buffer.html
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const obj = { hello: 'world' }
  const buffer = Buffer.from(JSON.stringify(obj))
  const files = [
    new File(['contents-of-file-1'], 'plain-utf8.txt'),
    new File([buffer], 'hello.json')
  ]
  return files
}
```

## Next steps

Learn more about how to fetch your data using the CID in the next section, Retrieve.

<https://web3.storage/docs/how-tos/retrieve/>

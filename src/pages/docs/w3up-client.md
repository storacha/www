# `w3up-client`

You can easily integrate web3.storage into your JavaScript apps using `w3up-client`, our JavaScript client for the w3up platform.

In this guide, we'll walk through the following steps:

1. [Installing the client library](#install)
2. [Creating and registering your first space](#create-and-register-a-space)
3. [Uploading a file or directory](#upload-files)
4. [Viewing your file with IPFS](#view-your-file-on-an-ipfs-gateway)

## Install

You'll need [Node](https://nodejs.com) version 18 or higher, with NPM version 7 or higher to complete this guide.
You can check your local versions like this:

```bash
node --version && npm --version
```

Add the library to your project's dependencies:

```bash
npm install @web3-storage/w3up-client
```

To use the client, import and call the `create` function:

```js
import { create } from '@web3-storage/w3up-client'

const client = await create()
```

See the [client reference docs][reference-w3up-client#create] for more creation options.

## Create and register a space

When you upload things to web3.storage, each upload is associated with a <Term id="space">"space,"</Term> which is a unique identifier that acts as a namespace for your content.

Spaces are identified by <Term id="did">DID</Term> using keys created locally on your devices. To use a space for uploads, it needs to be registered with the storage service by providing an email address.

To create a space using `w3up-client`, use the [`createSpace` client method][reference-w3up-client#createSpace]:

```js
const space = await client.createSpace('my-awesome-space')
```

The name parameter is optional. If provided, it will be stored in your client's local state store and can be used to provide a friendly name for user interfaces.

After creating a [`Space`][reference-w3up-client#space], you'll need to register it with the w3up service before you can upload data.

First, set the space as your "current" space using the [`setCurrentSpace` method][reference-w3up-client#setcurrentspace], passing in the DID of the `space` object you created above:

```js
await client.setCurrentSpace(space.did())
```

Next, call the [`registerSpace` method][reference-w3up-client#registerspace], passing in an email address to register as the primary contact for the space:

```js
try {
  await client.registerSpace('zaphod@beeblebrox.galaxy')
} catch (err) {
  console.error('registration failed: ', err)
}
```

Calling `registerSpace` will cause an email to be sent to the given address. Once a user clicks the confirmation link in the email, the `registerSpace` method will resolve. Make sure to check for errors, as `registerSpace` will fail if the email is not confirmed within the expiration timeout.

Now that you've registered a space, you're ready to upload files!

## Upload files

Now that you've [created and registered a space](#create-space), you're ready to upload files to web3.storage!

Call [`uploadFile`][reference-w3up-client#uploadfile] to upload a single file, or [`uploadDirectory`][reference-w3up-client#uploaddirectory] to upload multiple files.

`uploadFile` expects a "Blob like" input, which can be a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) or [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) when running in a browser. On node.js, see the [`filesFromPath` library](https://github.com/web3-storage/files-from-path), which can load compatible objects from the local filesystem.

`uploadDirectory` requires `File`-like objects instead of `Blob`s, as the file's `name` property is used to build the directory hierarchy.

You can control the directory layout and create nested directory structures by using `/` delimited paths in your filenames:

```js
const files = [
  new File(['some-file-content'], 'readme.md'),
  new File(['import foo'], 'src/main.py'),
  new File([someBinaryData], 'images/example.png')
]

const directoryCid = await client.storeDirectory(files)
```

In the example above, `directoryCid` resolves to an IPFS directory with the following layout:

```
.
├── images
│   └── example.png
├── readme.md
└── src
    └── main.py
```
## View your file on an IPFS gateway

The `uploadFile` and `uploadDirectory` methods described in the previous step both return a CID, or Content Identifier, encoded as a string.

To create a link to view your file on an <Term id="gateway">IPFS gateway</Term>, create a URL of the form `https://${cid}.ipfs.${gatewayHost}`, where `${cid}` is the CID of the content you want to view, and `${gatewayHost}` is the domain of the gateway. To use our own gateway at `w3s.link`, your url would be `https://${cid}.ipfs.w3s.link`.

Opening the gateway URL in a browser will take you to your uploaded file, or a directory listing of files, depending on what you uploaded.

Of course, gateways aren't the only option for fetching data from IPFS! If you're running a [kubo](https://github.com/ipfs/kubo) node, you can use [`ipfs get <your-cid>`](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-get) to fetch your content from the peer-to-peer IPFS <Term id="bitswap">Bitswap</Term> network.


[reference-w3up-client#create]: ../api/w3up-client/modules/package.md#create
[reference-w3up-client#createspace]: ../api/w3up-client/classes/client.Client.md#createspace
[reference-w3up-client#setcurrentspace]: ../api/w3up-client/classes/client.Client.md#setcurrentspace
[reference-w3up-client#registerspace]: ../api/w3up-client/classes/client.Client.md#registerspace
[reference-w3up-client#uploadfile]: ../api/w3up-client/classes/client.Client.md#uploadfile
[reference-w3up-client#uploaddirectory]: ../api/w3up-client/classes/client.Client.md#uploaddirectory
[reference-w3up-client#space]: ../api/w3up-client/classes/space.Space.md
[concepts-did]: ../concepts/dids.md
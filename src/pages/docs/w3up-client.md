# `w3up-client`

You can easily integrate web3.storage into your JavaScript apps using `w3up-client`, our JavaScript client for the w3up platform.

In this guide, we'll walk through the following steps:

1. [Installing the client library](#install)
2. [Creating and provisioning your first space](#create-and-provision-a-space)
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

See the [w3up-client README](https://github.com/web3-storage/w3up/blob/main/packages/w3up-client/README.md) for more creation options.

## Create and provision a space

When you upload things to web3.storage, each upload is associated with a "space", which is a unique identifier that acts as a namespace for your content. Spaces are identified by DID using keys created locally on your devices.

To create a space using `w3up-client`, use the `createSpace` client method:

```js
const space = await client.createSpace('my-awesome-space')
```

The name parameter is optional. If provided, it will be stored in your client's local state store and can be used to provide a friendly name for user interfaces.

To use a space for uploads, it needs to be provisioned with the storage service, and can be done so with an account. To login or create an account, call the `login` client method:

```js
const myAccount = await client.login('zaphod@beeblebrox.galaxy')
```

Calling `login` cause an email to be sent to the given address, unless the client is already logged in. Once a user clicks the confirmation link in the email, the promise returned by the `login` method will resolve. Make sure to check for errors, as `login` will fail if the email is not confirmed within the expiration timeout.

If your account does not yet have a payment plan, you'll be prompted to choose one after your email address has been verified. You will need a payment plan in order to provision your space. You can use the following code to wait for a payment plan to be selected:

```js
// wait for payment plan to be selected
while (true) {
  const res = await myAccount.plan.get()
  if (res.ok) break
  console.log('Waiting for payment plan to be selected...')
  await new Promise(resolve => setTimeout(resolve, 1000))
}
```

Now you may provision your space with your account:

```js
await myAccount.provision(space.did())
```

Once provisioned, it's a good idea to setup recovery, so that when you move to a different device you can still access your space:

```js
await space.createRecovery(myAccount.did())
```

Finally, save your space to your agent's state store:

```js
await space.save()
```

If your agent has no other spaces, saving the space will set it as the "current space" in your agent. If you already have other spaces, you may want to set it as the current:

```js
await client.setCurrentSpace(space.did())
```

ℹ️ Note: creating a space and provisioning it needs to happen only **once**!

## Upload files

Now that you've created and provisioned a space, you're ready to upload files to web3.storage!

Call `uploadFile` to upload a single file, or `uploadDirectory` to upload multiple files.

`uploadFile` expects a "Blob like" input, which can be a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) or [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) when running in a browser. On node.js, see the [`filesFromPath` library](https://github.com/web3-storage/files-from-path), which can load compatible objects from the local filesystem.

`uploadDirectory` requires `File`-like objects instead of `Blob`s, as the file's `name` property is used to build the directory hierarchy.

You can control the directory layout and create nested directory structures by using `/` delimited paths in your filenames:

```js
const files = [
  new File(['some-file-content'], 'readme.md'),
  new File(['import foo'], 'src/main.py'),
  new File([someBinaryData], 'images/example.png')
]

const directoryCid = await client.uploadDirectory(files)
```

In the example above, `directoryCid` resolves to an IPFS directory with the following layout:

```text
.
├── images
│   └── example.png
├── readme.md
└── src
    └── main.py
```

## View your file on an IPFS gateway

The `uploadFile` and `uploadDirectory` methods described in the previous step both return a CID, or Content Identifier, encoded as a string.

To create a link to view your file on an IPFS gateway, create a URL of the form `https://${cid}.ipfs.${gatewayHost}`, where `${cid}` is the CID of the content you want to view, and `${gatewayHost}` is the domain of the gateway. To use our own gateway at `w3s.link`, your url would be `https://${cid}.ipfs.w3s.link`.

Opening the gateway URL in a browser will take you to your uploaded file, or a directory listing of files, depending on what you uploaded.

Of course, gateways aren't the only option for fetching data from IPFS! If you're running a [kubo](https://github.com/ipfs/kubo) node, you can use [`ipfs get <your-cid>`](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-get) to fetch your content from the peer-to-peer IPFS Bitswap network.

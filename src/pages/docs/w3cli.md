# `w3cli`

You can get started using web3.storage right away from your command line using `w3`, our command line interface tool.

In this guide, we'll walk through the following steps:

1. [Installing the `w3` tool](#install)
2. [Creating and registering your first space](#create-your-first-space)
3. [Uploading a file or directory](#upload-files)
4. [Viewing your file with IPFS](#view-your-file-with-ipfs)

## Install

You'll need [Node](https://nodejs.com) version 18 or higher, with NPM version 7 or higher to complete this guide.
You can check your local versions like this

```bash
node --version && npm --version
```

Install the `@web3-storage/w3cli` package with `npm`

```bash
npm install -g @web3-storage/w3cli
```

Once the install is complete, you'll have a `w3` command available. Try running `w3 --help` to get an idea of what's possible.

## Create your first space

When you upload things to web3.storage, each upload is associated with a <abbr id="space">"space,"</abbr> which is a unique identifier that acts as a namespace for your content.

Spaces are identified by <abbr id="did">DID</abbr> using keys created locally on your devices. To use a space for uploads, it needs to be registered with the storage service by providing an email address.

To create a space using the `w3` command line tool, use the `w3 space create` command. You can optionally give your space a "friendly" name, which acts like an alias for the space's DID and can make it easier to tell your spaces apart. In the example below, we'll use the name `Documents`:

```bash
w3 space create Documents
```

The DID for the new space will be printed to the console. It should look something like this, although the part after `did:key` will be unique to your space:

```
did:key:z6MkixXechJLc3TWibQj9RN6AiFx8VoMY9HNB3Y97WcwK3fm
```

You can now run `w3 spaces ls` to show a list of your spaces:

```bash
* did:key:z6MkixXechJLc3TWibQj9RN6AiFx8VoMY9HNB3Y97WcwK3fm Documents
```

The `*` symbol indicates that the `Documents` space is currently active. If you make multiple spaces, you can switch between them with `w3 space use`, passing in the name or DID of the space you want to activate.

Before you can upload, you'll need to register the new space with the web3.storage service using `w3 space register`:

```bash
w3 space register you@mail-provider.net
```

This command will wait for you to check your email and click the confirmation link that was sent to your address. Once you confirm your email, you'll see a success message and are ready to upload.

## Upload files

Now that you've [created and registered a space](#create-space), you're ready to upload files to web3.storage!

Use the `w3 up` command to upload a file or directory:

```bash
w3 up your-file.txt
```

Once your upload is complete, you should see a URL that links to your file on the `w3s.link` <abbr id="gateway">IPFS gateway</abbr>.

If you uploaded a single file, the link will resolve to an IPFS directory listing, with the actual file contained in the directory. This "wrapper" directory preserves the original filename of your upload, which can help organize your content and allows people to download files using their original names. If you don't want to create the wrapper directory, you can pass in the `--no-wrap` flag when running `w3 up`.

When uploading directories, files beginning with a `.` character are ignored by default. To include hidden files instead, pass in the `-H` or `--hidden` flag.

## View your file with IPFS

When your upload completes, you should see a link to your files on the `w3s.link` <abbr id="gateway">IPFS gateway</abbr>. Just click the link to see your files!

[concepts-did]: ../concepts/dids.md
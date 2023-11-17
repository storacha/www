# How to create a space

In this how-to guide, you'll learn how to create a web3.storage Space to organize stored uploads. For an overview of the various ways web3.storage can be integrated with your application, check out ["Architecture Options"](/docs/concepts-architecture-options/).

A Space acts as a namespace for your uploads. It is created locally, offline, and associated with a cryptographic key pair (identified by the [`did:key`](https://w3c-ccg.github.io/did-method-key/) of the public key). You can register this Space with your [web3.storage account](/docs/how-to/create-account/) to take responsibility for the uploads in the space. Once you do this, you don't need to worry about keeping track of the Space's private key, because your web3.storage account has been authorized to use the Space.

## Using the CLI

The easiest way to create and register a Space is by using the CLI.

1. Install the CLI from npm using your command line: `npm install -g @web3-storage/w3cli`
2. initiate space creation for a new Space:
   ```shell
   w3 space create
   ```
3. w3cli will ask "What would you like to call this space?". Give the space a name that will help you distinguish it from other spaces, then press the enter key. Can't spt come up with one? Try "my first space"
4. w3cli will say "🔑 You need to save the following secret recovery key somewhere safe!…"
   - press the enter key to reveal the recovery phrase.
   - save the recovery phrase somewhere safe if you want to be able to recover control of the space in case you lose access to the computer you used to create the space
     - even if you don't need this level of recovery, you will need to store this phrase and be able to repeat it in the next step
   - type the recovery phrase so `w3cli` knows you have backed it up, then press the enter key

## Using console.web3.storage

Separately, you can visit [console.web3.storage](https://console.web3.storage/), sign up with your email and select a plan, and create a space using the UI, but we recommend that developers get familiar with the CLI since it's a powerful tool for many things you might want to do.

The Space you create can be used to [upload](/docs/how-to/upload/) data using the CLI, the w3up client, or when you log into the web console.

## Using the JS library

1. Install the client library from npm using your command line: `npm install @web3-storage/w3up-client`.
2. Call `client.createSpace('Documents')` and wait for the promise to resolve.

Note: the space must be provisioned by an account before it can be used for uploads. See [our guide](/docs/w3up-client/#create-and-register-a-space) for details.

# How to list files uploaded to web3.storage

In this how-to guide, you'll learn about the different ways that you can list the files that you've uploaded to web3.storage. Once you've stored some files using web3.storage, you'll want to see a list of what you've uploaded. There are two ways you can do this:

- Programmatically using the web3.storage client or CLI
- Using the web3.storage console

## Using the JS client or CLI

You can also access a listing of your uploads from your code using the web3.storage client. In the example below, this guide walks through how to use the JavaScript client library to fetch a complete listing of all the data you've uploaded using web3.storage.

For instructions on how to set up your client instance or CLI, check out the Upload section.

Today, like other developer object storage solutions, there is no sorting or querying by timestamp to keep things scalable.

You can get a nested list of shard CIDs, or look up what the shard CIDs are for an individual upload. Client and CLI. If you'd like to learn more check out Upload vs. Store section

## Using the console web UI

You can see a list of everything you've uploaded to web3.storage in the [console](https://console.web3.storage) web app. If you don't need to work with this list programmatically, using the website may be a simpler choice.

This console provides a convenient overview of your stored data, including links to view your files in your browser via an [IPFS gateway](https://docs.ipfs.io/concepts/ipfs-gateway/) and information about how the data is being stored on the decentralized storage networks that web3.storage uses under the hood.

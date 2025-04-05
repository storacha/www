# Quickstart

Ready to get started using Storacha? Get up and running in minutes by following this quickstart guide. In this guide, we'll walk through the following steps:

1. Install the CLI.
2. Create a Space to upload your files and register it with Storacha.
3. Upload a file.
4. Get your uploaded file using your browser or curl.

This guide uses our CLI, w3cli, since it's the fastest way to get started using Storacha. In the "How-to" section of the docs, we also include instructions on using the Javascript client or web interface to create an account, store data, and more.

## You will need

Node.js version `18` or higher and npm version `7` or higher to complete this guide. Check your local versions like this:

```shell
node --version && npm --version

> v18.17.1
> 7.18.1
```

Install the CLI from npm using your command line:

```sh
npm install -g @web3-storage/w3cli
```

## Create an account

You need to create a Storacha account associated with an email address and set it up so you can start uploading to a Space. The Space is created locally and associated with a private key, and is then registered with Storacha and associated with your email address. But don't worry about keeping track of the Space's private key! Storacha's email authorization system allows this private key to be treated as a throwaway key.

1. Run `w3 login alice@example.com` in the command line using your email address. This will send an email to your inbox with a link for validation.
2. Once you click on the validation link, you'll be taken to a webpage where you can select a plan (like our Starter tier).
3. Create a new Space for storing your data and register it:

```sh
w3 space create Documents # pick a good name!
```

## Upload

You can now upload a file or directory using the command line:

```sh
w3 up lets-go.txt
  1 file 0.6KB
⁂ Stored 1 file
⁂ https://w3s.link/ipfs/bafybeib4ht2a53pttgipw6mgckqqhmgkifnmh2glzsju2c6ait5ibnkow4
```

The CLI content-addresses your files, packs them into 1 or more CAR files, and uploads them to Storacha for indexing and inclusion in Filecoin storage deals. It will show an HTTP gateway URL that includes the content CID (content identifier) of your upload e.g:

https://w3s.link/ipfs/bafybeib4ht2a53pttgipw6mgckqqhmgkifnmh2glzsju2c6ait5ibnkow4

By default, `w3` will wrap files in a folder, so that their filename is preserved. They can then be accessed directly by adding their name in the URL path:

https://w3s.link/ipfs/bafybeib4ht2a53pttgipw6mgckqqhmgkifnmh2glzsju2c6ait5ibnkow4/lets-go.txt

## Get your file

Your upload is now available over the public IPFS network using the content CID of your upload. The easiest way to fetch it is using the link that `w3 up` provided to the w3s.link gateway. w3s.link is optimized for content uploaded to Storacha.

```sh
curl -L 'https://w3s.link/ipfs/bafybeib4ht2a53pttgipw6mgckqqhmgkifnmh2glzsju2c6ait5ibnkow4/lets-go.txt'

                 ___.    ________               __                                            
__  _  __  ____  \_ |__  \_____  \      _______/  |_   ____  _______ _____      ____    ____  
\ \/ \/ /_/ __ \  | __ \   _(__  <     /  ___/\   __\ /  _ \ \_  __ \\__  \    / ___\ _/ __ \ 
 \     / \  ___/  | \_\ \ /       \    \___ \  |  |  (  <_> ) |  | \/ / __ \_ / /_/  >\  ___/ 
  \/\_/   \___  > |___  //______  / /\/____  > |__|   \____/  |__|   (____  / \___  /  \___  >
              \/      \/        \/  \/     \/                             \/ /_____/       \/ 
```

You can also fetch your content p2p style over bitswap with an IPFS implementation like `helia` or `kubo`.

```sh
ipfs cat bafybeib4ht2a53pttgipw6mgckqqhmgkifnmh2glzsju2c6ait5ibnkow4/lets-go.txt

                 ___.    ________               __                                            
__  _  __  ____  \_ |__  \_____  \      _______/  |_   ____  _______ _____      ____    ____  
\ \/ \/ /_/ __ \  | __ \   _(__  <     /  ___/\   __\ /  _ \ \_  __ \\__  \    / ___\ _/ __ \ 
 \     / \  ___/  | \_\ \ /       \    \___ \  |  |  (  <_> ) |  | \/ / __ \_ / /_/  >\  ___/ 
  \/\_/   \___  > |___  //______  / /\/____  > |__|   \____/  |__|   (____  / \___  /  \___  >
              \/      \/        \/  \/     \/                             \/ /_____/       \/ 
```

## Next steps

Congratulations! You've just covered the basics of Storacha. To learn more, take a look at these useful resources:

- For a deep dive into storing files, including using the Javascript client to do so, visit the [Upload how-to guide](/docs/how-to/upload).
- Read more about the power of [UCANs and IPFS](/docs/concepts/ucans-and-storacha), and learn about the various options to integrate Storacha with your application.
<!-- - Try out our image gallery example to see how easy it is to take advantage of these decentralized protocols using Storacha.
- Visit the reference API section for more details on what else you can do with the Storacha client and how to integrate it into your own projects. -->

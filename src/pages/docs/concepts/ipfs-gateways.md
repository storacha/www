# IPFS HTTP Gateways

Storacha uses the [InterPlanetary File System (IPFS)](https://ipfs.io/) as a key part of its storage and retrieval infrastructure.

The IPFS network is a peer-to-peer network of computers that share resources to efficiently provide content to anyone that requests it. Computers that join the IPFS network supply blocks of data using a hash-based Content Identifiers (CIDs).

To make IPFS data accessible outside of the peer-to-peer network, [special IPFS nodes called "gateways"](https://docs.ipfs.io/concepts/ipfs-gateway/) act as bridges between the HTTP protocol that all web browsers understand and IPFS-native protocols.

As more browsers like [Brave](https://brave.com/ipfs-support/) and [Opera](https://blogs.opera.com/tips-and-tricks/2021/02/opera-crypto-files-for-keeps-ipfs-unstoppable-domains/) adopt native IPFS support, the need for gateways will naturally lessen over time. Today, you can reach the widest audience by using HTTP gateways in your web applications, but it's a great idea to also surface the original ipfs:// URI for your content, so that IPFS-native browsers can access the content directly through Bitswap.

For more information about fetching content that you uploaded through an IPFS HTTP gateway, see the [Retrieve section](/docs/how-to/retrieve).

## Types of gateway

The official [IPFS documentation on gateways](https://docs.ipfs.io/concepts/ipfs-gateway/) is helpful for understanding the types of gateways in the IPFS ecosystem and how they're used.

One of the key things to understand for our purposes is the different [resolution styles](https://docs.ipfs.io/concepts/ipfs-gateway/#resolution-style) that can be used to fetch content using gateway URLs.

If you check the [list of public gateways](https://ipfs.github.io/public-gateway-checker/), you'll see that some support "subdomain" style URLs, while others only support path-style URLs. Below is a short refresher on the distinction between the two styles.

### Path style URLs

A "path style" URL puts the IPFS CID into the path portion of the gateway URL, like this:

<https://w3s.link/ipfs/bafkreied5tvfci25k5td56w4zgj3owxypjgvmpwj5n7cvzgp5t4ittatfy>

If the CID points to a directory listing, you can append the name of a file within the directory to fetch the file:

<https://w3s.link/ipfs/bafybeid4gwmvbza257a7rx52bheeplwlaogshu4rgse3eaudfkfm7tx2my/hi-gateway.txt>

### Subdomain style URLs

A "subdomain style" gateway URL puts the CID into the host portion of the URL, as a subdomain of the gateway host, like this:

[https://bafkreied5tvfci25k5td56w4zgj3owxypjgvmpwj5n7cvzgp5t4ittatfy.ipfs.w3s.link](https://bafkreied5tvfci25k5td56w4zgj3owxypjgvmpwj5n7cvzgp5t4ittatfy.ipfs.w3s.link/)

If the CID points to a directory listing, you can use the path portion of the URL to specify the filename:

https://bafybeid4gwmvbza257a7rx52bheeplwlaogshu4rgse3eaudfkfm7tx2my.ipfs.w3s.link/hi-gateway.txt

This is the preferred style for serving web assets over HTTP gateways, because web browsers provide security isolation on a per-domain basis. Using the subdomain style, every CID gets its own "namespace" for things like cookies and local storage, which isolates things from other web content stored on IPFS.

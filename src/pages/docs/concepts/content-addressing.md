# Content addressing

Storacha's decentralized file storage relies on _content addressing_ to find, reference, and retrieve your files on the network. Content addressing is a technique for organizing and locating data in a system in which the key used to locate content is derived from the content itself, rather than its location. While you don't need to understand content addressing to be able to incorporate sSoracha in your apps and services, if you're curious about what's going on under the hood, read on.

## The basic problem

Consider what happens when you resolve a link like `storacha.network/docs/concepts/content-addressing`. First, your operating system queries a global shared key-value store, split into many domains — you may know this as the Domain Name System (DNS). The DNS returns an IP address that your network card can use to send HTTP requests over the network, where this site's naming conventions turn the key `/docs/concepts/content-addressing` into a response payload.

The problem is, components of an address like `storacha.network/docs/concepts/content-addressing` are _mutable_, meaning they can change over time. In the context of the web, where _everything_ is mutable and dynamic, this is just the way it's always been. As a result, [link rot](https://en.wikipedia-on-ipfs.org/wiki/Link_rot) is just something we've all learned to live with.

## CIDs: Location-independent, globally unique keys

However, thanks to content addressing, link rot may become a thing of the past. A content-addressed system such as Storacha is like our key-value-based DNS, with one significant difference: You no longer get to choose the keys. Instead, the keys are derived directly from the file contents using an algorithm that will always generate the same key for the same content.

As a result, we no longer need to coordinate among multiple writers to our store by splitting the key space into domains and locations on file systems. There's now one universal domain: the domain of all possible values. If multiple people add the same value, there's no collision in the key space. They just each get the same key back from the put method, with one additional benefit: The availability and performance of retrievals on the network is increased. This gives our keys _location independence_. There's one other important result: Each individual key is a unique signature for the data itself, ensuring _verifiability_ that the key matches the content and the content hasn't been altered.

This type of key is called a _content identifier (CID)_. Once you know the CID of a file on the Storacha network, you have all you need for the network to locate and return the file back to you.

## Storacha CIDs under the hood

Storacha uses CIDs to make its decentralized file storage work, with help from [IPFS](https://ipfs.io/) for locating files and making sure they're always available.

Content addressing is the basis of the peer-to-peer hypermedia protocol IPFS (the InterPlanetary File System), which Storacha uses to locate files. When Storacha stores your data on IPFS, it can be retrieved from any IPFS node that has a copy of that data. This can make data transfers more efficient and reduce the load on any single node. As each user fetches a piece of data, they keep a local copy around to help other users who might request it later.

In addition to Storacha making it easy to get your data onto the content-addressed IPFS network, it also provides long-term persistence for your files using the decentralized Filecoin storage network. The Filecoin network incentivizes participants to provide storage space for files on the network. By combining IPFS and Filecoin storage into one easy-to-use service, Storacha makes it simple to store, locate, and retrieve your files on the decentralized web.

There are two types of CIDs that Storacha interacts with:

- Content CIDs: The CIDs used to reference and access uploads in the format generally useful to users (e.g., files, directories). These CIDs are generally prefixed by `bafy…`. This is what the vast majority of IPFS users will be using.
- Shard CIDs: The CID of the serialized shards of data itself that are produced client-side, sent to Storacha, and stored. These CIDs are generally prefixed by `bag…`.

In the vast majority of cases, users should focus on content CIDs, as this is what they'll be using to fetch their content. If you stick with using the recommended client and CLI methods, then you won't really have to ever worry about the shard CIDs.

## Summary

Using content addressing for locating files rather than the legacy web's method of location-dependent addressing responds to several critical weaknesses of the legacy web:

- Content addressing solves for the problem behind link rot — the mutability of location-dependent storage systems — by using a hashing algorithm to generate a unique CID for each file that can be used as the lookup key for a file rather than a URL.
- In addition to making sure files don't get lost if they're moved, content addressing also ensures that users intending to retrieve a specific version of a file will be guaranteed to retrieve that version for as long as it exists anywhere on the network.

## Learn more

Want a deep dive into content addressing, how it works, and why it's important? Check out [ProtoSchool](https://proto.school/content-addressing/) for an in-depth look at content addressing on the decentralized web, plus a wealth of other interactive tutorials on DWeb concepts, protocols, and tools.

Want a technical explanation of how IPFS CIDs work in particular? Have a look at the [official IPFS docs](https://docs.ipfs.io/concepts/content-addressing/).

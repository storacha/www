# Upload vs. Store in web3.storage

There are two types of content identifiers (CIDs) that web3.storage interacts with:

1. Content CIDs: The CIDs used to reference and access uploads in the format generally useful to users (e.g., files, directories). These CIDs are generally prefixed by `bafy…`.
2. Shard CIDs: The CID of the serialized shards of data itself that are produced client-side, sent to web3.storage, and stored. These CIDs are generally prefixed by `bag…`.

One example of where you might see both is uploading a large file with the CLI:

```sh
w3 up gb.file
 1 file (1GB)
bagbaierao...
bagbaieraq...
bagbaieraj...
bagbaierai...
bagbaierax...
bagbaieraf...
bagbaierac...
bagbaierax...
bagbaierax...
bagbaiera4...

⁂ Stored 1 file
⁂ https://w3s.link/ipfs/bafybeiaxwvg4...
```

The CLI sharded the 1GB upload into 10 shards, each with a `bag…`-prefixed CID. The content CID of the file itself is included in the `w3s.link/ipfs/bafy…` link at the bottom.

In the vast majority of cases, users should focus on content CIDs, as this is what they'll be using to fetch their content. If you stick with using the recommended client and CLI methods, then you won't really have to ever worry about the shard CIDs.

However, if you're interested in learning more about how web3.storage uses both, read on!

## Upload vs. Store

There are two similar-sounding, complementary, but separate concepts in web3.storage: Upload and Store. The place you most readily see this is in the lower-level client methods like `Client.capabilities.upload.*` and `Client.capabilities.store.*`, and CLI methods like `w3 can upload *`, and `w3 can store *`.

The main difference is that upload methods interact with content CIDs and store methods interact with shard CIDs. However, both are needed to make your uploads available to the IPFS network!

Let's break it down. In the CLI example above where we called `w3 up file`, we saw that both shard CIDs and a content CID were returned. That's because `w3 up` calls both `store` and `upload` were called under the hood (but abstracts the complexity for any user that doesn't care about it).

The CLI and client first take the upload and converts it into an DAG (directed acyclic graph). This is what IPFS uses to generate the content CID - each node in the graph has its own CID, with the graph's leafs containing the upload's data, and the root node of the graph the content CID of the entire graph. However, to send the data to web3.storage, the content has to be in a different form. web3.storage achieves this by converting the graph into a set of CAR file shards.

Each CAR shard has a CID associated with the data itself (i.e., as it sits on disk serialized, with a header for instructions on how the blocks within the serialized data should be arranged, etc.). The CLI and client send each of these shards one-by-one to web3.storage by invoking the `store/add` UCAN capability under the hood (e.g., `w3 can store add`)!

However, from web3.storage's perspective, it doesn't necessarily know whether the set of CAR shards it was sent from the series of `store/add`s corresponds to a single content CID that the user cares about, multiple content CIDs, or none at all (e.g., the CAR files sent represent an incomplete graph). As a result, `upload/add` allows the user to explicitly register a content CID with a set of shard CIDs. This is primarily done for the user's sake - it makes it easier to track which content CIDs (what they're using to fetch data from the IPFS network) correspond to which shard CIDs (what is physically being stored with web3.storage).

In cases where the user is uploading a whole file or directory like in the example above, it's safe to know that the series of CAR shards uploaded by the user correspond to the file's content CID that it cares about. That's why the higher-level `w3 up` method is appropriate to use, and should represent the vast majority of upload use cases by web3.storage users.

## When should I care about Store and shard CIDs?

There's a few cases to note when caring about shard CIDs themselves and the `store` series of capabilities.

### Sharing data across content CIDs

Because IPFS interacts with DAGs, you can actually share blocks between different content CIDs. One simple example would be in a directory

If a user uploads a directory using `w3 up`, the content CID for this directory will be registered with their account. This is actually the root CID of the directory itself, but isn't the only content CID in reality that was made available on the network: each file within this directory actually has their own content CID (highlighted).

Let's say you want to be able to have two different directories registered as uploads in your account: one that has 3 of the files above, and another that has all of them. One way to do this would be to upload each file separately, then locally compute the content CIDs of each directory. You can then call `w3 can upload add` to register each of these directories.

This results in only a single copy of each file being stored, but you being able to interact with two different directories!

### Removing data from an account

web3.storage tracks usage for payment (i.e., how much storage is utilized by a user) using the volume of data associated with shard CIDs. This should make sense after learning about the difference between `store` and `upload` - web3.storage is storing the CAR shards themselves, and `upload`s are more users tracking.

Fortunately, this shouldn't make things any more complicated - we go into more detail below, but in general, when you remove a content CID from your account, you'll want to remove the shard CIDs as well (e.g., in the client calling `Client.remove(contentCID, shards=true)`).

However, if you are a power user interacting with shard CIDs as well (like in the previous section), then you need to be more cautious about removing shard CIDs from your account. (This is why the default for the client and CLI methods is for shards to be maintained after removing a content CID). Learn more about how to do this in the Remove section.

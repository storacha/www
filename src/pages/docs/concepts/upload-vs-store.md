# Upload vs. Store capabilities in Storacha

There are three types of content identifiers (CIDs) that Storacha interacts with:

1. **Content CIDs**: The CIDs used to reference and access uploads in the format generally useful to users (e.g., files, directories). These CIDs are generally prefixed by `bafy…`.
2. **Shard CIDs**: The CID of the serialized shards of data itself that are produced client-side, sent to Storacha, and stored. These CIDs are generally prefixed by `bag…`.
3. **Piece CIDs**: The primary means of referencing data stored in a sector of a Filecoin Storage Provider. You can think of them as another way to reference a shard. These CIDs are generally prefixed by `bafk…`.

One example of where you might see all three is uploading a large file with the CLI:

```sh
w3 up gb.file --verbose
  1 file 1.0GB
  bagbaierakgivx2igjaydgkdholxohq77gsmjceb44wghn6l7rcxjnxlb2ysq 132.1MB
   └── Piece CID: bafkzcibextmt6fvx6vkm56k3je76dirfpwzbqhs75agxen7yidv5lo5usnfdbetzcu
  bagbaiera5hekddouwxfgue3wrbe5ddwcefr6l7z3majbqsjk3rxlruziw4nq 132.1MB
   └── Piece CID: bafkzcibextmt6fujkiyd45vkvyd2gppji2wzcpsvu72y3sshzppmi2wnxp4q5pblay
  bagbaierazfqaaabmnaksetr4ivqu7ytchnikygij7g26cycbjbbnfja6oxfa 132.1MB
   └── Piece CID: bafkzcibextmt6ftpb5xepzfvg4ot5bv7uhuplrdbdrwnznpwnpaempif4i76gxbmdm
  bagbaiera3elp7gxxbwvgyrgzrjjqsrhefofnr4t2zayktvkamqbjxfuundoa 132.1MB
   └── Piece CID: bafkzcibextmt6frkjuqg6pxgqaq2zi5ktwsprflbikk2cnqshxifvsumntmqedgrba
  bagbaieraamcctnhnqvwzuf7zhg4jyedg5c76fqn625wi7pico4xtnid5bgba 132.1MB
   └── Piece CID: bafkzcibextmt6frloqsvau6qhwzfndrh55ahdjech52ddhspakf4gnxwksuks6uiem
  bagbaiera6kel2dvxaiowgtj563kic2ftosnzqwue7etiph242w7w5s262fha 132.1MB
   └── Piece CID: bafkzcibextmt6frcrmqxujkfxiy34yutheho55cwhlaqdypafjkhgusphcn5kyp3da
  bagbaieranxcdfpqqqvmyugisyxmautsduivwrsm4jg2x2akys4ia3u4oyh7q 59.0MB
   └── Piece CID: bafkzcibfzxlncayvf3ndiybf3hpigkfd4o27oqrfgmpr6y7ut5nhcyjdtjhqsvstwyqq
  bagbaierakynqcaqedv2brd6qs772s3uqnrxwa62guoeqqjq2bi6kr76vfvla 132.1MB
   └── Piece CID: bafkzcibextmt6fvobnshzubgtr4szqsztg35yjkoczy3bry74zfy2bu5fm2x5caefq
⁂ Stored 1 file
⁂ https://w3s.link/ipfs/bafybeidt227tuki2axtb3xcolwd5fw7relv6hfwxrlhgxjzyzwh4cowymy
```

The CLI sharded the ~1GB upload into 8 shards, each with a `bag…`-prefixed CID. The content CID of the file itself is included in the `w3s.link/ipfs/bafy…` link at the bottom.

In the vast majority of cases, users should focus on content CIDs, as this is what they'll be using to fetch their content. If you stick with using the recommended client and CLI methods, then you won't really have to ever worry about the shard CIDs.

However, if you're interested in learning more about how Storacha uses all three, read on!

## Upload vs. Store

There are two similar-sounding, complementary, but separate concepts in Storacha: Upload and Store. The place you most readily see this is in the lower-level client methods like `client.capability.upload.*` and `client.capability.store.*`, and CLI methods like `w3 can upload *`, and `w3 can store *`.

The main difference is that upload methods interact with content CIDs and store methods interact with shard CIDs. However, both are needed to make your uploads available to the IPFS network!

Let's break it down. In the CLI example above where we called `w3 up file`, we saw that both shard CIDs and a content CID were returned. That's because `w3 up` calls both `store` and `upload` were called under the hood (but abstracts the complexity for any user that doesn't care about it).

The CLI and client first take the upload and converts it into an DAG (directed acyclic graph). This is what IPFS uses to generate the content CID - each node in the graph has its own CID, with the graph's leafs containing the upload's data, and the root node of the graph the content CID of the entire graph. However, to send the data to Storacha, the content has to be in a different form. Storacha achieves this by converting the graph into a set of CAR file shards.

Each CAR shard has a CID associated with the data itself (i.e., as it sits on disk serialized, with a header for instructions on how the blocks within the serialized data should be arranged, etc.). The CLI and client send each of these shards one-by-one to Storacha by invoking the `space/blob/add` UCAN capability under the hood (e.g., `w3 can blob add`)!

However, from Storacha's perspective, it doesn't necessarily know whether the set of CAR shards it was sent from the series of `space/blob/add`s corresponds to a single content CID that the user cares about, multiple content CIDs, or none at all (e.g., the CAR files sent represent an incomplete graph). As a result, `upload/add` allows the user to explicitly register a content CID with a set of shard CIDs. This is primarily done for the user's sake - it makes it easier to track which content CIDs (what they're using to fetch data from the IPFS network) correspond to which shard CIDs (what is physically being stored with Storacha).

In cases where the user is uploading a whole file or directory like in the example above, it's safe to know that the series of CAR shards uploaded by the user correspond to the file's content CID that it cares about. That's why the higher-level `w3 up` method is appropriate to use, and should represent the vast majority of upload use cases by Storacha users.

## When should I care about Store and shard CIDs?

There's a few cases to note when caring about shard CIDs themselves and the `store` series of capabilities.

### Sharing data across content CIDs

Because IPFS interacts with DAGs, you can actually share blocks between different content CIDs. One simple example would be in a directory

If a user uploads a directory using `w3 up`, the content CID for this directory will be registered with their account. This is actually the root CID of the directory itself, but isn't the only content CID in reality that was made available on the network: each file within this directory actually has their own content CID (highlighted).

Let's say you want to be able to have two different directories registered as uploads in your account: one that has 3 of the files above, and another that has all of them. One way to do this would be to upload each file separately, then locally compute the content CIDs of each directory. You can then call `w3 can upload add` to register each of these directories.

This results in only a single copy of each file being stored, but you being able to interact with two different directories!

### Removing data from an account

Storacha tracks usage for payment (i.e., how much storage is utilized by a user) using the volume of data associated with shard CIDs. This should make sense after learning about the difference between `store` and `upload` - Storacha is storing the CAR shards themselves, and `upload`s are more users tracking.

Fortunately, this shouldn't make things any more complicated - we go into more detail below, but in general, when you remove a content CID from your account, you'll want to remove the shard CIDs as well (e.g., in the client calling `client.remove(contentCID, { shards: true })`).

However, if you are a power user interacting with shard CIDs as well (like in the previous section), then you need to be more cautious about removing shard CIDs from your account. (This is why the default for the client and CLI methods is for shards to be maintained after removing a content CID). Learn more about how to do this in the Remove section.

## When should I care about Piece CIDs?

Piece CIDs are how you can reference your data when it is stored in Filecoin Storage Providers. You can think of Piece CIDs as another way to reference a shard - they are in fact calculated from shard data. Piece CIDs are used in [PoDSI (Proof of Data Segment Inclusion)](/docs/concepts/podsi/) - a proof that a piece is included in a larger piece, which allows users and third parties to prove their data is stored with a Filecoin Storage Provider.

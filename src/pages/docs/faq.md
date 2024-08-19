# Frequently Asked Questions

## What advantages does Storacha have over traditional hosted storage services?

Because Storacha uses decentralized data and identity protocols like IPFS and UCAN, data and identity are referenced in an open way. Data is referenced using IPFS content identifiers that are unique to the data, making your data completely portable - accessible from anywhere broadcasting data to the IPFS network, whether on a local or peer device, or uploaded to Storacha itself. Data is backed up on Filecoin, which gives cryptographic proof that your data is physically being stored without needing to trust Storacha.

Authentication is associated with user decentralized identifiers (DIDs) that sign UCAN tokens that can be cryptographically verified by the Storacha service, meaning that your identity is not determined by a central authentication server. And because any storage solution can utilize the same UCAN and IPFS content IDs, there is no lock-in to Storacha’s service.

## What advantages does Storacha have over other IPFS hosted services?

Storacha runs on a serverless implementation of IPFS that is optimized for scale and cost.
We wrote it as the solution to address increasing adoption of Storacha, which previously used kubo and IPFS Cluster. As a result, Storacha is designed to give strong performance and reliability regardless of how much data is being stored on it, meaning that you can rely on it as you and Storacha grow. And all data is backed up in Filecoin storage deals, which gives cryptographic proof that your data is physically being stored without needing to trust Storacha.

## How do I store data on Storacha that is already available over the IPFS network without having to download and reupload it myself?

To keep costs low, we no longer offer an implementation of the Pinning Service API. But fear not, you can just download a copy of your content in CAR file form (e.g., access your data via `https://{cid}.ipfs.dweb.link/path?format=car`) and upload that directly using w3up. We’re working on a new product to make it as easy as possible to do this!

## How can I delete items from Storacha?

You can delete files listed in your account. Simply log-in to your account and use the file manager on the files page, or use the client’s remove method.

However, once a file is uploaded to Storacha, there cannot be a guarantee that all copies of the file are gone from the IPFS network. As soon as a file is uploaded, other IPFS nodes can access and store a copy of the data. The data only becomes unavailable when the last IPFS node has stopped pinning the file, and all copies are garbage collected. As a consequence you should only upload to Storacha files that you know can be shared with anyone forever, or are securely encrypted.

## Are there client libraries other than Javascript?

Yes! There is a [client in Go](/docs/go-w3up). However, it is heavily under development at the time of writing and not yet fully featured. Alternatively, you can use the CLI for many programmatic use cases.

## How can I edit a file or add files to a folder?

Since CIDs are immutable, it's not possible to edit files or add files to a folder. However, we are working on UCAN-based immutable pointers to enable this use case.

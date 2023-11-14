# Frequently Asked Questions

## What advantages does web3.storage have over traditional hosted storage services?

Because web3.storage uses decentralized data and identity protocols like IPFS and UCAN, data and identity are referenced in an open way. Data is referenced using IPFS content identifiers that are unique to the data, making your data completely portable - accessible from anywhere broadcasting data to the IPFS network, whether on a local or peer device, or uploaded to web3.storage itself. Data is backed up on Filecoin, which gives cryptographic proof that your data is physically being stored without needing to trust web3.storage.

Authentication is associated with user decentralized identifiers (DIDs) that sign UCAN tokens that can be cryptographically verified by the web3.storage service, meaning that your identity is not determined by a central authentication server. And because any storage solution can utilize the same UCAN and IPFS content IDs, there is no lock-in to web3.storage’s service.

## What advantages does web3.storage have over other IPFS hosted services?

web3.storage runs on a serverless implementation of IPFS that is optimized for scale and cost.
We wrote it as the solution to address increasing adoption of web3.storage, which previously used kubo and IPFS Cluster. As a result, web3.storage is designed to give strong performance and reliability regardless of how much data is being stored on it, meaning that you can rely on it as you and web3.storage grow. And all data is backed up in Filecoin storage deals, which gives cryptographic proof that your data is physically being stored without needing to trust web3.storage.

## How do I store data on web3.storage that is already available over the IPFS network without having to download and reupload it myself?

To keep costs low, we no longer offer an implementation of the Pinning Service API. But fear not, you can just download a copy of your content in CAR file form (e.g., access your data via `{cid}.ipfs.dweb.link/path?format=car`) and upload that directly using w3up. We’re working on Beam to make it as easy as possible to do this!

## How can I delete items from web3.storage?

You can delete files listed in your account. Simply log-in to your account and use the file manager on the files page, or use the client’s remove method.

However, once a file is uploaded to web3.storage, there cannot be a guarantee that all copies of the file are gone from the IPFS network. As soon as a file is uploaded, other IPFS nodes can access and store a copy of the data. The data only becomes unavailable when the last IPFS node has stopped pinning the file, and all copies are garbage collected. As a consequence you should only upload to web3.storage files that you know can be shared with anyone forever, or are securely encrypted.

## Are there client libraries other than Javascript?

Unfortunately today there is only a Javascript client library. You can, however, use the CLI for many programmatic use cases.

## How can I edit a file or add files to a folder?

Since CIDs are immutable, it's not possible to edit files or add files to a folder. However, we are working on UCAN-based immutable pointers to enable this use case.

# Working with Content Archive (CAR) files

When you upload files to Storacha using the client library, your data is converted into a graph of data structures, which are then packed into a format called a Content Archive (CAR) before being sent to the Storacha service.

For most use cases, you never need to know about this process, as the conversion happens behind the scenes when using the client library. However, you might want to know more about how to manipulate CAR files directly, especially if you're using `upload` and `store` separately in Storacha.

## What is a Content Archive?

The [Content Archive format](https://ipld.io/specs/transport/car/) is a way of packaging up [content addressed data](https://storacha.network/docs/concepts/content-addressing/) into archive files that can be easily stored and transferred. You can think of them like [TAR files](https://en.wikipedia.org/wiki/Tar_\(computing\)) that are designed for storing collections of content addressed data.

The type of data stored in CARs is defined by [IPLD](https://ipld.io/), or InterPlanetary Linked Data. IPLD is a specification and set of implementations for structured data types that can link to each other using a hash-based Content Identifier (CID). Data linked in this way forms a Directed Acyclic Graph, or DAG, and you'll likely see a few references to DAGs in the documentation for IPLD and IPFS.

IPFS files are one example of IPLD data, but IPLD can also be used to access data from Ethereum, Git, and other hash-addressed systems. You can also use IPLD as a general purpose format for your structured data, sort of like a Web3-flavored JSON. See Advanced IPLD formats below for more information.

## CARs and Storacha

When the Storacha client and CLI pack up regular files into a CAR to store on IPFS, the CAR contains data encoded in the same format used by IPFS when importing files using the command line or other IPFS APIs.

This format uses an IPLD "codec" called [dag-pb](https://ipld.io/docs/codecs/known/dag-pb/), which uses [Protocol Buffers](https://developers.google.com/protocol-buffers) to encode an object graph. Inside the graph are [UnixFS objects](https://docs.ipfs.io/concepts/file-systems/#unix-file-system-unixfs) that describe the files and their contents. We do this client-side for a few reasons.

First, formatting everything on the client allows us to calculate the root Content Identifier for the data you're uploading before we send any data to the remote service. This means that you can compare the CID returned by the Storacha service to the one you calculated locally, and you don't have to trust the service to do the right thing.

Another reason to use CARs is to support large files, which would otherwise hit size limits on the Storacha backend platform. The data in a CAR is already chunked into small blocks, which makes CARs easy to shard into small pieces that can be uploaded in batches. This also enables the Storacha platform to get larger content into Filecoin deals.

CAR files are a format that pretty much any IPFS tool or implementation can interact with. You can export data from your personal IPFS node into a CAR file and upload it to Storacha using `w3 up --car` or `client.uploadCAR`. As a result, we dive into the various ways you might interact with CAR files.

## Command line tools

There are a few ways to create and interact with CAR files from the command line.

### ipfs-car

The [ipfs-car](https://github.com/web3-storage/ipfs-car) JavaScript package includes a command-line tool for easily creating, unpacking, and verifying CAR files.

You can install the command globally:

```sh
npm install -g ipfs-car
```

The --pack flag will create a new CAR file from a collection of input files:

```sh
ipfs-car pack path/to/files --output path/to/write/a.car
```

Extract files from a CAR with `--unpack`:

```sh
ipfs-car unpack path/to/my.car --output path/to/unpack/files/to
```

List the contents of a CAR with `--list`:

```sh
ipfs-car list path/to/my.car
```

For more usage information, run `ipfs-car --help`.

### Kubo

Kubo is the reference implementation of the IPFS protocol. Among many other features, go-ipfs supports exporting any IPFS object graph into a CAR file and importing data from CAR files into your local IPFS repository.

The [ipfs dag export](https://docs.ipfs.io/reference/cli/#ipfs-dag-export) command will fetch an IPFS object graph by its Content ID (CID), writing a stream of CAR data to standard output.

To create a CAR file using go-ipfs, you can redirect the output of ipfs dag export to a file:

```sh
cid="bafybeigdmvh2wgmryq5ovlfu4bd3yiljokhzdep7abpe4c4lrf6rukkx4m"
ipfs dag export $cid > path/to/output.car
```

Note that you should replace the value of cid inside the quotes with the CID you want to export.

If you don't have the CID in your local IPFS repository, the dag export command will try to fetch it over the IPFS network.

To add the contents of a CAR file to your local IPFS repository, you can use ipfs dag import:

```sh
ipfs dag import path/to/input.car
```

## Javascript libraries

### `ipfs-car`

The [`ipfs-car`](https://github.com/web3-storage/ipfs-car) package includes library functions for packing and unpacking files into CARs, using the IPFS UnixFs data model. The library includes the same functionality as the ipfs-car command line utility [described above](https://storacha.network/docs/how-tos/work-with-car-files/#ipfs-car).

See the `ipfs-car` [README](https://github.com/web3-storage/ipfs-car#api) for API documentation and usage examples.

### `@ipld/car`

The [`@ipld/car`](https://github.com/ipld/js-car) package contains the main JavaScript implementation of the CAR specification and is used by ipfs-car under the hood. If you want to store non-file data using [advanced IPLD formats](https://storacha.network/docs/how-tos/work-with-car-files/#advanced-ipld-formats), you should use @ipld/car directly.

@ipld/car also provides the CarReader interface used by the Storacha client's [putCar](https://storacha.network/docs/reference/js-client-library/#store-car-files)[method](https://storacha.network/docs/reference/js-client-library/#store-car-files).

Here's a simple example of loading a CAR file from a Node.js stream and storing it with Storacha:

```js
import fs from 'node:fs'
import { Readable } from 'node:stream'

async function storeCarFile(filename) {
  const stream = () => Readable.toWeb(fs.createReadStream(filename))
  const client = makeStorageClient()
  const cid = await client.uploadCAR({ stream })
  console.log('Stored CAR file! CID:', cid)
}
```

## Advanced IPLD formats

IPLD can also be used as a general purpose data format like JSON. In fact, you can use JSON directly as IPLD just by using a special convention for linking to other IPLD objects. This convention is defined in the [dag-json](https://ipld.io/docs/codecs/known/dag-json/)["codec"](https://ipld.io/docs/codecs/known/dag-json/).

Here's an example of a `dag-json` object:

```json
{
  "name": "Have you seen this dog?",
  "description": "I have now...",
  "image": { "/": "bafybeihkqv2ukwgpgzkwsuz7whmvneztvxglkljbs3zosewgku2cfluvba" }
}
```

The image field uses the special "link type" to reference another IPLD object. The link is just a regular JSON object with a single key named /, whose value is a Content Identifier.

Although dag-json is familiar and easy to use, we recommend using the similar [dag-cbor](https://ipld.io/docs/codecs/known/dag-cbor/)[codec](https://ipld.io/docs/codecs/known/dag-cbor/) instead. dag-cbor uses the [Concise Binary Object Representation](https://cbor.io/) to more efficiently encode data, especially binary data which must be Base64-encoded when using dag-json.

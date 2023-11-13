## Content Archive (CAR) files

Working with Content Archives (CAR) files

When you upload files to web3.storage using the [client library](https://web3.storage/docs/reference/js-client-library/), your data is converted into a graph of data structures, which are then packed into a format called a Content Archive (CAR) before being sent to the web3.storage service.

For most use cases, you never need to know about this process, as the conversion happens behind the scenes when using the client library. However, you might want to know more about how to manipulate CAR files directly, especially if you're using `upload` and `store` separately in web3.storage.

## What is a Content Archive?

The [Content Archive format](https://ipld.io/specs/transport/car/) is a way of packaging up [content addressed data](https://web3.storage/docs/concepts/content-addressing/) into archive files that can be easily stored and transferred. You can think of them like [TAR files](https://en.wikipedia.org/wiki/Tar_(computing)) that are designed for storing collections of content addressed data.

The type of data stored in CARs is defined by [IPLD](https://ipld.io/), or InterPlanetary Linked Data. IPLD is a specification and set of implementations for structured data types that can link to each other using a hash-based Content Identifier (CID). Data linked in this way forms a Directed Acyclic Graph, or DAG, and you'll likely see a few references to DAGs in the documentation for IPLD and IPFS.

IPFS files are one example of IPLD data, but IPLD can also be used to access data from Ethereum, Git, and other hash-addressed systems. You can also use IPLD as a general purpose format for your structured data, sort of like a Web3-flavored JSON. See Advanced IPLD formats below for more information.

## [CARs and web3.storage](https://web3.storage/docs/how-tos/work-with-car-files/#cars-and-web3storage)

When the web3.storage client and CLI pack up regular files into a CAR to store on IPFS, the CAR contains data encoded in the same format used by IPFS when importing files using the command line or other IPFS APIs.

This format uses an IPLD "codec" called [dag-pb](https://ipld.io/docs/codecs/known/dag-pb/), which uses [Protocol Buffers](https://developers.google.com/protocol-buffers) to encode an object graph. Inside the graph are [UnixFS objects](https://docs.ipfs.io/concepts/file-systems/#unix-file-system-unixfs) that describe the files and their contents. We do this client-side for a few reasons.

First, formatting everything on the client allows us to calculate the root Content Identifier for the data you're uploading before we send any data to the remote service. This means that you can compare the CID returned by the web3.storage service to the one you calculated locally, and you don't have to trust the service to do the right thing.

Another reason to use CARs is to support large files, which would otherwise hit size limits on the web3.storage backend platform. The data in a CAR is already chunked into small blocks, which makes CARs easy to shard into small pieces that can be uploaded in batches.

CAR files are a format that pretty much any IPFS tool or implementation can interact with. You can export data from your personal IPFS node into a CAR file and upload it to web3.storage using `w3 up --car` or `client.uploadCar`. As a result, we dive into the various ways you might interact with CAR files.

## [Command line tools](https://web3.storage/docs/how-tos/work-with-car-files/#command-line-tools)

There are a few ways to create and interact with CAR files from the command line.

### [ipfs-car](https://web3.storage/docs/how-tos/work-with-car-files/#ipfs-car)

The [ipfs-car](https://github.com/web3-storage/ipfs-car) JavaScript package includes a command-line tool for easily creating, unpacking, and verifying CAR files.

To install it, you'll need [Node.js](https://nodejs.org/) - we recommend the latest stable version.

You can install the command globally:

```npm install -g ipfs-car```

Or run the command with npx without installing it to your PATH:

```npx ipfs-car --help```

The --pack flag will create a new CAR file from a collection of input files:

```ipfs-car --packpath/to/files --outputpath/to/write/a.car```

Or extract files from a CAR with --unpack:

```ipfs-car --unpackpath/to/my.car --output/path/to/unpack/files/to```

You can also list the contents of a CAR with --list:

```ipfs-car --listpath/to/my.car```

For more usage information, run ipfs-car --help.

### Kubo

Kubo is the reference implementation of the IPFS protocol. Among many other features, go-ipfs supports exporting any IPFS object graph into a CAR file and importing data from CAR files into your local IPFS repository.

The [ipfs dag export](https://docs.ipfs.io/reference/cli/#ipfs-dag-export) command will fetch an IPFS object graph by its Content ID (CID), writing a stream of CAR data to standard output.

To create a CAR file using go-ipfs, you can redirect the output of ipfs dag export to a file:

```
cid="bafybeigdmvh2wgmryq5ovlfu4bd3yiljokhzdep7abpe4c4lrf6rukkx4m"
ipfs dag export $cid > path/to/output.car
```

Note that you should replace the value of cid inside the quotes with the CID you want to export.

If you don't have the CID in your local IPFS repository, the dag export command will try to fetch it over the IPFS network.

To add the contents of a CAR file to your local IPFS repository, you can use ipfs dag import:

```ipfs dag import path/to/input.car```

## Javascript libraries

#### ipfs-car

The ipfs-car package includes library functions for packing and unpacking files into CARs, using the IPFS UnixFs data model. The library includes the same functionality as the ipfs-car command line utility [described above](https://web3.storage/docs/how-tos/work-with-car-files/#ipfs-car).

See the [ipfs-car README](https://github.com/web3-storage/ipfs-car#api) for API documentation and usage examples.

#### @ipld/car

The [@ipld/car](https://github.com/ipld/js-car)[package](https://github.com/ipld/js-car) contains the main JavaScript implementation of the CAR specification and is used by ipfs-car under the hood. If you want to store non-file data using [advanced IPLD formats](https://web3.storage/docs/how-tos/work-with-car-files/#advanced-ipld-formats), you should use @ipld/car directly.

@ipld/car also provides the CarReader interface used by the web3.storage client's [putCar](https://web3.storage/docs/reference/js-client-library/#store-car-files)[method](https://web3.storage/docs/reference/js-client-library/#store-car-files).

Here's a simple example of loading a CAR file from a Node.js stream and storing it with web3.storage:

```
import { reateReadStream } from 'fs';

import { CarReader } from '@ipld/car';

async function storeCarFile(filename) {

const inStream = createReadStream(filename);

const car = await CarReader.fromIterable(inStream);

const client = makeStorageClient();

const cid = await client.putCar(car);

console.log('Stored CAR file! CID:',cid);

}
```

CarReader.fromIterable accepts any iterable of Uint8Array data, including Node.js streams. If you have all your CAR data in a single Uint8Array already, you can use [CarReader.fromBytes](https://github.com/ipld/js-car#CarReader__fromBytes) instead.

The CarReader type shown above will read the entire contents of the CAR into memory, which may cause issues with large files. On Node.js, you can use [CarIndexedReader](https://github.com/ipld/js-car#carindexedreader), which reads CAR data from disk directly and uses less memory than CarReader.

## [Advanced IPLD formats](https://web3.storage/docs/how-tos/work-with-car-files/#advanced-ipld-formats)

IPLD can also be used as a general purpose data format like JSON. In fact, you can use JSON directly as IPLD just by using a special convention for linking to other IPLD objects. This convention is defined in the [dag-json](https://ipld.io/docs/codecs/known/dag-json/)["codec"](https://ipld.io/docs/codecs/known/dag-json/).

Here's an example of a dag-json object:

```
{

"name": "Have you seen this dog?",

"description": "I have now...",

"image":{"/":"bafybeihkqv2ukwgpgzkwsuz7whmvneztvxglkljbs3zosewgku2cfluvba"}

}
```
The image field uses the special "link type" to reference another IPLD object. The link is just a regular JSON object with a single key named /, whose value is a Content Identifier.

Although dag-json is familiar and easy to use, we recommend using the similar [dag-cbor](https://ipld.io/docs/codecs/known/dag-cbor/)[codec](https://ipld.io/docs/codecs/known/dag-cbor/) instead. dag-cbor uses the [Concise Binary Object Representation](https://cbor.io/) to more efficiently encode data, especially binary data which must be Base64-encoded when using dag-json.

### [Examples](https://web3.storage/docs/how-tos/work-with-car-files/#examples)

Below are some examples of working with dag-cbor data and sending it to web3.storage.

First, you'll need to import some things:

```
import {Web3Storage} from 'web3.storage'

import {CarReader} from '@ipld/car'

import {encode} from 'multiformats/block'

import *as cbor from '@ipld/dag-cbor'

import {sha256} from 'multiformats/hashes/sha2'

//#end region cbor Link Example

//#region make UnixFs File

import {importer} from 'ipfs-unixfs-importer'

import {MemoryBlockStore} from 'ipfs-car/blockstore/memory'
```

Now we'll define a convenience function to encode an IPLD block of CBOR data and hash with SHA2-256:

```
encodeCborBlock(value)

async function encodeCborBlock (value) {
  return encode({ value, codec: cbor, hasher: sha256 })
}
```

And a function to make a CAR from a collection of blocks and a root CID:

```
makeCar(rootCID, ipldBlocks)

asyncfunction makeCar (rootCID,ipldBlocks){

return new CarReader (1,[rootCID],ipldBlocks)

}
```

#### Storing simple CBOR data

Using the helpers above, you can make a CAR file with a single block of simple CBOR data and send it to web3.storage:

```
simpleCborExample()

async function simpleCborExample(){

//encode the value into an IPLD block and store with web3.storage

const block = await encodeCborBlock({hello:'world'})

const car = await makeCar(block.cid,[block])

//upload to web3.storage using put Car

const client = new Web3Storage({token:process.env.WEB3STORAGE\_TOKEN})

console.log('🤖Storing simple CBOR object...')

const cid = await client.putCar(car)

console.log(`🎉Done storing simple CBOR object.CID:${cid}`)

console.log(`💡If you have ipfs installed, try:ipfsdagget${cid}\n`)

}
```


If you have the IPFS command line app installed, you can view the object you stored with the [ipfs dag get](https://docs.ipfs.io/reference/cli/#ipfs-dag-get)[command](https://docs.ipfs.io/reference/cli/#ipfs-dag-get), for example:

```
ipfs dag get bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae

{ "hello" : "world"}
``` 

Note that the example output has been indented with [jq](https://stedolan.github.io/jq/) for clarity.The real command will output a compact dag-json representation of the CBOR data without any extra whitespace.

#### CBOR with IPLD links

You can link from one CBOR object to another using CIDs:

```
cborLinkExample()

async function cborLinkExample(){

//Encode a simple object to get its CID

const addressBlock = await encodeCborBlock({email:'zaphod@beeblebrox.galaxy'})

//Now we can use the CID to link to the object from another object

const personBlock = await encodeCborBlock({

title:'Galactic President',

description:'Just this guy, you know?',

contact:addressBlock.cid

})

//pack everything into a CAR

const car = await makeCar(personBlock.cid,[personBlock,addressBlock])

//upload to web3.storage using putCar

const client = new Web3Storage({token:process.env.WEB3STORAGE\_TOKEN})

console.log('🤖 Storing CBOR objects with CID links between them...')

const cid = await client.putCar(car)

console.log('🎉Stored linked data using dag-cbor.RootCID:',cid)

console.log(`💡If you have ipfs installed, try: ipfsdagget${cid}`)

console.log(`🔗You can also traverse the link by path:ipfsdagget${cid}/contact\n`)

}

async function make UnixFsFile(source){

const blockstore = new MemoryBlockStore()

//taken from https://github.com/web3-storage/ipfs-car/blob/main/src/pack/constants.ts

//but with wrapWithDirectory overriden to false

const unixFs Options={

cidVersion:1,

chunker:'fixed',

maxChunkSize:262144,

hasher:sha256,

rawLeaves:true,

wrapWithDirectory:false,

maxChildrenPerNode:174

}

const importStream = await importer(source,blockstore,unixFsOptions)

let root = null

for await(const entry of importStream){

root = entry

}

const blocks=[]

for await(const block of blockstore.blocks()){

blocks.push(block)

}

await blockstore.close()

return{root,blocks}

}

//#end region make UnixFs File

//#region cbor Link To File Example

async function cborLinkToFileExample(){

const source=[{

path: 'example.txt',

content: new TextEncoder().encode('Some plain text, encoded to UTF-8')

}]

const {root,blocks} = await makeUnixFsFile(source)

const cborBlock = await encodeCborBlock({

description:'A CBOR object that references a UnixFS file object by CID',

file:root.cid

})

blocks.push(cborBlock)

const car = await makeCar(cborBlock.cid,blocks)

const client = new Web3Storage({token:process.env.WEB3STORAGE_TOKEN})

console.log('🤖 Storing a CBOR object that links to a UnixFS file by CID...')

const cid = await client.putCar(car)

console.log('🎉Stored dag-cbor object that links to a unixfs file.RootCID:',cid)

console.log(`💡If you have ipfs installed, try: ipfsdagget${cid}`)

console.log(`💾You can view the linked file with ipfs: ipfscat${cid}/file`)

console.log('🔗View linked file via IPFS gateway:',`https://${cid}.ipfs.dweb.link/file`)

}

//#end region cbor Link To File Example

simpleCborExample()

.then(cborLinkExample)

.then(cborLinkToFileExample)

.catch(console.error)
```

As with simple objects, you can use ipfs dag get to show the outer object:

```ipfs dag get bafyreieq6bftbe3o46lrdbzj6vrvyee4njfschajxgmpxwbqex3czifhry```


```
{

"contact":{

"/":"bafyreicp2g6ez5exmw5uxsns7kkwtxr5z4vyx4xkdci6xpy2vou3zqc6me"

},

"description" : "Just this guy, you know?",

"title":"Galactic President"

}
```

The contact field above contains an IPLD link, which can be included in the ipfs dag get command to resolve the linked object:

```ipfs dag get bafyreieq6bftbe3o46lrdbzj6vrvyee4njfschajxgmpxwbqex3czifhry/contact```

```{"email":"zaphod@beeblebrox.galaxy"}```

#### Linking from CBOR to an IPFS file

Our final example is a little more complex. We're going to store a file in the same UnixFS format that IPFS uses, and link to it from a CBOR object.

First, we'll encode a file into UnixFS format. Normally, this is done by the client library, but we want to get the CID of the file object to use for our link before we send the file off to web3.storage, so we'll construct the UnixFS object ourselves.

Here's a helper function to make a UnixFS file and encode it to an IPLD block:

```
makeUnixFsFile(source)

import { importer } from 'ipfs-unixfs-importer'
import { MemoryBlockStore } from 'ipfs-car/blockstore/memory'
// #endregion imports

// #region encodeCborBlock
async function encodeCborBlock (value) {
  return encode({ value, codec: cbor, hasher: sha256 })
}
// #endregion encodeCborBlock

// #region makeCar
async function makeCar (rootCID, ipldBlocks) {
  return new CarReader(1, [rootCID], ipldBlocks)
}
// #endregion makeCar

// #region simpleCborExample
async function simpleCborExample () {
  // encode the value into an IPLD block and store with web3.storage
  const block = await encodeCborBlock({ hello: 'world' })
  const car = await makeCar(block.cid, [block])

  // upload to web3.storage using putCar
  const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN })
  console.log('🤖 Storing simple CBOR object...')
  const cid = await client.putCar(car)
  console.log(`🎉 Done storing simple CBOR object. CID: ${cid}`)
  console.log(`💡 If you have ipfs installed, try: ipfs dag get ${cid}\n`)
}
// #endregion simpleCborExample

// #region cborLinkExample
async function cborLinkExample () {
  // Encode a simple object to get its CID
  const addressBlock = await encodeCborBlock({ email: 'zaphod@beeblebrox.galaxy' })

  // Now we can use the CID to link to the object from another object
  const personBlock = await encodeCborBlock({
    title: 'Galactic President',
    description: 'Just this guy, you know?',
    contact: addressBlock.cid
  })

  // pack everything into a CAR
  const car = await makeCar(personBlock.cid, [personBlock, addressBlock])

  // upload to web3.storage using putCar
  const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN })

  console.log('🤖 Storing CBOR objects with CID links between them...')
  const cid = await client.putCar(car)
  console.log('🎉 Stored linked data using dag-cbor. Root CID:', cid)
  console.log(`💡 If you have ipfs installed, try: ipfs dag get ${cid}`)
  console.log(`🔗 You can also traverse the link by path: ipfs dag get ${cid}/contact\n`)
}
async function makeUnixFsFile (source) {
  const blockstore = new MemoryBlockStore()
  // taken from https://github.com/web3-storage/ipfs-car/blob/main/src/pack/constants.ts
  // but with wrapWithDirectory overriden to false
  const unixFsOptions = {
    cidVersion: 1,
    chunker: 'fixed',
    maxChunkSize: 262144,
    hasher: sha256,
    rawLeaves: true,
    wrapWithDirectory: false,
    maxChildrenPerNode: 174
  }
  const importStream = await importer(source, blockstore, unixFsOptions)
  let root = null
  for await (const entry of importStream) {
    root = entry
  }
  const blocks = []
  for await (const block of blockstore.blocks()) {
    blocks.push(block)
  }
  await blockstore.close()
  return { root, blocks }
}
```
The helper returns a root block, which we can link to by CID, as well as a blocks array containing the encoded file data. When we create the CAR to send to web3.storage, it's important to include all the file blocks as well as the CBOR block.

```
cborLinkToFileExample()

asyncfunctioncborLinkToFileExample(){

constsource=[{

path:'example.txt',

content:newTextEncoder().encode('Someplaintext,encodedtoUTF-8')

}]

const{root,blocks}=awaitmakeUnixFsFile(source)

constcborBlock=awaitencodeCborBlock({

description:'ACBORobjectthatreferencesaUnixFSfileobjectbyCID',

file:root.cid

})

blocks.push(cborBlock)

constcar=awaitmakeCar(cborBlock.cid,blocks)

constclient=newWeb3Storage({token:process.env.WEB3STORAGE\_TOKEN})

console.log('🤖StoringaCBORobjectthatlinkstoaUnixFSfilebyCID...')

constcid=awaitclient.putCar(car)

console.log('🎉Storeddag-cborobjectthatlinkstoaunixfsfile.RootCID:',cid)

console.log(`💡Ifyouhaveipfsinstalled,try:ipfsdagget${cid}`)

console.log(`💾Youcanviewthelinkedfilewithipfs:ipfscat${cid}/file`)

console.log('🔗ViewlinkedfileviaIPFSgateway:',`https://${cid}.ipfs.dweb.link/file`)

}
```

As before, we can view the root block with ipfs dag get:

```
ipfs dag get bafyreid7hvce4pzcy56s4hwu7xrt3dnnzzfvilzfwsadvf6q4eqild6ndy

{

"description" : "A CBOR object that references a UnixFS file object by CID",

"file":{

"/":"bafkreihmlglmfpadbk4fy72ljniveedbqicysoe5zhqqkgkuso3e6xyns4"

}

}
```

Since the file data is plain text, you can use ipfs dag get to fetch its contents:

```
ipfs dag get bafyreid7hvce4pzcy56s4hwu7xrt3dnnzzfvilzfwsadvf6q4eqild6ndy/file

"Some plain text, encoded to UTF-8"
```

Notice that the file content is wrapped in quotes because dag get is interpreting the content as a JSON string.

To avoid this, or to fetch binary files, you can use ipfs get to download the file:

```
ipfs get bafyreid7hvce4pzcy56s4hwu7xrt3dnnzzfvilzfwsadvf6q4eqild6ndy/file


Saving file(s) to file

33B/33B[===============================================================]100.00%0s
```

Note that the IPFS HTTP gateway currently does not support rendering CBOR data, so the root object is not directly viewable via the gateway. See the note about gateway support below for more information.

However, the gateway _can_ traverse the IPLD links inside our CBOR object, so you can link to the file by path and the gateway will resolve the linked file. For example:

[https://bafyreid7hvce4pzcy56s4hwu7xrt3dnnzzfvilzfwsadvf6q4eqild6ndy.ipfs.dweb.link/file](https://bafyreid7hvce4pzcy56s4hwu7xrt3dnnzzfvilzfwsadvf6q4eqild6ndy.ipfs.dweb.link/file).

##### Gateway support

Although web3.storage supports storing CAR files with dag-cbor content by default and can accept other codecs with the decoders option, the IPFS HTTP gateway does not currently "speak" these formats and will not return such data over HTTP. Please follow [this issue](https://github.com/ipfs/go-ipfs/issues/8234) to track the development of this feature.

### [Enabling IPLD codecs in the client library](https://web3.storage/docs/how-tos/work-with-car-files/#enabling-ipld-codecs-in-the-client-library)

By default, the client's [putCar](https://web3.storage/docs/reference/js-client-library/#store-car-files)[method](https://web3.storage/docs/reference/js-client-library/#store-car-files) will accept data encoded using the  dag-pb,  dag-cbor, or raw codecs. If you want to use another codec like dag-json, you must include the codec in the decoders option to putCar.

See the [putCar](https://web3.storage/docs/reference/js-client-library/#parameters-5)[parameter reference](https://web3.storage/docs/reference/js-client-library/#parameters-5) for more details and an example that uses dag-json.

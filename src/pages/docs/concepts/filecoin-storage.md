# Filecoin storage

The Filecoin network is a great building block for any decentralized storage system. Independent storage providers periodically must cryptographically prove that they are physically storing your specific data for a specific duration of time. When they submit these proofs to the network, other nodes verify these proofs, and this is what ends up on the Filecoin blockchain. So, anyone at any given moment can trustlessly verify that specific content is persisted, the number of copies on the network, and with who they are stored with.

Read more about Filecoin proofs [here](https://filecoin.io/blog/posts/what-sets-us-apart-filecoin-s-proof-system/).

Because of the open nature of the Filecoin network allowing anyone to participate, it's very inexpensive to store data on the Filecoin network. As a result, Storacha uses the network today to back up all its data on the decentralized web. In the future, we will launch new products that allow users to take advantage of Filecoin for "colder," disruptively expensive data storage.

The great thing about IPFS is that, regardless of where your data is sitting (on Storacha's dedicated servers, Filecoin, on your local IPFS node, or anywhere else), you access your data the same way - using the data's content address - and allows you to tune how many copies you have if you'd like, which has tradeoffs in terms of cost, availability, and read performance!

When storing data on Filecoin, you enter storage "deals" that have a finite duration. Storacha service currently renews deals for you to ensure your data deals never expire.

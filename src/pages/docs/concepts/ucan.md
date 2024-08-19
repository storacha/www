# UCAN: User controlled authorization networks

The w3up platform by Storacha is built on a technology called UCAN, a system which takes a different approach to user identity and authorization than you may be used to from building or interacting with "web 2.0" services. Read on to learn about what makes UCAN special.

UCAN stands for User Controlled Authorization Networks, and it's fundamentally about changing the relationship between users and service providers in a way that empowers the end-user.

If you really want to dive into UCANs, the [UCAN spec](https://github.com/ucan-wg/spec) goes into detail about how everything works. You can also take a look at [ucanto](https://github.com/web3-storage/ucanto), our UCAN-based framework for building UCAN services and interacting with them over the wire. You won't need to use `ucanto` directly in order to use w3up, but it's a good resource if you're curious about how things work under the hood.

Broadly speaking, there are two big pieces of the "auth" puzzle: authentication and authorization. Authentication tries to answer the question "are you who you claim to be," while authorization tries to answer "are you allowed to do what you're trying to do." UCAN addresses both pieces of the puzzle in a novel way.

Most online services today use a "service controlled" notion of user identity and authorization. When you sign up for a service, you'll be assigned an opaque identifier for your user account, and the service will have some kind of permission model that determines what you're allowed to do. Both the identifier and the set of permissions are entirely controlled by the service, making it difficult to share resources between multiple platforms.

UCAN flips things around, so that the user creates their own "user id" and shares it with the service.  Because the user ids are based on public key cryptography, the service can validate that the user must have the private key that corresponds to their user id, which removes the need for password-based authentication.

Using cryptographic keys for user identity helps solve the authentication problem, but there's still the matter of authorization, or what you're allowed to do. The most common form of authorization is the Access Control List, or ACL, where the service keeps track of which user ids are allowed to access which resources. Some flavors of the ACL pattern will use things like "roles" to group permissions into buckets, but they all essentially translate a user id to a set of permissions, or "things you can do."

In the ACL model, the service you're trying to access will look up your user id in some kind of database to determine what you're allowed to do, usually "just in time" as part of the request. While this model works well for centralized services, it starts to fall apart in systems that don't have a single "source of truth" that can maintain the ACL. When multiple systems need to interact, careful coordination is needed to ensure that the permissions are consistent, and the overhead of verifying permissions starts to add up for complex requests that may involve several services.

To crib an analogy from the [UCAN spec](https://github.com/ucan-wg/spec#12-intuition), ACLs are like a bouncer at a fancy club. After you authenticate (by showing your ID), the bouncer will look up your name on the guest list and either let you in or turn you away. If there are many venues that want to share the same guest list, they will need to coordinate ahead of time, and the coordination overhead grows as more venues are added.

UCANs work more like a movie ticket or a festival pass, which grants you access based on simple possession of the ticket. There's no need to first verify your identity and compare it to an access list. Instead, the ticket itself contains everything needed to determine whether you should be allowed in, and you can give your ticket to a friend without needing to coordinate with the venue.

## Resources and Capabilities

As we mentioned above, UCANs contain enough information for a service to make authorization decisions without needing a separate access control list or centralized "authorization service" that maps user ids to permissions.

This works by embedding the permissions into a "bearer token" that can be attached to a request to prove that you're allowed to do what you're trying to do. You may be familiar with bearer tokens from systems like [OAuth](https://oauth.net), where they're used as a secondary form of authentication and issued once you log in with your primary password.

UCAN extends the [JSON Web Token (JWT)](https://jwt.io) standard to include a permission model based on **capabilities** and **resources**. Simply put, a capability represents something you're allowed to do, and a resource represents something you're allowed to do it to.

You can "invoke" a capability by making a request to a service and including a UCAN that contains the capability name and a URI that identifies the resource you're acting upon. The service will then inspect the UCAN and determine if the capabilities you're presenting are sufficient to fulfil the request.

## Proofs

When you make a request with a UCAN token, you generate the token on the client side and encode the capabilities and resources that you should have access to in the token. But how does the service know that you're actually supposed to have those capabilities? This is where proofs come into the picture.

Each UCAN token contains a "proof chain" that shows how your capabilities were issued and by whom. A proof chain is actually just a collection of UCAN tokens that show the "provenance" of your claimed capabilities.

The simplest proof chain just has a single entry, a UCAN issued by the service or "owner" of the resource that you're trying to access. When you make a request, you embed this proof token into your "request token," and the service will compare the capabilities you're claiming in your request token to the ones granted by the proof token. Because the proof token is signed with the resource owner's private key, the service can easily validate that the proof is correct and hasn't been tampered with to grant unauthorized capabilities.

## Delegation

Above, we described a "proof chain" with a single proof - a UCAN issued by the service which grants some capabilities to a user. This is simple to reason about, but does not illustrate the power of proof chains. After all, one link is not much of a chain!

To understand more complex proof chains, we first need to talk about **delegation**.

In the movie ticket analogy, we mentioned that you can give your ticket to a friend without needing to coordinate with the venue owner. UCANs allow something similar through delegation. Delegation allows you to share your access to a resource with another user (or service, or device), without actually needing to give them a copy of your private key.

As a user of a UCAN-based system, you can freely delegate some or all of your capabilities to another "agent" by issuing your own UCAN tokens. The term "agent" here roughly corresponds to "user," but it could also be another service, or a second device like a phone belonging to the same human user. In either case, delegation allows you to "share authority without sharing keys," using proof chains to show that the authority was ultimately derived from the resource owner.

Delegated UCANs have a proof chain with multiple "links" in the form of UCAN tokens. At the root of the chain is the token issued by the resource owner, with additional tokens granting some or all of those capabilities to other agents. By allowing users to control which agents can exercise their capabilities, UCANs offer tremendous flexibility in how users can interact with a service.

Delegation is at the heart of what makes UCAN special! To learn more about delegation in the context of the w3up APIs, see our [delegation overview](./delegation.md).

## User owned accounts by default

In our [Intro to UCAN article](./index.md), we gave a high-level overview of the new authorization protocol at the heart of our next-generation storage APIs. One of the most exciting things about UCAN is the ability for users to delegate access to their account's resources to other users, services, and devices. This guide will highlight some of the ways that delegation can be used with w3up, our new upload API. But first, let's consider some use cases that don't require delegation.

When applications use the w3ui components, or developers run the `w3` CLI, they need access to a "space," which is a unique ID that groups uploads together. Once a space has been registered with the w3up service, it can be used to upload files and other data.

If you're uploading files from your laptop using [the `w3` command line tool](../../getting-started/w3cli.md), you can just create a space on the laptop and register it with the w3up service using the `w3 space register` command. The service will issue you a UCAN token that grants your client's "agent" some capabilities; in this case, you get the ability to upload data to Storacha, list your uploads, unlink uploads from your account, etc.

Each client that you use to access w3up will have an "agent" associated with it. Agents are what we call the component that manages your local private keys and signs UCAN requests to the w3up service. When you create a space and register it, the agent you use to register the space is automatically issued a UCAN delegation that grants the agent the ability to upload to the space, as well as other "space related" capabilities like listing uploads.

Because your laptop has access to the private key for your agent, and your agent has access to the space, there's no need to delegate anything. The `w3` tool will just sign a UCAN request token with your agent's private key and will include all the required proofs that you have the right permissions.

Another example is a fully decentralized app with a web frontend that interacts with a smart contract "backend." Let's say you're building a decentralized image sharing application, where users can get rewarded for sharing funny memes. You'd like your app's users to be able to upload images to Storacha, but you don't want to coordinate their access or handle billing on their behalf.

In that case, you can use the [w3ui keyring component](https://beta.ui.storacha/keyring) to help your users create their own spaces and register them with w3up. There's no need for delegation in this case, because each user has their own registered account with web.storage.

## App owned accounts - transparent to the user

Now let's see where Storacha delegation can improve the experience for end users of traditional apps. By delegating to a user's session the capability to upload to your app's w3up spaces, you can add uploads to an app without impacting your infrastructure, completely invisibly to users.

Let's say that you run a recipe sharing app written on traditional web2 technologies. You have a sizeable user-base, and you want to add recipe photo uploads without impacting your existing infrastructure. With UCAN delegation, users can upload directly to your Storacha space, with no visible impact on the user experience.

To do this, you can delegate access to your own Storacha space, instead of having each user create their own space.

On the client side, each user will still create an agent with a public/private keypair, but instead of using the agent to register with Storacha, they can send the agent's public ID to your app's web API or cloud function. That service will issue a UCAN that grants some permissions to the user's agent, without needing to coordinate anything between your app's backend and the Storacha service. In that way, storage access is attached to your application's session.

When a new user signs into your web app, the frontend can use [`w3up-client`](../../getting-started/w3up-client.md), which will automatically create an agent keypair on first run. Instead of using the client to create and register spaces belonging to the user, the frontend can send the agent's public ID to your backend service instead.

Your backend service can then use an instance of `w3up-client` that's been configured to use your service's agent. Since this agent has access to your w3up spaces, it can create UCAN delegations for the user's agent. The client's [`createDelegation` method][reference-client#createdelegation] will create a delegation object that you can send to the user.

Here's what your backend code might look like:

```javascript
import { create } from '@web3-storage/w3up-client'
import { parse as parseDID } from '@ipld/dag-ucan/did'

async function delegationRequestHandler (request) {
  const userDID = await getDIDFromRequest(request)

  // The `create` function will load your agent keys from disk,
  // falling back to creating a new agent if none can be found.
  // Here, we assume that you've previously created an agent
  // and that the agent is configured to use the space that
  // you want to issue delegations to.
  // see the docs at https://github.com/web3-storage/w3up-client
  // for more about using the client.
  const client = await create()

  // createDelegation takes in the DID of the "audience" that
  // we're issuing the delegation to, as well as a list of
  // "ability" strings.
  // Here, we're passing in the abilities needed to upload to the space:
  // 'space/blob/add', 'space/index/add', 'filecoin/offer', and 'upload/add'.
  //
  // With these capabilities, the user will be able to upload to the space,
  // but they won't be able to list existing uploads or perform any "management"
  // operation on the space. To give full access, use the special "top" ability
  // "*", which includes all abilities that your agent has access to.
  //
  // See the capabilities spec for more about capabilities:
  // https://github.com/web3-storage/w3protocol/blob/main/spec/capabilities.md
  const delegation = await client.createDelegation(
    userDID,
    ['space/blob/add', 'space/index/add', 'filecoin/offer', 'upload/add']
  )

  // The delegation object is a binary "blob" that encodes the UCAN
  // delegation into the CAR format.
  // Here we're just returning it from our handler and assuming that the
  // server-side framework will handle the details of setting the right
  // Content-Type headers, etc.
  // Alternatively, you could encode the delegation to base64 and
  // include it in a JSON response, etc.
  return delegation
}

async function getDIDFromRequest (request) {
  // How to extract the user's public DID from the request will
  // depend on the server-side framework you're using and your
  // service API.
  //
  // Here we'll assume that the `request` object has a `json()`
  // method that does what you'd expect, and that the request
  // body has a "did" field containing the DID as a string.
  //
  // The client's createDelegation method expects a `Principal`
  // object whose `did()` method returns the DID string.
  // We can use the `parse` function from `@ipld/dag-ucan/did`
  // to convert the string to a valid `Principal`.
  const body = await request.json()
  const did = parseDID(body.did)
  return did
}
```

When the frontend recieves the delegation from your service, they can call [`addProof`][reference-client#addproof] on their `w3up-client` instance and pass in the bytes of the delegation object. They will also need to call `client.setCurrentSpace(spaceDID)`, passing in the DID for the space that you delegated access to. Once that's done, they should be able to use the `uploadFile` and `uploadDirectory` client methods to send data to your Storacha space.

Note that in our example above, we granted a limited set of capabilities, so that our user can upload but not access any other functionality related to the space. If you want to delegate all permissions, use the `'*'` ability in your delegation, and use the client's [`addSpace` method][reference-client#addspace] instead of `addProof`.

## Delegate across apps and services

You can also use delegation to share access with other services, without requiring an explicit agreement between each service provider.

For example, you or your users could delegate access to an image resizing app that will create thumbnails of each uploaded image and write them back to Storacha. While you could do this without delegation by having the image app use its own Storacha account, the uploads would be attached to the space registered to the app. By using delegation, you'll be able to see the CIDs for the thumbnails in the upload listing for the user's account instead, and the resizing app doesn't need to have any kind of business relationship with Storacha to use the service.

### Link devices through delegation

The last use case we'll look at today involves managing multiple devices belonging to the same user.

Earlier, we used the example of uploading files from your laptop as a case where delegation isn't needed, since the private key for your registered UCAN identity lives on the laptop.

If you also want to upload from your phone, you can use delegation to share access to your account without needing to go through the registration process on the new device. Instead, your laptop can generate a delegation for your phone's UCAN identity and send it to the phone. Because the w3up service doesn't need to be "in the loop," you can even add new devices to your account when you're offline, for example, by having your phone scan a QR code from the laptop's screen.

## Step-by-step delegation with w3cli

Now that we've seen some reasons why you might want to delegate, let's look at delegation in practice using the `w3` command line tool.

If you haven't had a chance to check out the `w3` tool yet, see our [intro to using w3up from the command line](../../getting-started/w3cli.md) to get an overview.

To get started, make sure you have [Node.js](https://nodejs.org/en/) version 16 or greater installed on your computer. Then enter the following command at a terminal:

```shell
npm install -g @web3-storage/w3cli
```

This will install the `w3` command, which we'll be using to interact with the w3up service.

By default, `w3` manages a single "agent" keypair, stored in a configuration directory in your home folder. To demonstrate delegation, we'll create a second agent, and use the default agent to issue a delegation for the second agent to use.

To create the second agent, open a new terminal and enter the following to set the `W3_STORE_NAME` environment variable:

```bash
export W3_STORE_NAME=second-agent
```

Now enter `w3 whoami`, which prints the DID of your agent. If you enter `w3 whoami` in both terminal windows, you should see a different DID. The first window will show the DID of your default agent, and the second window with the `W3_STORE_NAME` variable set will show the ID of your second agent.

Let's go through the process step-by-step.

### 1. Create a space using your default agent

In the first terminal window, use the `w3 space create` command to create a new space:

```shell
w3 space create SharedSpace
```

Here we're giving the space the name `SharedSpace`, but you can call yours whatever you like.

Running `w3 space ls` should show the new space.

### 2. Register your space

Before we can make requests to the w3up service, we need to register our new space using  the `w3 space register` command.

In the first terminal window, run the following command, filling in your own email address:

```shell
w3 space register your-email@your-provider.net
```

You should see a message in the console asking you to check your email. Once you click the link in your inbox, you'll see a success message. Now you're ready to start using the rest of the `w3` commands.

### 3. Upload something to your account

Let's upload a test file to confirm that things are working.

First, make a text file called `hello.txt` with some simple content:

```shell
echo "Hello, web3!" > hello.txt
```

Now you can use `w3 up hello.txt` to upload the file. You should see something like this:

```shell
  1 file (12B)
  bagbaieraspawtgooy5lptr7loyd3fxjsrgkamre3y6au3ga4df5bkhrxdkmq
⁂ Stored 1 file
⁂ https://w3s.link/ipfs/bafybeidwm2gfdrx2yjnzdqnw7n3a2er2vo5uwv6w5otjfbyboeoq3jfiby

```

Running `w3up list` should now show the CID of your upload:

```shell
bafybeidwm2gfdrx2yjnzdqnw7n3a2er2vo5uwv6w5otjfbyboeoq3jfiby
```

You can also use the HTTP gateway at `w3s.link` to quickly fetch the content and check that it resolves. With the CID above, the gateway URL would be `https://w3s.link/ipfs/bafybeidwm2gfdrx2yjnzdqnw7n3a2er2vo5uwv6w5otjfbyboeoq3jfiby`.

### 4. Get the DID of the agent you want to delegate to

Switch over to your second terminal window with the `W3_STORE_NAME` variable set and run the `w3 whoami` command. You should see a string starting with `did:key:`. Copy that string to your clipboard for the next step.

### 5. Delegate access to the new Agent DID

Run the `w3 delegation create` command, passing in the DID for the second agent. The `-o` flag tells the `w3` command to write the delegation to a file named `delegation.car`:

```shell
w3 delegation create -o delegation.car SECOND_AGENT_DID
```

Be sure to replace `SECOND_AGENT_DID` in the example command with the DID for the second agent that you copied in step 4.

This will create a file called `delegation.car` in your current directory.

### 6. Add the delegated space to the second agent

Next, import this delegation to our second agent.

In the second terminal window, with the `W3_STORE_NAME` variable set, use the `w3 space add` command, passing in `delegation.car`:

```shell
w3 space add ./delegation.car
```

If you now run `w3 space ls` in the second terminal, you should see the space you just imported in the list.

Imported spaces are not automatically set as the default space, so we need one more command before we're ready to go. Copy the space DID from the `w3 space ls` command you just ran and run this to set the imported space as the default for uploads:

```bash
w3 space use SPACE_DID
```

Replace `SPACE_DID` with the space DID you just copied. If you run `w3 space ls` again, you should see a `*` symbol next to the space, indicating that it's currently active.

### 7. Upload to the space from the second agent

Now that your second agent has access to the space created by the first, you can use `w3 up` in your second terminal window to upload whatever you like.

Note that the `w3 delegation create` command we used in step 5 delegates the `'*'` or "top" capability by default, so the second agent will have full access to the space. You can restrict the set of delegated capabilites using the `--can` flag. Try running `w3 delegation create --help` to see more options.

## Wrapping up

UCAN delegation is a powerful tool for managing access to your w3up resources. Hopefully this post has given you some ideas about how delegation can help you build out new experiences using w3up.

Thanks for following along, and feel free to [get in touch](https://storacha.network/docs/community/help-and-support/) if you have any questions!

[reference-client#createdelegation]: ../../api/w3up-client/classes/client.Client.md#createdelegation

[reference-client#addproof]: ../../api/w3up-client/classes/client.Client.md#addproof

[reference-client#addspace]: ../../api/w3up-client/classes/client.Client.md#addspace

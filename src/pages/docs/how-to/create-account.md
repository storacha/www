# How to create an account

In this how-to guide, you'll learn how to to create a w3up account.

Anyone can use console.web3.storage to create an account and manage their storage using a web browser. Developers can use the `w3cli` command line interface or the `w3up-client` Javascript library. We recommend that developers get familiar with the `w3cli` since it's a powerful tool for many things you might want to do.

## Using the CLI

The easiest way to create an account is by using `w3cli`.

1. Install the CLI from npm using your command line: `npm install -g @web3-storage/w3cli`.
2. Run `w3 login alice@example.com` in the command line using your email address. This will send an email to your inbox with a link for validation.
3. Once you click on the validation link, you'll be taken to a webpage where you can enter your payment information and select a plan (like our Free tier).
4. Now you have created an account.

## Using console.web3.storage

1. Visit [console.web3.storage](https://console.web3.storage).
2. If you don't have an account, the website will ask you for your email address. Enter your email address and submit the form.
3. Check your email for a message from web3.storage including a link to confirm your intention to authenticate using the email you provided.

## Using the JS library

1. Install the client library from npm using your command line: `npm install @web3-storage/w3up-client`.
2. Call `client.login('alice@example.com')`, and wait for the promise to resolve. This will send an email to your inbox with a link for validation.
3. Once you click on the validation link, you'll be taken to a webpage where you can enter your payment information and select a plan (like our Free tier).
4. Now you have created an account.

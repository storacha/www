# Querying UCAN receipts

You'll be able to get the receipt for a given task. This is especially useful for getting more information about async tasks that are found in receipts for other UCAN invocations. To read more about how Storacha uses UCANs and why they're so useful, check out the UCANs and Storacha section.

e.g. in the case of `filecoin/offer`, you'll get an instant receipt with an async task of `filecoin/accept`.

You'll be able to ask for the receipt for `filecoin/accept` to get the aggregate CID and information of the deal the aggregate was first added to (when the task completes).

You can also then invoke `deal/info` with the aggregate CID to get the current deal information.

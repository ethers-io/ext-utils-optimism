Ethers: Optimistic Utilities
============================

The Optimism utilities is a small package to provide some
additional utilities required for those that wish to more
closely interact with Optimism-sepcific features.

**This package is currently experimental and beta; the API is subject to change.**

Installing
----------

```shell
/home/ricmoo> npm install @ethers-ext/utils-optimism
```


Usage
-----

By default, `estimateGas` will connect to the Ethers default Optimism
provider. When providing a transaction, using a fully populated
transaction will result in the best possible L1 estimation.

```javascript
import { estimateGas } from "@ethers-ext/utils-optimism";

// Given a transaction
// const tx = wallet.populateTransaction(...txParams);
// ... or ...
// const tx = contract.foobar.populateTransaction(...args);

const { gas, gasL1, gasL2 } = await estimateGas(tx);
```

An optional second parameter may be passed into choose another
Provider:

```javascript
// Connect to the default Optimism Goerli provider
result = await estimateGas(tx, "optimism-goerli")

// Connect to a local JSON-RPC provider
result = await estimateGas(tx, "https://localhost:8545")

// Connect to a normal Ethers provider, like MetaMask
provider = new BrowserProvider(window.ethereum)
result = await estimateGas(tx, provider)
```


API
---

### `estimateGas(tx, provider?) => Promise<{ gas: bigint, gasL1: bigint, gasL2: bigint }>`

Estimate the L1 and L2 gas requirements for `tx`. If `provider` is
not specified the default Ethers provider for Optimism is used. If
a string is provided the standard `getDefaultProvder` logic is used.


License
-------

MIT License.

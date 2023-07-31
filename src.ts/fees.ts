import {
    copyRequest, getDefaultProvider, resolveAddress, resolveProperties,
    Contract, Transaction
} from "ethers";

import type {
    Overrides, Provider, TransactionLike, TransactionRequest
} from "ethers";

const fullBytes32 = "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const gasPriceOracleAddress = "0x420000000000000000000000000000000000000F";

const gasPriceOracleAbi = [
    "function baseFee() view returns (uint)",
    "function decimals() view returns (uint)",
    "function gasPrice() view returns (uint)",
    "function getL1Fee(bytes data) view returns (uint)",
    "function getL1GasUsed(bytes data) view returns (uint)",
    "function l1BaseFee() view returns (uint)",
    "function overhead() view returns (uint)",
    "function scalar() view returns (uint)",
    "function version() view returns (string)",
];

async function getPriceOracle(provider?: string | Provider): Promise<{ contract: Contract, provider: Provider }> {
    if (provider == null) {
        provider = getDefaultProvider("optimism", { quorum: 1 });
    } else if (typeof(provider) === "string") {
        provider = getDefaultProvider(provider, { quorum: 1 });
    }

    return {
        contract: new Contract(gasPriceOracleAddress, gasPriceOracleAbi, provider),
        provider
    };
}

// @TODO: Does it make sense to expose:
// - baseFee, decimals, gasPrice, overhead, etc.
// What are they?

export type GasResult = {
  gas: bigint;
  gasL1: bigint;
  gasL2: bigint;

//  dataL1: string;
};

export async function estimateGas(_tx: TransactionRequest, _provider?: string | Provider): Promise<GasResult> {
    const { contract, provider } = await getPriceOracle(_provider);

    const tx = copyRequest(_tx);
    tx.type = 2;

    const { to, from } = await resolveProperties({
        to: (tx.to ? resolveAddress(tx.to, provider): undefined),
        from: (tx.from ? resolveAddress(tx.from, provider): undefined)
    });

    if (to != null) { tx.to = to; }
    if (from != null) { tx.from = from; }

    const txObj = Transaction.from(<TransactionLike<string>>tx);

    // Unsigned transactions need a dummy signature added to correctly
    // simulate the length, but things like nonce could still cause a
    // discrepency. It is recommended passing in a fully populated
    // transaction.
    if (txObj.signature == null) {
        txObj.signature = {
            r: fullBytes32, s: fullBytes32, yParity: 1
        };
    }

    // Get the L2 gas limit (if not present)
    if (_tx.gasLimit == null) {
        txObj.gasLimit = await provider.estimateGas(tx);
    }
    const gasL2 = txObj.gasLimit;

    // Compute the sign of the serialized transaction
    const dataL1 = txObj.serialized;

    // Allow overriding the blockTag
    const options: Overrides = { };
    if (_tx.blockTag) { options.blockTag = _tx.blockTag; }

    // Compute the L1 gas
    const gasL1 = await contract.getL1Fee(dataL1, options);

    return { gas: (gasL1 + gasL2), gasL1, gasL2 };
}

/*
(async function() {
   console.log(await estimateGas({
     to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
     data: "0x12345678"
   }));
})();
*/

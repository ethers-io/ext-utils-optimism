var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { copyRequest, getDefaultProvider, resolveAddress, resolveProperties, Contract, Transaction } from "ethers";
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
function getPriceOracle(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        if (provider == null) {
            provider = getDefaultProvider("optimism", { quorum: 1 });
        }
        else if (typeof (provider) === "string") {
            provider = getDefaultProvider(provider, { quorum: 1 });
        }
        return {
            contract: new Contract(gasPriceOracleAddress, gasPriceOracleAbi, provider),
            provider
        };
    });
}
export function estimateGas(_tx, _provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const { contract, provider } = yield getPriceOracle(_provider);
        const tx = copyRequest(_tx);
        tx.type = 2;
        const { to, from } = yield resolveProperties({
            to: (tx.to ? resolveAddress(tx.to, provider) : undefined),
            from: (tx.from ? resolveAddress(tx.from, provider) : undefined)
        });
        if (to != null) {
            tx.to = to;
        }
        if (from != null) {
            tx.from = from;
        }
        const txObj = Transaction.from(tx);
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
            txObj.gasLimit = yield provider.estimateGas(tx);
        }
        const gasL2 = txObj.gasLimit;
        // Compute the sign of the serialized transaction
        const dataL1 = txObj.serialized;
        // Allow overriding the blockTag
        const options = {};
        if (_tx.blockTag) {
            options.blockTag = _tx.blockTag;
        }
        // Compute the L1 gas
        const gasL1 = yield contract.getL1Fee(dataL1, options);
        return { gas: (gasL1 + gasL2), gasL1, gasL2 };
    });
}
/*
(async function() {
   console.log(await estimateGas({
     to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
     data: "0x12345678"
   }));
})();
*/
//# sourceMappingURL=fees.js.map
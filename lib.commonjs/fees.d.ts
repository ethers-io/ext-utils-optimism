import type { Provider, TransactionRequest } from "ethers";
export type GasResult = {
    gas: bigint;
    gasL1: bigint;
    gasL2: bigint;
};
export declare function estimateGas(_tx: TransactionRequest, _provider?: string | Provider): Promise<GasResult>;
//# sourceMappingURL=fees.d.ts.map
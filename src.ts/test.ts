import { estimateGas } from "./index.js";

(async function() {
   console.log(await estimateGas({
     to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
     data: "0x12345678"
   }));
})();

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { estimateGas } from "./index.js";
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(yield estimateGas({
            to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
            data: "0x12345678"
        }));
    });
})();
//# sourceMappingURL=test.js.map
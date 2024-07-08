"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = exports.SupabaseClient = exports.FunctionsError = exports.FunctionsRelayError = exports.FunctionsFetchError = exports.FunctionsHttpError = void 0;
const SupabaseClient_1 = __importDefault(require("./SupabaseClient"));
const wefetch_1 = __importDefault(require("./wefetch"));
__exportStar(require("./gotrue-js/src/index"), exports);
var index_1 = require("./functions-js/src/index");
Object.defineProperty(exports, "FunctionsHttpError", { enumerable: true, get: function () { return index_1.FunctionsHttpError; } });
Object.defineProperty(exports, "FunctionsFetchError", { enumerable: true, get: function () { return index_1.FunctionsFetchError; } });
Object.defineProperty(exports, "FunctionsRelayError", { enumerable: true, get: function () { return index_1.FunctionsRelayError; } });
Object.defineProperty(exports, "FunctionsError", { enumerable: true, get: function () { return index_1.FunctionsError; } });
__exportStar(require("./realtime-js/src/index"), exports);
var SupabaseClient_2 = require("./SupabaseClient");
Object.defineProperty(exports, "SupabaseClient", { enumerable: true, get: function () { return __importDefault(SupabaseClient_2).default; } });
/**
 * Creates a new Supabase Client.
 */
const createClient = (supabaseUrl, supabaseKey, options) => {
    var _a;
    return new SupabaseClient_1.default(supabaseUrl, supabaseKey, Object.assign(Object.assign({}, options), { global: {
            fetch: (...args) => (0, wefetch_1.default)(...args),
            headers: ((_a = options === null || options === void 0 ? void 0 : options.global) === null || _a === void 0 ? void 0 : _a.headers) || {},
        } }));
};
exports.createClient = createClient;
//# sourceMappingURL=index.js.map
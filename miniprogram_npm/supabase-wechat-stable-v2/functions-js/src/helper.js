"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveFetch = void 0;
const resolveFetch = (customFetch) => {
    let _fetch;
    if (customFetch) {
        _fetch = customFetch;
    }
    else if (typeof fetch === 'undefined') {
        // _fetch = (...args) =>
        //   import('@supabase/node-fetch' as any).then(({ default: fetch }) => fetch(...args))
    }
    else {
        _fetch = fetch;
    }
    return (...args) => _fetch(...args);
};
exports.resolveFetch = resolveFetch;
//# sourceMappingURL=helper.js.map
"use strict";
// @ts-ignore
// import nodeFetch, { Headers as NodeFetchHeaders } from '@supabase/node-fetch'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithAuth = exports.resolveHeaders = exports.resolveFetch = void 0;
const resolveFetch = (customFetch) => {
    let _fetch;
    if (customFetch) {
        _fetch = customFetch;
    }
    else if (typeof fetch === 'undefined') {
        // _fetch = nodeFetch as unknown as Fetch
    }
    else {
        _fetch = fetch;
    }
    return (...args) => _fetch(...args);
};
exports.resolveFetch = resolveFetch;
const resolveHeaders = (init) => {
    return new Map(Object.entries(init.headers));
};
exports.resolveHeaders = resolveHeaders;
const fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
    const fetch = (0, exports.resolveFetch)(customFetch);
    return (input, init) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const accessToken = (_a = (yield getAccessToken())) !== null && _a !== void 0 ? _a : supabaseKey;
        let headers = (0, exports.resolveHeaders)(init);
        if (!headers.has('apikey')) {
            headers.set('apikey', supabaseKey);
        }
        if (!headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }
        return fetch(input, Object.assign(Object.assign({}, init), { headers }));
    });
};
exports.fetchWithAuth = fetchWithAuth;
//# sourceMappingURL=fetch.js.map
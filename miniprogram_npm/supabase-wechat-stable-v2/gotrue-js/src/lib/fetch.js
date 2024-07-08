"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._noResolveJsonResponse = exports._generateLinkResponse = exports._ssoResponse = exports._userResponse = exports._sessionResponse = exports._request = void 0;
const helpers_1 = require("./helpers");
let { URLSearchParams } = require('../../../wechaturl-parse/index');
const errors_1 = require("./errors");
const _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const NETWORK_ERROR_CODES = [502, 503, 504];
function handleError(error) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, helpers_1.looksLikeFetchResponse)(error)) {
            throw new errors_1.AuthRetryableFetchError(_getErrorMessage(error), 0);
        }
        if (NETWORK_ERROR_CODES.includes(error.status)) {
            // status in 500...599 range - server had an error, request might be retryed.
            throw new errors_1.AuthRetryableFetchError(_getErrorMessage(error), error.status);
        }
        let data;
        try {
            data = error;
        }
        catch (e) {
            throw new errors_1.AuthUnknownError(_getErrorMessage(e), e);
        }
        if (typeof data === 'object' &&
            data &&
            typeof data.weak_password === 'object' &&
            data.weak_password &&
            Array.isArray(data.weak_password.reasons) &&
            data.weak_password.reasons.length &&
            data.weak_password.reasons.reduce((a, i) => a && typeof i === 'string', true)) {
            throw new errors_1.AuthWeakPasswordError(_getErrorMessage(data), error.status, data.weak_password.reasons);
        }
        throw new errors_1.AuthApiError(_getErrorMessage(data), error.status || 500);
    });
}
const _getRequestParams = (method, options, parameters, body) => {
    const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
    if (method === 'GET') {
        return params;
    }
    params.headers = Object.assign({ 'Content-Type': 'application/json;charset=UTF-8' }, options === null || options === void 0 ? void 0 : options.headers);
    params.body = JSON.stringify(body);
    return Object.assign(Object.assign({}, params), parameters);
};
function _request(fetcher, method, url, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
        if (options === null || options === void 0 ? void 0 : options.jwt) {
            headers['Authorization'] = `Bearer ${options.jwt}`;
        }
        const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
        if (options === null || options === void 0 ? void 0 : options.redirectTo) {
            qs['redirect_to'] = options.redirectTo;
        }
        const queryString = Object.keys(qs).length ? '?' + new URLSearchParams(qs).toString() : '';
        const data = yield _handleRequest(fetcher, method, url + queryString, { headers, noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson }, {}, options === null || options === void 0 ? void 0 : options.body);
        return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
    });
}
exports._request = _request;
function _handleRequest(fetcher, method, url, options, parameters, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestParams = _getRequestParams(method, options, parameters, body);
        let result;
        try {
            result = yield fetcher(url, requestParams);
        }
        catch (e) {
            console.error(e);
            // fetch failed, likely due to a network or CORS error
            throw new errors_1.AuthRetryableFetchError(_getErrorMessage(e), 0);
        }
        if (!result.ok) {
            yield handleError(result);
        }
        if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
            return result;
        }
        try {
            return result;
        }
        catch (e) {
            yield handleError(e);
        }
    });
}
function _sessionResponse(data) {
    var _a;
    let session = null;
    if (hasSession(data.data)) {
        session = Object.assign({}, data.data);
        if (!data.expires_at) {
            session.expires_at = (0, helpers_1.expiresAt)(data.data.expires_in);
        }
    }
    const user = (_a = data.data.user) !== null && _a !== void 0 ? _a : data;
    return { data: { session, user }, error: null };
}
exports._sessionResponse = _sessionResponse;
function _userResponse(data) {
    var _a;
    const user = (_a = data.data) !== null && _a !== void 0 ? _a : data;
    return { data: { user }, error: null };
}
exports._userResponse = _userResponse;
function _ssoResponse(data) {
    return { data, error: null };
}
exports._ssoResponse = _ssoResponse;
function _generateLinkResponse(data) {
    const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
    const properties = {
        action_link,
        email_otp,
        hashed_token,
        redirect_to,
        verification_type,
    };
    const user = Object.assign({}, rest);
    return {
        data: {
            properties,
            user,
        },
        error: null,
    };
}
exports._generateLinkResponse = _generateLinkResponse;
function _noResolveJsonResponse(data) {
    return data;
}
exports._noResolveJsonResponse = _noResolveJsonResponse;
/**
 * hasSession checks if the response object contains a valid session
 * @param data A response object
 * @returns true if a session is in the response
 */
function hasSession(data) {
    return data.access_token && data.refresh_token && data.expires_in;
}
//# sourceMappingURL=fetch.js.map
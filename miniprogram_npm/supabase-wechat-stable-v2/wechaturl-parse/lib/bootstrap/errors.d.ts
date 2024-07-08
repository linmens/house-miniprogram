export class AbortError extends Error {
    constructor(message?: string, options?: undefined);
    code: string;
}
export function aggregateTwoErrors(innerError: unknown, outerError: unknown): any;
export function captureLargerStackTrace(err: unknown): unknown;
export const codes: {};
export function connResetException(msg: any): Error;
export function dnsException(code: unknown, syscall: unknown, hostname: unknown): unknown;
/**
 * Determine the specific type of a value for type-mismatch errors.
 * @param {*} value
 * @returns {string}
 */
export function determineSpecificType(value: any): string;
export function E(sym: any, val: any, def: any, ...otherClasses: any[]): void;
export function errnoException(err: unknown, syscall: unknown, original: unknown): unknown;
export function exceptionWithHostPort(err: unknown, syscall: unknown, address: unknown, port: unknown, additional: unknown): unknown;
export namespace fatalExceptionStackEnhancers {
    function beforeInspector(error: any): any;
    function beforeInspector(error: any): any;
    function afterInspector(error: any): any;
    function afterInspector(error: any): any;
}
export function genericNodeError(message: unknown, errorProperties: unknown): Error;
export function getMessage(key: any, args: any, self: any): any;
export function hideInternalStackFrames(error: any): void;
/**
 * This function removes unnecessary frames from Node.js core errors.
 * @template {(...args: unknown[]) => unknown} T
 * @param {T} fn
 * @returns {T}
 */
export function hideStackFrames<T extends (...args: unknown[]) => unknown>(fn: T): T;
export function inspectWithNoCustomRetry(obj: any, options: any): any;
export function isErrorStackTraceLimitWritable(): any;
/**
 * Returns true if `err.name` and `err.message` are equal to engine-specific
 * values indicating max call stack size has been exceeded.
 * "Maximum call stack size exceeded" in V8.
 *
 * @param {Error} err
 * @returns {boolean}
 */
export function isStackOverflowError(err: Error): boolean;
export const kEnhanceStackBeforeInspector: unique symbol;
export const kIsNodeError: unique symbol;
export const kNoOverride: unique symbol;
export function maybeOverridePrepareStackTrace(globalThis: any, error: any, trace: any): any;
export function prepareStackTrace(globalThis: any, error: any, trace: any): any;
export function setArrowMessage(err: any, arrowMessage: any): void;
export class SystemError extends Error {
    constructor(key: any, context: any);
    code: any;
}
export function uvErrmapGet(name: any): any;
export function uvException(ctx: unknown): unknown;
export function uvExceptionWithHostPort(err: unknown, syscall: unknown, address: unknown, port: unknown): unknown;
//# sourceMappingURL=errors.d.ts.map
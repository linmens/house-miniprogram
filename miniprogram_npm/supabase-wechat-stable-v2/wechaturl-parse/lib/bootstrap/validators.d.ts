export type validateFunction = (value: any, name: string) => asserts value is Function;
export type validateObject = (value: any, name: string, options?: {
    allowArray?: boolean | undefined;
    allowFunction?: boolean | undefined;
    nullable?: boolean | undefined;
} | undefined) => any;
/**
 * @callback validateFunction
 * @param {*} value
 * @param {string} name
 * @returns {asserts value is Function}
 */
/** @type {validateFunction} */
export const validateFunction: validateFunction;
/**
 * @callback validateObject
 * @param {*} value
 * @param {string} name
 * @param {{
 *   allowArray?: boolean,
 *   allowFunction?: boolean,
 *   nullable?: boolean
 * }} [options]
 */
/** @type {validateObject} */
export const validateObject: validateObject;
//# sourceMappingURL=validators.d.ts.map
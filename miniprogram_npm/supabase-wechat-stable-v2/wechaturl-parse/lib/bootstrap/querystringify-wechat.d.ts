/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
declare function querystringify(obj: Object, prefix: string): string;
/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
declare function querystring(query: string): Object;
export { querystringify as stringify, querystring as parse };
//# sourceMappingURL=querystringify-wechat.d.ts.map
export class URL {
    static revokeObjectURL(url: any): void;
    constructor(input: any, base?: undefined);
    toString(): string;
    set href(arg: string);
    get href(): string;
    get origin(): any;
    set protocol(arg: string);
    get protocol(): string;
    set username(arg: string);
    get username(): string;
    set password(arg: string);
    get password(): string;
    set host(arg: any);
    get host(): any;
    set hostname(arg: any);
    get hostname(): any;
    set port(arg: string);
    get port(): string;
    set pathname(arg: string | undefined);
    get pathname(): string | undefined;
    set search(arg: string);
    get search(): string;
    get searchParams(): any;
    toJSON(): string;
    get [special](): boolean;
    get [cannotBeBase](): boolean;
    get [cannotHaveUsernamePasswordPort](): boolean;
    [kFormat](options: any): string;
    [context]: URLContext;
}
export class URLSearchParams {
    constructor(init?: undefined);
    append(name: any, value: any, ...args: any[]): void;
    delete(name: any, ...args: any[]): void;
    get(name: any, ...args: any[]): any;
    getAll(name: any, ...args: any[]): any[];
    has(name: any, ...args: any[]): boolean;
    set(name: any, value: any, ...args: any[]): void;
    sort(): void;
    entries(): any;
    forEach(callback: any, thisArg?: undefined): void;
    keys(): any;
    values(): any;
    toString(): string;
    [searchParams]: any[];
    [context]: any;
}
export function urlToHttpOptions(url: any): {
    protocol: any;
    hostname: any;
    hash: any;
    search: any;
    pathname: any;
    path: string;
    href: any;
};
declare const special: unique symbol;
declare const cannotBeBase: unique symbol;
declare const cannotHaveUsernamePasswordPort: unique symbol;
declare const kFormat: unique symbol;
declare const context: unique symbol;
declare class URLContext {
    flags: number;
    scheme: string;
    username: string;
    password: string;
    host: any;
    port: any;
    path: any[];
    query: any;
    fragment: any;
    pathname: string;
}
declare const searchParams: unique symbol;
export {};
//# sourceMappingURL=index.d.ts.map
import { FunctionsClient } from './functions-js/src/index';
import { PostgrestClient } from './postgrest-js/src/index';
import { RealtimeChannel, RealtimeChannelOptions, RealtimeClient } from './realtime-js/src/index';
import { StorageClient as SupabaseStorageClient } from './storage-js/src/index';
import { SupabaseAuthClient } from './lib/SupabaseAuthClient';
import { Fetch, GenericSchema, SupabaseClientOptions } from './lib/types';
/**
 * Supabase Client.
 *
 * An isomorphic Javascript client for interacting with Postgres.
 */
export default class SupabaseClient<Database = any, SchemaName extends string & keyof Database = 'public' extends keyof Database ? 'public' : string & keyof Database, Schema extends GenericSchema = Database[SchemaName] extends GenericSchema ? Database[SchemaName] : any> {
    protected supabaseUrl: string;
    protected supabaseKey: string;
    /**
     * Supabase Auth allows you to create and manage user sessions for access to data that is secured by access policies.
     */
    auth: SupabaseAuthClient;
    realtime: RealtimeClient;
    protected realtimeUrl: string;
    protected authUrl: string;
    protected storageUrl: string;
    protected functionsUrl: string;
    protected rest: PostgrestClient<Database, SchemaName>;
    protected storageKey: string;
    protected fetch?: Fetch;
    protected changedAccessToken?: string;
    protected headers: {
        [key: string]: string;
    };
    /**
     * Create a new client for use in the browser.
     * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
     * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
     * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
     * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
     * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
     * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
     * @param options.realtime Options passed along to realtime-js constructor.
     * @param options.global.fetch A custom fetch implementation.
     * @param options.global.headers Any additional headers to send with each network request.
     */
    constructor(supabaseUrl: string, supabaseKey: string, options?: SupabaseClientOptions<SchemaName>);
    /**
     * Supabase Functions allows you to deploy and invoke edge functions.
     */
    get functions(): FunctionsClient;
    /**
     * Supabase Storage allows you to manage user-generated content, such as photos or videos.
     */
    get storage(): SupabaseStorageClient;
    /**
     * Perform a query on a table or a view.
     *
     * @param relation - The table or view name to query
     */
    from: PostgrestClient<Database, SchemaName>['from'];
    /**
     * Perform a query on a schema distinct from the default schema supplied via
     * the `options.db.schema` constructor parameter.
     *
     * The schema needs to be on the list of exposed schemas inside Supabase.
     *
     * @param schema - The name of the schema to query
     */
    schema: PostgrestClient<Database, SchemaName>['schema'];
    /**
     * Perform a function call.
     *
     * @param fn - The function name to call
     * @param args - The arguments to pass to the function call
     * @param options - Named parameters
     * @param options.head - When set to `true`, `data` will not be returned.
     * Useful if you only need the count.
     * @param options.count - Count algorithm to use to count rows returned by the
     * function. Only applicable for [set-returning
     * functions](https://www.postgresql.org/docs/current/functions-srf.html).
     *
     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
     * hood.
     *
     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
     * statistics under the hood.
     *
     * `"estimated"`: Uses exact count for low numbers and planned count for high
     * numbers.
     */
    rpc: PostgrestClient<Database, SchemaName>['rpc'];
    /**
     * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
     *
     * @param {string} name - The name of the Realtime channel.
     * @param {Object} opts - The options to pass to the Realtime channel.
     *
     */
    channel(name: string, opts?: RealtimeChannelOptions): RealtimeChannel;
    /**
     * Returns all Realtime channels.
     */
    getChannels(): RealtimeChannel[];
    /**
     * Unsubscribes and removes Realtime channel from Realtime client.
     *
     * @param {RealtimeChannel} channel - The name of the Realtime channel.
     *
     */
    removeChannel(channel: RealtimeChannel): Promise<'ok' | 'timed out' | 'error'>;
    /**
     * Unsubscribes and removes all Realtime channels from Realtime client.
     */
    removeAllChannels(): Promise<('ok' | 'timed out' | 'error')[]>;
    private _getAccessToken;
    private _initSupabaseAuthClient;
    private _initRealtimeClient;
    private _listenForAuthEvents;
    private _handleTokenChanged;
}
//# sourceMappingURL=SupabaseClient.d.ts.map
import { WebSocketClient } from "..";
export type col_timeseries_granularity = "seconds" | "minutes" | "hours"; //  | "days" | "weeks" | "months" | "years";
export type col_validationLevel = "off" | "strict" | "moderate";
export type col_validationAction = "error" | "warn";
export type col_collation = {
   locale?: string,
   caseLevel?: boolean,
   caseFirst?: string,
   strength?: number,
   numericOrdering?: boolean,
   alternate?: string,
   maxVariable?: string,
   backwards?: boolean
};
export type col_timeseries = {
    timeField: string,
    metaField?: string,
    granularity?: col_timeseries_granularity,
};
export type CreateCollectionOptions = {
    jwt?: string,
    priority?: number,
    websocket?: WebSocketClient,
    collectionname: string,
    timeseries?: col_timeseries;
  
    expireAfterSeconds?: number,
    changeStreamPreAndPostImages?: boolean,
    size?: number, // Optional. Specify a maximum size in bytes for a capped collection.
    max?: number, // Optional. The maximum number of documents allowed in the capped collection. 
    validator?: object, // Optional. Specify validation rules for documents in a collection.
    validationLevel?: col_validationLevel, // Optional. Specify how strictly MongoDB applies the validation rules to existing documents during an update.
    validationAction?: col_validationAction, // Optional. Specify whether to error on invalid documents or just warn about the violations but allow invalid documents to be inserted.
    collation?: col_collation,
    capped?: boolean,
    traceId?: string,
    spanId?: string,
}
export class CreateCollectionDefaults {
    public priority: number = 2;
}
export class CreateCollectionMessage {
    public static parse(options: CreateCollectionOptions): [CreateCollectionMessage, number, WebSocketClient, string, string] {
        const defaults = new CreateCollectionDefaults();
        const priority = (options.priority ? options.priority : defaults.priority);
        const websocket = (options.websocket ? options.websocket : WebSocketClient.instance);
        const { traceId, spanId } = options;
        const q: CreateCollectionMessage = Object.assign(defaults, options) as any;
        delete (q as any).websocket;
        return [q, priority, websocket, traceId, spanId];
    }
    public error: string;
    public jwt: string;
    public collectionname: string;
    static assign(o: any): CreateCollectionMessage {
        if (typeof o === 'string' || o instanceof String) {
            return Object.assign(new CreateCollectionMessage(), JSON.parse(o.toString()));
        }
        return Object.assign(new CreateCollectionMessage(), o);
    }
}

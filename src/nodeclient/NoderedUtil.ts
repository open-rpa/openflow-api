import { WebSocketClient } from '../WebSocketClient';
import { Base } from './Base';
import { QueueMessage } from '../Message/QueueMessage';
import { QueryMessage } from '../Message/QueryMessage';
import { Message } from './Message';
import { InsertOneMessage } from '../Message/InsertOneMessage';
import { UpdateOneMessage } from '../Message/UpdateOneMessage';
import { UpdateManyMessage } from '../Message/UpdateManyMessage';
import { InsertOrUpdateOneMessage } from '../Message/InsertOrUpdateOneMessage';
import { DeleteOneMessage } from '../Message/DeleteOneMessage';
import { DeleteManyMessage } from '../Message/DeleteManyMessage';
import { mapFunc, reduceFunc, finalizeFunc, MapReduceMessage } from '../Message/MapReduceMessage';
import { JSONfn } from './JSONfn';
import { AggregateMessage } from '../Message/AggregateMessage';
import { GetFileMessage } from '../Message/GetFileMessage';
import { SaveFileMessage } from '../Message/SaveFileMessage';
import { GetNoderedInstanceMessage } from '../Message/GetNoderedInstanceMessage';
import { CreateWorkflowInstanceMessage } from '../Message/CreateWorkflowInstanceMessage';
import { SigninMessage } from '../Message/SigninMessage';
import { RegisterQueueMessage } from '../Message/RegisterQueueMessage';
import { ListCollectionsMessage } from '../Message/ListCollectionsMessage';
import { EnsureNoderedInstanceMessage, DeleteNoderedInstanceMessage, RestartNoderedInstanceMessage, StartNoderedInstanceMessage, StopNoderedInstanceMessage, DropCollectionMessage, DeleteNoderedPodMessage, GetNoderedInstanceLogMessage, EnsureStripeCustomerMessage, stripe_customer, StripeCancelPlanMessage, StripeAddPlanMessage, stripe_base, StripeMessage, RegisterUserMessage, TokenUser, UnWatchMessage, GetDocumentVersionMessage, InsertManyMessage, GetKubeNodeLabels } from '..';
import { WatchMessage } from '../Message/WatchMessage';
import { Billing } from '../stripe/Billing';
import { PushMetricsMessage } from '../Message/PushMetricsMessage';

// export type messageQueueCallback = (msg: QueueMessage) => void;
export type QueueOnMessage = (msg: QueueMessage, ack: any) => void;
export type WatchOnMessage = (msg: any) => void;
export interface IHashTable<T> {
    [key: string]: T;
}
export class NoderedUtil {
    public static Delay = ms => new Promise<void>(res => setTimeout(res, ms));
    public static IsNullUndefinded(obj: any) {
        if (obj === null || obj === undefined) {
            return true;
        }
        return false;
    }
    public static IsNullEmpty(obj: any) {
        if (obj === null || obj === undefined || obj === '') {
            return true;
        }
        return false;
    }
    public static IsString(obj: any) {
        if (typeof obj === 'string' || obj instanceof String) {
            return true;
        }
        return false;
    }
    public static isObject(obj: any): boolean {
        return obj === Object(obj);
    }
    public static FetchFromObject(obj: any, prop: string): any {
        if (typeof obj === 'undefined') {
            return false;
        }
        const _index = prop.indexOf('.');
        if (_index > -1) {
            return NoderedUtil.FetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
        }
        return obj[prop];
    }
    private static _isNodeJS: boolean = null;
    public static isNodeJS(): boolean {
        if (NoderedUtil._isNodeJS != null) return NoderedUtil._isNodeJS;
        if (typeof process === 'object' && process + '' === '[object process]') {
            NoderedUtil._isNodeJS = true;
            return true;
        }
        NoderedUtil._isNodeJS = false;
        return false;
    }
    private static _isDocker: boolean = null;
    public static isDocker(): boolean {
        if (NoderedUtil._isDocker != null) return NoderedUtil._isDocker;
        NoderedUtil._isDocker = NoderedUtil.hasDockerEnv() || NoderedUtil.hasDockerCGroup();
        return false;
    }
    private static _isKubernetes: boolean = null;
    public static isKubernetes(): boolean {
        if (NoderedUtil._isKubernetes != null) return NoderedUtil._isKubernetes;
        if (!NoderedUtil.isDocker()) { NoderedUtil._isKubernetes = false; return false; }
        if (NoderedUtil.IsNullEmpty(process.env["KUBERNETES_SERVICE_HOST"])) { NoderedUtil._isKubernetes = false; return false; }
        NoderedUtil._isKubernetes = true;
        return true;
    }
    static hasDockerEnv(): boolean {
        try {
            const fs = require('fs');
            fs.statSync('/.dockerenv');
            return true;
        } catch (_) {
            return false;
        }
    }
    static hasDockerCGroup() {
        try {
            const fs = require('fs');
            if (fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker')) return true;
            return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('/kubepods');
        } catch (_) {
            return false;
        }
    }
    public static saveToObject(obj: any, path: string, value: any): any {
        const pList = path.split('.');
        const key = pList.pop();
        const pointer = pList.reduce((accumulator, currentValue) => {
            if (accumulator[currentValue] === undefined) accumulator[currentValue] = {};
            return accumulator[currentValue];
        }, obj);
        if (NoderedUtil.isObject(pointer)) {
            pointer[key] = value;
        } else {
            throw new Error(path + ' is not an object!');
        }
        return obj;
    }
    public static HandleError(node: any, error: any, msg: any): void {
        // tslint:disable-next-line: no-console
        console.error(error);
        let message: string = error;
        if (typeof error === 'string' || error instanceof String) {
            error = new Error(error as string);
        }
        try {
            node.error(error, msg);
            // if (error.message) {
            //     message = error.message;
            //     node.error(message, error);
            // } else {
            //     node.error(message, error);
            // }
            // tslint:disable-next-line: no-empty
        } catch (error) {
        }
        try {
            if (NoderedUtil.IsNullUndefinded(message)) {
                message = '';
            }
            node.status({ fill: 'red', shape: 'dot', text: message.toString().substr(0, 32) });
            // tslint:disable-next-line: no-empty
        } catch (error) {
        }
    }

    public static GetUniqueIdentifier(): string {
        return Math.random().toString(36).substr(2, 9);
    }
    public static async SigninWithToken(jwt: string, rawAssertion: string, impersonate: string, longtoken: boolean = false, validateonly: boolean = false): Promise<SigninMessage> {
        const q: SigninMessage = new SigninMessage();
        q.jwt = jwt;
        q.rawAssertion = rawAssertion;
        q.realm = "browser";
        if (this.isNodeJS()) q.realm = "nodejs";
        q.clientagent = WebSocketClient.instance.agent;
        q.clientversion = WebSocketClient.instance.version;
        if (WebSocketClient.instance.usingCordova) {
            q.realm = "mobile";
            q.clientagent = "mobileapp";
        }
        q.impersonate = impersonate;
        q.longtoken = longtoken;
        q.validate_only = validateonly;
        q.onesignalid = WebSocketClient.instance.oneSignalId;
        q.device = WebSocketClient.instance.device;
        q.gpslocation = WebSocketClient.instance.location;
        const msg: Message = new Message(); msg.command = "signin"; msg.data = JSON.stringify(q);
        const result = await WebSocketClient.instance.Send<SigninMessage>(msg);
        WebSocketClient.instance.user = result.user;
        WebSocketClient.instance.jwt = result.jwt;
        WebSocketClient.instance.supports_watch = result.supports_watch;
        // this.$rootScope.$broadcast("signin", result);
        return result;
    }
    public static async SigninWithUsername(username: string, password: string, impersonate: string, longtoken: boolean = false, validateonly: boolean = false): Promise<SigninMessage> {
        const q: SigninMessage = new SigninMessage();
        q.username = username;
        q.password = password;
        q.realm = "browser";
        if (this.isNodeJS()) q.realm = "nodejs";
        q.clientagent = WebSocketClient.instance.agent;
        q.clientversion = WebSocketClient.instance.version;
        if (WebSocketClient.instance.usingCordova) {
            q.realm = "mobile";
            q.clientagent = "mobileapp";
        }
        q.impersonate = impersonate;
        q.longtoken = longtoken;
        q.validate_only = validateonly;
        q.onesignalid = WebSocketClient.instance.oneSignalId;
        q.device = WebSocketClient.instance.device;
        q.gpslocation = WebSocketClient.instance.location;
        const msg: Message = new Message(); msg.command = "signin"; msg.data = JSON.stringify(q);
        const result = await WebSocketClient.instance.Send<SigninMessage>(msg);
        WebSocketClient.instance.user = result.user;
        WebSocketClient.instance.jwt = result.jwt;
        WebSocketClient.instance.supports_watch = result.supports_watch;
        // this.$rootScope.$broadcast("signin", result);
        return result;
    }

    public static async GetRole(id: string, name: string): Promise<Base> {
        let res: any[];
        if (NoderedUtil.IsNullEmpty(id)) {
            // res = await NoderedUtil.Query("users", { "_type": "role", $or: [{ _id: id }, { name: name }] }, null, null, 2, 0, null);
            res = await NoderedUtil.Query('users', { _type: 'role', name }, null, null, 2, 0, null);
        } else {
            res = await NoderedUtil.Query('users', { _type: 'role', _id: id }, null, null, 2, 0, null);
        }
        if (res.length === 1) {
            return res[0];
        } else if (res.length === 2) {
            // tslint:disable-next-line: no-console
            console.error('Found more than one !');
        }
        return null;
    }

    public static async Query(
        collection: string,
        query: any,
        projection: any,
        orderby: any,
        top: number,
        skip: number,
        jwt: string,
        queryas: string = null,
        hint: object | string = null
    ): Promise<any[]> {
        const q: QueryMessage = new QueryMessage();
        q.collectionname = collection;
        q.orderby = orderby;
        q.projection = projection;
        q.queryas = queryas;
        q.hint = hint;
        q.query = JSON.stringify(query, (key, value) => {
            const t = typeof value;
            if (value instanceof RegExp) return '__REGEXP ' + value.toString();
            else if (t === 'object') {
                if (value.constructor != null && value.constructor.name === 'RegExp') {
                    return '__REGEXP ' + value.toString();
                }
                return value;
            } else return value;
        });
        q.skip = skip;
        q.top = top;
        q.jwt = jwt;
        const _msg: Message = new Message();
        _msg.command = 'query';
        _msg.data = JSON.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(_msg);
        return result.result;
    }
    public static async GetDocumentVersion(collectionname: string, id: string, version: number, jwt: string): Promise<any> {
        const q: GetDocumentVersionMessage = new GetDocumentVersionMessage();
        q.collectionname = collectionname;
        q._id = id;
        q.version = version;
        q.jwt = jwt;
        const _msg: Message = new Message();
        _msg.command = 'getdocumentversion';
        _msg.data = JSON.stringify(q);
        const result: GetDocumentVersionMessage = await WebSocketClient.instance.Send<GetDocumentVersionMessage>(_msg);
        return result.result;
    }
    public static async InsertOne(collection: string, item: any, w: number, j: boolean, jwt: string): Promise<any> {
        const q: InsertOneMessage = new InsertOneMessage();
        q.collectionname = collection;
        q.item = item;
        q.jwt = jwt;
        q.w = w;
        q.j = j;
        const _msg: Message = new Message();
        _msg.command = 'insertone';
        _msg.data = JSON.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(_msg);
        return result.result;
    }
    public static async InsertMany(collection: string, items: any[], w: number, j: boolean, skipresults: boolean, jwt: string): Promise<any[]> {
        const q: InsertManyMessage = new InsertManyMessage();
        q.collectionname = collection;
        q.items = items; q.skipresults = skipresults;
        q.jwt = jwt;
        q.w = w;
        q.j = j;
        const _msg: Message = new Message();
        _msg.command = 'insertmany';
        _msg.data = JSON.stringify(q);
        const result: InsertManyMessage = await WebSocketClient.instance.Send<InsertManyMessage>(_msg);
        return result.results;
    }
    public static async UpdateOne(
        collection: string,
        query: any,
        item: any,
        w: number,
        j: boolean,
        jwt: string,
    ): Promise<any> {
        const q: UpdateOneMessage = new UpdateOneMessage();
        q.collectionname = collection;
        q.item = item;
        q.jwt = jwt;
        q.w = w;
        q.j = j;
        q.query = query;
        const result = await this._UpdateOne(q);
        return result.result;
    }
    public static async _UpdateOne(q: UpdateOneMessage): Promise<UpdateOneMessage> {
        const _msg: Message = new Message();
        _msg.command = 'updateone';
        _msg.data = JSON.stringify(q);
        const result: UpdateOneMessage = await WebSocketClient.instance.Send<UpdateOneMessage>(_msg);
        return result;
    }
    // public static async UpdateMany(collection: string, query: any, item: any, w: number, j: boolean, jwt: string): Promise<any> {
    public static async UpdateMany(q: UpdateManyMessage): Promise<any> {
        const _msg: Message = new Message();
        _msg.command = 'updatemany';
        _msg.data = JSON.stringify(q);
        const result: UpdateOneMessage = await WebSocketClient.instance.Send<UpdateOneMessage>(_msg);
        return result;
    }
    public static async InsertOrUpdateOne(
        collection: string,
        item: any,
        uniqeness: string,
        w: number,
        j: boolean,
        jwt: string,
    ): Promise<any> {
        const q: InsertOrUpdateOneMessage = new InsertOrUpdateOneMessage();
        q.collectionname = collection;
        q.item = item;
        q.jwt = jwt;
        q.uniqeness = uniqeness;
        q.w = w;
        q.j = j;
        const _msg: Message = new Message();
        _msg.command = 'insertorupdateone';
        _msg.data = JSON.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(_msg);
        return result.result;
    }

    public static async DeleteOne(collection: string, id: string, jwt: string): Promise<any> {
        const q: DeleteOneMessage = new DeleteOneMessage();
        q.collectionname = collection;
        q._id = id;
        q.jwt = jwt;
        const _msg: Message = new Message();
        _msg.command = 'deleteone';
        _msg.data = JSON.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(_msg);
        return result.result;
    }
    public static async DeleteMany(collection: string, query: any, ids: string[], jwt: string): Promise<number> {
        const q: DeleteManyMessage = new DeleteManyMessage();
        q.collectionname = collection;
        q.ids = ids; q.query = query;
        q.jwt = jwt;
        const _msg: Message = new Message();
        _msg.command = 'deletemany';
        _msg.data = JSON.stringify(q);
        const result: DeleteManyMessage = await WebSocketClient.instance.Send<DeleteManyMessage>(_msg);
        return result.affectedrows;
    }

    public static async MapReduce(
        collection: string,
        map: mapFunc,
        reduce: reduceFunc,
        finalize: finalizeFunc,
        query: any,
        out: string | any,
        scope: any,
        jwt: string,
    ): Promise<any> {
        const q: MapReduceMessage = new MapReduceMessage(map, reduce, finalize, query, out);
        q.collectionname = collection;
        q.scope = scope;
        q.jwt = jwt;
        const msg: Message = new Message();
        msg.command = 'mapreduce';
        q.out = out;
        msg.data = JSONfn.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(msg);
        return result.result;
    }

    public static async Aggregate(collection: string, aggregates: object[], jwt: string, hint: object | string = null): Promise<any> {
        const q: AggregateMessage = new AggregateMessage();
        q.collectionname = collection;
        q.aggregates = aggregates;
        q.jwt = jwt;
        q.hint = hint;
        const msg: Message = new Message();
        msg.command = 'aggregate';
        msg.data = JSONfn.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(msg);
        return result.result;
    }
    public static watchcb: IHashTable<WatchOnMessage> = {};
    public static async Watch(collection: string, aggregates: object[], jwt: string, callback: any): Promise<any> {
        const q: WatchMessage = new WatchMessage();
        q.collectionname = collection;
        q.aggregates = aggregates;
        q.jwt = jwt;
        const msg: Message = new Message();
        msg.command = 'watch';
        msg.data = JSONfn.stringify(q);
        const result: WatchMessage = await WebSocketClient.instance.Send<WatchMessage>(msg);
        if (!NoderedUtil.IsNullEmpty(result.id)) this.watchcb[result.id] = callback;
        return result.id;
    }
    public static async UnWatch(id: string, jwt: string): Promise<void> {
        const q: UnWatchMessage = new UnWatchMessage();
        q.id = id; q.jwt = jwt;
        const msg: Message = new Message();
        msg.command = 'unwatch';
        msg.data = JSONfn.stringify(q);
        const result: WatchMessage = await WebSocketClient.instance.Send<WatchMessage>(msg);
        if (this.watchcb != null && this.watchcb[id] != null) {
            delete this.watchcb[id];
        }
    }

    public static async GetFile(filename: string, id: string, jwt: string): Promise<GetFileMessage> {
        const q: GetFileMessage = new GetFileMessage();
        q.filename = filename;
        q.id = id;
        q.jwt = jwt;
        const msg: Message = new Message();
        msg.command = 'getfile';
        msg.data = JSONfn.stringify(q);
        const result: GetFileMessage = await WebSocketClient.instance.Send<GetFileMessage>(msg);
        return result;
    }

    public static async SaveFile(
        filename: string,
        mimeType: string,
        metadata: any,
        file: string,
        jwt: string,
    ): Promise<SaveFileMessage> {
        const q: SaveFileMessage = new SaveFileMessage();
        q.filename = filename;
        q.mimeType = mimeType;
        q.file = file;
        q.jwt = jwt;
        q.metadata = metadata;
        const msg: Message = new Message();
        msg.command = 'savefile';
        msg.data = JSONfn.stringify(q);
        const result: SaveFileMessage = await WebSocketClient.instance.Send<SaveFileMessage>(msg);
        return result;
    }
    public static async GetKubeNodeLabels(jwt: string): Promise<any[]> {
        const q: GetKubeNodeLabels = new GetKubeNodeLabels();
        q.jwt = jwt;
        const _msg: Message = new Message();
        _msg.command = 'getkubenodelabels';
        _msg.data = JSON.stringify(q);
        const result: GetKubeNodeLabels = await WebSocketClient.instance.Send<GetKubeNodeLabels>(_msg);
        return result.result;
    }
    public static async GetNoderedInstance(_id: string, jwt: string): Promise<any[]> {
        const q: GetNoderedInstanceMessage = new GetNoderedInstanceMessage();
        q._id = _id;
        q.jwt = jwt;
        const _msg: Message = new Message();
        _msg.command = 'getnoderedinstance';
        _msg.data = JSON.stringify(q);
        const result: GetNoderedInstanceMessage = await WebSocketClient.instance.Send<GetNoderedInstanceMessage>(_msg);
        return result.results;
    }
    public static async GetNoderedInstanceLog(_id: string, instancename: string, jwt: string): Promise<string> {
        const q: GetNoderedInstanceLogMessage = new GetNoderedInstanceLogMessage();
        q._id = _id;
        q.jwt = jwt; q.instancename = instancename;
        const _msg: Message = new Message();
        _msg.command = 'getnoderedinstancelog';
        _msg.data = JSON.stringify(q);
        const result: GetNoderedInstanceLogMessage = await WebSocketClient.instance.Send<GetNoderedInstanceLogMessage>(_msg);
        return result.result;
    }


    public static async CreateWorkflowInstance(
        targetid: string,
        workflowid: string,
        correlationId: string,
        resultqueue: string,
        parentid: string,
        payload: any,
        initialrun: boolean,
        jwt: string,
    ): Promise<string> {
        const q: CreateWorkflowInstanceMessage = new CreateWorkflowInstanceMessage();
        q.targetid = targetid;
        q.workflowid = workflowid;
        q.resultqueue = resultqueue;
        q.initialrun = initialrun;
        q.correlationId = correlationId;
        q.parentid = parentid;
        q.jwt = jwt;
        q.payload = payload;
        const _msg: Message = new Message();
        _msg.command = 'createworkflowinstance';
        _msg.data = JSON.stringify(q);
        const result: CreateWorkflowInstanceMessage = await WebSocketClient.instance.Send<CreateWorkflowInstanceMessage>(
            _msg,
        );
        return result.newinstanceid;
    }
    static isNumeric(num) {
        return !isNaN(num);
    }
    public static async RenewToken(jwt: string, longtoken: boolean): Promise<SigninMessage> {
        const q: SigninMessage = new SigninMessage();
        q.validate_only = true;
        q.clientagent = 'nodered';
        q.clientversion = WebSocketClient.instance.version;
        q.longtoken = longtoken;
        q.jwt = jwt;
        const _msg: Message = new Message();
        _msg.command = 'signin';
        _msg.data = JSON.stringify(q);
        const result: SigninMessage = await WebSocketClient.instance.Send<SigninMessage>(_msg);
        return result;
    }
    public static async GetTokenFromSAML(rawAssertion: string): Promise<SigninMessage> {
        const q: SigninMessage = new SigninMessage();
        q.validate_only = true;
        q.clientagent = 'nodered';
        q.clientversion = WebSocketClient.instance.version;
        q.rawAssertion = rawAssertion;
        const _msg: Message = new Message();
        _msg.command = 'signin';
        _msg.data = JSON.stringify(q);
        const result: SigninMessage = await WebSocketClient.instance.Send<SigninMessage>(_msg);
        return result;
    }

    // public static messageQueue: IHashTable<messagequeue> = {};
    public static messageQueuecb: IHashTable<QueueOnMessage> = {};
    public static async RegisterQueue(websocket: WebSocketClient, queuename: string, callback: any): Promise<string> {
        const q: RegisterQueueMessage = new RegisterQueueMessage();
        q.queuename = queuename;
        const msg: Message = new Message();
        msg.command = 'registerqueue';
        msg.data = JSON.stringify(q);
        const result: RegisterQueueMessage = await websocket.Send(msg);
        if (result) {
            this.messageQueuecb[result.queuename] = callback;
            return result.queuename;
        }
        return null;
    }
    public static async CloseQueue(websocket: WebSocketClient, queuename: string): Promise<void> {
        if (!websocket.isConnected()) return;
        const q: RegisterQueueMessage = new RegisterQueueMessage();
        q.queuename = queuename;
        const msg: Message = new Message();
        msg.command = 'closequeue';
        msg.data = JSON.stringify(q);
        const result: RegisterQueueMessage = await websocket.Send(msg);
        if (result) {
            delete this.messageQueuecb[result.queuename];
        } else {
            return;
        }
    }
    // ROLLBACK
    // Promise<QueueMessage>
    public static async _QueueMessage(
        websocket: WebSocketClient,
        queuename: string,
        replyto: string,
        data: any,
        correlationId: string,
        expiration: number,
    ): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const q: QueueMessage = new QueueMessage();
                q.correlationId = correlationId;
                if (NoderedUtil.IsNullEmpty(q.correlationId)) q.correlationId = NoderedUtil.GetUniqueIdentifier();
                q.expiration = expiration;
                q.queuename = queuename;
                q.data = JSON.stringify(data);
                q.replyto = replyto;
                const msg: Message = new Message();
                msg.command = 'queuemessage';
                msg.data = JSON.stringify(q);
                const res = await websocket.Send(msg);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    public static async QueueMessage(websocket: WebSocketClient, queuename: string, replyto: string, data: any, correlationId: string, expiration: number): Promise<void> {
        await this._QueueMessage(websocket, queuename, replyto, data, correlationId, expiration);
    }
    public static async ListCollections(jwt: string): Promise<any[]> {
        const q: ListCollectionsMessage = new ListCollectionsMessage();
        q.jwt = jwt;
        const _msg: Message = new Message();
        _msg.command = 'listcollections';
        _msg.data = JSON.stringify(q);
        const result: ListCollectionsMessage = await WebSocketClient.instance.Send<ListCollectionsMessage>(_msg);
        return result.result;
    }
    public static async DropCollection(collectionname: string, jwt: string): Promise<void> {
        const q: DropCollectionMessage = new DropCollectionMessage();
        q.jwt = jwt; q.collectionname = collectionname;
        const _msg: Message = new Message();
        _msg.command = 'dropcollection';
        _msg.data = JSON.stringify(q);
        await WebSocketClient.instance.Send<DropCollectionMessage>(_msg);
    }
    public static async EnsureNoderedInstance(_id: string, skipcreate: boolean, jwt: string): Promise<void> {
        const q: EnsureNoderedInstanceMessage = new EnsureNoderedInstanceMessage();
        q.jwt = jwt; q._id = _id; q.skipcreate = skipcreate;
        const _msg: Message = new Message();
        _msg.command = 'ensurenoderedinstance';
        _msg.data = JSON.stringify(q);
        await WebSocketClient.instance.Send<EnsureNoderedInstanceMessage>(_msg);
    }
    public static async DeleteNoderedInstance(_id: string, jwt: string): Promise<void> {
        const q: DeleteNoderedInstanceMessage = new DeleteNoderedInstanceMessage();
        q.jwt = jwt; q._id = _id;
        const _msg: Message = new Message();
        _msg.command = 'deletenoderedinstance';
        _msg.data = JSON.stringify(q);
        await WebSocketClient.instance.Send<EnsureNoderedInstanceMessage>(_msg);
    }
    public static async DeleteNoderedPod(_id: string, instancename: string, jwt: string): Promise<void> {
        const q: DeleteNoderedPodMessage = new DeleteNoderedPodMessage();
        q.jwt = jwt; q._id = _id; q.name = instancename;
        const _msg: Message = new Message();
        _msg.command = 'deletenoderedpod';
        _msg.data = JSON.stringify(q);
        await WebSocketClient.instance.Send<DeleteNoderedPodMessage>(_msg);
    }
    public static async RestartNoderedInstance(_id: string, jwt: string): Promise<void> {
        const q: RestartNoderedInstanceMessage = new RestartNoderedInstanceMessage();
        q.jwt = jwt; q._id = _id;
        const _msg: Message = new Message();
        _msg.command = 'restartnoderedinstance';
        _msg.data = JSON.stringify(q);
        await WebSocketClient.instance.Send<RestartNoderedInstanceMessage>(_msg);
    }
    public static async StartNoderedInstance(_id: string, jwt: string): Promise<void> {
        const q: StartNoderedInstanceMessage = new StartNoderedInstanceMessage();
        q.jwt = jwt; q._id = _id;
        const _msg: Message = new Message();
        _msg.command = 'startnoderedinstance';
        _msg.data = JSON.stringify(q);
        await WebSocketClient.instance.Send<StartNoderedInstanceMessage>(_msg);
    }
    public static async StopNoderedInstance(_id: string, jwt: string): Promise<void> {
        const q: StopNoderedInstanceMessage = new StopNoderedInstanceMessage();
        q.jwt = jwt; q._id = _id;
        const _msg: Message = new Message();
        _msg.command = 'stopnoderedinstance';
        _msg.data = JSON.stringify(q);
        await WebSocketClient.instance.Send<StopNoderedInstanceMessage>(_msg);
    }
    public static async EnsureStripeCustomer(billing: Billing, userid: string, jwt: string): Promise<stripe_customer> {
        const q: EnsureStripeCustomerMessage = new EnsureStripeCustomerMessage();
        q.jwt = jwt; q.billing = billing; q.userid = userid;
        const _msg: Message = new Message();
        _msg.command = 'ensurestripecustomer';
        _msg.data = JSON.stringify(q);
        const result = await WebSocketClient.instance.Send<EnsureStripeCustomerMessage>(_msg);
        return result.customer;
    }
    public static async StripeAddPlan(userid: string, planid: string, subplanid: string, jwt: string): Promise<StripeAddPlanMessage> {
        const q: StripeAddPlanMessage = new StripeAddPlanMessage();
        q.jwt = jwt; q.userid = userid; q.planid = planid; q.subplanid = subplanid;
        const _msg: Message = new Message();
        _msg.command = 'stripeaddplan';
        _msg.data = JSON.stringify(q);
        const result = await WebSocketClient.instance.Send<StripeAddPlanMessage>(_msg);
        return result;
    }
    public static async StripeCancelPlan(userid: string, planid: string, jwt: string): Promise<void> {
        const q: StripeCancelPlanMessage = new StripeCancelPlanMessage();
        q.jwt = jwt; q.planid = planid; q.userid = userid;
        const _msg: Message = new Message();
        _msg.command = 'stripecancelplan';
        _msg.data = JSON.stringify(q);
        await WebSocketClient.instance.Send<StripeCancelPlanMessage>(_msg);
    }
    public static async Stripe<T extends stripe_base>(method: string, object: string, customerid: string, id: string, payload: stripe_base, jwt: string): Promise<T> {
        const q: StripeMessage = new StripeMessage();
        q.jwt = jwt; q.method = method; q.object = object; q.customerid = customerid; q.id = id; q.payload = payload;
        const _msg: Message = new Message();
        _msg.command = 'stripemessage';
        _msg.data = JSON.stringify(q);
        const result = await WebSocketClient.instance.Send<StripeMessage>(_msg);
        return result.payload as T;
    }
    public static async RegisterUser(name: string, username: string, password: string, jwt: string): Promise<TokenUser> {
        const q: RegisterUserMessage = new RegisterUserMessage();
        q.name = name; q.username = username; q.password = password;
        q.jwt = jwt;
        const msg: Message = new Message();
        msg.command = 'registeruser';
        msg.data = JSONfn.stringify(q);
        const result: RegisterUserMessage = await WebSocketClient.instance.Send<RegisterUserMessage>(msg);
        return result.user;
    }
    public static async PushMetrics(metrics: string, jwt: string): Promise<void> {
        const q: PushMetricsMessage = new PushMetricsMessage();
        q.metrics = metrics;
        q.jwt = jwt;
        const msg: Message = new Message();
        msg.command = 'pushmetrics';
        msg.data = JSONfn.stringify(q);
        const result: PushMetricsMessage = await WebSocketClient.instance.Send<PushMetricsMessage>(msg);
    }
}

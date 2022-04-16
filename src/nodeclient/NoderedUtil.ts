import { WebSocketClient } from '../WebSocketClient';
import { AddWorkitemOptions, Base, GetWorkitemQueueOptions } from './Base';
import { QueueMessage, QueueOptions } from '../Message/QueueMessage';
import { QueryMessage, QueryOptions } from '../Message/QueryMessage';
import { Message } from './Message';
import { InsertOneMessage, InsertOneOptions } from '../Message/InsertOneMessage';
import { UpdateOneMessage, UpdateOneOptions } from '../Message/UpdateOneMessage';
import { UpdateManyMessage, UpdateManyOptions } from '../Message/UpdateManyMessage';
import { InsertOrUpdateOneMessage, InsertOrUpdateOneOptions } from '../Message/InsertOrUpdateOneMessage';
import { DeleteOneMessage, DeleteOneOptions } from '../Message/DeleteOneMessage';
import { DeleteManyMessage, DeleteManyOptions } from '../Message/DeleteManyMessage';
import { mapFunc, reduceFunc, finalizeFunc, MapReduceMessage } from '../Message/MapReduceMessage';
import { JSONfn } from './JSONfn';
import { AggregateMessage, AggregateOptions } from '../Message/AggregateMessage';
import { GetFileMessage, GetFileOptions } from '../Message/GetFileMessage';
import { SaveFileMessage, SaveFileOptions } from '../Message/SaveFileMessage';
import { GetNoderedInstanceMessage, GetNoderedInstanceOptions } from '../Message/GetNoderedInstanceMessage';
import { GetTokenFromSAMLOptions, RenewTokenOptions, SigninMessage, SigninWithTokenOptions, SigninWithUsernameOptions } from '../Message/SigninMessage';
import { RegisterQueueMessage, RegisterQueueOptions } from '../Message/RegisterQueueMessage';
import { ListCollectionsMessage, ListCollectionsOptions } from '../Message/ListCollectionsMessage';
import { EnsureNoderedInstanceMessage, DeleteNoderedInstanceMessage, RestartNoderedInstanceMessage, StartNoderedInstanceMessage, StopNoderedInstanceMessage, DropCollectionMessage, DeleteNoderedPodMessage, GetNoderedInstanceLogMessage, stripe_customer, StripeCancelPlanMessage, StripeAddPlanMessage, stripe_base, StripeMessage, TokenUser, UnWatchMessage, GetDocumentVersionMessage, InsertManyMessage, QueueClosedMessage, ExchangeClosedMessage, WellknownIds, Rights, Ace, EnsureCustomerMessage, SelectCustomerMessage, GetNextInvoiceMessage, subscription_item, stripe_invoice, AddWorkitemMessage, AddWorkitemQueueMessage, AddWorkitemQueueOptions, AddWorkitemsMessage, AddWorkitemsOptions, DeleteWorkitemMessage, DeleteWorkitemOptions, DeleteWorkitemQueueMessage, DeleteWorkitemQueueOptions, GetWorkitemQueueMessage, PopWorkitemMessage, PopWorkitemOptions, UpdateWorkitemMessage, UpdateWorkitemOptions, UpdateWorkitemQueueMessage, UpdateWorkitemQueueOptions, Workitem, WorkitemQueue, GetKubeNodeLabelsMessage, CloseQueueMessage } from '..';
import { WatchMessage, WatchOptions } from '../Message/WatchMessage';
import { RegisterExchangeMessage, RegisterExchangeOptions } from '../Message/RegisterExchangeMessage';
import { GetDocumentVersionOptions } from '../Message/GetDocumentVersionMessage';
import { InsertManyOptions } from '../Message/InsertManyMessage';
import { UnWatchOptions } from '../Message/UnWatchMessage';
import { GetKubeNodeLabelsOptions } from '../Message/GetKubeNodeLabelsMessage';
import { GetNoderedInstanceLogOptions } from '../Message/GetNoderedInstanceLogMessage';
import { CloseQueueOptions } from '../Message/CloseQueueMessage';
import { DropCollectionOptions } from '../Message/DropCollectionMessage';
import { EnsureNoderedInstanceOptions } from '../Message/EnsureNoderedInstanceMessage';
import { DeleteNoderedInstanceOptions } from '../Message/DeleteNoderedInstanceMessage';
import { DeleteNoderedPodOptions } from '../Message/DeleteNoderedPodMessage';
import { RestartNoderedInstanceOptions } from '../Message/RestartNoderedInstanceMessage';
import { StartNoderedInstanceOptions } from '../Message/StartNoderedInstanceMessage';
import { StopNoderedInstanceOptions } from '../Message/StopNoderedInstanceMessage';
import { StripeAddPlanOptions } from '../Message/StripeAddPlanMessage';
import { StripeCancelPlanOptions } from '../Message/StripeCancelPlanMessage';
import { GetNextInvoiceOptions } from '../Message/GetNextInvoiceMessage';
import { StripeOptions } from '../Message/StripeMessage';
import { EnsureCustomerOptions } from '../Message/EnsureCustomerMessage';
import { SelectCustomerOptions } from '../Message/SelectCustomerMessage';
import { CreateWorkflowInstanceMessage, CreateWorkflowInstanceOptions } from '../Message/CreateWorkflowInstanceMessage';

// export type messageQueueCallback = (msg: QueueMessage) => void;
export type QueueOnMessage = (msg: QueueMessage, ack: any) => void;
export type QueueClosed = (msg: QueueClosedMessage) => void;
export type ExchangeClosed = (msg: ExchangeClosedMessage) => void;
export type WatchOnMessage = (msg: any) => void;
export interface IHashTable<T> {
    [key: string]: T;
}
export declare class RegisterExchangeResponse {
    exchangename: string;
    queuename: string;
}
export type HouseKeepingOptions = {
    priority?: number,
    jwt?: string,
    skipnodered?: boolean,
    skipcalculatesize?: boolean,
    skipupdateusersize?: boolean,
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
        // crypto.randomBytes(16).toString("hex")
        return Math.random().toString(36).substr(2, 9);
    }


    public static async GetRole(id: string, name: string): Promise<Base> {
        let res: any[];
        if (NoderedUtil.IsNullEmpty(id)) {
            res = await NoderedUtil.Query({ query: { _type: 'role', name }, collectionname: 'users', top: 2 });
        } else {
            res = await NoderedUtil.Query({ query: { _type: 'role', _id: id }, collectionname: 'users', top: 2 });
        }
        if (res.length === 1) {
            return res[0];
        } else if (res.length === 2) {
            // tslint:disable-next-line: no-console
            console.error('Found more than one !');
        }
        return null;
    }

    public static async Query(options: QueryOptions): Promise<any[]> {
        const [q, priority] = QueryMessage.parse(options);
        q.query = JSON.stringify(q.query, (key, value) => {
            if (value == null) return value;
            const t = typeof value;
            if (value instanceof RegExp) return '__REGEXP ' + value.toString();
            else if (t === 'object') {
                if (value.constructor != null && value.constructor.name === 'RegExp') {
                    return '__REGEXP ' + value.toString();
                }
                return value;
            } else return value;
        });
        const _msg: Message = new Message();
        _msg.command = 'query';
        _msg.data = JSON.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(_msg, priority);
        return result.result;
    }
    public static async GetDocumentVersion(options: GetDocumentVersionOptions): Promise<any> {
        const [q, priority] = GetDocumentVersionMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'getdocumentversion';
        _msg.data = JSON.stringify(q);
        const result: GetDocumentVersionMessage = await WebSocketClient.instance.Send<GetDocumentVersionMessage>(_msg, priority);
        return result.result;
    }
    public static async InsertOne(options: InsertOneOptions): Promise<any> {
        const [q, priority] = InsertOneMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'insertone';
        _msg.data = JSON.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(_msg, priority);
        return result.result;
    }
    public static async InsertMany(options: InsertManyOptions): Promise<any[]> {
        const [q, priority] = InsertManyMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'insertmany';
        _msg.data = JSON.stringify(q);
        const result: InsertManyMessage = await WebSocketClient.instance.Send<InsertManyMessage>(_msg, priority);
        return result.results;
    }
    public static async UpdateOne(options: UpdateOneOptions): Promise<any> {
        const [q, priority] = UpdateOneMessage.parse(options);
        const result = await NoderedUtil._UpdateOne(q, priority);
        return result.result;
    }
    public static async _UpdateOne(q: UpdateOneMessage, priority: number): Promise<UpdateOneMessage> {
        const _msg: Message = new Message();
        _msg.command = 'updateone';
        _msg.data = JSON.stringify(q);
        const result: UpdateOneMessage = await WebSocketClient.instance.Send<UpdateOneMessage>(_msg, priority);
        return result;
    }
    public static async UpdateMany(options: UpdateManyOptions): Promise<any> {
        const [q, priority] = UpdateOneMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'updatemany';
        _msg.data = JSON.stringify(q);
        const result: UpdateManyMessage = await WebSocketClient.instance.Send<UpdateManyMessage>(_msg, priority);
        return result;
    }
    public static async InsertOrUpdateOne(options: InsertOrUpdateOneOptions): Promise<any> {
        const [q, priority] = InsertOrUpdateOneMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'insertorupdateone';
        _msg.data = JSON.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(_msg, priority);
        return result.result;
    }
    public static async DeleteOne(options: DeleteOneOptions): Promise<any> {
        const [q, priority] = DeleteOneMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'deleteone';
        _msg.data = JSON.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(_msg, priority);
        return result.result;
    }
    public static async DeleteMany(options: DeleteManyOptions): Promise<number> {
        const [q, priority] = DeleteManyMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'deletemany';
        _msg.data = JSON.stringify(q);
        const result: DeleteManyMessage = await WebSocketClient.instance.Send<DeleteManyMessage>(_msg, priority);
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
        priority: number
    ): Promise<any> {
        const q: MapReduceMessage = new MapReduceMessage(map, reduce, finalize, query, out);
        q.collectionname = collection;
        q.scope = scope;
        q.jwt = jwt;
        const msg: Message = new Message();
        msg.command = 'mapreduce';
        q.out = out;
        msg.data = JSONfn.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(msg, priority);
        return result.result;
    }

    public static async Aggregate(options: AggregateOptions): Promise<any> {
        const [q, priority] = AggregateMessage.parse(options);
        const msg: Message = new Message();
        msg.command = 'aggregate';
        msg.data = JSONfn.stringify(q);
        const result: QueryMessage = await WebSocketClient.instance.Send<QueryMessage>(msg, priority);
        return result.result;
    }
    public static watchcb: IHashTable<WatchOnMessage> = {};
    public static async Watch(options: WatchOptions): Promise<any> {
        const [q, priority, callback] = WatchMessage.parse(options);
        const msg: Message = new Message();
        msg.command = 'watch';
        msg.data = JSONfn.stringify(q);
        const result: WatchMessage = await WebSocketClient.instance.Send<WatchMessage>(msg, priority);
        if (!NoderedUtil.IsNullEmpty(result.id)) NoderedUtil.watchcb[result.id] = callback;
        return result.id;
    }
    public static async UnWatch(options: UnWatchOptions): Promise<void> {
        const [q, priority] = UnWatchMessage.parse(options);
        const msg: Message = new Message();
        msg.command = 'unwatch';
        msg.data = JSONfn.stringify(q);
        const result: WatchMessage = await WebSocketClient.instance.Send<WatchMessage>(msg, priority);
        if (NoderedUtil.watchcb != null && NoderedUtil.watchcb[q.id] != null) {
            delete NoderedUtil.watchcb[q.id];
        }
    }

    public static async GetFile(options: GetFileOptions): Promise<GetFileMessage> {
        const [q, priority] = GetFileMessage.parse(options);
        const msg: Message = new Message();
        msg.command = 'getfile';
        msg.data = JSONfn.stringify(q);
        const result: GetFileMessage = await WebSocketClient.instance.Send<GetFileMessage>(msg, priority);
        return result;
    }

    public static async SaveFile(options: SaveFileOptions): Promise<SaveFileMessage> {
        const [q, priority] = SaveFileMessage.parse(options);
        const msg: Message = new Message();
        msg.command = 'savefile';
        msg.data = JSONfn.stringify(q);
        const result: SaveFileMessage = await WebSocketClient.instance.Send<SaveFileMessage>(msg, priority);
        return result;
    }
    public static async GetKubeNodeLabels(options: GetKubeNodeLabelsOptions): Promise<any[]> {
        const [q, priority] = GetKubeNodeLabelsMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'getkubenodelabels';
        _msg.data = JSON.stringify(q);
        const result: GetKubeNodeLabelsMessage = await WebSocketClient.instance.Send<GetKubeNodeLabelsMessage>(_msg, priority);
        return result.result;
    }
    public static async GetNoderedInstance(options: GetNoderedInstanceOptions): Promise<any[]> {
        const [q, priority] = GetKubeNodeLabelsMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'getnoderedinstance';
        _msg.data = JSON.stringify(q);
        const result: GetNoderedInstanceMessage = await WebSocketClient.instance.Send<GetNoderedInstanceMessage>(_msg, priority);
        return result.results;
    }
    public static async GetNoderedInstanceLog(options: GetNoderedInstanceLogOptions): Promise<string> {
        const [q, priority] = GetNoderedInstanceLogMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'getnoderedinstancelog';
        _msg.data = JSON.stringify(q);
        const result: GetNoderedInstanceLogMessage = await WebSocketClient.instance.Send<GetNoderedInstanceLogMessage>(_msg, priority);
        return result.result;
    }


    static isNumeric(num) {
        return !isNaN(num);
    }
    // public static async Signin(options: RenewTokenOptions): Promise<SigninMessage> {
    //     const [q, priority] = SigninMessage.parse(options);
    //     const _msg: Message = new Message();
    //     _msg.command = 'signin';
    //     _msg.data = JSON.stringify(q);
    //     const result: SigninMessage = await WebSocketClient.instance.Send<SigninMessage>(_msg, priority);
    //     return result;
    // }
    public static async RenewToken(options: RenewTokenOptions): Promise<SigninMessage> {
        const [q, priority] = SigninMessage.parserenew(options);
        const _msg: Message = new Message();
        _msg.command = 'signin';
        _msg.data = JSON.stringify(q);
        const result: SigninMessage = await WebSocketClient.instance.Send<SigninMessage>(_msg, priority);
        return result;
    }
    public static async GetTokenFromSAML(options: GetTokenFromSAMLOptions): Promise<SigninMessage> {
        const [q, priority] = SigninMessage.parsefromsaml(options);
        const _msg: Message = new Message();
        _msg.command = 'signin';
        _msg.data = JSON.stringify(q);
        const result: SigninMessage = await WebSocketClient.instance.Send<SigninMessage>(_msg, priority);
        return result;
    }
    public static async SigninWithToken(options: SigninWithTokenOptions): Promise<SigninMessage> {
        const [q, priority] = SigninMessage.parsesigninwithtoken(options);
        const _msg: Message = new Message();
        _msg.command = 'signin';
        _msg.data = JSON.stringify(q);
        const result: SigninMessage = await WebSocketClient.instance.Send<SigninMessage>(_msg, priority);
        WebSocketClient.instance.user = result.user;
        WebSocketClient.instance.jwt = result.jwt;
        WebSocketClient.instance.supports_watch = result.supports_watch;
        WebSocketClient.instance.websocket_package_size = result.websocket_package_size;
        return result;
    }
    public static async SigninWithUsername(options: SigninWithUsernameOptions): Promise<SigninMessage> {
        const [q, priority] = SigninMessage.parsesigninwithpassword(options);
        const _msg: Message = new Message();
        _msg.command = 'signin';
        _msg.data = JSON.stringify(q);
        const result: SigninMessage = await WebSocketClient.instance.Send<SigninMessage>(_msg, priority);
        WebSocketClient.instance.user = result.user;
        WebSocketClient.instance.jwt = result.jwt;
        WebSocketClient.instance.supports_watch = result.supports_watch;
        WebSocketClient.instance.websocket_package_size = result.websocket_package_size;
        return result;
    }
    public static messageQueuecb: IHashTable<QueueOnMessage> = {};
    public static messageQueueclosedcb: IHashTable<QueueClosed> = {};
    public static messageExchangeclosedcb: IHashTable<ExchangeClosed> = {};
    public static async RegisterQueue(options: RegisterQueueOptions): Promise<string> {
        const [q, priority, websocket, callback, closedcallback] = RegisterQueueMessage.parse(options);
        const msg: Message = new Message();
        msg.command = 'registerqueue';
        msg.data = JSON.stringify(q);
        const result: RegisterQueueMessage = await websocket.Send(msg, priority);
        if (result && !NoderedUtil.IsNullEmpty(result.queuename)) {
            NoderedUtil.messageQueuecb[result.queuename] = callback;
            NoderedUtil.messageQueueclosedcb[result.queuename] = closedcallback;
            return result.queuename;
        }
        return null;
    }
    public static async CloseQueue(options: CloseQueueOptions): Promise<void> {
        const [q, priority, websocket] = CloseQueueMessage.parse(options);
        const msg: Message = new Message();
        msg.command = 'closequeue';
        msg.data = JSON.stringify(q);
        const result: CloseQueueMessage = await websocket.Send(msg, priority);
        if (result && !NoderedUtil.IsNullEmpty(result.queuename)) {
            delete NoderedUtil.messageQueuecb[result.queuename];
            delete NoderedUtil.messageQueueclosedcb[result.queuename];
        } else {
            return;
        }
    }
    public static async RegisterExchange(options: RegisterExchangeOptions): Promise<RegisterExchangeResponse> {
        const [q, priority, websocket, callback, closedcallback] = RegisterExchangeMessage.parse(options);
        const msg: Message = new Message();
        msg.command = 'registerexchange';
        msg.data = JSON.stringify(q);
        const result: RegisterExchangeMessage = await websocket.Send(msg, priority);
        if (result && !NoderedUtil.IsNullEmpty(result.exchangename) && !NoderedUtil.IsNullEmpty(result.queuename)) {
            NoderedUtil.messageQueuecb[result.queuename] = callback;
            NoderedUtil.messageExchangeclosedcb[result.exchangename] = closedcallback;
            return { exchangename: result.exchangename, queuename: result.queuename };
        }
        return null;
    }
    public static async Queue(options: QueueOptions): Promise<void> {
        const [q, priority, websocket] = QueueMessage.parse(options);
        const msg: Message = new Message();
        msg.command = 'queuemessage';
        msg.data = JSON.stringify(q);
        await websocket.Send(msg, priority);
    }
    public static async ListCollections(options: ListCollectionsOptions): Promise<any[]> {
        const [q, priority, websocket] = ListCollectionsMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'listcollections';
        _msg.data = JSON.stringify(q);
        const result: ListCollectionsMessage = await websocket.Send<ListCollectionsMessage>(_msg, priority);
        return result.result;
    }
    public static async DropCollection(options: DropCollectionOptions): Promise<void> {
        const [q, priority, websocket] = DropCollectionMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'dropcollection';
        _msg.data = JSON.stringify(q);
        await websocket.Send<DropCollectionMessage>(_msg, priority);
    }
    public static async EnsureNoderedInstance(options: EnsureNoderedInstanceOptions): Promise<void> {
        const [q, priority, websocket] = EnsureNoderedInstanceMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'ensurenoderedinstance';
        _msg.data = JSON.stringify(q);
        await websocket.Send<EnsureNoderedInstanceMessage>(_msg, priority);
    }
    public static async DeleteNoderedInstance(options: DeleteNoderedInstanceOptions): Promise<void> {
        const [q, priority, websocket] = DeleteNoderedInstanceMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'deletenoderedinstance';
        _msg.data = JSON.stringify(q);
        await websocket.Send<EnsureNoderedInstanceMessage>(_msg, priority);
    }
    public static async DeleteNoderedPod(options: DeleteNoderedPodOptions): Promise<void> {
        const [q, priority, websocket] = DeleteNoderedPodMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'deletenoderedpod';
        _msg.data = JSON.stringify(q);
        await websocket.Send<DeleteNoderedPodMessage>(_msg, priority);
    }
    public static async RestartNoderedInstance(options: RestartNoderedInstanceOptions): Promise<void> {
        const [q, priority, websocket] = RestartNoderedInstanceMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'restartnoderedinstance';
        _msg.data = JSON.stringify(q);
        await websocket.Send<RestartNoderedInstanceMessage>(_msg, priority);
    }
    public static async StartNoderedInstance(options: StartNoderedInstanceOptions): Promise<void> {
        const [q, priority, websocket] = StartNoderedInstanceMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'startnoderedinstance';
        _msg.data = JSON.stringify(q);
        await websocket.Send<StartNoderedInstanceMessage>(_msg, priority);
    }
    public static async StopNoderedInstance(options: StopNoderedInstanceOptions): Promise<void> {
        const [q, priority, websocket] = StopNoderedInstanceMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'stopnoderedinstance';
        _msg.data = JSON.stringify(q);
        await websocket.Send<StopNoderedInstanceMessage>(_msg, priority);
    }
    public static async StripeAddPlan(options: StripeAddPlanOptions): Promise<StripeAddPlanMessage> {
        const [q, priority, websocket] = StripeAddPlanMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'stripeaddplan';
        _msg.data = JSON.stringify(q);
        const result = await websocket.Send<StripeAddPlanMessage>(_msg, priority);
        return result;
    }
    public static async StripeCancelPlan(options: StripeCancelPlanOptions): Promise<void> {
        const [q, priority, websocket] = StripeCancelPlanMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'stripecancelplan';
        _msg.data = JSON.stringify(q);
        await websocket.Send<StripeCancelPlanMessage>(_msg, priority);
    }
    public static async StripeAddPlanUsage(date: Date, amount: number, siid: string, jwt: string, priority: number): Promise<void> {
        const dt = parseInt((new Date(date).getTime() / 1000).toFixed(0))
        const payload: any = { "quantity": amount, "timestamp": dt };
        this.Stripe({ method: "POST", object: "usage_records", id: siid, payload, jwt, priority });
    }
    public static async GetNextInvoice(options: GetNextInvoiceOptions): Promise<stripe_invoice> {
        const [q, priority, websocket] = GetNextInvoiceMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'getnextinvoice';
        _msg.data = JSON.stringify(q);
        const result = await websocket.Send<GetNextInvoiceMessage>(_msg, priority);
        return result.invoice;
    }

    public static async Stripe<T extends stripe_base>(options: StripeOptions): Promise<T> {
        const [q, priority, websocket] = StripeMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'stripemessage';
        _msg.data = JSON.stringify(q);
        const result = await websocket.Send<StripeMessage>(_msg, priority);
        return result.payload as T;
    }
    public static async EnsureCustomer(options: EnsureCustomerOptions): Promise<EnsureCustomerMessage> {
        const [q, priority, websocket] = EnsureCustomerMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'ensurecustomer';
        _msg.data = JSON.stringify(q);
        const result = await websocket.Send<EnsureCustomerMessage>(_msg, priority);
        return result;
    }
    public static async SelectCustomer(options: SelectCustomerOptions): Promise<void> {
        const [q, priority, websocket] = SelectCustomerMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'selectcustomer';
        _msg.data = JSON.stringify(q);
        await websocket.Send<SelectCustomerMessage>(_msg, priority);
    }
    public static async HouseKeeping(options: HouseKeepingOptions): Promise<void> {
        let { priority, jwt, skipnodered, skipcalculatesize, skipupdateusersize } = Object.assign({
            priority: 2,
            skipnodered: false,
            skipcalculatesize: false,
            skipupdateusersize: false,
        }, options);
        const _msg: Message = new Message();
        _msg.command = 'housekeeping';
        _msg.data = JSON.stringify({ jwt, skipnodered, skipcalculatesize, skipupdateusersize });
        await WebSocketClient.instance.Send<EnsureCustomerMessage>(_msg, priority);
    }
    /**
    * Validated user has rights to perform the requested action ( create is missing! )
    * @param  {TokenUser} user User requesting permission
    * @param  {any} item Item permission is needed on
    * @param  {Rights} action Permission wanted (create, update, delete)
    * @returns boolean Is allowed
    */
    public static hasAuthorization(user: TokenUser, item: Base, action: number): boolean {
        if (user._id === WellknownIds.root) { return true; }
        if (action === Rights.create || action === Rights.delete) {
            if (item._type === "role") {
                if (item.name.toLowerCase() === "users" || item.name.toLowerCase() === "admins" || item.name.toLowerCase() === "workflow") {
                    return false;
                }
            }
            if (item._type === "user") {
                if (item.name === "workflow") {
                    return false;
                }
            }
        }
        if (action === Rights.update && item._id === WellknownIds.admins && item.name.toLowerCase() !== "admins") {
            return false;
        }
        if (action === Rights.update && item._id === WellknownIds.users && item.name.toLowerCase() !== "users") {
            return false;
        }
        if (action === Rights.update && item._id === WellknownIds.root && item.name.toLowerCase() !== "root") {
            return false;
        }
        if ((item as any).userid === user.username || (item as any).userid === user._id || (item as any).user === user.username) {
            return true;
        } else if (item._id === user._id) {
            if (action === Rights.delete) { return false; }
            return true;
        }

        if (item._acl != null && item._acl != undefined) {
            if (typeof item._acl === 'string' || item._acl instanceof String) {
                item._acl = JSON.parse((item._acl as any));
            }

            const a = item._acl.filter(x => x._id === user._id);
            if (a.length > 0) {
                if (Ace.isBitSet(a[0], action)) return true;
            }
            for (let i = 0; i < user.roles.length; i++) {
                const b = item._acl.filter(x => x._id === user.roles[i]._id);
                if (b.length > 0) {
                    if (Ace.isBitSet(b[0], action)) return true;
                }
            }
            return false;
        }
        return true;
    }
    public static async AddWorkitem(options: AddWorkitemOptions): Promise<Workitem> {
        const [q, priority, websocket] = AddWorkitemMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'addworkitem';
        _msg.data = JSON.stringify(q);
        const result: AddWorkitemMessage = await websocket.Send<AddWorkitemMessage>(_msg, priority);
        return result.result;
    }
    public static async AddWorkitems(options: AddWorkitemsOptions): Promise<void> {
        const [q, priority, websocket] = AddWorkitemsMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'addworkitems';
        _msg.data = JSON.stringify(q);
        const result: AddWorkitemsMessage = await websocket.Send<AddWorkitemsMessage>(_msg, priority);
    }
    public static async UpdateWorkitem(options: UpdateWorkitemOptions): Promise<Workitem> {
        const [q, priority, websocket] = UpdateWorkitemMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'updateworkitem';
        _msg.data = JSON.stringify(q);
        const result: UpdateWorkitemMessage = await websocket.Send<UpdateWorkitemMessage>(_msg, priority);
        return result.result;
    }
    public static async PopWorkitem(options: PopWorkitemOptions): Promise<Workitem> {
        const [q, priority, websocket] = PopWorkitemMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'popworkitem';
        _msg.data = JSON.stringify(q);
        const result: PopWorkitemMessage = await websocket.Send<PopWorkitemMessage>(_msg, priority);
        return result.result;
    }
    public static async DeleteWorkitem(options: DeleteWorkitemOptions): Promise<void> {
        const [q, priority, websocket] = DeleteWorkitemMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'deleteworkitem';
        _msg.data = JSON.stringify(q);
        await websocket.Send<DeleteWorkitemMessage>(_msg, priority);
    }
    public static async AddWorkitemQueue(options: AddWorkitemQueueOptions): Promise<WorkitemQueue> {
        const [q, priority, websocket] = AddWorkitemQueueMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'addworkitemqueue';
        _msg.data = JSON.stringify(q);
        const result: AddWorkitemQueueMessage = await websocket.Send<AddWorkitemQueueMessage>(_msg, priority);
        return result.result;
    }
    public static async GetWorkitemQueue(options: GetWorkitemQueueOptions): Promise<WorkitemQueue> {
        const [q, priority, websocket] = GetWorkitemQueueMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'getworkitemqueue';
        _msg.data = JSON.stringify(q);
        const result: GetWorkitemQueueMessage = await websocket.Send<GetWorkitemQueueMessage>(_msg, priority);
        return result.result;
    }
    public static async UpdateWorkitemQueue(options: UpdateWorkitemQueueOptions): Promise<WorkitemQueue> {
        const [q, priority, websocket] = UpdateWorkitemQueueMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'updateworkitemqueue';
        _msg.data = JSON.stringify(q);
        const result: UpdateWorkitemQueueMessage = await websocket.Send<UpdateWorkitemQueueMessage>(_msg, priority);
        return result.result;
    }
    public static async DeleteWorkitemQueue(options: DeleteWorkitemQueueOptions): Promise<void> {
        const [q, priority, websocket] = DeleteWorkitemQueueMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'deleteworkitemqueue';
        _msg.data = JSON.stringify(q);
        const result: DeleteWorkitemQueueMessage = await websocket.Send<DeleteWorkitemQueueMessage>(_msg, priority);
    }
    public static async CreateWorkflowInstance(options: CreateWorkflowInstanceOptions): Promise<string> {
        const [q, priority, websocket] = CreateWorkflowInstanceMessage.parse(options);
        const _msg: Message = new Message();
        _msg.command = 'createworkflowinstance';
        _msg.data = JSON.stringify(q);
        const result: CreateWorkflowInstanceMessage = await WebSocketClient.instance.Send<CreateWorkflowInstanceMessage>(
            _msg, priority
        );
        return result.newinstanceid;
    }

}

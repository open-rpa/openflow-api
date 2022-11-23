import { Message } from './nodeclient/Message';
import { NoderedUtil } from './nodeclient/NoderedUtil';
import { QueuedMessage, QueuedMessageCallback } from './Message/QueuedMessage';
import { SocketMessage } from './Message/SocketMessage';
import { TokenUser } from './nodeclient/TokenUser';
import { CustomEventEmitter } from './events';
import { ApiConfig } from './ApiConfig';
interface IHashTable<T> {
  [key: string]: T;
}

declare const WebSocket: {
  prototype: WebSocket;
  new(url: string, protocols?: string | string[]): WebSocket;
  readonly CLOSED: number;
  readonly CLOSING: number;
  readonly CONNECTING: number;
  readonly OPEN: number;
};

export class WebSocketClient {
  public messageStore = null;
  private messageCounter: number = 0;
  public _logger: any;
  private _url: string;
  private _socketObject: WebSocket = null;
  public static instance: WebSocketClient = null;
  private _receiveQueue: SocketMessage[] = [];
  private _sendQueue: SocketMessage[] = [];
  public user: TokenUser;
  public jwt: string;
  // tslint:disable-next-line: variable-name
  public supports_watch: boolean = false;
  public websocket_package_size: number = 500;
  public messageQueue: IHashTable<QueuedMessage> = {};
  public update_message_queue_count: any;
  public events: CustomEventEmitter = null;
  private pinghandle: NodeJS.Timeout = null;
  private processqueuehandle: NodeJS.Timeout = null;
  // Remove again
  public version: string = "0.0.1";
  public agent: string = "webapp";
  public usingCordova: boolean = false;
  public oneSignalId: string = "";
  public device: any = null;
  public location: any = null;
  public lastheartbeat: Date = new Date();
  public max_message_queue_time_seconds: number = 3600;
  constructor(logger: any, url: string, skipconnect: boolean = false) {
    this._logger = logger;
    if (!this._logger) {
      this._logger = {
        info(msg) { console.log(msg); },
        verbose(msg) { console.debug(msg); },
        error(msg) { console.error(msg); },
        debug(msg) { console.debug(msg); },
        silly(msg) { console.debug(msg); }
      }
    }
    this._url = url;
    if (ApiConfig.log_information) this._logger.info('connecting to ' + url);
    this.events = new CustomEventEmitter();
    this.events.setMaxListeners(200);

    if (!skipconnect) this.connect();
    if (WebSocketClient.instance === null) {
      WebSocketClient.instance = this;
    }

    this.pinghandle = setInterval(this.pingServer.bind(this), 10000);
  }
  public async Connect() {
    return new Promise<void>((resolve, reject) => {
      var resolved = false;
      var onerror = (err) => {
        if (!resolved) { reject(err); resolved = true; }
      };
      var onopen = () => {
        if (!resolved) { resolve(); resolved = true; }
        this.events.removeListener("onerror", onerror);
        this.events.removeListener("onclose", onclose);
        this.events.removeListener("onopen", onopen);
      }
      var onclose = () => {
        if (!resolved) { reject(); resolved = true; }
        this.events.removeListener("onerror", onerror);
        this.events.removeListener("onclose", onclose);
        this.events.removeListener("onopen", onopen);
      }
      this.events.on("onerror", onerror);
      this.events.on("onclose", onclose);
      this.events.on("onopen", onopen);
      this.connect();
    });
  }
  public close(code: number, message: string): void {
    if (ApiConfig.log_information) this._logger.verbose('websocket.close');
    if (this._socketObject !== null) {
      this._socketObject.onopen = null;
      this._socketObject.onmessage = null;
      this._socketObject.onclose = null;
      this._socketObject.onerror = null;
      try {
        this._socketObject.close(code, message);
      } catch (error) {
        if (ApiConfig.log_error) this._logger.error(error);
      }
      try {
        if ((this._socketObject as any).terminate) {
          (this._socketObject as any).terminate();
        }        
      } catch (error) {
        if (ApiConfig.log_error) this._logger.error(error);
      }
      this._socketObject = null;
    }
    if (this.pinghandle != null) {
      clearTimeout(this.pinghandle);
      this.pinghandle = null;
    }
    if (this.processqueuehandle != null) {
      clearTimeout(this.processqueuehandle);
      this.processqueuehandle = null;
    }
    if (WebSocketClient.instance === this) {
      WebSocketClient.instance = null
    }
    // this.events.removeAllListeners();
    // this.events = null;
    // WebSocketClient.instance = this;
  }
  public async connect(): Promise<void> {
    try {
      if (
        this._socketObject !== null &&
        this._socketObject.readyState !== this._socketObject.OPEN &&
        this._socketObject.readyState !== this._socketObject.CONNECTING
      ) {
        this._socketObject.onopen = null;
        this._socketObject.onmessage = null;
        this._socketObject.onclose = null;
        this._socketObject.onerror = null;
        this._socketObject = null;
      }
      try {
        if (this.messageStore) {
          const items: any = await this.messageStore.load();
          this.messageCounter = items.files.length;
        }
      } catch (error) {
        if (ApiConfig.log_error) this._logger.error(error);
      }
      if (this._socketObject === null) {
        const options: any = {
          rejectUnauthorized: false,
          strictSSL: false,
        };
        if (!NoderedUtil.isNodeJS()) {
          try {
            if (ApiConfig.log_trafic_verbose) this._logger.debug('Create as javascript WebSocket, using options', options);
            this._socketObject = new WebSocket(this._url, []);
            // tslint:disable-next-line: no-empty
          } catch (error) {
            if (ApiConfig.log_error) this._logger.error(error);
          }
        }
        // tslint:disable-next-line: no-empty
        if (this._socketObject == null) {
          if (ApiConfig.log_trafic_verbose) this._logger.debug('Create as universal-websocket-client, using options', options);
          const _ws: any = require('universal-websocket-client');
          this._socketObject = new _ws(this._url, options);
        }
        this._socketObject.onopen = this.onopen.bind(this);
        this._socketObject.onmessage = this.onmessage.bind(this);
        this._socketObject.onclose = this.onclose.bind(this);
        this._socketObject.onerror = this.onerror.bind(this);
      }
    } catch (error) {
      if (ApiConfig.log_error) this._logger.error(error);
    }
    // _ CLOSED:3
    // _ CLOSING:2
    // _ OPEN:1
    // _ CONNECTING:0
  }
  public isConnected(): boolean {
    if (this._socketObject === null || this._socketObject.readyState !== this._socketObject.OPEN) {
      return false;
    }
    return true;
  }
  public pingServer(): void {
    try {
      if (this._socketObject !== null && this._socketObject.readyState === this._socketObject.OPEN) {
        const msg: SocketMessage = SocketMessage.fromcommand('ping');
        this._socketObject.send(JSON.stringify(msg));
      }
      let readyState: number = -1;
      if (this._socketObject !== null) readyState = this._socketObject.readyState;
      if (readyState !== 0 && readyState !== 1) {
        // CLOSED = 3
        // CLOSING = 2
        // OPEN = 1
        // CONNECTING = 0
        this.connect();
      }
    } catch (error) {
      if (ApiConfig.log_error) this._logger.error(error);
      this.connect();
    }
  }
  private async onopen(evt: Event): Promise<void> {
    if (ApiConfig.log_information) this._logger.debug("WebSocketclient::onopen");
    this.user = null;
    this.events.emit('onopen');
    // used in old websocket client
    this.events.emit('connect');
  }
  private onclose(evt: CloseEvent): void {
    if (ApiConfig.log_information) this._logger.debug("WebSocketclient::onclose");
    this.user = null;
    this.events.emit('onclose');
  }
  private onerror(evt: ErrorEvent): void {
    if (ApiConfig.log_information) this._logger.debug("WebSocketclient::onerror");
    this.events.emit('onclose', evt.message);
  }
  private onmessage(evt: MessageEvent): void {
    try {
      if (ApiConfig.log_trafic_silly) this._logger.silly('[RESC] socket recevied');
      if (ApiConfig.log_trafic_silly) this._logger.silly(evt);
      const msg: SocketMessage = SocketMessage.fromjson(evt.data);
      this._receiveQueue.push(msg);
      this.ProcessQueue.bind(this)();
    } catch (error) {
      this._logger.error(error);
    }
  }
  public async Send<T>(message: Message, priority: number): Promise<T> {
    if (NoderedUtil.IsNullEmpty(message.id)) message.id = NoderedUtil.GetUniqueIdentifier();
    if (message.command !== 'pong') {
      let reply = message.replyto;
      if (NoderedUtil.IsNullEmpty(reply)) reply = '';
      if (ApiConfig.log_trafic_verbose) this._logger.verbose('[SEND][' + message.command + '][' + message.id + '][' + reply + ']');
      if (ApiConfig.log_trafic_silly) this._logger.silly('[SEND][' + message.command + '][' + message.id + '][' + reply + ']');
    }
    return new Promise<T>(async (resolve, reject) => {
      this._Send(
        message,
        ((msg: any) => {
          if (msg.error !== null && msg.error !== undefined) {
            return reject(msg.error);
          }
          resolve(msg);
        }).bind(this),
        priority
      );
    });
  }
  private _Send(message: Message, cb: QueuedMessageCallback, priority: number): void {
    const messages: string[] = this.chunkString(message.data, this.websocket_package_size);
    if (messages === null || messages === undefined || messages.length === 0) {
      const singlemessage: SocketMessage = SocketMessage.frommessage(message, '', 1, 0);
      if (message.replyto === null || message.replyto === undefined) {
        this.messageQueue[singlemessage.id] = new QueuedMessage(singlemessage, cb);
        if (this.update_message_queue_count) this.update_message_queue_count(this);
      }
      singlemessage.priority = message.priority;
      this._sendQueue.push(singlemessage);
      return;
    }
    if (message.id === null || message.id === undefined) {
      message.id = NoderedUtil.GetUniqueIdentifier();
    }
    message.priority = priority;
    for (let i: number = 0; i < messages.length; i++) {
      const _message: SocketMessage = SocketMessage.frommessage(message, messages[i], messages.length, i);
      _message.priority = message.priority;
      this._sendQueue.push(_message);
    }
    if (message.replyto === null || message.replyto === undefined) {
      this.messageQueue[message.id] = new QueuedMessage(message, cb);
      if (this.update_message_queue_count) this.update_message_queue_count(this);
    }

    const keys = Object.keys(this.messageQueue);
    for (var i = 0; i < keys.length; i++) {
      const key = keys[i];
      var msg = this.messageQueue[key];
      var from = new Date(msg.timestamp);
      const now = new Date();
      const seconds = (now.getTime() - from.getTime()) / 1000;
      if (seconds > this.max_message_queue_time_seconds) {
        if (ApiConfig.log_information) console.log("Deleting message " + key + " that is more " + this.max_message_queue_time_seconds + " seconds old (" + seconds + ")");
        delete this.messageQueue[key];
      }
    }
    if (this.update_message_queue_count) {
      const keys2 = Object.keys(this.messageQueue);
      if (keys.length != keys2.length) this.update_message_queue_count(this);
    }

    if (this.processqueuehandle === null) {
      this.processqueuehandle = setTimeout(() => {
        this.processqueuehandle = null;
        this.ProcessQueue();
      }, 10);
    }
  }
  public chunkString(str: string, length: number): string[] {
    if (str === null || str === undefined) {
      return [];
    }
    // tslint:disable-next-line: quotemark
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
  }
  private async ProcessQueue(): Promise<void> {
    if (ApiConfig.log_trafic_silly) this._logger.silly('[ProcessQueue] start');
    try {
      const ids: string[] = [];
      this._receiveQueue.forEach((msg) => {
        if (ids.indexOf(msg.id) === -1) {
          ids.push(msg.id);
        }
      });
      if (ApiConfig.log_trafic_silly) this._logger.silly('[ProcessQueue] Process receive queue ' + this._receiveQueue.length);
      ids.forEach((id) => {
        try {
          const msgs: SocketMessage[] = this._receiveQueue.filter((msg: SocketMessage): boolean => {
            return msg.id === id;
          });
          msgs.sort((a, b) => a.index - b.index);
          const first: SocketMessage = msgs[0];
          if (first.count === msgs.length) {
            try {
              if (msgs.length === 1) {
                const singleresult: Message = Message.frommessage(first, first.data);
                singleresult.Process(this);
              } else {
                let buffer: string = '';
                msgs.forEach((msg) => {
                  if (msg.data !== null && msg.data !== undefined) {
                    buffer += msg.data;
                  }
                });
                const result: Message = Message.frommessage(first, buffer);
                result.Process(this);
              }
            } catch (error) {
              if (ApiConfig.log_error) this._logger.error(error);    
            }
            this._receiveQueue = this._receiveQueue.filter((msg: SocketMessage): boolean => {
              return msg.id !== id;
            });
          }
        } catch (error) {
          if (ApiConfig.log_error) this._logger.error(error);
        }
      });
    } catch (error) {
      if (ApiConfig.log_error) this._logger.error(error);
    }
    if (this._socketObject === null || this._socketObject.readyState !== this._socketObject.OPEN) {
      if (this.messageStore) {
        for (let i = this._sendQueue.length - 1; i >= 0; i--) {
          try {
            const msg = this._sendQueue[i];
            if (msg.command !== "unwatch" && msg.command !== "watch" && msg.command !== "signin") {
              this.messageStore.set(this.messageCounter, JSON.stringify(msg));
            }
            this._sendQueue.splice(i, 1);
            this.messageCounter++;
          } catch (error) {
            if (ApiConfig.log_error) this._logger.error(error);
          }
        }
      }
      if (ApiConfig.log_trafic_silly) {
        if (this._socketObject === null) {
          if (ApiConfig.log_trafic_silly) this._logger.silly('[ProcessQueue] socket not ready exit (_socketObject is null)');
        } else if (this._socketObject.readyState !== this._socketObject.OPEN) {
          if (ApiConfig.log_trafic_silly) this._logger.silly('[ProcessQueue] socket not ready exit (readyState is ' + this._socketObject.readyState + ' expected ' + this._socketObject.OPEN + ')');
        } else {
          if (ApiConfig.log_trafic_silly) this._logger.silly('[ProcessQueue] socket not ready exit');
        }
      }
      return;
    }
    if (this.messageCounter > 0 && this.user != null && this.messageStore) {
      const items: any = await this.messageStore.load();
      let bail: boolean = false;
      items.files.forEach(item => {
        try {
          if (!NoderedUtil.IsNullUndefinded(item) && !NoderedUtil.IsNullUndefinded(item.value)) {
            const msg = JSON.parse(item.value);
            this._sendQueue.push(msg);
          }
        } catch (error) {
          if (ApiConfig.log_error) this._logger.error(error);
          bail = true;
        }
      });
      if (!bail) {
        this.messageCounter = 0;
        this.messageStore.clear();
      }
    }
    if (ApiConfig.log_trafic_silly) this._logger.silly('[ProcessQueue] Process send queue ' + this._sendQueue.length);
    this._sendQueue.forEach((msg) => {
      try {
        const id: string = msg.id;
        if (ApiConfig.log_trafic_silly) this._logger.silly('[SEND][' + msg.command + '][' + msg.id + '][' + msg.replyto + '] socket send');
        this._socketObject.send(JSON.stringify(msg));
        this._sendQueue = this._sendQueue.filter((_msg: SocketMessage): boolean => {
          return _msg.id !== id;
        });
      } catch (error) {
        if (ApiConfig.log_error) this._logger.error(error);
        return;
      }
    });


  }
  getJSON(url: string, callback: any): void {

    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.onload = (): void => {
      const status: number = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
  }

}


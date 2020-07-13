import { Message } from './nodeclient/Message';
import { NoderedUtil } from './nodeclient/NoderedUtil';
import { QueuedMessage, QueuedMessageCallback } from './Message/QueuedMessage';
import { SocketMessage } from './Message/SocketMessage';
import { TokenUser } from './nodeclient/TokenUser';
import { CustomEventEmitter } from './events';
interface IHashTable<T> {
  [key: string]: T;
}
/** Provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection. */
interface WebSocket extends EventTarget {
  terminate(): void;
  /**
   * Returns a string that indicates how binary data from the WebSocket object is exposed to scripts:
   * 
   * Can be set, to change how binary data is returned. The default is "blob".
   */
  binaryType: BinaryType;
  /**
   * Returns the number of bytes of application data (UTF-8 text and binary data) that have been queued using send() but not yet been transmitted to the network.
   * 
   * If the WebSocket connection is closed, this attribute's value will only increase with each call to the send() method. (The number does not reset to zero once the connection closes.)
   */
  readonly bufferedAmount: number;
  /**
   * Returns the extensions selected by the server, if any.
   */
  readonly extensions: string;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
  onerror: ((this: WebSocket, ev: Event) => any) | null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
  onopen: ((this: WebSocket, ev: Event) => any) | null;
  /**
   * Returns the subprotocol selected by the server, if any. It can be used in conjunction with the array form of the constructor's second argument to perform subprotocol negotiation.
   */
  readonly protocol: string;
  /**
   * Returns the state of the WebSocket object's connection. It can have the values described below.
   */
  readonly readyState: number;
  /**
   * Returns the URL that was used to establish the WebSocket connection.
   */
  readonly url: string;
  /**
   * Closes the WebSocket connection, optionally using code as the the WebSocket connection close code and reason as the the WebSocket connection close reason.
   */
  close(code?: number, reason?: string): void;
  /**
   * Transmits data using the WebSocket connection. data can be a string, a Blob, an ArrayBuffer, or an ArrayBufferView.
   */
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  readonly CLOSED: number;
  readonly CLOSING: number;
  readonly CONNECTING: number;
  readonly OPEN: number;
  addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var WebSocket: {
  prototype: WebSocket;
  new(url: string, protocols?: string | string[]): WebSocket;
  readonly CLOSED: number;
  readonly CLOSING: number;
  readonly CONNECTING: number;
  readonly OPEN: number;
};

export class WebSocketClient {
  public _logger: any;
  private _url: string;
  private _socketObject: WebSocket = null;
  public static instance: WebSocketClient = null;
  private _receiveQueue: SocketMessage[] = [];
  private _sendQueue: SocketMessage[] = [];
  public user: TokenUser;
  public jwt: string;
  public messageQueue: IHashTable<QueuedMessage> = {};
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
  constructor(logger: any, url: string) {
    this._logger = logger;
    this._url = url;
    this._logger.info('connecting to ' + url);
    this.events = new CustomEventEmitter();
    this.events.setMaxListeners(200);

    this.connect();
    if (WebSocketClient.instance === null) {
      WebSocketClient.instance = this;
    }

    this.pinghandle = setInterval(this.pingServer.bind(this), 10000);
  }
  public close(code: number, message: string): void {
    this._logger.verbose('websocket.close');
    if (this._socketObject !== null) {
      this._socketObject.onopen = null;
      this._socketObject.onmessage = null;
      this._socketObject.onclose = null;
      this._socketObject.onerror = null;
      try {
        this._socketObject.close(code, message);
      } catch (error) {
        this._logger.error(error);
      }
      try {
        this._socketObject.terminate();
      } catch (error) {
        this._logger.error(error);
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
    this.events.removeAllListeners();
    this.events = null;
    WebSocketClient.instance = this;
  }
  public connect(): void {
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
      if (this._socketObject === null) {
        const options: any = {
          rejectUnauthorized: false,
          strictSSL: false,
        };
        if (!NoderedUtil.isNodeJS()) {
          try {
            this._logger.debug('Create as javascript WebSocket, using options', options);
            this._socketObject = new WebSocket(this._url, []);
            // tslint:disable-next-line: no-empty
          } catch (error) {
            this._logger.error(error);
          }
        }
        // tslint:disable-next-line: no-empty
        if (this._socketObject == null) {
          this._logger.debug('Create as universal-websocket-client, using options', options);
          const _ws: any = require('universal-websocket-client');
          this._socketObject = new _ws(this._url, options);
        }
        this._socketObject.onopen = this.onopen.bind(this);
        this._socketObject.onmessage = this.onmessage.bind(this);
        this._socketObject.onclose = this.onclose.bind(this);
        this._socketObject.onerror = this.onerror.bind(this);
      }
    } catch (error) {
      this._logger.debug(error.message);
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
  private pingServer(): void {
    try {
      if (this._socketObject !== null && this._socketObject.readyState === this._socketObject.OPEN) {
        const msg: SocketMessage = SocketMessage.fromcommand('ping');
        this._socketObject.send(JSON.stringify(msg));
      }
      if (
        this._socketObject === null ||
        this._socketObject.readyState !== this._socketObject.CONNECTING ||
        this._socketObject.readyState !== this._socketObject.OPEN
      ) {
        this.connect();
      }
    } catch (error) {
      if (error.message) {
        this._logger.error(error.message);
      } else {
        this._logger.error(error);
      }
      this.connect();
    }
  }
  private async onopen(evt: Event): Promise<void> {
    this._logger.debug("WebSocketclient::onopen");
    this.events.emit('onopen');
    // used in old websocket client
    this.events.emit('connect');
  }
  private onclose(evt: CloseEvent): void {
    this._logger.debug("WebSocketclient::onclose");
    this.events.emit('onclose');
  }
  private onerror(evt: ErrorEvent): void {
    this._logger.debug("WebSocketclient::onerror");
    this.events.emit('onclose', evt.message);
  }
  private onmessage(evt: MessageEvent): void {
    // this._logger.verbose("WebSocketclient::onmessage");
    const msg: SocketMessage = SocketMessage.fromjson(evt.data);
    this._receiveQueue.push(msg);
    this.ProcessQueue.bind(this)();
  }
  public async Send<T>(message: Message): Promise<T> {
    if (NoderedUtil.IsNullEmpty(message.id)) message.id = Math.random().toString(36).substr(2, 9);
    if (message.command !== 'pong') {
      let reply = message.replyto;
      if (NoderedUtil.IsNullEmpty(reply)) reply = '';
      this._logger.verbose('[SEND][' + message.command + '][' + message.id + '][' + reply + ']');
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
      );
    });
  }
  private _Send(message: Message, cb: QueuedMessageCallback): void {
    const messages: string[] = this.chunkString(message.data, 500);
    if (messages === null || messages === undefined || messages.length === 0) {
      const singlemessage: SocketMessage = SocketMessage.frommessage(message, '', 1, 0);
      if (message.replyto === null || message.replyto === undefined) {
        this.messageQueue[singlemessage.id] = new QueuedMessage(singlemessage, cb);
      }
      this._sendQueue.push(singlemessage);
      return;
    }
    if (message.id === null || message.id === undefined) {
      message.id = Math.random().toString(36).substr(2, 9);
    }
    for (let i: number = 0; i < messages.length; i++) {
      const _message: SocketMessage = SocketMessage.frommessage(message, messages[i], messages.length, i);
      this._sendQueue.push(_message);
    }
    if (message.replyto === null || message.replyto === undefined) {
      this.messageQueue[message.id] = new QueuedMessage(message, cb);
    }
    this.processqueuehandle = setTimeout(() => {
      this.ProcessQueue();
    }, 10);
  }
  public chunkString(str: string, length: number): string[] {
    if (str === null || str === undefined) {
      return [];
    }
    // tslint:disable-next-line: quotemark
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
  }
  private ProcessQueue(): void {
    try {
      const ids: string[] = [];
      this._receiveQueue.forEach((msg) => {
        if (ids.indexOf(msg.id) === -1) {
          ids.push(msg.id);
        }
      });
      ids.forEach((id) => {
        try {
          const msgs: SocketMessage[] = this._receiveQueue.filter((msg: SocketMessage): boolean => {
            return msg.id === id;
          });
          msgs.sort((a, b) => a.index - b.index);
          const first: SocketMessage = msgs[0];
          if (first.count === msgs.length) {
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
            this._receiveQueue = this._receiveQueue.filter((msg: SocketMessage): boolean => {
              return msg.id !== id;
            });
          }
        } catch (error) {
          if (error.message) {
            this._logger.error(error.message);
          } else {
            this._logger.error(error);
          }
        }
      });
    } catch (error) {
      if (error.message) {
        this._logger.error(error.message);
      } else {
        this._logger.error(error);
      }
    }
    if (this._socketObject === null || this._socketObject.readyState !== this._socketObject.OPEN) {
      this._logger.info('Cannot send, not connected');
      return;
    }
    this._sendQueue.forEach((msg) => {
      try {
        const id: string = msg.id;
        this._socketObject.send(JSON.stringify(msg));
        this._sendQueue = this._sendQueue.filter((_msg: SocketMessage): boolean => {
          return _msg.id !== id;
        });
      } catch (error) {
        if (error.message) {
          this._logger.error(error.message);
        } else {
          this._logger.error(error);
        }
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


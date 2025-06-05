import * as GMUTypes from "."
import { Move } from "./types";

const WS_ADDRESS_VALIDATOR_REGEX: RegExp = /^wss?:\/\/((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d):([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/

const DEFAULT_PROTOCOL_TIMEOUT_MS: number = 10000;

enum LogType {
    INFO,
    ERROR
}

interface WebSocketOptions {
    debug: boolean;
    reconnect: boolean;
    msReconnectInterval: number;
    reconnectMaxRetries: number;
}

enum WSMessageType {
    ACKOWLEDGE = "ack",
    MOVE = "move"
}

type WebSocketMessageType = WSMessageType.ACKOWLEDGE | WSMessageType.MOVE;

interface WebSocketMessage {
    type: WebSocketMessageType;
    data: string;
}

type MessageHandler = (message: WebSocketMessage) => void;

export class WebSocketClient {
    private static readonly WS_DEFAULT_OPTIONS: WebSocketOptions = {
        debug: true,
        reconnect: true,
        msReconnectInterval: 2000,
        reconnectMaxRetries: 5,
    }

    private address: string;
    private webSocket: WebSocket | null = null;
    private options: WebSocketOptions;
    
    private messageHandlers: Record<WebSocketMessageType, MessageHandler> = {} as Record<WebSocketMessageType, MessageHandler>;

    private retryCount: number = 0;

    /**
     * Creates a WebSocket object instance.
     * @param {string} address - A valid ws:// or wss:// address in the format 'protocol://ip:port'.
     * @param {Partial<WebSocketOptions>} options - Optional partial options for WebSocket behavior.
     */
    constructor(address: string, options: Partial<WebSocketOptions> = {}) {
        WebSocketClient.validateAddress(address);
        
        this.address = address;
        this.options = {
            ...WebSocketClient.WS_DEFAULT_OPTIONS,
            ...options
        };

        this.connect();
    }

    /**
     * Establishes a WebSocket Connection to `this.address` and sets up event listeners for `open`, `close`, `message`, `error`.
     */
    private connect() {
        this.webSocket = new WebSocket(this.address);

        this.webSocket.addEventListener('open', (event) => {
            this.retryCount = 0;
            this.log(LogType.INFO,`Established Connection.`);
            this.onConnectionOpenHandler(event);
        });

        this.webSocket.addEventListener('close', (event) => {
            this.options.reconnect ? this.reconnectOnConnectionCloseHandler() : this.log(LogType.INFO, `Closed Connection.`);
            this.onConnectionCloseHandler(event);
        })

        this.webSocket.addEventListener('message', (event) => {
            this.log(LogType.INFO, `Received: ${event.data}`);
            this.onMessageReceivedHandler(event);
        })

        this.webSocket.addEventListener('error', (event) => {
            this.log(LogType.ERROR, event);
            this.onErrorReceivedHandler(event);
        })
    }

    /**
     * Logs messages to the console based on `logType` if `this.options.debug` is `true`.
     * @param {LogType} logType 
     * @param {string | Object} info 
     */
    private log(logType: LogType, info: string | Object) {
        if (!this.options.debug) return;

        switch (logType) {
            case LogType.ERROR:
                console.error(`[${this.address}]:`, info);
                break;
            case LogType.INFO:
            default:
                console.log(`[${this.address}]: ${info}`);
                break;
            
        }
        
    }

    /**
     * Sends data to the WebSocket server if the connection is open.
     * @param {string | Object} data - Data to send.
     * @returns `true` or `false` depending on whether the data was sent.
     */
    private send(data: string | Object): boolean {
        const message = typeof data === 'string' ? data : JSON.stringify(data);

        if (this.webSocket?.readyState === WebSocket.OPEN) {
            this.log(LogType.INFO, `Sent: ${message}`);
            this.webSocket.send(message);
            return true;
        } else {
            this.log(LogType.ERROR, `Connection is closed.`)
            return false;
        }
    }

    /**
     * Validates the provided address against the WebSocket regex.
     * 
     * Valid format: `protocol://x.x.x.x:port`
     * 
     * - Supported Protocols: `ws`, `wss`
     * - IP Address Octets (`x`): 0-255
     * - Port (`port`): 1-65535
     * 
     * Valid example: `ws://127.0.0.1:8080`
     * @param {string} address - Address to validate.
     * @throws Error if the address is invalid.
     */
    private static validateAddress(address: string) {
        if (!WS_ADDRESS_VALIDATOR_REGEX.test(address)) {
            throw new Error(`[WebSocketClient Address Validator]: Invalid Address ${address}`);
        }
    }

    /**
     * Attempts to reconnect to the WebSocket server if the connection is lost.
     *
     * Retries up to `this.options.reconnectMaxRetries` times, waiting
     * `this.options.msReconnectInterval` milliseconds between each attempt.
     *
     * Stops trying once the maximum retry count is reached.
     */
    private reconnectOnConnectionCloseHandler = () => {
        if (this.retryCount < this.options.reconnectMaxRetries) {
            this.retryCount++;
            this.log(LogType.INFO, `Reconnecting... Attempt ${this.retryCount} out of ${this.options.reconnectMaxRetries}`)
            setTimeout(() => this.connect(), this.options.msReconnectInterval);
        } else {
            this.log(LogType.INFO, `Maximum reconnect attempts (${this.options.reconnectMaxRetries}) reached. Giving up.`)
        }
    };

    /**
     * Returns true if the WebSocket is currently open.
     */
    public isConnected(): boolean {
        return this.webSocket?.readyState === WebSocket.OPEN;
    }

    /**
     * Waits for the server to acknowledge readiness, then sends a move.
     * Automatically resets readiness flag after sending.
     * @param {Move} move - GamesmanUni `Move`.
     */
    public async sendMove(move: Move) {
        try {
            await this.timeoutWaitUntilMessage(WSMessageType.ACKOWLEDGE);
            
            if (!this.send(move)) {
                return;
            }

        } catch (error) {
            this.log(LogType.ERROR, `${error}`);
        }
    }

    /**
     * 
     */
    private async nextMove(msUntilTimeout: number = DEFAULT_PROTOCOL_TIMEOUT_MS): Promise<WebSocketMessage> {
        this.send({type: "ack", status: "move-complete"});

        return this.timeoutWaitUntilMessage(WSMessageType.MOVE);
    }

    /**
     * Disconnects the WebSocket connection.
     * `this.serverIsReady` is set to `false`.
     * `this.readyResolver` is set to `null`.
     */
    public disconnect() {
        this.options.reconnect = false;
        this.webSocket?.close();
    }
    
    /* ------------------ Event Handlers ------------------ */

    /**
     * Hook method triggered when a WebSocket connection is opened.
     * Override this to implement custom behavior.
     */
    private onConnectionOpenHandler = (event: Event) => {};

    /**
     * Hook method triggered when a message is received from the WebSocket server.
     * Override this to implement custom behavior.
     */
    private onMessageReceivedHandler = (event: MessageEvent) => {
        try {
            const msg: WebSocketMessage = JSON.parse(event.data);
            const messageHandler = this.messageHandlers[msg.type];
            if (messageHandler) {
                messageHandler(msg);
            } else {
                this.log(LogType.ERROR, `Unhandled message type ${msg.type}.`);
            }
        } catch (e) {
            this.log(LogType.ERROR, `Failed to parse message: ${event.data}`);
        }
    };

    private registerMessageHandler (type: WebSocketMessageType, handler: (message: WebSocketMessage) => void) {
        this.messageHandlers[type] = handler;
    }

    private unregisterMessageHandler (type: WebSocketMessageType) {
        delete this.messageHandlers[type];
    }

    /**
     * Hook method triggered when the WebSocket connection is closed.
     * Override this to implement custom behavior.
     */
    private onConnectionCloseHandler = (event: Event) => {};

    /**
     * Hook method triggered when a WebSocket error occurs.
     * Override this to implement custom behavior.
     */
    private onErrorReceivedHandler = (event: Event) => {};

    /* ------------------ Message Handlers ------------------ */
    /**
     * Waits until the WebSocket server responds with message `type`.
     * @param {number} msUntilTimeout - Waiting time, in ms, until timeout.
     */
    private timeoutWaitUntilMessage(type: WebSocketMessageType, msUntilTimeout: number = DEFAULT_PROTOCOL_TIMEOUT_MS): Promise<WebSocketMessage> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
            this.unregisterMessageHandler(type);
            reject(new Error(`Timed out while waiting for message of type '${type}'.`));
            }, msUntilTimeout);
            this.log(LogType.INFO, `Waiting on message of type '${type}'.`);
            const listener = (msg: WebSocketMessage) => {
            clearTimeout(timeout);
            this.unregisterMessageHandler(type);
            resolve(msg);
            };

            this.registerMessageHandler(type, listener);
        });
    }
}
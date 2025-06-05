import * as GMUTypes from "."

const WS_ADDRESS_VALIDATOR_REGEX: RegExp = /^wss?:\/\/((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d):([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/

enum LogType {
    INFO,
    ERROR
}

interface WebSocketOptions {
    debug: boolean;
    reconnect: boolean;
    reconnectInterval: number;
    reconnectMaxRetries: number;
}

export class WebSocketClient {
    private static WS_DEFAULT_OPTIONS: WebSocketOptions = {
        debug: true,
        reconnect: true,
        reconnectInterval: 2000,
        reconnectMaxRetries: 5,
    }

    private address: string;
    private webSocket: WebSocket | null = null;
    private options: WebSocketOptions;
    
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
     * Logs messages to the console based on `logType`.
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
     * @param {string | Object} data 
     */
    private send(data: string | Object) {
        const message = typeof data === 'string' ? data : JSON.stringify(data);

        if (this.webSocket?.readyState === WebSocket.OPEN) {
            this.log(LogType.INFO, `Sent: ${message}`);
            this.webSocket?.send(message);
        } else {
            this.log(LogType.ERROR, `Connection is closed.`)
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
     * Valid example: `ws://127.0.0.0:8080`
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
     * `this.options.reconnectInterval` milliseconds between each attempt.
     *
     * Stops trying once the maximum retry count is reached.
     */
    private reconnectOnConnectionCloseHandler = () => {
        if (this.retryCount < this.options.reconnectMaxRetries) {
            this.retryCount++;
            this.log(LogType.INFO, `Reconnecting... Attempt ${this.retryCount} out of ${this.options.reconnectMaxRetries}`)
            setTimeout(() => this.connect(), this.options.reconnectInterval);
        } else {
            this.log(LogType.INFO, `Max reconnect attempts (${this.options.reconnectMaxRetries}) reached. Giving up.`)
        }
    };

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
    private onMessageReceivedHandler = (event: Event) => {};

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
}
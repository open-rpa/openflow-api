var wtf = require('wtfnode');
import path = require("path");
import os = require('os');
const env = path.join(process.cwd(), 'config', '.env');
require("dotenv").config({ path: env }); // , debug: false 
import { suite, test, timeout } from '@testdeck/mocha';
import assert = require('assert');
import { ApiConfig } from '../src/ApiConfig';
import { WebSocketClient, SigninMessage, Message, NoderedUtil } from "../src/index";

@suite class websocketclient_test {
    private socket: WebSocketClient = null;
    @timeout(500000)
    async before() {
        ApiConfig.log_trafic_verbose = false;
        ApiConfig.log_trafic_silly = false;
        ApiConfig.log_information = false;
        if (!this.socket) this.socket = new WebSocketClient(null, "wss://pc.openiap.io", true);
        // if (!this.socket) this.socket = new WebSocketClient(null, "wss://demo.openiap.io", true, true);
        this.socket.agent = "test-cli";
        await this.socket.Connect();
        await NoderedUtil.SigninWithUsername({ username: "testuser", password: "testuser" });
    }
    @timeout(5000)
    async after() {
        await this.socket.close(1000, "Close by user");
        this.socket.events.removeAllListeners()
        // wtf.dump()
    }
    @timeout(5000)
    @test async 'message store test'() {
        this.socket.setCacheFolder(os.tmpdir())
        let testo = { "name": "Find me" };
        await this.socket.messageStore.set("test", JSON.stringify(testo));

        const items: any = await this.socket.messageStore.load();
        assert.strictEqual(items.files.length, 1);
        items.files.forEach(item => {
            const msg = JSON.parse(item.value);
            assert.strictEqual(msg.name, "Find me");
        });
        await this.socket.messageStore.clear();
    }
    @timeout(500000)
    @test async 'connect test'() {
        ApiConfig.log_trafic_verbose = false;
        ApiConfig.log_trafic_silly = false;
        ApiConfig.log_information = false;
        let socket = new WebSocketClient(null, "wss://pc.openiap.io", true);
        socket.agent = "test-cli";
        await socket.Connect();
        await NoderedUtil.SigninWithUsername({ username: "testuser", password: "testuser", websocket: socket });
        socket.pingServer()

        await socket.close(1000, "Close by user");


        await socket.Connect();
        let item = await NoderedUtil.InsertOne({ item: { "_type": "test", "name": "test entities item" }, collectionname: "entities" });
        await NoderedUtil.SigninWithUsername({ username: "testuser", password: "testuser", websocket: socket });

        await socket.close(1000, "Close by user");

        socket.events.removeAllListeners()
    }
}
// cls | ts-mocha --paths -p test/tsconfig.json .\test\websocketclient.test.ts
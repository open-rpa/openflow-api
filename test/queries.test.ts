var wtf = require('wtfnode');
const path = require("path");
const env = path.join(process.cwd(), 'config', '.env');
require("dotenv").config({ path: env }); // , debug: false 
import { suite, test, timeout } from '@testdeck/mocha';
import assert = require('assert');
import { ApiConfig } from '../src/ApiConfig';
import { WebSocketClient, SigninMessage, Message, NoderedUtil } from "../src/index";

@suite class queries {
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
    @test async 'querytest'() {
        let users = await NoderedUtil.Query({ query: { "_type": "user" }, collectionname: "users", top: 1 });
        assert.notStrictEqual(users, null, "query for users returned null");
        assert.strictEqual(users.length, 1, "Query for users did not return 1 items");
        users = await NoderedUtil.Query({ query: { "_type": "role" }, collectionname: "users", top: 5 });
        assert.notStrictEqual(users, null, "query for roles returned null");
        assert.strictEqual(users.length, 5, "Query for roles  did not return 5 items");
        users = await NoderedUtil.Query({ query: { "_type": "role" }, projection: { "name": 1 }, collectionname: "users", top: 1 });
        assert.notStrictEqual(users, null, "query for roles returned null");
        assert.strictEqual(users.length, 1, "Query for roles  did not return 5 items");
        assert.notStrictEqual(users[0].name, null, "project for name failed, name is null");
        assert.strictEqual(users[0].username, undefined, "project for name failed, username is not null");

        users = await NoderedUtil.Query({ query: { "_type": "role" }, projection: { "name": 1 }, collectionname: "users", top: 1 });
        let users2 = await NoderedUtil.Query({ query: { "_type": "role" }, projection: { "name": 1 }, collectionname: "users", top: 1, skip: 1 });
        assert.notStrictEqual(users[0].name, users2[0].name, "project for name failed, name is null");
    }
    @timeout(5000)
    @test async 'aggregatetest'() {
        let users = await NoderedUtil.Aggregate({ aggregates: [{ "$match": { "_type": "role" } }, { "$limit": 5 }], collectionname: "users" })
        assert.notStrictEqual(users, null);
        assert.strictEqual(users.length > 1, true);
        users = await NoderedUtil.Aggregate({ aggregates: [{ "$match": { "_type": "role" } }, { "$limit": 1 }], collectionname: "users" })
        assert.notStrictEqual(users, null);
        assert.strictEqual(users.length, 1);
    }
}
// cls | ts-mocha --paths -p test/tsconfig.json .\test\queries.test.ts
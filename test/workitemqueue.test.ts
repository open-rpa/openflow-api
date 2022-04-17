var wtf = require('wtfnode');
const path = require("path");
const env = path.join(process.cwd(), 'config', '.env');
require("dotenv").config({ path: env }); // , debug: false 
import { suite, test, timeout } from '@testdeck/mocha';
import assert = require('assert');
import { ApiConfig } from '../src/ApiConfig';
import { WebSocketClient, SigninMessage, Message, NoderedUtil, Workitem } from "../src/index";

@suite class workitemqueue {
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
    @timeout(50000)
    @test async 'basic workitem test'() {
        let q = await NoderedUtil.GetWorkitemQueue({ name: "test queue" });
        if (q == null) q = await NoderedUtil.AddWorkitemQueue({ name: "test queue" });
        assert.notStrictEqual(q, null, "Failed getting test queue");
        assert.notStrictEqual(q, undefined, "Failed getting test queue");

        let item: Workitem;
        do {
            item = await NoderedUtil.PopWorkitem({ wiq: q.name });
            if (item != null) await NoderedUtil.UpdateWorkitem({ _id: item._id, state: "successful" });
        } while (item != null)

        item = await NoderedUtil.AddWorkitem({ name: "Test Work Item", payload: { "find": "me" }, wiq: q.name });
        assert.notStrictEqual(item, null, "Failed adding test work item");
        assert.notStrictEqual(item, undefined, "Failed adding test work item");
        assert.strictEqual(item.name, "Test Work Item", "Failed matching name on new work item");
        assert.strictEqual(item.state, "new");

        item = await NoderedUtil.PopWorkitem({ wiq: q.name });
        assert.notStrictEqual(item, null, "Failed getting test work item");
        assert.notStrictEqual(item, undefined, "Failed getting test work item");
        assert.strictEqual(item.name, "Test Work Item", "Failed matching name on work item");
        assert.strictEqual(item.state, "processing");

        item = await NoderedUtil.UpdateWorkitem({ _id: item._id });

        let testitem = await NoderedUtil.PopWorkitem({ wiq: q.name });
        assert.strictEqual(testitem, undefined, "Failed queue test, can still pop items while processing the added item!");

        item = await NoderedUtil.UpdateWorkitem({ _id: item._id, state: "retry" });
        assert.strictEqual(item.state, "new");

        item = await NoderedUtil.PopWorkitem({ wiq: q.name });
        assert.strictEqual(item.state, "processing");
        assert.notStrictEqual(item, null, "Failed getting test work item");
        assert.notStrictEqual(item, undefined, "Failed getting test work item");
        assert.strictEqual(item.name, "Test Work Item", "Failed matching name on work item");
        await NoderedUtil.UpdateWorkitem({ _id: item._id, state: "successful" });

        // await NoderedUtil.UpdateWorkitem({ _id: item._id, state: "successful" });
    }
}
// .\node_modules\.bin\ts-node .\test\workitemqueue.test.ts
// cls | .\node_modules\.bin\ts-node .\test\workitemqueue.test.ts
// cls | ./node_modules/.bin/_mocha 'test/**/workitemqueue.test.ts'
// cls | ts-mocha --paths -p test/tsconfig.json .\test\workitemqueue.test.ts

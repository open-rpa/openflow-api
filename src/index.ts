export function hello(name: string): string {
    return `Hello ${name}`;
}

export { AggregateMessage } from "./Message/AggregateMessage";
export { CreateWorkflowInstanceMessage } from "./Message/CreateWorkflowInstanceMessage";
export { DeleteNoderedInstanceMessage } from "./Message/DeleteNoderedInstanceMessage";

export { Ace } from "./nodeclient/Ace";
export { Base } from "./nodeclient/Base";
export { JSONfn } from "./nodeclient/JSONfn";
export { Message } from "./nodeclient/Message";
export { NoderedUtil } from "./nodeclient/NoderedUtil";
export { Rights } from "./nodeclient/Rights";
export { Role } from "./nodeclient/Role";
export { Rolemember } from "./nodeclient/Rolemember";
export { TokenUser } from "./nodeclient/TokenUser";
export { WellknownIds } from "./nodeclient/WellknownIds";
// export { cliutil } from "./nodeclient/cliutil";
export { Messagequeue } from "./nodeclient/Messagequeue";


export { SigninMessage } from "./Message/SigninMessage";

export { WebSocketClient } from "./WebSocketClient";
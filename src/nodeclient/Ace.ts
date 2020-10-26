import { NoderedUtil } from "./NoderedUtil";
export class Ace {
    // tslint:disable-next-line: variable-name
    public ace_right_bits: number = 1000;
    public deny: boolean;
    public _id: string;
    public name: string;
    public rights: string = "//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=";
    constructor() {
        const arr: Uint8Array = new Uint8Array(this.ace_right_bits / 8);
        this.deny = false;
    }
    static resetfullcontrol(item: Ace) {
        item.rights = "//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=";
    }
    static resetnone(item: Ace) {
        item.rights = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIA="
    }
    static _base64ToArrayBuffer(base64): ArrayBuffer {
        let binarystring: string = null;
        if (NoderedUtil.isNodeJS()) {
            binarystring = Buffer.from(base64, 'base64').toString('binary');
        } else {
            binarystring = window.atob(base64);
        }
        const len = binarystring.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            const ascii = binarystring.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes.buffer;
    }
    static _arrayBufferToBase64(arraybuffer): string {
        let binary = '';
        const bytes = new Uint8Array(arraybuffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        if (NoderedUtil.isNodeJS()) {
            return Buffer.from(binary, 'binary').toString('base64');
        }
        return window.btoa(binary);
    }
    static isBitSet(item: Ace, bit: number): boolean {
        bit--;
        let rights = item.rights;
        if (typeof rights !== "string") {
            rights = JSON.stringify(item.rights);
        }
        const buf = Ace._base64ToArrayBuffer(rights);
        const view = new Uint8Array(buf);
        const octet = Math.floor(bit / 8);
        const currentValue = view[octet];
        const _bit = (bit % 8);
        const mask = Math.pow(2, _bit);
        // tslint:disable-next-line: no-bitwise
        return (currentValue & mask) !== 0;
    }
    static setBit(item: Ace, bit: number) {
        bit--;
        let rights = item.rights;
        if (typeof rights !== "string") {
            rights = JSON.stringify(item.rights);
        }
        const buf = Ace._base64ToArrayBuffer(rights);
        const view = new Uint8Array(buf);
        const octet = Math.floor(bit / 8);
        const currentValue = view[octet];
        const _bit = (bit % 8);
        const mask = Math.pow(2, _bit);
        // tslint:disable-next-line: no-bitwise
        const newValue = currentValue | mask;
        view[octet] = newValue;
        item.rights = Ace._arrayBufferToBase64(view);
        return item.rights;
    }
    static unsetBit(item: Ace, bit: number) {
        bit--;
        let rights = item.rights;
        if (typeof rights !== "string") {
            rights = JSON.stringify(item.rights);
        }
        const buf = Ace._base64ToArrayBuffer(rights);
        const view = new Uint8Array(buf);
        const octet = Math.floor(bit / 8);
        let currentValue = view[octet];
        const _bit = (bit % 8);
        const mask = Math.pow(2, _bit);
        // tslint:disable-next-line: no-bitwise
        const newValue = currentValue &= ~mask;
        view[octet] = newValue;
        item.rights = Ace._arrayBufferToBase64(view);
        return item.rights;
    }
    static toogleBit(item: Ace, bit: number) {
        if (Ace.isBitSet(item, bit)) {
            Ace.unsetBit(item, bit);
        } else {
            Ace.setBit(item, bit);
        }
    }
}
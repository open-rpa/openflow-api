import { NoderedUtil } from "./NoderedUtil";
export class Ace {
    // tslint:disable-next-line: variable-name
    public static ace_right_bits: number = 16;
    public static full_control: number = 65535;
    public deny: boolean = false;
    public _id: string;
    public name: string;
    // public rights: string = "//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=";
    public rights: string | number = 65535;
    constructor() {
    }
    static resetfullcontrol(item: Ace) {
        if (typeof item.rights === "number") {
            // for (var i = 0; i < item.ace_right_bits; i++) {
            //     Ace.setBit(item, i + 1);
            // }
            item.rights = 65535;
        } else {
            item.rights = "//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=";
        }
    }
    static resetnone(item: Ace) {
        if (typeof item.rights === "number") {
            item.rights = 0;
        } else {
            item.rights = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIA="
        }
    }
    static _base64ToArrayBuffer(base64): ArrayBuffer {
        let binarystring: string = null;
        try {
            if (NoderedUtil.isNodeJS()) {
                binarystring = Buffer.from(base64, 'base64').toString('binary');
            } else {
                binarystring = window.atob(base64);
            }
        } catch (error) {
            console.log(base64);
            throw error;
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
        // if rights is number
        let currentValue: number = item.rights as any;
        let mask: number = 1 << bit;
        if (bit == -2) {
            if (item.rights == Ace.full_control || item.rights == "//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=") {
                return true;
            }
            for (var i = 0; i < Ace.ace_right_bits; i++) {
                if (!Ace.isBitSet(item, i)) {
                    return false;
                }
            }
        }
        if (typeof currentValue === "number") {
        } else {
            let rights = item.rights;
            // if (typeof rights === "string" || typeof rights === "object") {
            if (typeof rights === "object") {
                rights = JSON.stringify(item.rights);
            } else if (Array.isArray(rights)) {
                rights = JSON.stringify(item.rights);
            }
            const buf = Ace._base64ToArrayBuffer(rights);
            const view = new Uint8Array(buf);
            const octet = Math.floor(bit / 8);
            currentValue = view[octet];
            const _bit = (bit % 8);
            mask = Math.pow(2, _bit);
            // tslint:disable-next-line: no-bitwise
        }
        return (currentValue & mask) !== 0;
    }
    static setBit(item: Ace, bit: number) {
        bit--;
        let currentValue: number = item.rights as any;
        let mask: number = 1 << bit;
        if (typeof currentValue === "number") {
            // @ts-ignore
            item.rights |= mask;
            // item.rights = currentValue |= mask;
            // var test1 = this.isBitSet(item, bit + 1)
            // var test2 = this.isBitSet(item, bit)
        } else {
            let rights = item.rights;
            if (typeof rights === "object") {
                rights = JSON.stringify(item.rights);
            } else if (Array.isArray(rights)) {
                rights = JSON.stringify(item.rights);
            }
            const buf = Ace._base64ToArrayBuffer(rights);
            const view = new Uint8Array(buf);
            const octet = Math.floor(bit / 8);
            currentValue = view[octet];
            const _bit = (bit % 8);
            mask = Math.pow(2, _bit);
            // tslint:disable-next-line: no-bitwise
            const newValue = currentValue | mask;
            view[octet] = newValue;
            item.rights = Ace._arrayBufferToBase64(view);
        }
        return item.rights;
    }
    static unsetBit(item: Ace, bit: number) {
        bit--;
        let currentValue: number = item.rights as any;
        let mask: number = 1 << bit;
        if (typeof currentValue === "number") {
            // @ts-ignore
            item.rights = currentValue &= ~mask;
        } else {
            let rights = item.rights;
            if (typeof rights === "object") {
                rights = JSON.stringify(item.rights);
            }
            const buf = Ace._base64ToArrayBuffer(rights);
            const view = new Uint8Array(buf);
            const octet = Math.floor(bit / 8);
            currentValue = view[octet];
            const _bit = (bit % 8);
            mask = Math.pow(2, _bit);
            // tslint:disable-next-line: no-bitwise
            const newValue = currentValue &= ~mask;
            view[octet] = newValue;
            item.rights = Ace._arrayBufferToBase64(view);
        }
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
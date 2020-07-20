import { NoderedUtil } from "./NoderedUtil";

// export class Ace {
//     // tslint:disable-next-line: variable-name
//     public ace_right_bits: number = 1000;
//     constructor() {
//         const arr: Uint8Array = new Uint8Array(this.ace_right_bits / 8);
//         this.rights = new Binary(Buffer.from(arr), 0);
//         this.deny = false;
//     }
//     static assign(a: Ace): Ace {
//         const result: Ace = Object.assign(new Ace(), a);
//         if (typeof result.rights === "string") {
//             result.rights = new Binary(Buffer.from(result.rights, "base64"), 0);
//         }
//         return result;
//     }
//     public _id: string;
//     public name: string;
//     public deny: boolean = false;
//     public rights: Binary;
//     reset(): void {
//         const arr: Uint8Array = new Uint8Array(this.ace_right_bits / 8);
//         this.rights = new Binary(Buffer.from(arr), 0);
//     }
//     getview(): Uint8Array {
//         const buf: Buffer = this.rights.read(0, this.rights.length());
//         return new Uint8Array(buf);
//     }
//     getMask(bit: number): number {
//         return Math.pow(2, bit);
//     }
//     setBit(bit: number): void {
//         bit--;
//         const buf: Buffer = this.rights.read(0, this.rights.length());
//         const view: Uint8Array = new Uint8Array(buf);
//         if (bit === -2) {
//             for (let i: number = 0; i < view.length; i++) {
//                 view[i] = 255;
//             }
//         } else {
//             const octet: number = Math.floor(bit / 8);
//             const currentValue: number = view[octet];
//             const _bit: number = (bit % 8);
//             const mask: number = this.getMask(_bit);
//             // tslint:disable-next-line: no-bitwise
//             const newValue: number = currentValue | mask;
//             view[octet] = newValue;
//         }
//         this.rights = new Binary(Buffer.from(view), 0);
//     }
//     unsetBit(bit: number): void {
//         bit--;
//         const buf: Buffer = this.rights.read(0, this.rights.length());
//         const view: Uint8Array = new Uint8Array(buf);

//         const octet: number = Math.floor(bit / 8);
//         let currentValue: number = view[octet];
//         const _bit: number = (bit % 8);
//         const mask: number = this.getMask(_bit);
//         // tslint:disable-next-line: no-bitwise
//         const newValue: number = currentValue &= ~mask;
//         view[octet] = newValue;
//         this.rights = new Binary(Buffer.from(view), 0);
//     }
//     getBit(bit: number): boolean {
//         bit--;
//         const buf: Buffer = this.rights.read(0, this.rights.length());
//         const view: Uint8Array = new Uint8Array(buf);

//         const octet: number = Math.floor(bit / 8);
//         const currentValue: number = view[octet];
//         const _bit: number = (bit % 8);
//         const bitValue: number = Math.pow(2, _bit);
//         // tslint:disable-next-line: no-bitwise
//         return (currentValue & bitValue) !== 0;
//     }
//     isBitSet(bit: number): boolean {
//         return this.getBit(bit);
//     }
// }
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
    static assign(o: any): Ace {
        return Object.assign(new Ace(), o);
    }
    _base64ToArrayBuffer(base64): ArrayBuffer {
        let binarystring: string = null;
        if (NoderedUtil.isNodeJS()) {
            // binarystring = new Buffer(base64, 'base64').toString('binary');
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
    _arrayBufferToBase64(arraybuffer): string {
        let binary = '';
        const bytes = new Uint8Array(arraybuffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        if (NoderedUtil.isNodeJS()) {
            return Buffer.from(binary, 'binary').toString('base64');
            // return new Buffer(binary, 'binary').toString('base64');
        }
        return window.btoa(binary);
    }
    isBitSet(bit: number): boolean {
        bit--;
        // const buf = this._base64ToArrayBuffer(this.rights);
        const rights = JSON.stringify(this.rights);
        const buf = this._base64ToArrayBuffer(rights);
        const view = new Uint8Array(buf);
        const octet = Math.floor(bit / 8);
        const currentValue = view[octet];
        const _bit = (bit % 8);
        const mask = Math.pow(2, _bit);
        // tslint:disable-next-line: no-bitwise
        return (currentValue & mask) !== 0;
    }
    setBit(bit: number) {
        bit--;
        const rights = JSON.stringify(this.rights);
        const buf = this._base64ToArrayBuffer(rights);
        const view = new Uint8Array(buf);
        const octet = Math.floor(bit / 8);
        const currentValue = view[octet];
        const _bit = (bit % 8);
        const mask = Math.pow(2, _bit);
        // tslint:disable-next-line: no-bitwise
        const newValue = currentValue | mask;
        view[octet] = newValue;
        return this._arrayBufferToBase64(view);
    }
    unsetBit(bit: number) {
        bit--;
        const rights = JSON.stringify(this.rights);
        const buf = this._base64ToArrayBuffer(rights);
        const view = new Uint8Array(buf);
        const octet = Math.floor(bit / 8);
        let currentValue = view[octet];
        const _bit = (bit % 8);
        const mask = Math.pow(2, _bit);
        // tslint:disable-next-line: no-bitwise
        const newValue = currentValue &= ~mask;
        view[octet] = newValue;
        return this._arrayBufferToBase64(view);
    }
    toogleBit(bit: number) {
        if (this.isBitSet(bit)) {
            this.unsetBit(bit);
        } else {
            this.setBit(bit);
        }
    }
}
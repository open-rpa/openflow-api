import { Base } from "./Base";

export class Ace {
  public deny: boolean;
  public _id: string;
  public name: string;
  public rights: string = "//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=";
  static assign(o: any): Ace {
    return Object.assign(new Base(), o);
  }
  _base64ToArrayBuffer(base64): ArrayBuffer {
    const binarystring = window.atob(base64);
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
    return window.btoa(binary);
  }
  isBitSet(bit: number): boolean {
    bit--;
    const buf = this._base64ToArrayBuffer(this.rights);
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
    const buf = this._base64ToArrayBuffer(this.rights);
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
    const buf = this._base64ToArrayBuffer(this.rights);
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
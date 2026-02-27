(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

  // node_modules/@noble/hashes/utils.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function anumber(n, title = "") {
    if (!Number.isSafeInteger(n) || n < 0) {
      const prefix = title && `"${title}" `;
      throw new Error(`${prefix}expected integer >= 0, got ${n}`);
    }
  }
  function abytes(value, length, title = "") {
    const bytes = isBytes(value);
    const len = value?.length;
    const needsLen = length !== void 0;
    if (!bytes || needsLen && len !== length) {
      const prefix = title && `"${title}" `;
      const ofLen = needsLen ? ` of length ${length}` : "";
      const got = bytes ? `length=${len}` : `type=${typeof value}`;
      throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
    }
    return value;
  }
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash must wrapped by utils.createHasher");
    anumber(h.outputLen);
    anumber(h.blockLen);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes(out, void 0, "digestInto() output");
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error('"digestInto() output" expected to be of length >=' + min);
    }
  }
  function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  function byteSwap(word) {
    return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
  }
  function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = byteSwap(arr[i]);
    }
    return arr;
  }
  function bytesToHex(bytes) {
    abytes(bytes);
    if (hasHexBuiltin)
      return bytes.toHex();
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += hexes[bytes[i]];
    }
    return hex;
  }
  function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9)
      return ch - asciis._0;
    if (ch >= asciis.A && ch <= asciis.F)
      return ch - (asciis.A - 10);
    if (ch >= asciis.a && ch <= asciis.f)
      return ch - (asciis.a - 10);
    return;
  }
  function hexToBytes(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    if (hasHexBuiltin)
      return Uint8Array.fromHex(hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
      throw new Error("hex string expected, got unpadded hex of length " + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex.charCodeAt(hi));
      const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex[hi] + hex[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
  }
  function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad);
      pad += a.length;
    }
    return res;
  }
  function createHasher(hashCons, info = {}) {
    const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
    const tmp = hashCons(void 0);
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    Object.assign(hashC, info);
    return Object.freeze(hashC);
  }
  function randomBytes(bytesLength = 32) {
    const cr = typeof window === "object" ? window.crypto : null;
    if (typeof cr?.getRandomValues === "function") {
      return cr.getRandomValues(new Uint8Array(bytesLength));
    }
    // Fallback PRNG — used when crypto is unavailable (e.g. Postman sandbox).
    var _t = Date.now();
    var _x = _t >>> 0;
    var _y = (_t * 1664525 + 1013904223) >>> 0;
    var _z = (Math.random() * 0xFFFFFFFF) >>> 0;
    var _w = (Math.random() * 0xFFFFFFFF) >>> 0;
    var _out = new Uint8Array(bytesLength);
    for (var _i = 0; _i < bytesLength; ) {
      var _s = _x ^ (_x << 11); _x = _y; _y = _z; _z = _w;
      _w = (_w ^ (_w >>> 19)) ^ (_s ^ (_s >>> 8));
      _out[_i++] = _w & 0xff;
      if (_i < bytesLength) _out[_i++] = (_w >>> 8) & 0xff;
      if (_i < bytesLength) _out[_i++] = (_w >>> 16) & 0xff;
      if (_i < bytesLength) _out[_i++] = (_w >>> 24) & 0xff;
    }
    return _out;
  }
  var isLE, swap32IfBE, hasHexBuiltin, hexes, asciis, oidNist;
  var init_utils = __esm({
    "node_modules/@noble/hashes/utils.js"() {
      isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
      swap32IfBE = isLE ? (u) => u : byteSwap32;
      hasHexBuiltin = /* @__PURE__ */ (() => (
        // @ts-ignore
        typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
      ))();
      hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
      oidNist = (suffix) => ({
        oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
      });
    }
  });

  // node_modules/@noble/hashes/_md.js
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD, SHA256_IV, SHA384_IV, SHA512_IV;
  var init_md = __esm({
    "node_modules/@noble/hashes/_md.js"() {
      init_utils();
      HashMD = class {
        blockLen;
        outputLen;
        padOffset;
        isLE;
        // For partial updates less than block size
        buffer;
        view;
        finished = false;
        length = 0;
        pos = 0;
        destroyed = false;
        constructor(blockLen, outputLen, padOffset, isLE2) {
          this.blockLen = blockLen;
          this.outputLen = outputLen;
          this.padOffset = padOffset;
          this.isLE = isLE2;
          this.buffer = new Uint8Array(blockLen);
          this.view = createView(this.buffer);
        }
        update(data) {
          aexists(this);
          abytes(data);
          const { view, buffer, blockLen } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              const dataView = createView(data);
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(dataView, pos);
              continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
            }
          }
          this.length += data.length;
          this.roundClean();
          return this;
        }
        digestInto(out) {
          aexists(this);
          aoutput(out, this);
          this.finished = true;
          const { buffer, view, blockLen, isLE: isLE2 } = this;
          let { pos } = this;
          buffer[pos++] = 128;
          clean(this.buffer.subarray(pos));
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
          }
          for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
          view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE2);
          this.process(view, 0);
          const oview = createView(out);
          const len = this.outputLen;
          if (len % 4)
            throw new Error("_sha2: outputLen must be aligned to 32bit");
          const outLen = len / 4;
          const state = this.get();
          if (outLen > state.length)
            throw new Error("_sha2: outputLen bigger than state");
          for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE2);
        }
        digest() {
          const { buffer, outputLen } = this;
          this.digestInto(buffer);
          const res = buffer.slice(0, outputLen);
          this.destroy();
          return res;
        }
        _cloneInto(to) {
          to ||= new this.constructor();
          to.set(...this.get());
          const { blockLen, buffer, length, finished, destroyed, pos } = this;
          to.destroyed = destroyed;
          to.finished = finished;
          to.length = length;
          to.pos = pos;
          if (length % blockLen)
            to.buffer.set(buffer);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
      };
      SHA256_IV = /* @__PURE__ */ Uint32Array.from([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ]);
      SHA384_IV = /* @__PURE__ */ Uint32Array.from([
        3418070365,
        3238371032,
        1654270250,
        914150663,
        2438529370,
        812702999,
        355462360,
        4144912697,
        1731405415,
        4290775857,
        2394180231,
        1750603025,
        3675008525,
        1694076839,
        1203062813,
        3204075428
      ]);
      SHA512_IV = /* @__PURE__ */ Uint32Array.from([
        1779033703,
        4089235720,
        3144134277,
        2227873595,
        1013904242,
        4271175723,
        2773480762,
        1595750129,
        1359893119,
        2917565137,
        2600822924,
        725511199,
        528734635,
        4215389547,
        1541459225,
        327033209
      ]);
    }
  });

  // node_modules/@noble/hashes/_u64.js
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i = 0; i < len; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
  }
  var U32_MASK64, _32n, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, rotlSH, rotlSL, rotlBH, rotlBL, add3L, add3H, add4L, add4H, add5L, add5H;
  var init_u64 = __esm({
    "node_modules/@noble/hashes/_u64.js"() {
      U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
      _32n = /* @__PURE__ */ BigInt(32);
      shrSH = (h, _l, s) => h >>> s;
      shrSL = (h, l, s) => h << 32 - s | l >>> s;
      rotrSH = (h, l, s) => h >>> s | l << 32 - s;
      rotrSL = (h, l, s) => h << 32 - s | l >>> s;
      rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
      rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
      rotlSH = (h, l, s) => h << s | l >>> 32 - s;
      rotlSL = (h, l, s) => l << s | h >>> 32 - s;
      rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
      rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
      add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
      add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
      add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
      add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
      add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
      add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    }
  });

  // node_modules/@noble/hashes/sha2.js
  var SHA256_K, SHA256_W, SHA2_32B, _SHA256, K512, SHA512_Kh, SHA512_Kl, SHA512_W_H, SHA512_W_L, SHA2_64B, _SHA512, _SHA384, sha256, sha512, sha384;
  var init_sha2 = __esm({
    "node_modules/@noble/hashes/sha2.js"() {
      init_md();
      init_u64();
      init_utils();
      SHA256_K = /* @__PURE__ */ Uint32Array.from([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      SHA256_W = /* @__PURE__ */ new Uint32Array(64);
      SHA2_32B = class extends HashMD {
        constructor(outputLen) {
          super(64, outputLen, 8, false);
        }
        get() {
          const { A, B, C, D, E, F, G, H } = this;
          return [A, B, C, D, E, F, G, H];
        }
        // prettier-ignore
        set(A, B, C, D, E, F, G, H) {
          this.A = A | 0;
          this.B = B | 0;
          this.C = C | 0;
          this.D = D | 0;
          this.E = E | 0;
          this.F = F | 0;
          this.G = G | 0;
          this.H = H | 0;
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
          for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
            SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
          }
          let { A, B, C, D, E, F, G, H } = this;
          for (let i = 0; i < 64; i++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = sigma0 + Maj(A, B, C) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B;
            B = A;
            A = T1 + T2 | 0;
          }
          A = A + this.A | 0;
          B = B + this.B | 0;
          C = C + this.C | 0;
          D = D + this.D | 0;
          E = E + this.E | 0;
          F = F + this.F | 0;
          G = G + this.G | 0;
          H = H + this.H | 0;
          this.set(A, B, C, D, E, F, G, H);
        }
        roundClean() {
          clean(SHA256_W);
        }
        destroy() {
          this.set(0, 0, 0, 0, 0, 0, 0, 0);
          clean(this.buffer);
        }
      };
      _SHA256 = class extends SHA2_32B {
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        A = SHA256_IV[0] | 0;
        B = SHA256_IV[1] | 0;
        C = SHA256_IV[2] | 0;
        D = SHA256_IV[3] | 0;
        E = SHA256_IV[4] | 0;
        F = SHA256_IV[5] | 0;
        G = SHA256_IV[6] | 0;
        H = SHA256_IV[7] | 0;
        constructor() {
          super(32);
        }
      };
      K512 = /* @__PURE__ */ (() => split([
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817"
      ].map((n) => BigInt(n))))();
      SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
      SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
      SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
      SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
      SHA2_64B = class extends HashMD {
        constructor(outputLen) {
          super(128, outputLen, 16, false);
        }
        // prettier-ignore
        get() {
          const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
          return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
        }
        // prettier-ignore
        set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
          this.Ah = Ah | 0;
          this.Al = Al | 0;
          this.Bh = Bh | 0;
          this.Bl = Bl | 0;
          this.Ch = Ch | 0;
          this.Cl = Cl | 0;
          this.Dh = Dh | 0;
          this.Dl = Dl | 0;
          this.Eh = Eh | 0;
          this.El = El | 0;
          this.Fh = Fh | 0;
          this.Fl = Fl | 0;
          this.Gh = Gh | 0;
          this.Gl = Gl | 0;
          this.Hh = Hh | 0;
          this.Hl = Hl | 0;
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32(offset += 4);
          }
          for (let i = 16; i < 80; i++) {
            const W15h = SHA512_W_H[i - 15] | 0;
            const W15l = SHA512_W_L[i - 15] | 0;
            const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
            const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
            const W2h = SHA512_W_H[i - 2] | 0;
            const W2l = SHA512_W_L[i - 2] | 0;
            const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
            const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
            const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
            const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
            SHA512_W_H[i] = SUMh | 0;
            SHA512_W_L[i] = SUMl | 0;
          }
          let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
          for (let i = 0; i < 80; i++) {
            const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
            const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
            const CHIh = Eh & Fh ^ ~Eh & Gh;
            const CHIl = El & Fl ^ ~El & Gl;
            const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
            const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
            const T1l = T1ll | 0;
            const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
            const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
            const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
            const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = add3L(T1l, sigma0l, MAJl);
            Ah = add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
          }
          ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
          ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
          ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
          ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
          ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
          ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
          ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
          ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
          this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
        }
        roundClean() {
          clean(SHA512_W_H, SHA512_W_L);
        }
        destroy() {
          clean(this.buffer);
          this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
      };
      _SHA512 = class extends SHA2_64B {
        Ah = SHA512_IV[0] | 0;
        Al = SHA512_IV[1] | 0;
        Bh = SHA512_IV[2] | 0;
        Bl = SHA512_IV[3] | 0;
        Ch = SHA512_IV[4] | 0;
        Cl = SHA512_IV[5] | 0;
        Dh = SHA512_IV[6] | 0;
        Dl = SHA512_IV[7] | 0;
        Eh = SHA512_IV[8] | 0;
        El = SHA512_IV[9] | 0;
        Fh = SHA512_IV[10] | 0;
        Fl = SHA512_IV[11] | 0;
        Gh = SHA512_IV[12] | 0;
        Gl = SHA512_IV[13] | 0;
        Hh = SHA512_IV[14] | 0;
        Hl = SHA512_IV[15] | 0;
        constructor() {
          super(64);
        }
      };
      _SHA384 = class extends SHA2_64B {
        Ah = SHA384_IV[0] | 0;
        Al = SHA384_IV[1] | 0;
        Bh = SHA384_IV[2] | 0;
        Bl = SHA384_IV[3] | 0;
        Ch = SHA384_IV[4] | 0;
        Cl = SHA384_IV[5] | 0;
        Dh = SHA384_IV[6] | 0;
        Dl = SHA384_IV[7] | 0;
        Eh = SHA384_IV[8] | 0;
        El = SHA384_IV[9] | 0;
        Fh = SHA384_IV[10] | 0;
        Fl = SHA384_IV[11] | 0;
        Gh = SHA384_IV[12] | 0;
        Gl = SHA384_IV[13] | 0;
        Hh = SHA384_IV[14] | 0;
        Hl = SHA384_IV[15] | 0;
        constructor() {
          super(48);
        }
      };
      sha256 = /* @__PURE__ */ createHasher(
        () => new _SHA256(),
        /* @__PURE__ */ oidNist(1)
      );
      sha512 = /* @__PURE__ */ createHasher(
        () => new _SHA512(),
        /* @__PURE__ */ oidNist(3)
      );
      sha384 = /* @__PURE__ */ createHasher(
        () => new _SHA384(),
        /* @__PURE__ */ oidNist(2)
      );
    }
  });

  // node_modules/@noble/curves/utils.js
  function abool(value, title = "") {
    if (typeof value !== "boolean") {
      const prefix = title && `"${title}" `;
      throw new Error(prefix + "expected boolean, got type=" + typeof value);
    }
    return value;
  }
  function abignumber(n) {
    if (typeof n === "bigint") {
      if (!isPosBig(n))
        throw new Error("positive bigint expected, got " + n);
    } else
      anumber(n);
    return n;
  }
  function asafenumber(value, title = "") {
    if (!Number.isSafeInteger(value)) {
      const prefix = title && `"${title}" `;
      throw new Error(prefix + "expected safe integer, got type=" + typeof value);
    }
  }
  function numberToHexUnpadded(num2) {
    const hex = abignumber(num2).toString(16);
    return hex.length & 1 ? "0" + hex : hex;
  }
  function hexToNumber(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    return hex === "" ? _0n : BigInt("0x" + hex);
  }
  function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex(bytes));
  }
  function bytesToNumberLE(bytes) {
    return hexToNumber(bytesToHex(copyBytes(abytes(bytes)).reverse()));
  }
  function numberToBytesBE(n, len) {
    anumber(len);
    n = abignumber(n);
    const res = hexToBytes(n.toString(16).padStart(len * 2, "0"));
    if (res.length !== len)
      throw new Error("number too large");
    return res;
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function equalBytes(a, b) {
    if (a.length !== b.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a[i] ^ b[i];
    return diff === 0;
  }
  function copyBytes(bytes) {
    return Uint8Array.from(bytes);
  }
  function asciiToBytes(ascii) {
    return Uint8Array.from(ascii, (c, i) => {
      const charCode = c.charCodeAt(0);
      if (c.length !== 1 || charCode > 127) {
        throw new Error(`string contains non-ASCII character "${ascii[i]}" with code ${charCode} at position ${i}`);
      }
      return charCode;
    });
  }
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  function bitLen(n) {
    let len;
    for (len = 0; n > _0n; n >>= _1n, len += 1)
      ;
    return len;
  }
  function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    anumber(hashLen, "hashLen");
    anumber(qByteLen, "qByteLen");
    if (typeof hmacFn !== "function")
      throw new Error("hmacFn must be a function");
    const u8n = (len) => new Uint8Array(len);
    const NULL = Uint8Array.of();
    const byte0 = Uint8Array.of(0);
    const byte1 = Uint8Array.of(1);
    const _maxDrbgIters = 1e3;
    let v = u8n(hashLen);
    let k = u8n(hashLen);
    let i = 0;
    const reset = () => {
      v.fill(1);
      k.fill(0);
      i = 0;
    };
    const h = (...msgs) => hmacFn(k, concatBytes(v, ...msgs));
    const reseed = (seed = NULL) => {
      k = h(byte0, seed);
      v = h();
      if (seed.length === 0)
        return;
      k = h(byte1, seed);
      v = h();
    };
    const gen = () => {
      if (i++ >= _maxDrbgIters)
        throw new Error("drbg: tried max amount of iterations");
      let len = 0;
      const out = [];
      while (len < qByteLen) {
        v = h();
        const sl = v.slice();
        out.push(sl);
        len += v.length;
      }
      return concatBytes(...out);
    };
    const genUntil = (seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen())))
        reseed();
      reset();
      return res;
    };
    return genUntil;
  }
  function validateObject(object, fields = {}, optFields = {}) {
    if (!object || typeof object !== "object")
      throw new Error("expected valid options object");
    function checkField(fieldName, expectedType, isOpt) {
      const val = object[fieldName];
      if (isOpt && val === void 0)
        return;
      const current = typeof val;
      if (current !== expectedType || val === null)
        throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
    }
    const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
    iter(fields, false);
    iter(optFields, true);
  }
  function memoized(fn) {
    const map = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map.get(arg);
      if (val !== void 0)
        return val;
      const computed = fn(arg, ...args);
      map.set(arg, computed);
      return computed;
    };
  }
  var _0n, _1n, isPosBig, bitMask, notImplemented;
  var init_utils2 = __esm({
    "node_modules/@noble/curves/utils.js"() {
      init_utils();
      init_utils();
      _0n = /* @__PURE__ */ BigInt(0);
      _1n = /* @__PURE__ */ BigInt(1);
      isPosBig = (n) => typeof n === "bigint" && _0n <= n;
      bitMask = (n) => (_1n << BigInt(n)) - _1n;
      notImplemented = () => {
        throw new Error("not implemented");
      };
    }
  });

  // node_modules/@noble/curves/abstract/modular.js
  function mod(a, b) {
    const result = a % b;
    return result >= _0n2 ? result : b + result;
  }
  function pow2(x, power, modulo) {
    let res = x;
    while (power-- > _0n2) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  function invert(number, modulo) {
    if (number === _0n2)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _0n2)
      throw new Error("invert: expected positive modulus, got " + modulo);
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
    while (a !== _0n2) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n2)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  function assertIsSquare(Fp3, root, n) {
    if (!Fp3.eql(Fp3.sqr(root), n))
      throw new Error("Cannot find square root");
  }
  function sqrt3mod4(Fp3, n) {
    const p1div4 = (Fp3.ORDER + _1n2) / _4n;
    const root = Fp3.pow(n, p1div4);
    assertIsSquare(Fp3, root, n);
    return root;
  }
  function sqrt5mod8(Fp3, n) {
    const p5div8 = (Fp3.ORDER - _5n) / _8n;
    const n2 = Fp3.mul(n, _2n);
    const v = Fp3.pow(n2, p5div8);
    const nv = Fp3.mul(n, v);
    const i = Fp3.mul(Fp3.mul(nv, _2n), v);
    const root = Fp3.mul(nv, Fp3.sub(i, Fp3.ONE));
    assertIsSquare(Fp3, root, n);
    return root;
  }
  function sqrt9mod16(P) {
    const Fp_ = Field(P);
    const tn = tonelliShanks(P);
    const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
    const c2 = tn(Fp_, c1);
    const c3 = tn(Fp_, Fp_.neg(c1));
    const c4 = (P + _7n) / _16n;
    return (Fp3, n) => {
      let tv1 = Fp3.pow(n, c4);
      let tv2 = Fp3.mul(tv1, c1);
      const tv3 = Fp3.mul(tv1, c2);
      const tv4 = Fp3.mul(tv1, c3);
      const e1 = Fp3.eql(Fp3.sqr(tv2), n);
      const e2 = Fp3.eql(Fp3.sqr(tv3), n);
      tv1 = Fp3.cmov(tv1, tv2, e1);
      tv2 = Fp3.cmov(tv4, tv3, e2);
      const e3 = Fp3.eql(Fp3.sqr(tv2), n);
      const root = Fp3.cmov(tv1, tv2, e3);
      assertIsSquare(Fp3, root, n);
      return root;
    };
  }
  function tonelliShanks(P) {
    if (P < _3n)
      throw new Error("sqrt is not defined for small field");
    let Q = P - _1n2;
    let S = 0;
    while (Q % _2n === _0n2) {
      Q /= _2n;
      S++;
    }
    let Z = _2n;
    const _Fp = Field(P);
    while (FpLegendre(_Fp, Z) === 1) {
      if (Z++ > 1e3)
        throw new Error("Cannot find square root: probably non-prime P");
    }
    if (S === 1)
      return sqrt3mod4;
    let cc = _Fp.pow(Z, Q);
    const Q1div2 = (Q + _1n2) / _2n;
    return function tonelliSlow(Fp3, n) {
      if (Fp3.is0(n))
        return n;
      if (FpLegendre(Fp3, n) !== 1)
        throw new Error("Cannot find square root");
      let M = S;
      let c = Fp3.mul(Fp3.ONE, cc);
      let t = Fp3.pow(n, Q);
      let R = Fp3.pow(n, Q1div2);
      while (!Fp3.eql(t, Fp3.ONE)) {
        if (Fp3.is0(t))
          return Fp3.ZERO;
        let i = 1;
        let t_tmp = Fp3.sqr(t);
        while (!Fp3.eql(t_tmp, Fp3.ONE)) {
          i++;
          t_tmp = Fp3.sqr(t_tmp);
          if (i === M)
            throw new Error("Cannot find square root");
        }
        const exponent = _1n2 << BigInt(M - i - 1);
        const b = Fp3.pow(c, exponent);
        M = i;
        c = Fp3.sqr(b);
        t = Fp3.mul(t, c);
        R = Fp3.mul(R, b);
      }
      return R;
    };
  }
  function FpSqrt(P) {
    if (P % _4n === _3n)
      return sqrt3mod4;
    if (P % _8n === _5n)
      return sqrt5mod8;
    if (P % _16n === _9n)
      return sqrt9mod16(P);
    return tonelliShanks(P);
  }
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      BYTES: "number",
      BITS: "number"
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
      map[val] = "function";
      return map;
    }, initial);
    validateObject(field, opts);
    return field;
  }
  function FpPow(Fp3, num2, power) {
    if (power < _0n2)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n2)
      return Fp3.ONE;
    if (power === _1n2)
      return num2;
    let p = Fp3.ONE;
    let d = num2;
    while (power > _0n2) {
      if (power & _1n2)
        p = Fp3.mul(p, d);
      d = Fp3.sqr(d);
      power >>= _1n2;
    }
    return p;
  }
  function FpInvertBatch(Fp3, nums, passZero = false) {
    const inverted = new Array(nums.length).fill(passZero ? Fp3.ZERO : void 0);
    const multipliedAcc = nums.reduce((acc, num2, i) => {
      if (Fp3.is0(num2))
        return acc;
      inverted[i] = acc;
      return Fp3.mul(acc, num2);
    }, Fp3.ONE);
    const invertedAcc = Fp3.inv(multipliedAcc);
    nums.reduceRight((acc, num2, i) => {
      if (Fp3.is0(num2))
        return acc;
      inverted[i] = Fp3.mul(acc, inverted[i]);
      return Fp3.mul(acc, num2);
    }, invertedAcc);
    return inverted;
  }
  function FpLegendre(Fp3, n) {
    const p1mod2 = (Fp3.ORDER - _1n2) / _2n;
    const powered = Fp3.pow(n, p1mod2);
    const yes = Fp3.eql(powered, Fp3.ONE);
    const zero = Fp3.eql(powered, Fp3.ZERO);
    const no = Fp3.eql(powered, Fp3.neg(Fp3.ONE));
    if (!yes && !zero && !no)
      throw new Error("invalid Legendre symbol result");
    return yes ? 1 : zero ? 0 : -1;
  }
  function nLength(n, nBitLength) {
    if (nBitLength !== void 0)
      anumber(nBitLength);
    const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  function Field(ORDER, opts = {}) {
    return new _Field(ORDER, opts);
  }
  function FpSqrtEven(Fp3, elm) {
    if (!Fp3.isOdd)
      throw new Error("Field doesn't have isOdd");
    const root = Fp3.sqrt(elm);
    return Fp3.isOdd(root) ? Fp3.neg(root) : root;
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE2 = false) {
    abytes(key);
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num2 = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
    const reduced = mod(num2, fieldOrder - _1n2) + _1n2;
    return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
  }
  var _0n2, _1n2, _2n, _3n, _4n, _5n, _7n, _8n, _9n, _16n, isNegativeLE, FIELD_FIELDS, _Field;
  var init_modular = __esm({
    "node_modules/@noble/curves/abstract/modular.js"() {
      init_utils2();
      _0n2 = /* @__PURE__ */ BigInt(0);
      _1n2 = /* @__PURE__ */ BigInt(1);
      _2n = /* @__PURE__ */ BigInt(2);
      _3n = /* @__PURE__ */ BigInt(3);
      _4n = /* @__PURE__ */ BigInt(4);
      _5n = /* @__PURE__ */ BigInt(5);
      _7n = /* @__PURE__ */ BigInt(7);
      _8n = /* @__PURE__ */ BigInt(8);
      _9n = /* @__PURE__ */ BigInt(9);
      _16n = /* @__PURE__ */ BigInt(16);
      isNegativeLE = (num2, modulo) => (mod(num2, modulo) & _1n2) === _1n2;
      FIELD_FIELDS = [
        "create",
        "isValid",
        "is0",
        "neg",
        "inv",
        "sqrt",
        "sqr",
        "eql",
        "add",
        "sub",
        "mul",
        "pow",
        "div",
        "addN",
        "subN",
        "mulN",
        "sqrN"
      ];
      _Field = class {
        ORDER;
        BITS;
        BYTES;
        isLE;
        ZERO = _0n2;
        ONE = _1n2;
        _lengths;
        _sqrt;
        // cached sqrt
        _mod;
        constructor(ORDER, opts = {}) {
          if (ORDER <= _0n2)
            throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
          let _nbitLength = void 0;
          this.isLE = false;
          if (opts != null && typeof opts === "object") {
            if (typeof opts.BITS === "number")
              _nbitLength = opts.BITS;
            if (typeof opts.sqrt === "function")
              this.sqrt = opts.sqrt;
            if (typeof opts.isLE === "boolean")
              this.isLE = opts.isLE;
            if (opts.allowedLengths)
              this._lengths = opts.allowedLengths?.slice();
            if (typeof opts.modFromBytes === "boolean")
              this._mod = opts.modFromBytes;
          }
          const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
          if (nByteLength > 2048)
            throw new Error("invalid field: expected ORDER of <= 2048 bytes");
          this.ORDER = ORDER;
          this.BITS = nBitLength;
          this.BYTES = nByteLength;
          this._sqrt = void 0;
          Object.preventExtensions(this);
        }
        create(num2) {
          return mod(num2, this.ORDER);
        }
        isValid(num2) {
          if (typeof num2 !== "bigint")
            throw new Error("invalid field element: expected bigint, got " + typeof num2);
          return _0n2 <= num2 && num2 < this.ORDER;
        }
        is0(num2) {
          return num2 === _0n2;
        }
        // is valid and invertible
        isValidNot0(num2) {
          return !this.is0(num2) && this.isValid(num2);
        }
        isOdd(num2) {
          return (num2 & _1n2) === _1n2;
        }
        neg(num2) {
          return mod(-num2, this.ORDER);
        }
        eql(lhs, rhs) {
          return lhs === rhs;
        }
        sqr(num2) {
          return mod(num2 * num2, this.ORDER);
        }
        add(lhs, rhs) {
          return mod(lhs + rhs, this.ORDER);
        }
        sub(lhs, rhs) {
          return mod(lhs - rhs, this.ORDER);
        }
        mul(lhs, rhs) {
          return mod(lhs * rhs, this.ORDER);
        }
        pow(num2, power) {
          return FpPow(this, num2, power);
        }
        div(lhs, rhs) {
          return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
        }
        // Same as above, but doesn't normalize
        sqrN(num2) {
          return num2 * num2;
        }
        addN(lhs, rhs) {
          return lhs + rhs;
        }
        subN(lhs, rhs) {
          return lhs - rhs;
        }
        mulN(lhs, rhs) {
          return lhs * rhs;
        }
        inv(num2) {
          return invert(num2, this.ORDER);
        }
        sqrt(num2) {
          if (!this._sqrt)
            this._sqrt = FpSqrt(this.ORDER);
          return this._sqrt(this, num2);
        }
        toBytes(num2) {
          return this.isLE ? numberToBytesLE(num2, this.BYTES) : numberToBytesBE(num2, this.BYTES);
        }
        fromBytes(bytes, skipValidation = false) {
          abytes(bytes);
          const { _lengths: allowedLengths, BYTES, isLE: isLE2, ORDER, _mod: modFromBytes } = this;
          if (allowedLengths) {
            if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
              throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
            }
            const padded = new Uint8Array(BYTES);
            padded.set(bytes, isLE2 ? 0 : padded.length - bytes.length);
            bytes = padded;
          }
          if (bytes.length !== BYTES)
            throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
          let scalar = isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
          if (modFromBytes)
            scalar = mod(scalar, ORDER);
          if (!skipValidation) {
            if (!this.isValid(scalar))
              throw new Error("invalid field element: outside of range 0..ORDER");
          }
          return scalar;
        }
        // TODO: we don't need it here, move out to separate fn
        invertBatch(lst) {
          return FpInvertBatch(this, lst);
        }
        // We can't move this out because Fp6, Fp12 implement it
        // and it's unclear what to return in there.
        cmov(a, b, condition) {
          return condition ? b : a;
        }
      };
    }
  });

  // node_modules/@noble/curves/abstract/hash-to-curve.js
  function i2osp(value, length) {
    asafenumber(value);
    asafenumber(length);
    if (value < 0 || value >= 1 << 8 * length)
      throw new Error("invalid I2OSP input: " + value);
    const res = Array.from({ length }).fill(0);
    for (let i = length - 1; i >= 0; i--) {
      res[i] = value & 255;
      value >>>= 8;
    }
    return new Uint8Array(res);
  }
  function strxor(a, b) {
    const arr = new Uint8Array(a.length);
    for (let i = 0; i < a.length; i++) {
      arr[i] = a[i] ^ b[i];
    }
    return arr;
  }
  function normDST(DST) {
    if (!isBytes(DST) && typeof DST !== "string")
      throw new Error("DST must be Uint8Array or ascii string");
    return typeof DST === "string" ? asciiToBytes(DST) : DST;
  }
  function expand_message_xmd(msg, DST, lenInBytes, H) {
    abytes(msg);
    asafenumber(lenInBytes);
    DST = normDST(DST);
    if (DST.length > 255)
      DST = H(concatBytes(asciiToBytes("H2C-OVERSIZE-DST-"), DST));
    const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
    const ell = Math.ceil(lenInBytes / b_in_bytes);
    if (lenInBytes > 65535 || ell > 255)
      throw new Error("expand_message_xmd: invalid lenInBytes");
    const DST_prime = concatBytes(DST, i2osp(DST.length, 1));
    const Z_pad = i2osp(0, r_in_bytes);
    const l_i_b_str = i2osp(lenInBytes, 2);
    const b = new Array(ell);
    const b_0 = H(concatBytes(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
    b[0] = H(concatBytes(b_0, i2osp(1, 1), DST_prime));
    for (let i = 1; i <= ell; i++) {
      const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
      b[i] = H(concatBytes(...args));
    }
    const pseudo_random_bytes = concatBytes(...b);
    return pseudo_random_bytes.slice(0, lenInBytes);
  }
  function expand_message_xof(msg, DST, lenInBytes, k, H) {
    abytes(msg);
    asafenumber(lenInBytes);
    DST = normDST(DST);
    if (DST.length > 255) {
      const dkLen = Math.ceil(2 * k / 8);
      DST = H.create({ dkLen }).update(asciiToBytes("H2C-OVERSIZE-DST-")).update(DST).digest();
    }
    if (lenInBytes > 65535 || DST.length > 255)
      throw new Error("expand_message_xof: invalid lenInBytes");
    return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
  }
  function hash_to_field(msg, count, options) {
    validateObject(options, {
      p: "bigint",
      m: "number",
      k: "number",
      hash: "function"
    });
    const { p, k, m, hash, expand, DST } = options;
    asafenumber(hash.outputLen, "valid hash");
    abytes(msg);
    asafenumber(count);
    const log2p = p.toString(2).length;
    const L = Math.ceil((log2p + k) / 8);
    const len_in_bytes = count * m * L;
    let prb;
    if (expand === "xmd") {
      prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
    } else if (expand === "xof") {
      prb = expand_message_xof(msg, DST, len_in_bytes, k, hash);
    } else if (expand === "_internal_pass") {
      prb = msg;
    } else {
      throw new Error('expand must be "xmd" or "xof"');
    }
    const u = new Array(count);
    for (let i = 0; i < count; i++) {
      const e = new Array(m);
      for (let j = 0; j < m; j++) {
        const elm_offset = L * (j + i * m);
        const tv = prb.subarray(elm_offset, elm_offset + L);
        e[j] = mod(os2ip(tv), p);
      }
      u[i] = e;
    }
    return u;
  }
  function isogenyMap(field, map) {
    const coeff = map.map((i) => Array.from(i).reverse());
    return (x, y) => {
      const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
      const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
      x = field.mul(xn, xd_inv);
      y = field.mul(y, field.mul(yn, yd_inv));
      return { x, y };
    };
  }
  function createHasher2(Point, mapToCurve, defaults) {
    if (typeof mapToCurve !== "function")
      throw new Error("mapToCurve() must be defined");
    function map(num2) {
      return Point.fromAffine(mapToCurve(num2));
    }
    function clear(initial) {
      const P = initial.clearCofactor();
      if (P.equals(Point.ZERO))
        return Point.ZERO;
      P.assertValidity();
      return P;
    }
    return {
      defaults: Object.freeze(defaults),
      Point,
      hashToCurve(msg, options) {
        const opts = Object.assign({}, defaults, options);
        const u = hash_to_field(msg, 2, opts);
        const u0 = map(u[0]);
        const u1 = map(u[1]);
        return clear(u0.add(u1));
      },
      encodeToCurve(msg, options) {
        const optsDst = defaults.encodeDST ? { DST: defaults.encodeDST } : {};
        const opts = Object.assign({}, defaults, optsDst, options);
        const u = hash_to_field(msg, 1, opts);
        const u0 = map(u[0]);
        return clear(u0);
      },
      /** See {@link H2CHasher} */
      mapToCurve(scalars) {
        if (defaults.m === 1) {
          if (typeof scalars !== "bigint")
            throw new Error("expected bigint (m=1)");
          return clear(map([scalars]));
        }
        if (!Array.isArray(scalars))
          throw new Error("expected array of bigints");
        for (const i of scalars)
          if (typeof i !== "bigint")
            throw new Error("expected array of bigints");
        return clear(map(scalars));
      },
      // hash_to_scalar can produce 0: https://www.rfc-editor.org/errata/eid8393
      // RFC 9380, draft-irtf-cfrg-bbs-signatures-08
      hashToScalar(msg, options) {
        const N = Point.Fn.ORDER;
        const opts = Object.assign({}, defaults, { p: N, m: 1, DST: _DST_scalar }, options);
        return hash_to_field(msg, 1, opts)[0][0];
      }
    };
  }
  var os2ip, _DST_scalar;
  var init_hash_to_curve = __esm({
    "node_modules/@noble/curves/abstract/hash-to-curve.js"() {
      init_utils2();
      init_modular();
      os2ip = bytesToNumberBE;
      _DST_scalar = asciiToBytes("HashToScalar-");
    }
  });

  // node_modules/@noble/curves/abstract/curve.js
  function negateCt(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
  }
  function normalizeZ(c, points) {
    const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
    return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
  }
  function validateW(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
  }
  function calcWOpts(W, scalarBits) {
    validateW(W, scalarBits);
    const windows = Math.ceil(scalarBits / W) + 1;
    const windowSize = 2 ** (W - 1);
    const maxNumber = 2 ** W;
    const mask = bitMask(W);
    const shiftBy = BigInt(W);
    return { windows, windowSize, mask, maxNumber, shiftBy };
  }
  function calcOffsets(n, window2, wOpts) {
    const { windowSize, mask, maxNumber, shiftBy } = wOpts;
    let wbits = Number(n & mask);
    let nextN = n >> shiftBy;
    if (wbits > windowSize) {
      wbits -= maxNumber;
      nextN += _1n3;
    }
    const offsetStart = window2 * windowSize;
    const offset = offsetStart + Math.abs(wbits) - 1;
    const isZero = wbits === 0;
    const isNeg = wbits < 0;
    const isNegF = window2 % 2 !== 0;
    const offsetF = offsetStart;
    return { nextN, offset, isZero, isNeg, isNegF, offsetF };
  }
  function validateMSMPoints(points, c) {
    if (!Array.isArray(points))
      throw new Error("array expected");
    points.forEach((p, i) => {
      if (!(p instanceof c))
        throw new Error("invalid point at index " + i);
    });
  }
  function validateMSMScalars(scalars, field) {
    if (!Array.isArray(scalars))
      throw new Error("array of scalars expected");
    scalars.forEach((s, i) => {
      if (!field.isValid(s))
        throw new Error("invalid scalar at index " + i);
    });
  }
  function getW(P) {
    return pointWindowSizes.get(P) || 1;
  }
  function assert0(n) {
    if (n !== _0n3)
      throw new Error("invalid wNAF");
  }
  function mulEndoUnsafe(Point, point, k1, k2) {
    let acc = point;
    let p1 = Point.ZERO;
    let p2 = Point.ZERO;
    while (k1 > _0n3 || k2 > _0n3) {
      if (k1 & _1n3)
        p1 = p1.add(acc);
      if (k2 & _1n3)
        p2 = p2.add(acc);
      acc = acc.double();
      k1 >>= _1n3;
      k2 >>= _1n3;
    }
    return { p1, p2 };
  }
  function pippenger(c, points, scalars) {
    const fieldN = c.Fn;
    validateMSMPoints(points, c);
    validateMSMScalars(scalars, fieldN);
    const plength = points.length;
    const slength = scalars.length;
    if (plength !== slength)
      throw new Error("arrays of points and scalars must have equal length");
    const zero = c.ZERO;
    const wbits = bitLen(BigInt(plength));
    let windowSize = 1;
    if (wbits > 12)
      windowSize = wbits - 3;
    else if (wbits > 4)
      windowSize = wbits - 2;
    else if (wbits > 0)
      windowSize = 2;
    const MASK = bitMask(windowSize);
    const buckets = new Array(Number(MASK) + 1).fill(zero);
    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
    let sum = zero;
    for (let i = lastBits; i >= 0; i -= windowSize) {
      buckets.fill(zero);
      for (let j = 0; j < slength; j++) {
        const scalar = scalars[j];
        const wbits2 = Number(scalar >> BigInt(i) & MASK);
        buckets[wbits2] = buckets[wbits2].add(points[j]);
      }
      let resI = zero;
      for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
        sumI = sumI.add(buckets[j]);
        resI = resI.add(sumI);
      }
      sum = sum.add(resI);
      if (i !== 0)
        for (let j = 0; j < windowSize; j++)
          sum = sum.double();
    }
    return sum;
  }
  function createField(order, field, isLE2) {
    if (field) {
      if (field.ORDER !== order)
        throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
      validateField(field);
      return field;
    } else {
      return Field(order, { isLE: isLE2 });
    }
  }
  function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
    if (FpFnLE === void 0)
      FpFnLE = type === "edwards";
    if (!CURVE || typeof CURVE !== "object")
      throw new Error(`expected valid ${type} CURVE object`);
    for (const p of ["p", "n", "h"]) {
      const val = CURVE[p];
      if (!(typeof val === "bigint" && val > _0n3))
        throw new Error(`CURVE.${p} must be positive bigint`);
    }
    const Fp3 = createField(CURVE.p, curveOpts.Fp, FpFnLE);
    const Fn3 = createField(CURVE.n, curveOpts.Fn, FpFnLE);
    const _b = type === "weierstrass" ? "b" : "d";
    const params = ["Gx", "Gy", "a", _b];
    for (const p of params) {
      if (!Fp3.isValid(CURVE[p]))
        throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
    }
    CURVE = Object.freeze(Object.assign({}, CURVE));
    return { CURVE, Fp: Fp3, Fn: Fn3 };
  }
  function createKeygen(randomSecretKey, getPublicKey) {
    return function keygen(seed) {
      const secretKey = randomSecretKey(seed);
      return { secretKey, publicKey: getPublicKey(secretKey) };
    };
  }
  var _0n3, _1n3, pointPrecomputes, pointWindowSizes, wNAF;
  var init_curve = __esm({
    "node_modules/@noble/curves/abstract/curve.js"() {
      init_utils2();
      init_modular();
      _0n3 = /* @__PURE__ */ BigInt(0);
      _1n3 = /* @__PURE__ */ BigInt(1);
      pointPrecomputes = /* @__PURE__ */ new WeakMap();
      pointWindowSizes = /* @__PURE__ */ new WeakMap();
      wNAF = class {
        BASE;
        ZERO;
        Fn;
        bits;
        // Parametrized with a given Point class (not individual point)
        constructor(Point, bits) {
          this.BASE = Point.BASE;
          this.ZERO = Point.ZERO;
          this.Fn = Point.Fn;
          this.bits = bits;
        }
        // non-const time multiplication ladder
        _unsafeLadder(elm, n, p = this.ZERO) {
          let d = elm;
          while (n > _0n3) {
            if (n & _1n3)
              p = p.add(d);
            d = d.double();
            n >>= _1n3;
          }
          return p;
        }
        /**
         * Creates a wNAF precomputation window. Used for caching.
         * Default window size is set by `utils.precompute()` and is equal to 8.
         * Number of precomputed points depends on the curve size:
         * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
         * - 𝑊 is the window size
         * - 𝑛 is the bitlength of the curve order.
         * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
         * @param point Point instance
         * @param W window size
         * @returns precomputed point tables flattened to a single array
         */
        precomputeWindow(point, W) {
          const { windows, windowSize } = calcWOpts(W, this.bits);
          const points = [];
          let p = point;
          let base = p;
          for (let window2 = 0; window2 < windows; window2++) {
            base = p;
            points.push(base);
            for (let i = 1; i < windowSize; i++) {
              base = base.add(p);
              points.push(base);
            }
            p = base.double();
          }
          return points;
        }
        /**
         * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
         * More compact implementation:
         * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
         * @returns real and fake (for const-time) points
         */
        wNAF(W, precomputes, n) {
          if (!this.Fn.isValid(n))
            throw new Error("invalid scalar");
          let p = this.ZERO;
          let f = this.BASE;
          const wo = calcWOpts(W, this.bits);
          for (let window2 = 0; window2 < wo.windows; window2++) {
            const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
            n = nextN;
            if (isZero) {
              f = f.add(negateCt(isNegF, precomputes[offsetF]));
            } else {
              p = p.add(negateCt(isNeg, precomputes[offset]));
            }
          }
          assert0(n);
          return { p, f };
        }
        /**
         * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
         * @param acc accumulator point to add result of multiplication
         * @returns point
         */
        wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
          const wo = calcWOpts(W, this.bits);
          for (let window2 = 0; window2 < wo.windows; window2++) {
            if (n === _0n3)
              break;
            const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
            n = nextN;
            if (isZero) {
              continue;
            } else {
              const item = precomputes[offset];
              acc = acc.add(isNeg ? item.negate() : item);
            }
          }
          assert0(n);
          return acc;
        }
        getPrecomputes(W, point, transform) {
          let comp = pointPrecomputes.get(point);
          if (!comp) {
            comp = this.precomputeWindow(point, W);
            if (W !== 1) {
              if (typeof transform === "function")
                comp = transform(comp);
              pointPrecomputes.set(point, comp);
            }
          }
          return comp;
        }
        cached(point, scalar, transform) {
          const W = getW(point);
          return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
        }
        unsafe(point, scalar, transform, prev) {
          const W = getW(point);
          if (W === 1)
            return this._unsafeLadder(point, scalar, prev);
          return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
        }
        // We calculate precomputes for elliptic curve point multiplication
        // using windowed method. This specifies window size and
        // stores precomputed values. Usually only base point would be precomputed.
        createCache(P, W) {
          validateW(W, this.bits);
          pointWindowSizes.set(P, W);
          pointPrecomputes.delete(P);
        }
        hasCache(elm) {
          return getW(elm) !== 1;
        }
      };
    }
  });

  // node_modules/@noble/curves/abstract/oprf.js
  function createORPF(opts) {
    validateObject(opts, {
      name: "string",
      hash: "function",
      hashToScalar: "function",
      hashToGroup: "function"
    });
    const { name, Point, hash } = opts;
    const { Fn: Fn3 } = Point;
    const hashToGroup = (msg, ctx) => opts.hashToGroup(msg, {
      DST: concatBytes(asciiToBytes("HashToGroup-"), ctx)
    });
    const hashToScalarPrefixed = (msg, ctx) => opts.hashToScalar(msg, { DST: concatBytes(_DST_scalar, ctx) });
    const randomScalar = (rng = randomBytes) => {
      const t = mapHashToField(rng(getMinHashLength(Fn3.ORDER)), Fn3.ORDER, Fn3.isLE);
      return Fn3.isLE ? bytesToNumberLE(t) : bytesToNumberBE(t);
    };
    const msm = (points, scalars) => pippenger(Point, points, scalars);
    const getCtx = (mode) => concatBytes(asciiToBytes("OPRFV1-"), new Uint8Array([mode]), asciiToBytes("-" + name));
    const ctxOPRF = getCtx(0);
    const ctxVOPRF = getCtx(1);
    const ctxPOPRF = getCtx(2);
    function encode(...args) {
      const res = [];
      for (const a of args) {
        if (typeof a === "number")
          res.push(numberToBytesBE(a, 2));
        else if (typeof a === "string")
          res.push(asciiToBytes(a));
        else {
          abytes(a);
          res.push(numberToBytesBE(a.length, 2), a);
        }
      }
      return concatBytes(...res);
    }
    const hashInput = (...bytes) => hash(encode(...bytes, "Finalize"));
    function getTranscripts(B, C, D, ctx) {
      const Bm = B.toBytes();
      const seed = hash(encode(Bm, concatBytes(asciiToBytes("Seed-"), ctx)));
      const res = [];
      for (let i = 0; i < C.length; i++) {
        const Ci = C[i].toBytes();
        const Di = D[i].toBytes();
        const di = hashToScalarPrefixed(encode(seed, i, Ci, Di, "Composite"), ctx);
        res.push(di);
      }
      return res;
    }
    function computeComposites(B, C, D, ctx) {
      const T = getTranscripts(B, C, D, ctx);
      const M = msm(C, T);
      const Z = msm(D, T);
      return { M, Z };
    }
    function computeCompositesFast(k, B, C, D, ctx) {
      const T = getTranscripts(B, C, D, ctx);
      const M = msm(C, T);
      const Z = M.multiply(k);
      return { M, Z };
    }
    function challengeTranscript(B, M, Z, t2, t3, ctx) {
      const [Bm, a0, a1, a2, a3] = [B, M, Z, t2, t3].map((i) => i.toBytes());
      return hashToScalarPrefixed(encode(Bm, a0, a1, a2, a3, "Challenge"), ctx);
    }
    function generateProof(ctx, k, B, C, D, rng) {
      const { M, Z } = computeCompositesFast(k, B, C, D, ctx);
      const r = randomScalar(rng);
      const t2 = Point.BASE.multiply(r);
      const t3 = M.multiply(r);
      const c = challengeTranscript(B, M, Z, t2, t3, ctx);
      const s = Fn3.sub(r, Fn3.mul(c, k));
      return concatBytes(...[c, s].map((i) => Fn3.toBytes(i)));
    }
    function verifyProof(ctx, B, C, D, proof) {
      abytes(proof, 2 * Fn3.BYTES);
      const { M, Z } = computeComposites(B, C, D, ctx);
      const [c, s] = [proof.subarray(0, Fn3.BYTES), proof.subarray(Fn3.BYTES)].map((f) => Fn3.fromBytes(f));
      const t2 = Point.BASE.multiply(s).add(B.multiply(c));
      const t3 = M.multiply(s).add(Z.multiply(c));
      const expectedC = challengeTranscript(B, M, Z, t2, t3, ctx);
      if (!Fn3.eql(c, expectedC))
        throw new Error("proof verification failed");
    }
    function generateKeyPair() {
      const skS = randomScalar();
      const pkS = Point.BASE.multiply(skS);
      return { secretKey: Fn3.toBytes(skS), publicKey: pkS.toBytes() };
    }
    function deriveKeyPair(ctx, seed, info) {
      const dst = concatBytes(asciiToBytes("DeriveKeyPair"), ctx);
      const msg = concatBytes(seed, encode(info), Uint8Array.of(0));
      for (let counter = 0; counter <= 255; counter++) {
        msg[msg.length - 1] = counter;
        const skS = opts.hashToScalar(msg, { DST: dst });
        if (Fn3.is0(skS))
          continue;
        return { secretKey: Fn3.toBytes(skS), publicKey: Point.BASE.multiply(skS).toBytes() };
      }
      throw new Error("Cannot derive key");
    }
    function blind(ctx, input, rng = randomBytes) {
      const blind2 = randomScalar(rng);
      const inputPoint = hashToGroup(input, ctx);
      if (inputPoint.equals(Point.ZERO))
        throw new Error("Input point at infinity");
      const blinded = inputPoint.multiply(blind2);
      return { blind: Fn3.toBytes(blind2), blinded: blinded.toBytes() };
    }
    function evaluate(ctx, secretKey, input) {
      const skS = Fn3.fromBytes(secretKey);
      const inputPoint = hashToGroup(input, ctx);
      if (inputPoint.equals(Point.ZERO))
        throw new Error("Input point at infinity");
      const unblinded = inputPoint.multiply(skS).toBytes();
      return hashInput(input, unblinded);
    }
    const oprf = {
      generateKeyPair,
      deriveKeyPair: (seed, keyInfo) => deriveKeyPair(ctxOPRF, seed, keyInfo),
      blind: (input, rng = randomBytes) => blind(ctxOPRF, input, rng),
      blindEvaluate(secretKey, blindedPoint) {
        const skS = Fn3.fromBytes(secretKey);
        const elm = Point.fromBytes(blindedPoint);
        return elm.multiply(skS).toBytes();
      },
      finalize(input, blindBytes, evaluatedBytes) {
        const blind2 = Fn3.fromBytes(blindBytes);
        const evalPoint = Point.fromBytes(evaluatedBytes);
        const unblinded = evalPoint.multiply(Fn3.inv(blind2)).toBytes();
        return hashInput(input, unblinded);
      },
      evaluate: (secretKey, input) => evaluate(ctxOPRF, secretKey, input)
    };
    const voprf = {
      generateKeyPair,
      deriveKeyPair: (seed, keyInfo) => deriveKeyPair(ctxVOPRF, seed, keyInfo),
      blind: (input, rng = randomBytes) => blind(ctxVOPRF, input, rng),
      blindEvaluateBatch(secretKey, publicKey, blinded, rng = randomBytes) {
        if (!Array.isArray(blinded))
          throw new Error("expected array");
        const skS = Fn3.fromBytes(secretKey);
        const pkS = Point.fromBytes(publicKey);
        const blindedPoints = blinded.map(Point.fromBytes);
        const evaluated = blindedPoints.map((i) => i.multiply(skS));
        const proof = generateProof(ctxVOPRF, skS, pkS, blindedPoints, evaluated, rng);
        return { evaluated: evaluated.map((i) => i.toBytes()), proof };
      },
      blindEvaluate(secretKey, publicKey, blinded, rng = randomBytes) {
        const res = this.blindEvaluateBatch(secretKey, publicKey, [blinded], rng);
        return { evaluated: res.evaluated[0], proof: res.proof };
      },
      finalizeBatch(items, publicKey, proof) {
        if (!Array.isArray(items))
          throw new Error("expected array");
        const pkS = Point.fromBytes(publicKey);
        const blindedPoints = items.map((i) => i.blinded).map(Point.fromBytes);
        const evalPoints = items.map((i) => i.evaluated).map(Point.fromBytes);
        verifyProof(ctxVOPRF, pkS, blindedPoints, evalPoints, proof);
        return items.map((i) => oprf.finalize(i.input, i.blind, i.evaluated));
      },
      finalize(input, blind2, evaluated, blinded, publicKey, proof) {
        return this.finalizeBatch([{ input, blind: blind2, evaluated, blinded }], publicKey, proof)[0];
      },
      evaluate: (secretKey, input) => evaluate(ctxVOPRF, secretKey, input)
    };
    const poprf = (info) => {
      const m = hashToScalarPrefixed(encode("Info", info), ctxPOPRF);
      const T = Point.BASE.multiply(m);
      return {
        generateKeyPair,
        deriveKeyPair: (seed, keyInfo) => deriveKeyPair(ctxPOPRF, seed, keyInfo),
        blind(input, publicKey, rng = randomBytes) {
          const pkS = Point.fromBytes(publicKey);
          const tweakedKey = T.add(pkS);
          if (tweakedKey.equals(Point.ZERO))
            throw new Error("tweakedKey point at infinity");
          const blind2 = randomScalar(rng);
          const inputPoint = hashToGroup(input, ctxPOPRF);
          if (inputPoint.equals(Point.ZERO))
            throw new Error("Input point at infinity");
          const blindedPoint = inputPoint.multiply(blind2);
          return {
            blind: Fn3.toBytes(blind2),
            blinded: blindedPoint.toBytes(),
            tweakedKey: tweakedKey.toBytes()
          };
        },
        blindEvaluateBatch(secretKey, blinded, rng = randomBytes) {
          if (!Array.isArray(blinded))
            throw new Error("expected array");
          const skS = Fn3.fromBytes(secretKey);
          const t = Fn3.add(skS, m);
          const invT = Fn3.inv(t);
          const blindedPoints = blinded.map(Point.fromBytes);
          const evalPoints = blindedPoints.map((i) => i.multiply(invT));
          const tweakedKey = Point.BASE.multiply(t);
          const proof = generateProof(ctxPOPRF, t, tweakedKey, evalPoints, blindedPoints, rng);
          return { evaluated: evalPoints.map((i) => i.toBytes()), proof };
        },
        blindEvaluate(secretKey, blinded, rng = randomBytes) {
          const res = this.blindEvaluateBatch(secretKey, [blinded], rng);
          return { evaluated: res.evaluated[0], proof: res.proof };
        },
        finalizeBatch(items, proof, tweakedKey) {
          if (!Array.isArray(items))
            throw new Error("expected array");
          const evalPoints = items.map((i) => i.evaluated).map(Point.fromBytes);
          verifyProof(ctxPOPRF, Point.fromBytes(tweakedKey), evalPoints, items.map((i) => i.blinded).map(Point.fromBytes), proof);
          return items.map((i, j) => {
            const blind2 = Fn3.fromBytes(i.blind);
            const point = evalPoints[j].multiply(Fn3.inv(blind2)).toBytes();
            return hashInput(i.input, info, point);
          });
        },
        finalize(input, blind2, evaluated, blinded, proof, tweakedKey) {
          return this.finalizeBatch([{ input, blind: blind2, evaluated, blinded }], proof, tweakedKey)[0];
        },
        evaluate(secretKey, input) {
          const skS = Fn3.fromBytes(secretKey);
          const inputPoint = hashToGroup(input, ctxPOPRF);
          if (inputPoint.equals(Point.ZERO))
            throw new Error("Input point at infinity");
          const t = Fn3.add(skS, m);
          const invT = Fn3.inv(t);
          const unblinded = inputPoint.multiply(invT).toBytes();
          return hashInput(input, info, unblinded);
        }
      };
    };
    return Object.freeze({ name, oprf, voprf, poprf, __tests: { Fn: Fn3 } });
  }
  var init_oprf = __esm({
    "node_modules/@noble/curves/abstract/oprf.js"() {
      init_utils2();
      init_curve();
      init_hash_to_curve();
      init_modular();
    }
  });

  // node_modules/@noble/hashes/hmac.js
  var _HMAC, hmac;
  var init_hmac = __esm({
    "node_modules/@noble/hashes/hmac.js"() {
      init_utils();
      _HMAC = class {
        oHash;
        iHash;
        blockLen;
        outputLen;
        finished = false;
        destroyed = false;
        constructor(hash, key) {
          ahash(hash);
          abytes(key, void 0, "key");
          this.iHash = hash.create();
          if (typeof this.iHash.update !== "function")
            throw new Error("Expected instance of class which extends utils.Hash");
          this.blockLen = this.iHash.blockLen;
          this.outputLen = this.iHash.outputLen;
          const blockLen = this.blockLen;
          const pad = new Uint8Array(blockLen);
          pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54;
          this.iHash.update(pad);
          this.oHash = hash.create();
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54 ^ 92;
          this.oHash.update(pad);
          clean(pad);
        }
        update(buf) {
          aexists(this);
          this.iHash.update(buf);
          return this;
        }
        digestInto(out) {
          aexists(this);
          abytes(out, this.outputLen, "output");
          this.finished = true;
          this.iHash.digestInto(out);
          this.oHash.update(out);
          this.oHash.digestInto(out);
          this.destroy();
        }
        digest() {
          const out = new Uint8Array(this.oHash.outputLen);
          this.digestInto(out);
          return out;
        }
        _cloneInto(to) {
          to ||= Object.create(Object.getPrototypeOf(this), {});
          const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
          to = to;
          to.finished = finished;
          to.destroyed = destroyed;
          to.blockLen = blockLen;
          to.outputLen = outputLen;
          to.oHash = oHash._cloneInto(to.oHash);
          to.iHash = iHash._cloneInto(to.iHash);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
        destroy() {
          this.destroyed = true;
          this.oHash.destroy();
          this.iHash.destroy();
        }
      };
      hmac = (hash, key, message) => new _HMAC(hash, key).update(message).digest();
      hmac.create = (hash, key) => new _HMAC(hash, key);
    }
  });

  // node_modules/@noble/curves/abstract/weierstrass.js
  function _splitEndoScalar(k, basis, n) {
    const [[a1, b1], [a2, b2]] = basis;
    const c1 = divNearest(b2 * k, n);
    const c2 = divNearest(-b1 * k, n);
    let k1 = k - c1 * a1 - c2 * a2;
    let k2 = -c1 * b1 - c2 * b2;
    const k1neg = k1 < _0n4;
    const k2neg = k2 < _0n4;
    if (k1neg)
      k1 = -k1;
    if (k2neg)
      k2 = -k2;
    const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n4;
    if (k1 < _0n4 || k1 >= MAX_NUM || k2 < _0n4 || k2 >= MAX_NUM) {
      throw new Error("splitScalar (endomorphism): failed, k=" + k);
    }
    return { k1neg, k1, k2neg, k2 };
  }
  function validateSigFormat(format) {
    if (!["compact", "recovered", "der"].includes(format))
      throw new Error('Signature format must be "compact", "recovered", or "der"');
    return format;
  }
  function validateSigOpts(opts, def) {
    const optsn = {};
    for (let optName of Object.keys(def)) {
      optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
    }
    abool(optsn.lowS, "lowS");
    abool(optsn.prehash, "prehash");
    if (optsn.format !== void 0)
      validateSigFormat(optsn.format);
    return optsn;
  }
  function weierstrass(params, extraOpts = {}) {
    const validated = createCurveFields("weierstrass", params, extraOpts);
    const { Fp: Fp3, Fn: Fn3 } = validated;
    let CURVE = validated.CURVE;
    const { h: cofactor, n: CURVE_ORDER } = CURVE;
    validateObject(extraOpts, {}, {
      allowInfinityPoint: "boolean",
      clearCofactor: "function",
      isTorsionFree: "function",
      fromBytes: "function",
      toBytes: "function",
      endo: "object"
    });
    const { endo } = extraOpts;
    if (endo) {
      if (!Fp3.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
        throw new Error('invalid endo: expected "beta": bigint and "basises": array');
      }
    }
    const lengths = getWLengths(Fp3, Fn3);
    function assertCompressionIsSupported() {
      if (!Fp3.isOdd)
        throw new Error("compression is not supported: Field does not have .isOdd()");
    }
    function pointToBytes2(_c, point, isCompressed) {
      const { x, y } = point.toAffine();
      const bx = Fp3.toBytes(x);
      abool(isCompressed, "isCompressed");
      if (isCompressed) {
        assertCompressionIsSupported();
        const hasEvenY = !Fp3.isOdd(y);
        return concatBytes(pprefix(hasEvenY), bx);
      } else {
        return concatBytes(Uint8Array.of(4), bx, Fp3.toBytes(y));
      }
    }
    function pointFromBytes(bytes) {
      abytes(bytes, void 0, "Point");
      const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
      const length = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      if (length === comp && (head === 2 || head === 3)) {
        const x = Fp3.fromBytes(tail);
        if (!Fp3.isValid(x))
          throw new Error("bad point: is not on curve, wrong x");
        const y2 = weierstrassEquation(x);
        let y;
        try {
          y = Fp3.sqrt(y2);
        } catch (sqrtError) {
          const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("bad point: is not on curve, sqrt error" + err);
        }
        assertCompressionIsSupported();
        const evenY = Fp3.isOdd(y);
        const evenH = (head & 1) === 1;
        if (evenH !== evenY)
          y = Fp3.neg(y);
        return { x, y };
      } else if (length === uncomp && head === 4) {
        const L = Fp3.BYTES;
        const x = Fp3.fromBytes(tail.subarray(0, L));
        const y = Fp3.fromBytes(tail.subarray(L, L * 2));
        if (!isValidXY(x, y))
          throw new Error("bad point: is not on curve");
        return { x, y };
      } else {
        throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
      }
    }
    const encodePoint = extraOpts.toBytes || pointToBytes2;
    const decodePoint = extraOpts.fromBytes || pointFromBytes;
    function weierstrassEquation(x) {
      const x2 = Fp3.sqr(x);
      const x3 = Fp3.mul(x2, x);
      return Fp3.add(Fp3.add(x3, Fp3.mul(x, CURVE.a)), CURVE.b);
    }
    function isValidXY(x, y) {
      const left = Fp3.sqr(y);
      const right = weierstrassEquation(x);
      return Fp3.eql(left, right);
    }
    if (!isValidXY(CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    const _4a3 = Fp3.mul(Fp3.pow(CURVE.a, _3n2), _4n2);
    const _27b2 = Fp3.mul(Fp3.sqr(CURVE.b), BigInt(27));
    if (Fp3.is0(Fp3.add(_4a3, _27b2)))
      throw new Error("bad curve params: a or b");
    function acoord(title, n, banZero = false) {
      if (!Fp3.isValid(n) || banZero && Fp3.is0(n))
        throw new Error(`bad point coordinate ${title}`);
      return n;
    }
    function aprjpoint(other) {
      if (!(other instanceof Point))
        throw new Error("Weierstrass Point expected");
    }
    function splitEndoScalarN(k) {
      if (!endo || !endo.basises)
        throw new Error("no endo");
      return _splitEndoScalar(k, endo.basises, Fn3.ORDER);
    }
    const toAffineMemo = memoized((p, iz) => {
      const { X, Y, Z } = p;
      if (Fp3.eql(Z, Fp3.ONE))
        return { x: X, y: Y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp3.ONE : Fp3.inv(Z);
      const x = Fp3.mul(X, iz);
      const y = Fp3.mul(Y, iz);
      const zz = Fp3.mul(Z, iz);
      if (is0)
        return { x: Fp3.ZERO, y: Fp3.ZERO };
      if (!Fp3.eql(zz, Fp3.ONE))
        throw new Error("invZ was invalid");
      return { x, y };
    });
    const assertValidMemo = memoized((p) => {
      if (p.is0()) {
        if (extraOpts.allowInfinityPoint && !Fp3.is0(p.Y))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = p.toAffine();
      if (!Fp3.isValid(x) || !Fp3.isValid(y))
        throw new Error("bad point: x or y not field elements");
      if (!isValidXY(x, y))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      return true;
    });
    function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
      k2p = new Point(Fp3.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
      k1p = negateCt(k1neg, k1p);
      k2p = negateCt(k2neg, k2p);
      return k1p.add(k2p);
    }
    class Point {
      // base / generator point
      static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp3.ONE);
      // zero / infinity / identity point
      static ZERO = new Point(Fp3.ZERO, Fp3.ONE, Fp3.ZERO);
      // 0, 1, 0
      // math field
      static Fp = Fp3;
      // scalar field
      static Fn = Fn3;
      X;
      Y;
      Z;
      /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
      constructor(X, Y, Z) {
        this.X = acoord("x", X);
        this.Y = acoord("y", Y, true);
        this.Z = acoord("z", Z);
        Object.freeze(this);
      }
      static CURVE() {
        return CURVE;
      }
      /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
      static fromAffine(p) {
        const { x, y } = p || {};
        if (!p || !Fp3.isValid(x) || !Fp3.isValid(y))
          throw new Error("invalid affine point");
        if (p instanceof Point)
          throw new Error("projective point not allowed");
        if (Fp3.is0(x) && Fp3.is0(y))
          return Point.ZERO;
        return new Point(x, y, Fp3.ONE);
      }
      static fromBytes(bytes) {
        const P = Point.fromAffine(decodePoint(abytes(bytes, void 0, "point")));
        P.assertValidity();
        return P;
      }
      static fromHex(hex) {
        return Point.fromBytes(hexToBytes(hex));
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       *
       * @param windowSize
       * @param isLazy true will defer table computation until the first multiplication
       * @returns
       */
      precompute(windowSize = 8, isLazy = true) {
        wnaf.createCache(this, windowSize);
        if (!isLazy)
          this.multiply(_3n2);
        return this;
      }
      // TODO: return `this`
      /** A point on curve is valid if it conforms to equation. */
      assertValidity() {
        assertValidMemo(this);
      }
      hasEvenY() {
        const { y } = this.toAffine();
        if (!Fp3.isOdd)
          throw new Error("Field doesn't support isOdd");
        return !Fp3.isOdd(y);
      }
      /** Compare one point to another. */
      equals(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        const U1 = Fp3.eql(Fp3.mul(X1, Z2), Fp3.mul(X2, Z1));
        const U2 = Fp3.eql(Fp3.mul(Y1, Z2), Fp3.mul(Y2, Z1));
        return U1 && U2;
      }
      /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
      negate() {
        return new Point(this.X, Fp3.neg(this.Y), this.Z);
      }
      // Renes-Costello-Batina exception-free doubling formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 3
      // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
      double() {
        const { a, b } = CURVE;
        const b3 = Fp3.mul(b, _3n2);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        let X3 = Fp3.ZERO, Y3 = Fp3.ZERO, Z3 = Fp3.ZERO;
        let t0 = Fp3.mul(X1, X1);
        let t1 = Fp3.mul(Y1, Y1);
        let t2 = Fp3.mul(Z1, Z1);
        let t3 = Fp3.mul(X1, Y1);
        t3 = Fp3.add(t3, t3);
        Z3 = Fp3.mul(X1, Z1);
        Z3 = Fp3.add(Z3, Z3);
        X3 = Fp3.mul(a, Z3);
        Y3 = Fp3.mul(b3, t2);
        Y3 = Fp3.add(X3, Y3);
        X3 = Fp3.sub(t1, Y3);
        Y3 = Fp3.add(t1, Y3);
        Y3 = Fp3.mul(X3, Y3);
        X3 = Fp3.mul(t3, X3);
        Z3 = Fp3.mul(b3, Z3);
        t2 = Fp3.mul(a, t2);
        t3 = Fp3.sub(t0, t2);
        t3 = Fp3.mul(a, t3);
        t3 = Fp3.add(t3, Z3);
        Z3 = Fp3.add(t0, t0);
        t0 = Fp3.add(Z3, t0);
        t0 = Fp3.add(t0, t2);
        t0 = Fp3.mul(t0, t3);
        Y3 = Fp3.add(Y3, t0);
        t2 = Fp3.mul(Y1, Z1);
        t2 = Fp3.add(t2, t2);
        t0 = Fp3.mul(t2, t3);
        X3 = Fp3.sub(X3, t0);
        Z3 = Fp3.mul(t2, t1);
        Z3 = Fp3.add(Z3, Z3);
        Z3 = Fp3.add(Z3, Z3);
        return new Point(X3, Y3, Z3);
      }
      // Renes-Costello-Batina exception-free addition formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 1
      // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
      add(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        let X3 = Fp3.ZERO, Y3 = Fp3.ZERO, Z3 = Fp3.ZERO;
        const a = CURVE.a;
        const b3 = Fp3.mul(CURVE.b, _3n2);
        let t0 = Fp3.mul(X1, X2);
        let t1 = Fp3.mul(Y1, Y2);
        let t2 = Fp3.mul(Z1, Z2);
        let t3 = Fp3.add(X1, Y1);
        let t4 = Fp3.add(X2, Y2);
        t3 = Fp3.mul(t3, t4);
        t4 = Fp3.add(t0, t1);
        t3 = Fp3.sub(t3, t4);
        t4 = Fp3.add(X1, Z1);
        let t5 = Fp3.add(X2, Z2);
        t4 = Fp3.mul(t4, t5);
        t5 = Fp3.add(t0, t2);
        t4 = Fp3.sub(t4, t5);
        t5 = Fp3.add(Y1, Z1);
        X3 = Fp3.add(Y2, Z2);
        t5 = Fp3.mul(t5, X3);
        X3 = Fp3.add(t1, t2);
        t5 = Fp3.sub(t5, X3);
        Z3 = Fp3.mul(a, t4);
        X3 = Fp3.mul(b3, t2);
        Z3 = Fp3.add(X3, Z3);
        X3 = Fp3.sub(t1, Z3);
        Z3 = Fp3.add(t1, Z3);
        Y3 = Fp3.mul(X3, Z3);
        t1 = Fp3.add(t0, t0);
        t1 = Fp3.add(t1, t0);
        t2 = Fp3.mul(a, t2);
        t4 = Fp3.mul(b3, t4);
        t1 = Fp3.add(t1, t2);
        t2 = Fp3.sub(t0, t2);
        t2 = Fp3.mul(a, t2);
        t4 = Fp3.add(t4, t2);
        t0 = Fp3.mul(t1, t4);
        Y3 = Fp3.add(Y3, t0);
        t0 = Fp3.mul(t5, t4);
        X3 = Fp3.mul(t3, X3);
        X3 = Fp3.sub(X3, t0);
        t0 = Fp3.mul(t3, t1);
        Z3 = Fp3.mul(t5, Z3);
        Z3 = Fp3.add(Z3, t0);
        return new Point(X3, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      is0() {
        return this.equals(Point.ZERO);
      }
      /**
       * Constant time multiplication.
       * Uses wNAF method. Windowed method may be 10% faster,
       * but takes 2x longer to generate and consumes 2x memory.
       * Uses precomputes when available.
       * Uses endomorphism for Koblitz curves.
       * @param scalar by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        const { endo: endo2 } = extraOpts;
        if (!Fn3.isValidNot0(scalar))
          throw new Error("invalid scalar: out of range");
        let point, fake;
        const mul = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point, p));
        if (endo2) {
          const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
          const { p: k1p, f: k1f } = mul(k1);
          const { p: k2p, f: k2f } = mul(k2);
          fake = k1f.add(k2f);
          point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
        } else {
          const { p, f } = mul(scalar);
          point = p;
          fake = f;
        }
        return normalizeZ(Point, [point, fake])[0];
      }
      /**
       * Non-constant-time multiplication. Uses double-and-add algorithm.
       * It's faster, but should only be used when you don't care about
       * an exposed secret key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(sc) {
        const { endo: endo2 } = extraOpts;
        const p = this;
        if (!Fn3.isValid(sc))
          throw new Error("invalid scalar: out of range");
        if (sc === _0n4 || p.is0())
          return Point.ZERO;
        if (sc === _1n4)
          return p;
        if (wnaf.hasCache(this))
          return this.multiply(sc);
        if (endo2) {
          const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
          const { p1, p2 } = mulEndoUnsafe(Point, p, k1, k2);
          return finishEndo(endo2.beta, p1, p2, k1neg, k2neg);
        } else {
          return wnaf.unsafe(p, sc);
        }
      }
      /**
       * Converts Projective point to affine (x, y) coordinates.
       * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
       */
      toAffine(invertedZ) {
        return toAffineMemo(this, invertedZ);
      }
      /**
       * Checks whether Point is free of torsion elements (is in prime subgroup).
       * Always torsion-free for cofactor=1 curves.
       */
      isTorsionFree() {
        const { isTorsionFree } = extraOpts;
        if (cofactor === _1n4)
          return true;
        if (isTorsionFree)
          return isTorsionFree(Point, this);
        return wnaf.unsafe(this, CURVE_ORDER).is0();
      }
      clearCofactor() {
        const { clearCofactor } = extraOpts;
        if (cofactor === _1n4)
          return this;
        if (clearCofactor)
          return clearCofactor(Point, this);
        return this.multiplyUnsafe(cofactor);
      }
      isSmallOrder() {
        return this.multiplyUnsafe(cofactor).is0();
      }
      toBytes(isCompressed = true) {
        abool(isCompressed, "isCompressed");
        this.assertValidity();
        return encodePoint(Point, this, isCompressed);
      }
      toHex(isCompressed = true) {
        return bytesToHex(this.toBytes(isCompressed));
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
    }
    const bits = Fn3.BITS;
    const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
    Point.BASE.precompute(8);
    return Point;
  }
  function pprefix(hasEvenY) {
    return Uint8Array.of(hasEvenY ? 2 : 3);
  }
  function SWUFpSqrtRatio(Fp3, Z) {
    const q = Fp3.ORDER;
    let l = _0n4;
    for (let o = q - _1n4; o % _2n2 === _0n4; o /= _2n2)
      l += _1n4;
    const c1 = l;
    const _2n_pow_c1_1 = _2n2 << c1 - _1n4 - _1n4;
    const _2n_pow_c1 = _2n_pow_c1_1 * _2n2;
    const c2 = (q - _1n4) / _2n_pow_c1;
    const c3 = (c2 - _1n4) / _2n2;
    const c4 = _2n_pow_c1 - _1n4;
    const c5 = _2n_pow_c1_1;
    const c6 = Fp3.pow(Z, c2);
    const c7 = Fp3.pow(Z, (c2 + _1n4) / _2n2);
    let sqrtRatio = (u, v) => {
      let tv1 = c6;
      let tv2 = Fp3.pow(v, c4);
      let tv3 = Fp3.sqr(tv2);
      tv3 = Fp3.mul(tv3, v);
      let tv5 = Fp3.mul(u, tv3);
      tv5 = Fp3.pow(tv5, c3);
      tv5 = Fp3.mul(tv5, tv2);
      tv2 = Fp3.mul(tv5, v);
      tv3 = Fp3.mul(tv5, u);
      let tv4 = Fp3.mul(tv3, tv2);
      tv5 = Fp3.pow(tv4, c5);
      let isQR = Fp3.eql(tv5, Fp3.ONE);
      tv2 = Fp3.mul(tv3, c7);
      tv5 = Fp3.mul(tv4, tv1);
      tv3 = Fp3.cmov(tv2, tv3, isQR);
      tv4 = Fp3.cmov(tv5, tv4, isQR);
      for (let i = c1; i > _1n4; i--) {
        let tv52 = i - _2n2;
        tv52 = _2n2 << tv52 - _1n4;
        let tvv5 = Fp3.pow(tv4, tv52);
        const e1 = Fp3.eql(tvv5, Fp3.ONE);
        tv2 = Fp3.mul(tv3, tv1);
        tv1 = Fp3.mul(tv1, tv1);
        tvv5 = Fp3.mul(tv4, tv1);
        tv3 = Fp3.cmov(tv2, tv3, e1);
        tv4 = Fp3.cmov(tvv5, tv4, e1);
      }
      return { isValid: isQR, value: tv3 };
    };
    if (Fp3.ORDER % _4n2 === _3n2) {
      const c12 = (Fp3.ORDER - _3n2) / _4n2;
      const c22 = Fp3.sqrt(Fp3.neg(Z));
      sqrtRatio = (u, v) => {
        let tv1 = Fp3.sqr(v);
        const tv2 = Fp3.mul(u, v);
        tv1 = Fp3.mul(tv1, tv2);
        let y1 = Fp3.pow(tv1, c12);
        y1 = Fp3.mul(y1, tv2);
        const y2 = Fp3.mul(y1, c22);
        const tv3 = Fp3.mul(Fp3.sqr(y1), v);
        const isQR = Fp3.eql(tv3, u);
        let y = Fp3.cmov(y2, y1, isQR);
        return { isValid: isQR, value: y };
      };
    }
    return sqrtRatio;
  }
  function mapToCurveSimpleSWU(Fp3, opts) {
    validateField(Fp3);
    const { A, B, Z } = opts;
    if (!Fp3.isValid(A) || !Fp3.isValid(B) || !Fp3.isValid(Z))
      throw new Error("mapToCurveSimpleSWU: invalid opts");
    const sqrtRatio = SWUFpSqrtRatio(Fp3, Z);
    if (!Fp3.isOdd)
      throw new Error("Field does not have .isOdd()");
    return (u) => {
      let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
      tv1 = Fp3.sqr(u);
      tv1 = Fp3.mul(tv1, Z);
      tv2 = Fp3.sqr(tv1);
      tv2 = Fp3.add(tv2, tv1);
      tv3 = Fp3.add(tv2, Fp3.ONE);
      tv3 = Fp3.mul(tv3, B);
      tv4 = Fp3.cmov(Z, Fp3.neg(tv2), !Fp3.eql(tv2, Fp3.ZERO));
      tv4 = Fp3.mul(tv4, A);
      tv2 = Fp3.sqr(tv3);
      tv6 = Fp3.sqr(tv4);
      tv5 = Fp3.mul(tv6, A);
      tv2 = Fp3.add(tv2, tv5);
      tv2 = Fp3.mul(tv2, tv3);
      tv6 = Fp3.mul(tv6, tv4);
      tv5 = Fp3.mul(tv6, B);
      tv2 = Fp3.add(tv2, tv5);
      x = Fp3.mul(tv1, tv3);
      const { isValid, value } = sqrtRatio(tv2, tv6);
      y = Fp3.mul(tv1, u);
      y = Fp3.mul(y, value);
      x = Fp3.cmov(x, tv3, isValid);
      y = Fp3.cmov(y, value, isValid);
      const e1 = Fp3.isOdd(u) === Fp3.isOdd(y);
      y = Fp3.cmov(Fp3.neg(y), y, e1);
      const tv4_inv = FpInvertBatch(Fp3, [tv4], true)[0];
      x = Fp3.mul(x, tv4_inv);
      return { x, y };
    };
  }
  function getWLengths(Fp3, Fn3) {
    return {
      secretKey: Fn3.BYTES,
      publicKey: 1 + Fp3.BYTES,
      publicKeyUncompressed: 1 + 2 * Fp3.BYTES,
      publicKeyHasPrefix: true,
      signature: 2 * Fn3.BYTES
    };
  }
  function ecdh(Point, ecdhOpts = {}) {
    const { Fn: Fn3 } = Point;
    const randomBytes_ = ecdhOpts.randomBytes || randomBytes;
    const lengths = Object.assign(getWLengths(Point.Fp, Fn3), { seed: getMinHashLength(Fn3.ORDER) });
    function isValidSecretKey(secretKey) {
      try {
        const num2 = Fn3.fromBytes(secretKey);
        return Fn3.isValidNot0(num2);
      } catch (error) {
        return false;
      }
    }
    function isValidPublicKey(publicKey, isCompressed) {
      const { publicKey: comp, publicKeyUncompressed } = lengths;
      try {
        const l = publicKey.length;
        if (isCompressed === true && l !== comp)
          return false;
        if (isCompressed === false && l !== publicKeyUncompressed)
          return false;
        return !!Point.fromBytes(publicKey);
      } catch (error) {
        return false;
      }
    }
    function randomSecretKey(seed = randomBytes_(lengths.seed)) {
      return mapHashToField(abytes(seed, lengths.seed, "seed"), Fn3.ORDER);
    }
    function getPublicKey(secretKey, isCompressed = true) {
      return Point.BASE.multiply(Fn3.fromBytes(secretKey)).toBytes(isCompressed);
    }
    function isProbPub(item) {
      const { secretKey, publicKey, publicKeyUncompressed } = lengths;
      if (!isBytes(item))
        return void 0;
      if ("_lengths" in Fn3 && Fn3._lengths || secretKey === publicKey)
        return void 0;
      const l = abytes(item, void 0, "key").length;
      return l === publicKey || l === publicKeyUncompressed;
    }
    function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
      if (isProbPub(secretKeyA) === true)
        throw new Error("first arg must be private key");
      if (isProbPub(publicKeyB) === false)
        throw new Error("second arg must be public key");
      const s = Fn3.fromBytes(secretKeyA);
      const b = Point.fromBytes(publicKeyB);
      return b.multiply(s).toBytes(isCompressed);
    }
    const utils = {
      isValidSecretKey,
      isValidPublicKey,
      randomSecretKey
    };
    const keygen = createKeygen(randomSecretKey, getPublicKey);
    return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point, utils, lengths });
  }
  function ecdsa(Point, hash, ecdsaOpts = {}) {
    ahash(hash);
    validateObject(ecdsaOpts, {}, {
      hmac: "function",
      lowS: "boolean",
      randomBytes: "function",
      bits2int: "function",
      bits2int_modN: "function"
    });
    ecdsaOpts = Object.assign({}, ecdsaOpts);
    const randomBytes2 = ecdsaOpts.randomBytes || randomBytes;
    const hmac2 = ecdsaOpts.hmac || ((key, msg) => hmac(hash, key, msg));
    const { Fp: Fp3, Fn: Fn3 } = Point;
    const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn3;
    const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point, ecdsaOpts);
    const defaultSigOpts = {
      prehash: true,
      lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : true,
      format: "compact",
      extraEntropy: false
    };
    const hasLargeCofactor = CURVE_ORDER * _2n2 < Fp3.ORDER;
    function isBiggerThanHalfOrder(number) {
      const HALF = CURVE_ORDER >> _1n4;
      return number > HALF;
    }
    function validateRS(title, num2) {
      if (!Fn3.isValidNot0(num2))
        throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
      return num2;
    }
    function assertSmallCofactor() {
      if (hasLargeCofactor)
        throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
    }
    function validateSigLength(bytes, format) {
      validateSigFormat(format);
      const size = lengths.signature;
      const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
      return abytes(bytes, sizer);
    }
    class Signature {
      r;
      s;
      recovery;
      constructor(r, s, recovery) {
        this.r = validateRS("r", r);
        this.s = validateRS("s", s);
        if (recovery != null) {
          assertSmallCofactor();
          if (![0, 1, 2, 3].includes(recovery))
            throw new Error("invalid recovery id");
          this.recovery = recovery;
        }
        Object.freeze(this);
      }
      static fromBytes(bytes, format = defaultSigOpts.format) {
        validateSigLength(bytes, format);
        let recid;
        if (format === "der") {
          const { r: r2, s: s2 } = DER.toSig(abytes(bytes));
          return new Signature(r2, s2);
        }
        if (format === "recovered") {
          recid = bytes[0];
          format = "compact";
          bytes = bytes.subarray(1);
        }
        const L = lengths.signature / 2;
        const r = bytes.subarray(0, L);
        const s = bytes.subarray(L, L * 2);
        return new Signature(Fn3.fromBytes(r), Fn3.fromBytes(s), recid);
      }
      static fromHex(hex, format) {
        return this.fromBytes(hexToBytes(hex), format);
      }
      assertRecovery() {
        const { recovery } = this;
        if (recovery == null)
          throw new Error("invalid recovery id: must be present");
        return recovery;
      }
      addRecoveryBit(recovery) {
        return new Signature(this.r, this.s, recovery);
      }
      recoverPublicKey(messageHash) {
        const { r, s } = this;
        const recovery = this.assertRecovery();
        const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER : r;
        if (!Fp3.isValid(radj))
          throw new Error("invalid recovery id: sig.r+curve.n != R.x");
        const x = Fp3.toBytes(radj);
        const R = Point.fromBytes(concatBytes(pprefix((recovery & 1) === 0), x));
        const ir = Fn3.inv(radj);
        const h = bits2int_modN(abytes(messageHash, void 0, "msgHash"));
        const u1 = Fn3.create(-h * ir);
        const u2 = Fn3.create(s * ir);
        const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
        if (Q.is0())
          throw new Error("invalid recovery: point at infinify");
        Q.assertValidity();
        return Q;
      }
      // Signatures should be low-s, to prevent malleability.
      hasHighS() {
        return isBiggerThanHalfOrder(this.s);
      }
      toBytes(format = defaultSigOpts.format) {
        validateSigFormat(format);
        if (format === "der")
          return hexToBytes(DER.hexFromSig(this));
        const { r, s } = this;
        const rb = Fn3.toBytes(r);
        const sb = Fn3.toBytes(s);
        if (format === "recovered") {
          assertSmallCofactor();
          return concatBytes(Uint8Array.of(this.assertRecovery()), rb, sb);
        }
        return concatBytes(rb, sb);
      }
      toHex(format) {
        return bytesToHex(this.toBytes(format));
      }
    }
    const bits2int = ecdsaOpts.bits2int || function bits2int_def(bytes) {
      if (bytes.length > 8192)
        throw new Error("input is too large");
      const num2 = bytesToNumberBE(bytes);
      const delta = bytes.length * 8 - fnBits;
      return delta > 0 ? num2 >> BigInt(delta) : num2;
    };
    const bits2int_modN = ecdsaOpts.bits2int_modN || function bits2int_modN_def(bytes) {
      return Fn3.create(bits2int(bytes));
    };
    const ORDER_MASK = bitMask(fnBits);
    function int2octets(num2) {
      aInRange("num < 2^" + fnBits, num2, _0n4, ORDER_MASK);
      return Fn3.toBytes(num2);
    }
    function validateMsgAndHash(message, prehash) {
      abytes(message, void 0, "message");
      return prehash ? abytes(hash(message), void 0, "prehashed message") : message;
    }
    function prepSig(message, secretKey, opts) {
      const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
      message = validateMsgAndHash(message, prehash);
      const h1int = bits2int_modN(message);
      const d = Fn3.fromBytes(secretKey);
      if (!Fn3.isValidNot0(d))
        throw new Error("invalid private key");
      const seedArgs = [int2octets(d), int2octets(h1int)];
      if (extraEntropy != null && extraEntropy !== false) {
        const e = extraEntropy === true ? randomBytes2(lengths.secretKey) : extraEntropy;
        seedArgs.push(abytes(e, void 0, "extraEntropy"));
      }
      const seed = concatBytes(...seedArgs);
      const m = h1int;
      function k2sig(kBytes) {
        const k = bits2int(kBytes);
        if (!Fn3.isValidNot0(k))
          return;
        const ik = Fn3.inv(k);
        const q = Point.BASE.multiply(k).toAffine();
        const r = Fn3.create(q.x);
        if (r === _0n4)
          return;
        const s = Fn3.create(ik * Fn3.create(m + r * d));
        if (s === _0n4)
          return;
        let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n4);
        let normS = s;
        if (lowS && isBiggerThanHalfOrder(s)) {
          normS = Fn3.neg(s);
          recovery ^= 1;
        }
        return new Signature(r, normS, hasLargeCofactor ? void 0 : recovery);
      }
      return { seed, k2sig };
    }
    function sign(message, secretKey, opts = {}) {
      const { seed, k2sig } = prepSig(message, secretKey, opts);
      const drbg = createHmacDrbg(hash.outputLen, Fn3.BYTES, hmac2);
      const sig = drbg(seed, k2sig);
      return sig.toBytes(opts.format);
    }
    function verify(signature, message, publicKey, opts = {}) {
      const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
      publicKey = abytes(publicKey, void 0, "publicKey");
      message = validateMsgAndHash(message, prehash);
      if (!isBytes(signature)) {
        const end = signature instanceof Signature ? ", use sig.toBytes()" : "";
        throw new Error("verify expects Uint8Array signature" + end);
      }
      validateSigLength(signature, format);
      try {
        const sig = Signature.fromBytes(signature, format);
        const P = Point.fromBytes(publicKey);
        if (lowS && sig.hasHighS())
          return false;
        const { r, s } = sig;
        const h = bits2int_modN(message);
        const is = Fn3.inv(s);
        const u1 = Fn3.create(h * is);
        const u2 = Fn3.create(r * is);
        const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
        if (R.is0())
          return false;
        const v = Fn3.create(R.x);
        return v === r;
      } catch (e) {
        return false;
      }
    }
    function recoverPublicKey(signature, message, opts = {}) {
      const { prehash } = validateSigOpts(opts, defaultSigOpts);
      message = validateMsgAndHash(message, prehash);
      return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
    }
    return Object.freeze({
      keygen,
      getPublicKey,
      getSharedSecret,
      utils,
      lengths,
      Point,
      sign,
      verify,
      recoverPublicKey,
      Signature,
      hash
    });
  }
  var divNearest, DERErr, DER, _0n4, _1n4, _2n2, _3n2, _4n2;
  var init_weierstrass = __esm({
    "node_modules/@noble/curves/abstract/weierstrass.js"() {
      init_hmac();
      init_utils();
      init_utils2();
      init_curve();
      init_modular();
      divNearest = (num2, den) => (num2 + (num2 >= 0 ? den : -den) / _2n2) / den;
      DERErr = class extends Error {
        constructor(m = "") {
          super(m);
        }
      };
      DER = {
        // asn.1 DER encoding utils
        Err: DERErr,
        // Basic building block is TLV (Tag-Length-Value)
        _tlv: {
          encode: (tag, data) => {
            const { Err: E } = DER;
            if (tag < 0 || tag > 256)
              throw new E("tlv.encode: wrong tag");
            if (data.length & 1)
              throw new E("tlv.encode: unpadded data");
            const dataLen = data.length / 2;
            const len = numberToHexUnpadded(dataLen);
            if (len.length / 2 & 128)
              throw new E("tlv.encode: long form length too big");
            const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
            const t = numberToHexUnpadded(tag);
            return t + lenLen + len + data;
          },
          // v - value, l - left bytes (unparsed)
          decode(tag, data) {
            const { Err: E } = DER;
            let pos = 0;
            if (tag < 0 || tag > 256)
              throw new E("tlv.encode: wrong tag");
            if (data.length < 2 || data[pos++] !== tag)
              throw new E("tlv.decode: wrong tlv");
            const first = data[pos++];
            const isLong = !!(first & 128);
            let length = 0;
            if (!isLong)
              length = first;
            else {
              const lenLen = first & 127;
              if (!lenLen)
                throw new E("tlv.decode(long): indefinite length not supported");
              if (lenLen > 4)
                throw new E("tlv.decode(long): byte length is too big");
              const lengthBytes = data.subarray(pos, pos + lenLen);
              if (lengthBytes.length !== lenLen)
                throw new E("tlv.decode: length bytes not complete");
              if (lengthBytes[0] === 0)
                throw new E("tlv.decode(long): zero leftmost byte");
              for (const b of lengthBytes)
                length = length << 8 | b;
              pos += lenLen;
              if (length < 128)
                throw new E("tlv.decode(long): not minimal encoding");
            }
            const v = data.subarray(pos, pos + length);
            if (v.length !== length)
              throw new E("tlv.decode: wrong value length");
            return { v, l: data.subarray(pos + length) };
          }
        },
        // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
        // since we always use positive integers here. It must always be empty:
        // - add zero byte if exists
        // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
        _int: {
          encode(num2) {
            const { Err: E } = DER;
            if (num2 < _0n4)
              throw new E("integer: negative integers are not allowed");
            let hex = numberToHexUnpadded(num2);
            if (Number.parseInt(hex[0], 16) & 8)
              hex = "00" + hex;
            if (hex.length & 1)
              throw new E("unexpected DER parsing assertion: unpadded hex");
            return hex;
          },
          decode(data) {
            const { Err: E } = DER;
            if (data[0] & 128)
              throw new E("invalid signature integer: negative");
            if (data[0] === 0 && !(data[1] & 128))
              throw new E("invalid signature integer: unnecessary leading zero");
            return bytesToNumberBE(data);
          }
        },
        toSig(bytes) {
          const { Err: E, _int: int, _tlv: tlv } = DER;
          const data = abytes(bytes, void 0, "signature");
          const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
          if (seqLeftBytes.length)
            throw new E("invalid signature: left bytes after parsing");
          const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
          const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
          if (sLeftBytes.length)
            throw new E("invalid signature: left bytes after parsing");
          return { r: int.decode(rBytes), s: int.decode(sBytes) };
        },
        hexFromSig(sig) {
          const { _tlv: tlv, _int: int } = DER;
          const rs = tlv.encode(2, int.encode(sig.r));
          const ss = tlv.encode(2, int.encode(sig.s));
          const seq = rs + ss;
          return tlv.encode(48, seq);
        }
      };
      _0n4 = BigInt(0);
      _1n4 = BigInt(1);
      _2n2 = BigInt(2);
      _3n2 = BigInt(3);
      _4n2 = BigInt(4);
    }
  });

  // node_modules/@noble/curves/nist.js
  var nist_exports = {};
  __export(nist_exports, {
    p256: () => p256,
    p256_hasher: () => p256_hasher,
    p256_oprf: () => p256_oprf,
    p384: () => p384,
    p384_hasher: () => p384_hasher,
    p384_oprf: () => p384_oprf,
    p521: () => p521,
    p521_hasher: () => p521_hasher,
    p521_oprf: () => p521_oprf
  });
  function createSWU(Point, opts) {
    const map = mapToCurveSimpleSWU(Point.Fp, opts);
    return (scalars) => map(scalars[0]);
  }
  var p256_CURVE, p384_CURVE, p521_CURVE, p256_Point, p256, p256_hasher, p256_oprf, p384_Point, p384, p384_hasher, p384_oprf, Fn521, p521_Point, p521, p521_hasher, p521_oprf;
  var init_nist = __esm({
    "node_modules/@noble/curves/nist.js"() {
      init_sha2();
      init_hash_to_curve();
      init_modular();
      init_oprf();
      init_weierstrass();
      p256_CURVE = /* @__PURE__ */ (() => ({
        p: BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff"),
        n: BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"),
        h: BigInt(1),
        a: BigInt("0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc"),
        b: BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"),
        Gx: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),
        Gy: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5")
      }))();
      p384_CURVE = /* @__PURE__ */ (() => ({
        p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff"),
        n: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973"),
        h: BigInt(1),
        a: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc"),
        b: BigInt("0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef"),
        Gx: BigInt("0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7"),
        Gy: BigInt("0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f")
      }))();
      p521_CURVE = /* @__PURE__ */ (() => ({
        p: BigInt("0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
        n: BigInt("0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409"),
        h: BigInt(1),
        a: BigInt("0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc"),
        b: BigInt("0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00"),
        Gx: BigInt("0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66"),
        Gy: BigInt("0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650")
      }))();
      p256_Point = /* @__PURE__ */ weierstrass(p256_CURVE);
      p256 = /* @__PURE__ */ ecdsa(p256_Point, sha256);
      p256_hasher = /* @__PURE__ */ (() => {
        return createHasher2(p256_Point, createSWU(p256_Point, {
          A: p256_CURVE.a,
          B: p256_CURVE.b,
          Z: p256_Point.Fp.create(BigInt("-10"))
        }), {
          DST: "P256_XMD:SHA-256_SSWU_RO_",
          encodeDST: "P256_XMD:SHA-256_SSWU_NU_",
          p: p256_CURVE.p,
          m: 1,
          k: 128,
          expand: "xmd",
          hash: sha256
        });
      })();
      p256_oprf = /* @__PURE__ */ (() => createORPF({
        name: "P256-SHA256",
        Point: p256_Point,
        hash: sha256,
        hashToGroup: p256_hasher.hashToCurve,
        hashToScalar: p256_hasher.hashToScalar
      }))();
      p384_Point = /* @__PURE__ */ weierstrass(p384_CURVE);
      p384 = /* @__PURE__ */ ecdsa(p384_Point, sha384);
      p384_hasher = /* @__PURE__ */ (() => {
        return createHasher2(p384_Point, createSWU(p384_Point, {
          A: p384_CURVE.a,
          B: p384_CURVE.b,
          Z: p384_Point.Fp.create(BigInt("-12"))
        }), {
          DST: "P384_XMD:SHA-384_SSWU_RO_",
          encodeDST: "P384_XMD:SHA-384_SSWU_NU_",
          p: p384_CURVE.p,
          m: 1,
          k: 192,
          expand: "xmd",
          hash: sha384
        });
      })();
      p384_oprf = /* @__PURE__ */ (() => createORPF({
        name: "P384-SHA384",
        Point: p384_Point,
        hash: sha384,
        hashToGroup: p384_hasher.hashToCurve,
        hashToScalar: p384_hasher.hashToScalar
      }))();
      Fn521 = /* @__PURE__ */ (() => Field(p521_CURVE.n, { allowedLengths: [65, 66] }))();
      p521_Point = /* @__PURE__ */ weierstrass(p521_CURVE, { Fn: Fn521 });
      p521 = /* @__PURE__ */ ecdsa(p521_Point, sha512);
      p521_hasher = /* @__PURE__ */ (() => {
        return createHasher2(p521_Point, createSWU(p521_Point, {
          A: p521_CURVE.a,
          B: p521_CURVE.b,
          Z: p521_Point.Fp.create(BigInt("-4"))
        }), {
          DST: "P521_XMD:SHA-512_SSWU_RO_",
          encodeDST: "P521_XMD:SHA-512_SSWU_NU_",
          p: p521_CURVE.p,
          m: 1,
          k: 256,
          expand: "xmd",
          hash: sha512
        });
      })();
      p521_oprf = /* @__PURE__ */ (() => createORPF({
        name: "P521-SHA512",
        Point: p521_Point,
        hash: sha512,
        hashToGroup: p521_hasher.hashToCurve,
        hashToScalar: p521_hasher.hashToScalar
        // produces L=98 just like in RFC
      }))();
    }
  });

  // node_modules/@noble/hashes/sha3.js
  function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    for (let round = 24 - rounds; round < 24; round++) {
      for (let x = 0; x < 10; x++)
        B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
      for (let x = 0; x < 10; x += 2) {
        const idx1 = (x + 8) % 10;
        const idx0 = (x + 2) % 10;
        const B0 = B[idx0];
        const B1 = B[idx0 + 1];
        const Th = rotlH(B0, B1, 1) ^ B[idx1];
        const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
        for (let y = 0; y < 50; y += 10) {
          s[x + y] ^= Th;
          s[x + y + 1] ^= Tl;
        }
      }
      let curH = s[2];
      let curL = s[3];
      for (let t = 0; t < 24; t++) {
        const shift = SHA3_ROTL[t];
        const Th = rotlH(curH, curL, shift);
        const Tl = rotlL(curH, curL, shift);
        const PI = SHA3_PI[t];
        curH = s[PI];
        curL = s[PI + 1];
        s[PI] = Th;
        s[PI + 1] = Tl;
      }
      for (let y = 0; y < 50; y += 10) {
        for (let x = 0; x < 10; x++)
          B[x] = s[y + x];
        for (let x = 0; x < 10; x++)
          s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
      }
      s[0] ^= SHA3_IOTA_H[round];
      s[1] ^= SHA3_IOTA_L[round];
    }
    clean(B);
  }
  var _0n5, _1n5, _2n3, _7n2, _256n, _0x71n, SHA3_PI, SHA3_ROTL, _SHA3_IOTA, IOTAS, SHA3_IOTA_H, SHA3_IOTA_L, rotlH, rotlL, Keccak, genShake, shake256;
  var init_sha3 = __esm({
    "node_modules/@noble/hashes/sha3.js"() {
      init_u64();
      init_utils();
      _0n5 = BigInt(0);
      _1n5 = BigInt(1);
      _2n3 = BigInt(2);
      _7n2 = BigInt(7);
      _256n = BigInt(256);
      _0x71n = BigInt(113);
      SHA3_PI = [];
      SHA3_ROTL = [];
      _SHA3_IOTA = [];
      for (let round = 0, R = _1n5, x = 1, y = 0; round < 24; round++) {
        [x, y] = [y, (2 * x + 3 * y) % 5];
        SHA3_PI.push(2 * (5 * y + x));
        SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
        let t = _0n5;
        for (let j = 0; j < 7; j++) {
          R = (R << _1n5 ^ (R >> _7n2) * _0x71n) % _256n;
          if (R & _2n3)
            t ^= _1n5 << (_1n5 << BigInt(j)) - _1n5;
        }
        _SHA3_IOTA.push(t);
      }
      IOTAS = split(_SHA3_IOTA, true);
      SHA3_IOTA_H = IOTAS[0];
      SHA3_IOTA_L = IOTAS[1];
      rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
      rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
      Keccak = class _Keccak {
        state;
        pos = 0;
        posOut = 0;
        finished = false;
        state32;
        destroyed = false;
        blockLen;
        suffix;
        outputLen;
        enableXOF = false;
        rounds;
        // NOTE: we accept arguments in bytes instead of bits here.
        constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
          this.blockLen = blockLen;
          this.suffix = suffix;
          this.outputLen = outputLen;
          this.enableXOF = enableXOF;
          this.rounds = rounds;
          anumber(outputLen, "outputLen");
          if (!(0 < blockLen && blockLen < 200))
            throw new Error("only keccak-f1600 function is supported");
          this.state = new Uint8Array(200);
          this.state32 = u32(this.state);
        }
        clone() {
          return this._cloneInto();
        }
        keccak() {
          swap32IfBE(this.state32);
          keccakP(this.state32, this.rounds);
          swap32IfBE(this.state32);
          this.posOut = 0;
          this.pos = 0;
        }
        update(data) {
          aexists(this);
          abytes(data);
          const { blockLen, state } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            for (let i = 0; i < take; i++)
              state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen)
              this.keccak();
          }
          return this;
        }
        finish() {
          if (this.finished)
            return;
          this.finished = true;
          const { state, suffix, pos, blockLen } = this;
          state[pos] ^= suffix;
          if ((suffix & 128) !== 0 && pos === blockLen - 1)
            this.keccak();
          state[blockLen - 1] ^= 128;
          this.keccak();
        }
        writeInto(out) {
          aexists(this, false);
          abytes(out);
          this.finish();
          const bufferOut = this.state;
          const { blockLen } = this;
          for (let pos = 0, len = out.length; pos < len; ) {
            if (this.posOut >= blockLen)
              this.keccak();
            const take = Math.min(blockLen - this.posOut, len - pos);
            out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
          }
          return out;
        }
        xofInto(out) {
          if (!this.enableXOF)
            throw new Error("XOF is not possible for this instance");
          return this.writeInto(out);
        }
        xof(bytes) {
          anumber(bytes);
          return this.xofInto(new Uint8Array(bytes));
        }
        digestInto(out) {
          aoutput(out, this);
          if (this.finished)
            throw new Error("digest() was already called");
          this.writeInto(out);
          this.destroy();
          return out;
        }
        digest() {
          return this.digestInto(new Uint8Array(this.outputLen));
        }
        destroy() {
          this.destroyed = true;
          clean(this.state);
        }
        _cloneInto(to) {
          const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
          to ||= new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds);
          to.state32.set(this.state32);
          to.pos = this.pos;
          to.posOut = this.posOut;
          to.finished = this.finished;
          to.rounds = rounds;
          to.suffix = suffix;
          to.outputLen = outputLen;
          to.enableXOF = enableXOF;
          to.destroyed = this.destroyed;
          return to;
        }
      };
      genShake = (suffix, blockLen, outputLen, info = {}) => createHasher((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true), info);
      shake256 = /* @__PURE__ */ genShake(31, 136, 32, /* @__PURE__ */ oidNist(12));
    }
  });

  // node_modules/@noble/curves/abstract/edwards.js
  function isEdValidXY(Fp3, CURVE, x, y) {
    const x2 = Fp3.sqr(x);
    const y2 = Fp3.sqr(y);
    const left = Fp3.add(Fp3.mul(CURVE.a, x2), y2);
    const right = Fp3.add(Fp3.ONE, Fp3.mul(CURVE.d, Fp3.mul(x2, y2)));
    return Fp3.eql(left, right);
  }
  function edwards(params, extraOpts = {}) {
    const validated = createCurveFields("edwards", params, extraOpts, extraOpts.FpFnLE);
    const { Fp: Fp3, Fn: Fn3 } = validated;
    let CURVE = validated.CURVE;
    const { h: cofactor } = CURVE;
    validateObject(extraOpts, {}, { uvRatio: "function" });
    const MASK = _2n4 << BigInt(Fn3.BYTES * 8) - _1n6;
    const modP = (n) => Fp3.create(n);
    const uvRatio3 = extraOpts.uvRatio || ((u, v) => {
      try {
        return { isValid: true, value: Fp3.sqrt(Fp3.div(u, v)) };
      } catch (e) {
        return { isValid: false, value: _0n6 };
      }
    });
    if (!isEdValidXY(Fp3, CURVE, CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    function acoord(title, n, banZero = false) {
      const min = banZero ? _1n6 : _0n6;
      aInRange("coordinate " + title, n, min, MASK);
      return n;
    }
    function aedpoint(other) {
      if (!(other instanceof Point))
        throw new Error("EdwardsPoint expected");
    }
    const toAffineMemo = memoized((p, iz) => {
      const { X, Y, Z } = p;
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? _8n2 : Fp3.inv(Z);
      const x = modP(X * iz);
      const y = modP(Y * iz);
      const zz = Fp3.mul(Z, iz);
      if (is0)
        return { x: _0n6, y: _1n6 };
      if (zz !== _1n6)
        throw new Error("invZ was invalid");
      return { x, y };
    });
    const assertValidMemo = memoized((p) => {
      const { a, d } = CURVE;
      if (p.is0())
        throw new Error("bad point: ZERO");
      const { X, Y, Z, T } = p;
      const X2 = modP(X * X);
      const Y2 = modP(Y * Y);
      const Z2 = modP(Z * Z);
      const Z4 = modP(Z2 * Z2);
      const aX2 = modP(X2 * a);
      const left = modP(Z2 * modP(aX2 + Y2));
      const right = modP(Z4 + modP(d * modP(X2 * Y2)));
      if (left !== right)
        throw new Error("bad point: equation left != right (1)");
      const XY = modP(X * Y);
      const ZT = modP(Z * T);
      if (XY !== ZT)
        throw new Error("bad point: equation left != right (2)");
      return true;
    });
    class Point {
      // base / generator point
      static BASE = new Point(CURVE.Gx, CURVE.Gy, _1n6, modP(CURVE.Gx * CURVE.Gy));
      // zero / infinity / identity point
      static ZERO = new Point(_0n6, _1n6, _1n6, _0n6);
      // 0, 1, 1, 0
      // math field
      static Fp = Fp3;
      // scalar field
      static Fn = Fn3;
      X;
      Y;
      Z;
      T;
      constructor(X, Y, Z, T) {
        this.X = acoord("x", X);
        this.Y = acoord("y", Y);
        this.Z = acoord("z", Z, true);
        this.T = acoord("t", T);
        Object.freeze(this);
      }
      static CURVE() {
        return CURVE;
      }
      static fromAffine(p) {
        if (p instanceof Point)
          throw new Error("extended point not allowed");
        const { x, y } = p || {};
        acoord("x", x);
        acoord("y", y);
        return new Point(x, y, _1n6, modP(x * y));
      }
      // Uses algo from RFC8032 5.1.3.
      static fromBytes(bytes, zip215 = false) {
        const len = Fp3.BYTES;
        const { a, d } = CURVE;
        bytes = copyBytes(abytes(bytes, len, "point"));
        abool(zip215, "zip215");
        const normed = copyBytes(bytes);
        const lastByte = bytes[len - 1];
        normed[len - 1] = lastByte & ~128;
        const y = bytesToNumberLE(normed);
        const max = zip215 ? MASK : Fp3.ORDER;
        aInRange("point.y", y, _0n6, max);
        const y2 = modP(y * y);
        const u = modP(y2 - _1n6);
        const v = modP(d * y2 - a);
        let { isValid, value: x } = uvRatio3(u, v);
        if (!isValid)
          throw new Error("bad point: invalid y coordinate");
        const isXOdd = (x & _1n6) === _1n6;
        const isLastByteOdd = (lastByte & 128) !== 0;
        if (!zip215 && x === _0n6 && isLastByteOdd)
          throw new Error("bad point: x=0 and x_0=1");
        if (isLastByteOdd !== isXOdd)
          x = modP(-x);
        return Point.fromAffine({ x, y });
      }
      static fromHex(hex, zip215 = false) {
        return Point.fromBytes(hexToBytes(hex), zip215);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      precompute(windowSize = 8, isLazy = true) {
        wnaf.createCache(this, windowSize);
        if (!isLazy)
          this.multiply(_2n4);
        return this;
      }
      // Useful in fromAffine() - not for fromBytes(), which always created valid points.
      assertValidity() {
        assertValidMemo(this);
      }
      // Compare one point to another.
      equals(other) {
        aedpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        const X1Z2 = modP(X1 * Z2);
        const X2Z1 = modP(X2 * Z1);
        const Y1Z2 = modP(Y1 * Z2);
        const Y2Z1 = modP(Y2 * Z1);
        return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
      }
      is0() {
        return this.equals(Point.ZERO);
      }
      negate() {
        return new Point(modP(-this.X), this.Y, this.Z, modP(-this.T));
      }
      // Fast algo for doubling Extended Point.
      // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
      // Cost: 4M + 4S + 1*a + 6add + 1*2.
      double() {
        const { a } = CURVE;
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const A = modP(X1 * X1);
        const B = modP(Y1 * Y1);
        const C = modP(_2n4 * modP(Z1 * Z1));
        const D = modP(a * A);
        const x1y1 = X1 + Y1;
        const E = modP(modP(x1y1 * x1y1) - A - B);
        const G = D + B;
        const F = G - C;
        const H = D - B;
        const X3 = modP(E * F);
        const Y3 = modP(G * H);
        const T3 = modP(E * H);
        const Z3 = modP(F * G);
        return new Point(X3, Y3, Z3, T3);
      }
      // Fast algo for adding 2 Extended Points.
      // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
      // Cost: 9M + 1*a + 1*d + 7add.
      add(other) {
        aedpoint(other);
        const { a, d } = CURVE;
        const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
        const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
        const A = modP(X1 * X2);
        const B = modP(Y1 * Y2);
        const C = modP(T1 * d * T2);
        const D = modP(Z1 * Z2);
        const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
        const F = D - C;
        const G = D + C;
        const H = modP(B - a * A);
        const X3 = modP(E * F);
        const Y3 = modP(G * H);
        const T3 = modP(E * H);
        const Z3 = modP(F * G);
        return new Point(X3, Y3, Z3, T3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      // Constant-time multiplication.
      multiply(scalar) {
        if (!Fn3.isValidNot0(scalar))
          throw new Error("invalid scalar: expected 1 <= sc < curve.n");
        const { p, f } = wnaf.cached(this, scalar, (p2) => normalizeZ(Point, p2));
        return normalizeZ(Point, [p, f])[0];
      }
      // Non-constant-time multiplication. Uses double-and-add algorithm.
      // It's faster, but should only be used when you don't care about
      // an exposed private key e.g. sig verification.
      // Does NOT allow scalars higher than CURVE.n.
      // Accepts optional accumulator to merge with multiply (important for sparse scalars)
      multiplyUnsafe(scalar, acc = Point.ZERO) {
        if (!Fn3.isValid(scalar))
          throw new Error("invalid scalar: expected 0 <= sc < curve.n");
        if (scalar === _0n6)
          return Point.ZERO;
        if (this.is0() || scalar === _1n6)
          return this;
        return wnaf.unsafe(this, scalar, (p) => normalizeZ(Point, p), acc);
      }
      // Checks if point is of small order.
      // If you add something to small order point, you will have "dirty"
      // point with torsion component.
      // Multiplies point by cofactor and checks if the result is 0.
      isSmallOrder() {
        return this.multiplyUnsafe(cofactor).is0();
      }
      // Multiplies point by curve order and checks if the result is 0.
      // Returns `false` is the point is dirty.
      isTorsionFree() {
        return wnaf.unsafe(this, CURVE.n).is0();
      }
      // Converts Extended point to default (x, y) coordinates.
      // Can accept precomputed Z^-1 - for example, from invertBatch.
      toAffine(invertedZ) {
        return toAffineMemo(this, invertedZ);
      }
      clearCofactor() {
        if (cofactor === _1n6)
          return this;
        return this.multiplyUnsafe(cofactor);
      }
      toBytes() {
        const { x, y } = this.toAffine();
        const bytes = Fp3.toBytes(y);
        bytes[bytes.length - 1] |= x & _1n6 ? 128 : 0;
        return bytes;
      }
      toHex() {
        return bytesToHex(this.toBytes());
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
    }
    const wnaf = new wNAF(Point, Fn3.BITS);
    Point.BASE.precompute(8);
    return Point;
  }
  function eddsa(Point, cHash, eddsaOpts = {}) {
    if (typeof cHash !== "function")
      throw new Error('"hash" function param is required');
    validateObject(eddsaOpts, {}, {
      adjustScalarBytes: "function",
      randomBytes: "function",
      domain: "function",
      prehash: "function",
      mapToCurve: "function"
    });
    const { prehash } = eddsaOpts;
    const { BASE, Fp: Fp3, Fn: Fn3 } = Point;
    const randomBytes2 = eddsaOpts.randomBytes || randomBytes;
    const adjustScalarBytes3 = eddsaOpts.adjustScalarBytes || ((bytes) => bytes);
    const domain = eddsaOpts.domain || ((data, ctx, phflag) => {
      abool(phflag, "phflag");
      if (ctx.length || phflag)
        throw new Error("Contexts/pre-hash are not supported");
      return data;
    });
    function modN_LE(hash) {
      return Fn3.create(bytesToNumberLE(hash));
    }
    function getPrivateScalar(key) {
      const len = lengths.secretKey;
      abytes(key, lengths.secretKey, "secretKey");
      const hashed = abytes(cHash(key), 2 * len, "hashedSecretKey");
      const head = adjustScalarBytes3(hashed.slice(0, len));
      const prefix = hashed.slice(len, 2 * len);
      const scalar = modN_LE(head);
      return { head, prefix, scalar };
    }
    function getExtendedPublicKey(secretKey) {
      const { head, prefix, scalar } = getPrivateScalar(secretKey);
      const point = BASE.multiply(scalar);
      const pointBytes = point.toBytes();
      return { head, prefix, scalar, point, pointBytes };
    }
    function getPublicKey(secretKey) {
      return getExtendedPublicKey(secretKey).pointBytes;
    }
    function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
      const msg = concatBytes(...msgs);
      return modN_LE(cHash(domain(msg, abytes(context, void 0, "context"), !!prehash)));
    }
    function sign(msg, secretKey, options = {}) {
      msg = abytes(msg, void 0, "message");
      if (prehash)
        msg = prehash(msg);
      const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
      const r = hashDomainToScalar(options.context, prefix, msg);
      const R = BASE.multiply(r).toBytes();
      const k = hashDomainToScalar(options.context, R, pointBytes, msg);
      const s = Fn3.create(r + k * scalar);
      if (!Fn3.isValid(s))
        throw new Error("sign failed: invalid s");
      const rs = concatBytes(R, Fn3.toBytes(s));
      return abytes(rs, lengths.signature, "result");
    }
    const verifyOpts = { zip215: true };
    function verify(sig, msg, publicKey, options = verifyOpts) {
      const { context, zip215 } = options;
      const len = lengths.signature;
      sig = abytes(sig, len, "signature");
      msg = abytes(msg, void 0, "message");
      publicKey = abytes(publicKey, lengths.publicKey, "publicKey");
      if (zip215 !== void 0)
        abool(zip215, "zip215");
      if (prehash)
        msg = prehash(msg);
      const mid = len / 2;
      const r = sig.subarray(0, mid);
      const s = bytesToNumberLE(sig.subarray(mid, len));
      let A, R, SB;
      try {
        A = Point.fromBytes(publicKey, zip215);
        R = Point.fromBytes(r, zip215);
        SB = BASE.multiplyUnsafe(s);
      } catch (error) {
        return false;
      }
      if (!zip215 && A.isSmallOrder())
        return false;
      const k = hashDomainToScalar(context, R.toBytes(), A.toBytes(), msg);
      const RkA = R.add(A.multiplyUnsafe(k));
      return RkA.subtract(SB).clearCofactor().is0();
    }
    const _size = Fp3.BYTES;
    const lengths = {
      secretKey: _size,
      publicKey: _size,
      signature: 2 * _size,
      seed: _size
    };
    function randomSecretKey(seed = randomBytes2(lengths.seed)) {
      return abytes(seed, lengths.seed, "seed");
    }
    function isValidSecretKey(key) {
      return isBytes(key) && key.length === Fn3.BYTES;
    }
    function isValidPublicKey(key, zip215) {
      try {
        return !!Point.fromBytes(key, zip215);
      } catch (error) {
        return false;
      }
    }
    const utils = {
      getExtendedPublicKey,
      randomSecretKey,
      isValidSecretKey,
      isValidPublicKey,
      /**
       * Converts ed public key to x public key. Uses formula:
       * - ed25519:
       *   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
       *   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
       * - ed448:
       *   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
       *   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
       */
      toMontgomery(publicKey) {
        const { y } = Point.fromBytes(publicKey);
        const size = lengths.publicKey;
        const is25519 = size === 32;
        if (!is25519 && size !== 57)
          throw new Error("only defined for 25519 and 448");
        const u = is25519 ? Fp3.div(_1n6 + y, _1n6 - y) : Fp3.div(y - _1n6, y + _1n6);
        return Fp3.toBytes(u);
      },
      toMontgomerySecret(secretKey) {
        const size = lengths.secretKey;
        abytes(secretKey, size);
        const hashed = cHash(secretKey.subarray(0, size));
        return adjustScalarBytes3(hashed).subarray(0, size);
      }
    };
    return Object.freeze({
      keygen: createKeygen(randomSecretKey, getPublicKey),
      getPublicKey,
      sign,
      verify,
      utils,
      Point,
      lengths
    });
  }
  var _0n6, _1n6, _2n4, _8n2, PrimeEdwardsPoint;
  var init_edwards = __esm({
    "node_modules/@noble/curves/abstract/edwards.js"() {
      init_utils2();
      init_curve();
      _0n6 = BigInt(0);
      _1n6 = BigInt(1);
      _2n4 = BigInt(2);
      _8n2 = BigInt(8);
      PrimeEdwardsPoint = class {
        static BASE;
        static ZERO;
        static Fp;
        static Fn;
        ep;
        constructor(ep) {
          this.ep = ep;
        }
        // Static methods that must be implemented by subclasses
        static fromBytes(_bytes) {
          notImplemented();
        }
        static fromHex(_hex) {
          notImplemented();
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        // Common implementations
        clearCofactor() {
          return this;
        }
        assertValidity() {
          this.ep.assertValidity();
        }
        toAffine(invertedZ) {
          return this.ep.toAffine(invertedZ);
        }
        toHex() {
          return bytesToHex(this.toBytes());
        }
        toString() {
          return this.toHex();
        }
        isTorsionFree() {
          return true;
        }
        isSmallOrder() {
          return false;
        }
        add(other) {
          this.assertSame(other);
          return this.init(this.ep.add(other.ep));
        }
        subtract(other) {
          this.assertSame(other);
          return this.init(this.ep.subtract(other.ep));
        }
        multiply(scalar) {
          return this.init(this.ep.multiply(scalar));
        }
        multiplyUnsafe(scalar) {
          return this.init(this.ep.multiplyUnsafe(scalar));
        }
        double() {
          return this.init(this.ep.double());
        }
        negate() {
          return this.init(this.ep.negate());
        }
        precompute(windowSize, isLazy) {
          return this.init(this.ep.precompute(windowSize, isLazy));
        }
      };
    }
  });

  // node_modules/@noble/curves/abstract/montgomery.js
  function validateOpts(curve) {
    validateObject(curve, {
      adjustScalarBytes: "function",
      powPminus2: "function"
    });
    return Object.freeze({ ...curve });
  }
  function montgomery(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { P, type, adjustScalarBytes: adjustScalarBytes3, powPminus2, randomBytes: rand } = CURVE;
    const is25519 = type === "x25519";
    if (!is25519 && type !== "x448")
      throw new Error("invalid type");
    const randomBytes_ = rand || randomBytes;
    const montgomeryBits = is25519 ? 255 : 448;
    const fieldLen = is25519 ? 32 : 56;
    const Gu = is25519 ? BigInt(9) : BigInt(5);
    const a24 = is25519 ? BigInt(121665) : BigInt(39081);
    const minScalar = is25519 ? _2n5 ** BigInt(254) : _2n5 ** BigInt(447);
    const maxAdded = is25519 ? BigInt(8) * _2n5 ** BigInt(251) - _1n7 : BigInt(4) * _2n5 ** BigInt(445) - _1n7;
    const maxScalar = minScalar + maxAdded + _1n7;
    const modP = (n) => mod(n, P);
    const GuBytes = encodeU(Gu);
    function encodeU(u) {
      return numberToBytesLE(modP(u), fieldLen);
    }
    function decodeU(u) {
      const _u = copyBytes(abytes(u, fieldLen, "uCoordinate"));
      if (is25519)
        _u[31] &= 127;
      return modP(bytesToNumberLE(_u));
    }
    function decodeScalar(scalar) {
      return bytesToNumberLE(adjustScalarBytes3(copyBytes(abytes(scalar, fieldLen, "scalar"))));
    }
    function scalarMult(scalar, u) {
      const pu = montgomeryLadder(decodeU(u), decodeScalar(scalar));
      if (pu === _0n7)
        throw new Error("invalid private or public key received");
      return encodeU(pu);
    }
    function scalarMultBase(scalar) {
      return scalarMult(scalar, GuBytes);
    }
    const getPublicKey = scalarMultBase;
    const getSharedSecret = scalarMult;
    function cswap(swap, x_2, x_3) {
      const dummy = modP(swap * (x_2 - x_3));
      x_2 = modP(x_2 - dummy);
      x_3 = modP(x_3 + dummy);
      return { x_2, x_3 };
    }
    function montgomeryLadder(u, scalar) {
      aInRange("u", u, _0n7, P);
      aInRange("scalar", scalar, minScalar, maxScalar);
      const k = scalar;
      const x_1 = u;
      let x_2 = _1n7;
      let z_2 = _0n7;
      let x_3 = u;
      let z_3 = _1n7;
      let swap = _0n7;
      for (let t = BigInt(montgomeryBits - 1); t >= _0n7; t--) {
        const k_t = k >> t & _1n7;
        swap ^= k_t;
        ({ x_2, x_3 } = cswap(swap, x_2, x_3));
        ({ x_2: z_2, x_3: z_3 } = cswap(swap, z_2, z_3));
        swap = k_t;
        const A = x_2 + z_2;
        const AA = modP(A * A);
        const B = x_2 - z_2;
        const BB = modP(B * B);
        const E = AA - BB;
        const C = x_3 + z_3;
        const D = x_3 - z_3;
        const DA = modP(D * A);
        const CB = modP(C * B);
        const dacb = DA + CB;
        const da_cb = DA - CB;
        x_3 = modP(dacb * dacb);
        z_3 = modP(x_1 * modP(da_cb * da_cb));
        x_2 = modP(AA * BB);
        z_2 = modP(E * (AA + modP(a24 * E)));
      }
      ({ x_2, x_3 } = cswap(swap, x_2, x_3));
      ({ x_2: z_2, x_3: z_3 } = cswap(swap, z_2, z_3));
      const z2 = powPminus2(z_2);
      return modP(x_2 * z2);
    }
    const lengths = {
      secretKey: fieldLen,
      publicKey: fieldLen,
      seed: fieldLen
    };
    const randomSecretKey = (seed = randomBytes_(fieldLen)) => {
      abytes(seed, lengths.seed, "seed");
      return seed;
    };
    const utils = { randomSecretKey };
    return Object.freeze({
      keygen: createKeygen(randomSecretKey, getPublicKey),
      getSharedSecret,
      getPublicKey,
      scalarMult,
      scalarMultBase,
      utils,
      GuBytes: GuBytes.slice(),
      lengths
    });
  }
  var _0n7, _1n7, _2n5;
  var init_montgomery = __esm({
    "node_modules/@noble/curves/abstract/montgomery.js"() {
      init_utils2();
      init_curve();
      init_modular();
      _0n7 = BigInt(0);
      _1n7 = BigInt(1);
      _2n5 = BigInt(2);
    }
  });

  // node_modules/@noble/curves/ed448.js
  var ed448_exports = {};
  __export(ed448_exports, {
    E448: () => E448,
    ED448_TORSION_SUBGROUP: () => ED448_TORSION_SUBGROUP,
    decaf448: () => decaf448,
    decaf448_hasher: () => decaf448_hasher,
    decaf448_oprf: () => decaf448_oprf,
    ed448: () => ed448,
    ed448_hasher: () => ed448_hasher,
    ed448ph: () => ed448ph,
    x448: () => x448
  });
  function ed448_pow_Pminus3div4(x) {
    const P = ed448_CURVE_p;
    const b2 = x * x * x % P;
    const b3 = b2 * b2 * x % P;
    const b6 = pow2(b3, _3n3, P) * b3 % P;
    const b9 = pow2(b6, _3n3, P) * b3 % P;
    const b11 = pow2(b9, _2n6, P) * b2 % P;
    const b22 = pow2(b11, _11n, P) * b11 % P;
    const b44 = pow2(b22, _22n, P) * b22 % P;
    const b88 = pow2(b44, _44n, P) * b44 % P;
    const b176 = pow2(b88, _88n, P) * b88 % P;
    const b220 = pow2(b176, _44n, P) * b44 % P;
    const b222 = pow2(b220, _2n6, P) * b2 % P;
    const b223 = pow2(b222, _1n8, P) * x % P;
    return pow2(b223, _223n, P) * b222 % P;
  }
  function adjustScalarBytes(bytes) {
    bytes[0] &= 252;
    bytes[55] |= 128;
    bytes[56] = 0;
    return bytes;
  }
  function uvRatio(u, v) {
    const P = ed448_CURVE_p;
    const u2v = mod(u * u * v, P);
    const u3v = mod(u2v * u, P);
    const u5v3 = mod(u3v * u2v * v, P);
    const root = ed448_pow_Pminus3div4(u5v3);
    const x = mod(u3v * root, P);
    const x2 = mod(x * x, P);
    return { isValid: mod(x2 * v, P) === u, value: x };
  }
  function dom4(data, ctx, phflag) {
    if (ctx.length > 255)
      throw new Error("context must be smaller than 255, got: " + ctx.length);
    return concatBytes(asciiToBytes("SigEd448"), new Uint8Array([phflag ? 1 : 0, ctx.length]), ctx, data);
  }
  function ed4(opts) {
    return eddsa(ed448_Point, shake256_114, Object.assign({ adjustScalarBytes, domain: dom4 }, opts));
  }
  function map_to_curve_elligator2_curve448(u) {
    let tv1 = Fp.sqr(u);
    let e1 = Fp.eql(tv1, Fp.ONE);
    tv1 = Fp.cmov(tv1, Fp.ZERO, e1);
    let xd = Fp.sub(Fp.ONE, tv1);
    let x1n = Fp.neg(ELL2_J);
    let tv2 = Fp.sqr(xd);
    let gxd = Fp.mul(tv2, xd);
    let gx1 = Fp.mul(tv1, Fp.neg(ELL2_J));
    gx1 = Fp.mul(gx1, x1n);
    gx1 = Fp.add(gx1, tv2);
    gx1 = Fp.mul(gx1, x1n);
    let tv3 = Fp.sqr(gxd);
    tv2 = Fp.mul(gx1, gxd);
    tv3 = Fp.mul(tv3, tv2);
    let y1 = Fp.pow(tv3, ELL2_C1);
    y1 = Fp.mul(y1, tv2);
    let x2n = Fp.mul(x1n, Fp.neg(tv1));
    let y2 = Fp.mul(y1, u);
    y2 = Fp.cmov(y2, Fp.ZERO, e1);
    tv2 = Fp.sqr(y1);
    tv2 = Fp.mul(tv2, gxd);
    let e2 = Fp.eql(tv2, gx1);
    let xn = Fp.cmov(x2n, x1n, e2);
    let y = Fp.cmov(y2, y1, e2);
    let e3 = Fp.isOdd(y);
    y = Fp.cmov(y, Fp.neg(y), e2 !== e3);
    return { xn, xd, yn: y, yd: Fp.ONE };
  }
  function map_to_curve_elligator2_edwards448(u) {
    let { xn, xd, yn, yd } = map_to_curve_elligator2_curve448(u);
    let xn2 = Fp.sqr(xn);
    let xd2 = Fp.sqr(xd);
    let xd4 = Fp.sqr(xd2);
    let yn2 = Fp.sqr(yn);
    let yd2 = Fp.sqr(yd);
    let xEn = Fp.sub(xn2, xd2);
    let tv2 = Fp.sub(xEn, xd2);
    xEn = Fp.mul(xEn, xd2);
    xEn = Fp.mul(xEn, yd);
    xEn = Fp.mul(xEn, yn);
    xEn = Fp.mul(xEn, _4n3);
    tv2 = Fp.mul(tv2, xn2);
    tv2 = Fp.mul(tv2, yd2);
    let tv3 = Fp.mul(yn2, _4n3);
    let tv1 = Fp.add(tv3, yd2);
    tv1 = Fp.mul(tv1, xd4);
    let xEd = Fp.add(tv1, tv2);
    tv2 = Fp.mul(tv2, xn);
    let tv4 = Fp.mul(xn, xd4);
    let yEn = Fp.sub(tv3, yd2);
    yEn = Fp.mul(yEn, tv4);
    yEn = Fp.sub(yEn, tv2);
    tv1 = Fp.add(xn2, xd2);
    tv1 = Fp.mul(tv1, xd2);
    tv1 = Fp.mul(tv1, xd);
    tv1 = Fp.mul(tv1, yn2);
    tv1 = Fp.mul(tv1, BigInt(-2));
    let yEd = Fp.add(tv2, tv1);
    tv4 = Fp.mul(tv4, yd2);
    yEd = Fp.add(yEd, tv4);
    tv1 = Fp.mul(xEd, yEd);
    let e = Fp.eql(tv1, Fp.ZERO);
    xEn = Fp.cmov(xEn, Fp.ZERO, e);
    xEd = Fp.cmov(xEd, Fp.ONE, e);
    yEn = Fp.cmov(yEn, Fp.ONE, e);
    yEd = Fp.cmov(yEd, Fp.ONE, e);
    const inv = FpInvertBatch(Fp, [xEd, yEd], true);
    return { x: Fp.mul(xEn, inv[0]), y: Fp.mul(yEn, inv[1]) };
  }
  function calcElligatorDecafMap(r0) {
    const { d, p: P } = ed448_CURVE;
    const mod2 = (n) => Fp448.create(n);
    const r = mod2(-(r0 * r0));
    const u0 = mod2(d * (r - _1n8));
    const u1 = mod2((u0 + _1n8) * (u0 - r));
    const { isValid: was_square, value: v } = uvRatio(ONE_MINUS_TWO_D, mod2((r + _1n8) * u1));
    let v_prime = v;
    if (!was_square)
      v_prime = mod2(r0 * v);
    let sgn = _1n8;
    if (!was_square)
      sgn = mod2(-_1n8);
    const s = mod2(v_prime * (r + _1n8));
    let s_abs = s;
    if (isNegativeLE(s, P))
      s_abs = mod2(-s);
    const s2 = s * s;
    const W0 = mod2(s_abs * _2n6);
    const W1 = mod2(s2 + _1n8);
    const W2 = mod2(s2 - _1n8);
    const W3 = mod2(v_prime * s * (r - _1n8) * ONE_MINUS_TWO_D + sgn);
    return new ed448_Point(mod2(W0 * W3), mod2(W2 * W1), mod2(W1 * W3), mod2(W0 * W2));
  }
  var ed448_CURVE_p, ed448_CURVE, E448_CURVE, shake256_114, shake256_64, _1n8, _2n6, _3n3, _4n3, _11n, _22n, _44n, _88n, _223n, Fp, Fn, Fp448, Fn448, ed448_Point, ed448, ed448ph, E448, x448, ELL2_C1, ELL2_J, ed448_hasher, ONE_MINUS_D, ONE_MINUS_TWO_D, SQRT_MINUS_D, INVSQRT_MINUS_D, invertSqrt, _DecafPoint, decaf448, decaf448_hasher, decaf448_oprf, ED448_TORSION_SUBGROUP;
  var init_ed448 = __esm({
    "node_modules/@noble/curves/ed448.js"() {
      init_sha3();
      init_utils();
      init_edwards();
      init_hash_to_curve();
      init_modular();
      init_montgomery();
      init_oprf();
      init_utils2();
      ed448_CURVE_p = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
      ed448_CURVE = /* @__PURE__ */ (() => ({
        p: ed448_CURVE_p,
        n: BigInt("0x3fffffffffffffffffffffffffffffffffffffffffffffffffffffff7cca23e9c44edb49aed63690216cc2728dc58f552378c292ab5844f3"),
        h: BigInt(4),
        a: BigInt(1),
        d: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffff6756"),
        Gx: BigInt("0x4f1970c66bed0ded221d15a622bf36da9e146570470f1767ea6de324a3d3a46412ae1af72ab66511433b80e18b00938e2626a82bc70cc05e"),
        Gy: BigInt("0x693f46716eb6bc248876203756c9c7624bea73736ca3984087789c1e05a0c2d73ad3ff1ce67c39c4fdbd132c4ed7c8ad9808795bf230fa14")
      }))();
      E448_CURVE = /* @__PURE__ */ (() => Object.assign({}, ed448_CURVE, {
        d: BigInt("0xd78b4bdc7f0daf19f24f38c29373a2ccad46157242a50f37809b1da3412a12e79ccc9c81264cfe9ad080997058fb61c4243cc32dbaa156b9"),
        Gx: BigInt("0x79a70b2b70400553ae7c9df416c792c61128751ac92969240c25a07d728bdc93e21f7787ed6972249de732f38496cd11698713093e9c04fc"),
        Gy: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffff80000000000000000000000000000000000000000000000000000001")
      }))();
      shake256_114 = /* @__PURE__ */ createHasher(() => shake256.create({ dkLen: 114 }));
      shake256_64 = /* @__PURE__ */ createHasher(() => shake256.create({ dkLen: 64 }));
      _1n8 = BigInt(1);
      _2n6 = BigInt(2);
      _3n3 = BigInt(3);
      _4n3 = /* @__PURE__ */ BigInt(4);
      _11n = BigInt(11);
      _22n = BigInt(22);
      _44n = BigInt(44);
      _88n = BigInt(88);
      _223n = BigInt(223);
      Fp = /* @__PURE__ */ (() => Field(ed448_CURVE_p, { BITS: 456, isLE: true }))();
      Fn = /* @__PURE__ */ (() => Field(ed448_CURVE.n, { BITS: 456, isLE: true }))();
      Fp448 = /* @__PURE__ */ (() => Field(ed448_CURVE_p, { BITS: 448, isLE: true }))();
      Fn448 = /* @__PURE__ */ (() => Field(ed448_CURVE.n, { BITS: 448, isLE: true }))();
      ed448_Point = /* @__PURE__ */ edwards(ed448_CURVE, { Fp, Fn, uvRatio });
      ed448 = /* @__PURE__ */ ed4({});
      ed448ph = /* @__PURE__ */ ed4({ prehash: shake256_64 });
      E448 = /* @__PURE__ */ edwards(E448_CURVE);
      x448 = /* @__PURE__ */ (() => {
        const P = ed448_CURVE_p;
        return montgomery({
          P,
          type: "x448",
          powPminus2: (x) => {
            const Pminus3div4 = ed448_pow_Pminus3div4(x);
            const Pminus3 = pow2(Pminus3div4, _2n6, P);
            return mod(Pminus3 * x, P);
          },
          adjustScalarBytes
        });
      })();
      ELL2_C1 = /* @__PURE__ */ (() => (ed448_CURVE_p - BigInt(3)) / BigInt(4))();
      ELL2_J = /* @__PURE__ */ BigInt(156326);
      ed448_hasher = /* @__PURE__ */ (() => createHasher2(ed448_Point, (scalars) => map_to_curve_elligator2_edwards448(scalars[0]), {
        DST: "edwards448_XOF:SHAKE256_ELL2_RO_",
        encodeDST: "edwards448_XOF:SHAKE256_ELL2_NU_",
        p: ed448_CURVE_p,
        m: 1,
        k: 224,
        expand: "xof",
        hash: shake256
      }))();
      ONE_MINUS_D = /* @__PURE__ */ BigInt("39082");
      ONE_MINUS_TWO_D = /* @__PURE__ */ BigInt("78163");
      SQRT_MINUS_D = /* @__PURE__ */ BigInt("98944233647732219769177004876929019128417576295529901074099889598043702116001257856802131563896515373927712232092845883226922417596214");
      INVSQRT_MINUS_D = /* @__PURE__ */ BigInt("315019913931389607337177038330951043522456072897266928557328499619017160722351061360252776265186336876723201881398623946864393857820716");
      invertSqrt = (number) => uvRatio(_1n8, number);
      _DecafPoint = class __DecafPoint extends PrimeEdwardsPoint {
        // The following gymnastics is done because typescript strips comments otherwise
        // prettier-ignore
        static BASE = /* @__PURE__ */ (() => new __DecafPoint(ed448_Point.BASE).multiplyUnsafe(_2n6))();
        // prettier-ignore
        static ZERO = /* @__PURE__ */ (() => new __DecafPoint(ed448_Point.ZERO))();
        // prettier-ignore
        static Fp = /* @__PURE__ */ (() => Fp448)();
        // prettier-ignore
        static Fn = /* @__PURE__ */ (() => Fn448)();
        constructor(ep) {
          super(ep);
        }
        static fromAffine(ap) {
          return new __DecafPoint(ed448_Point.fromAffine(ap));
        }
        assertSame(other) {
          if (!(other instanceof __DecafPoint))
            throw new Error("DecafPoint expected");
        }
        init(ep) {
          return new __DecafPoint(ep);
        }
        static fromBytes(bytes) {
          abytes(bytes, 56);
          const { d, p: P } = ed448_CURVE;
          const mod2 = (n) => Fp448.create(n);
          const s = Fp448.fromBytes(bytes);
          if (!equalBytes(Fn448.toBytes(s), bytes) || isNegativeLE(s, P))
            throw new Error("invalid decaf448 encoding 1");
          const s2 = mod2(s * s);
          const u1 = mod2(_1n8 + s2);
          const u1sq = mod2(u1 * u1);
          const u2 = mod2(u1sq - _4n3 * d * s2);
          const { isValid, value: invsqrt } = invertSqrt(mod2(u2 * u1sq));
          let u3 = mod2((s + s) * invsqrt * u1 * SQRT_MINUS_D);
          if (isNegativeLE(u3, P))
            u3 = mod2(-u3);
          const x = mod2(u3 * invsqrt * u2 * INVSQRT_MINUS_D);
          const y = mod2((_1n8 - s2) * invsqrt * u1);
          const t = mod2(x * y);
          if (!isValid)
            throw new Error("invalid decaf448 encoding 2");
          return new __DecafPoint(new ed448_Point(x, y, _1n8, t));
        }
        /**
         * Converts decaf-encoded string to decaf point.
         * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode-2).
         * @param hex Decaf-encoded 56 bytes. Not every 56-byte string is valid decaf encoding
         */
        static fromHex(hex) {
          return __DecafPoint.fromBytes(hexToBytes(hex));
        }
        /**
         * Encodes decaf point to Uint8Array.
         * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode-2).
         */
        toBytes() {
          const { X, Z, T } = this.ep;
          const P = ed448_CURVE.p;
          const mod2 = (n) => Fp448.create(n);
          const u1 = mod2(mod2(X + T) * mod2(X - T));
          const x2 = mod2(X * X);
          const { value: invsqrt } = invertSqrt(mod2(u1 * ONE_MINUS_D * x2));
          let ratio = mod2(invsqrt * u1 * SQRT_MINUS_D);
          if (isNegativeLE(ratio, P))
            ratio = mod2(-ratio);
          const u2 = mod2(INVSQRT_MINUS_D * ratio * Z - T);
          let s = mod2(ONE_MINUS_D * invsqrt * X * u2);
          if (isNegativeLE(s, P))
            s = mod2(-s);
          return Fn448.toBytes(s);
        }
        /**
         * Compare one point to another.
         * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals-2).
         */
        equals(other) {
          this.assertSame(other);
          const { X: X1, Y: Y1 } = this.ep;
          const { X: X2, Y: Y2 } = other.ep;
          return Fp448.create(X1 * Y2) === Fp448.create(Y1 * X2);
        }
        is0() {
          return this.equals(__DecafPoint.ZERO);
        }
      };
      decaf448 = { Point: _DecafPoint };
      decaf448_hasher = {
        Point: _DecafPoint,
        hashToCurve(msg, options) {
          const DST = options?.DST || "decaf448_XOF:SHAKE256_D448MAP_RO_";
          return decaf448_hasher.deriveToCurve(expand_message_xof(msg, DST, 112, 224, shake256));
        },
        /**
         * Warning: has big modulo bias of 2^-64.
         * RFC is invalid. RFC says "use 64-byte xof", while for 2^-112 bias
         * it must use 84-byte xof (56+56/2), not 64.
         */
        hashToScalar(msg, options = { DST: _DST_scalar }) {
          const xof = expand_message_xof(msg, options.DST, 64, 256, shake256);
          return Fn448.create(bytesToNumberLE(xof));
        },
        /**
         * HashToCurve-like construction based on RFC 9496 (Element Derivation).
         * Converts 112 uniform random bytes into a curve point.
         *
         * WARNING: This represents an older hash-to-curve construction, preceding the finalization of RFC 9380.
         * It was later reused as a component in the newer `hash_to_ristretto255` function defined in RFC 9380.
         */
        deriveToCurve(bytes) {
          abytes(bytes, 112);
          const skipValidation = true;
          const r1 = Fp448.create(Fp448.fromBytes(bytes.subarray(0, 56), skipValidation));
          const R1 = calcElligatorDecafMap(r1);
          const r2 = Fp448.create(Fp448.fromBytes(bytes.subarray(56, 112), skipValidation));
          const R2 = calcElligatorDecafMap(r2);
          return new _DecafPoint(R1.add(R2));
        }
      };
      decaf448_oprf = /* @__PURE__ */ (() => createORPF({
        name: "decaf448-SHAKE256",
        Point: _DecafPoint,
        hash: (msg) => shake256(msg, { dkLen: 64 }),
        hashToGroup: decaf448_hasher.hashToCurve,
        hashToScalar: decaf448_hasher.hashToScalar
      }))();
      ED448_TORSION_SUBGROUP = [
        "010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "fefffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffff00",
        "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080"
      ];
    }
  });

  // node_modules/@noble/curves/ed25519.js
  var ed25519_exports = {};
  __export(ed25519_exports, {
    ED25519_TORSION_SUBGROUP: () => ED25519_TORSION_SUBGROUP,
    _map_to_curve_elligator2_curve25519: () => _map_to_curve_elligator2_curve25519,
    ed25519: () => ed25519,
    ed25519_hasher: () => ed25519_hasher,
    ed25519ctx: () => ed25519ctx,
    ed25519ph: () => ed25519ph,
    ristretto255: () => ristretto255,
    ristretto255_hasher: () => ristretto255_hasher,
    ristretto255_oprf: () => ristretto255_oprf,
    x25519: () => x25519
  });
  function ed25519_pow_2_252_3(x) {
    const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
    const P = ed25519_CURVE_p;
    const x2 = x * x % P;
    const b2 = x2 * x % P;
    const b4 = pow2(b2, _2n7, P) * b2 % P;
    const b5 = pow2(b4, _1n9, P) * x % P;
    const b10 = pow2(b5, _5n2, P) * b5 % P;
    const b20 = pow2(b10, _10n, P) * b10 % P;
    const b40 = pow2(b20, _20n, P) * b20 % P;
    const b80 = pow2(b40, _40n, P) * b40 % P;
    const b160 = pow2(b80, _80n, P) * b80 % P;
    const b240 = pow2(b160, _80n, P) * b80 % P;
    const b250 = pow2(b240, _10n, P) * b10 % P;
    const pow_p_5_8 = pow2(b250, _2n7, P) * x % P;
    return { pow_p_5_8, b2 };
  }
  function adjustScalarBytes2(bytes) {
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
    return bytes;
  }
  function uvRatio2(u, v) {
    const P = ed25519_CURVE_p;
    const v3 = mod(v * v * v, P);
    const v7 = mod(v3 * v3 * v, P);
    const pow = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
    let x = mod(u * v3 * pow, P);
    const vx2 = mod(v * x * x, P);
    const root1 = x;
    const root2 = mod(x * ED25519_SQRT_M1, P);
    const useRoot1 = vx2 === u;
    const useRoot2 = vx2 === mod(-u, P);
    const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
    if (useRoot1)
      x = root1;
    if (useRoot2 || noRoot)
      x = root2;
    if (isNegativeLE(x, P))
      x = mod(-x, P);
    return { isValid: useRoot1 || useRoot2, value: x };
  }
  function ed25519_domain(data, ctx, phflag) {
    if (ctx.length > 255)
      throw new Error("Context is too big");
    return concatBytes(asciiToBytes("SigEd25519 no Ed25519 collisions"), new Uint8Array([phflag ? 1 : 0, ctx.length]), ctx, data);
  }
  function ed(opts) {
    return eddsa(ed25519_Point, sha512, Object.assign({ adjustScalarBytes: adjustScalarBytes2 }, opts));
  }
  function _map_to_curve_elligator2_curve25519(u) {
    const ELL2_C4 = (ed25519_CURVE_p - _5n2) / _8n3;
    const ELL2_J2 = BigInt(486662);
    let tv1 = Fp2.sqr(u);
    tv1 = Fp2.mul(tv1, _2n7);
    let xd = Fp2.add(tv1, Fp2.ONE);
    let x1n = Fp2.neg(ELL2_J2);
    let tv2 = Fp2.sqr(xd);
    let gxd = Fp2.mul(tv2, xd);
    let gx1 = Fp2.mul(tv1, ELL2_J2);
    gx1 = Fp2.mul(gx1, x1n);
    gx1 = Fp2.add(gx1, tv2);
    gx1 = Fp2.mul(gx1, x1n);
    let tv3 = Fp2.sqr(gxd);
    tv2 = Fp2.sqr(tv3);
    tv3 = Fp2.mul(tv3, gxd);
    tv3 = Fp2.mul(tv3, gx1);
    tv2 = Fp2.mul(tv2, tv3);
    let y11 = Fp2.pow(tv2, ELL2_C4);
    y11 = Fp2.mul(y11, tv3);
    let y12 = Fp2.mul(y11, ELL2_C3);
    tv2 = Fp2.sqr(y11);
    tv2 = Fp2.mul(tv2, gxd);
    let e1 = Fp2.eql(tv2, gx1);
    let y1 = Fp2.cmov(y12, y11, e1);
    let x2n = Fp2.mul(x1n, tv1);
    let y21 = Fp2.mul(y11, u);
    y21 = Fp2.mul(y21, ELL2_C2);
    let y22 = Fp2.mul(y21, ELL2_C3);
    let gx2 = Fp2.mul(gx1, tv1);
    tv2 = Fp2.sqr(y21);
    tv2 = Fp2.mul(tv2, gxd);
    let e2 = Fp2.eql(tv2, gx2);
    let y2 = Fp2.cmov(y22, y21, e2);
    tv2 = Fp2.sqr(y1);
    tv2 = Fp2.mul(tv2, gxd);
    let e3 = Fp2.eql(tv2, gx1);
    let xn = Fp2.cmov(x2n, x1n, e3);
    let y = Fp2.cmov(y2, y1, e3);
    let e4 = Fp2.isOdd(y);
    y = Fp2.cmov(y, Fp2.neg(y), e3 !== e4);
    return { xMn: xn, xMd: xd, yMn: y, yMd: _1n9 };
  }
  function map_to_curve_elligator2_edwards25519(u) {
    const { xMn, xMd, yMn, yMd } = _map_to_curve_elligator2_curve25519(u);
    let xn = Fp2.mul(xMn, yMd);
    xn = Fp2.mul(xn, ELL2_C1_EDWARDS);
    let xd = Fp2.mul(xMd, yMn);
    let yn = Fp2.sub(xMn, xMd);
    let yd = Fp2.add(xMn, xMd);
    let tv1 = Fp2.mul(xd, yd);
    let e = Fp2.eql(tv1, Fp2.ZERO);
    xn = Fp2.cmov(xn, Fp2.ZERO, e);
    xd = Fp2.cmov(xd, Fp2.ONE, e);
    yn = Fp2.cmov(yn, Fp2.ONE, e);
    yd = Fp2.cmov(yd, Fp2.ONE, e);
    const [xd_inv, yd_inv] = FpInvertBatch(Fp2, [xd, yd], true);
    return { x: Fp2.mul(xn, xd_inv), y: Fp2.mul(yn, yd_inv) };
  }
  function calcElligatorRistrettoMap(r0) {
    const { d } = ed25519_CURVE;
    const P = ed25519_CURVE_p;
    const mod2 = (n) => Fp2.create(n);
    const r = mod2(SQRT_M1 * r0 * r0);
    const Ns = mod2((r + _1n9) * ONE_MINUS_D_SQ);
    let c = BigInt(-1);
    const D = mod2((c - d * r) * mod2(r + d));
    let { isValid: Ns_D_is_sq, value: s } = uvRatio2(Ns, D);
    let s_ = mod2(s * r0);
    if (!isNegativeLE(s_, P))
      s_ = mod2(-s_);
    if (!Ns_D_is_sq)
      s = s_;
    if (!Ns_D_is_sq)
      c = r;
    const Nt = mod2(c * (r - _1n9) * D_MINUS_ONE_SQ - D);
    const s2 = s * s;
    const W0 = mod2((s + s) * D);
    const W1 = mod2(Nt * SQRT_AD_MINUS_ONE);
    const W2 = mod2(_1n9 - s2);
    const W3 = mod2(_1n9 + s2);
    return new ed25519_Point(mod2(W0 * W3), mod2(W2 * W1), mod2(W1 * W3), mod2(W0 * W2));
  }
  var _0n8, _1n9, _2n7, _3n4, _5n2, _8n3, ed25519_CURVE_p, ed25519_CURVE, ED25519_SQRT_M1, ed25519_Point, Fp2, Fn2, ed25519, ed25519ctx, ed25519ph, x25519, ELL2_C12, ELL2_C2, ELL2_C3, ELL2_C1_EDWARDS, ed25519_hasher, SQRT_M1, SQRT_AD_MINUS_ONE, INVSQRT_A_MINUS_D, ONE_MINUS_D_SQ, D_MINUS_ONE_SQ, invertSqrt2, MAX_255B, bytes255ToNumberLE, _RistrettoPoint, ristretto255, ristretto255_hasher, ristretto255_oprf, ED25519_TORSION_SUBGROUP;
  var init_ed25519 = __esm({
    "node_modules/@noble/curves/ed25519.js"() {
      init_sha2();
      init_utils();
      init_edwards();
      init_hash_to_curve();
      init_modular();
      init_montgomery();
      init_oprf();
      init_utils2();
      _0n8 = /* @__PURE__ */ BigInt(0);
      _1n9 = BigInt(1);
      _2n7 = BigInt(2);
      _3n4 = /* @__PURE__ */ BigInt(3);
      _5n2 = BigInt(5);
      _8n3 = BigInt(8);
      ed25519_CURVE_p = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
      ed25519_CURVE = /* @__PURE__ */ (() => ({
        p: ed25519_CURVE_p,
        n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
        h: _8n3,
        a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
        d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
        Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
        Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
      }))();
      ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
      ed25519_Point = /* @__PURE__ */ edwards(ed25519_CURVE, { uvRatio: uvRatio2 });
      Fp2 = /* @__PURE__ */ (() => ed25519_Point.Fp)();
      Fn2 = /* @__PURE__ */ (() => ed25519_Point.Fn)();
      ed25519 = /* @__PURE__ */ ed({});
      ed25519ctx = /* @__PURE__ */ ed({ domain: ed25519_domain });
      ed25519ph = /* @__PURE__ */ ed({ domain: ed25519_domain, prehash: sha512 });
      x25519 = /* @__PURE__ */ (() => {
        const P = ed25519_CURVE_p;
        return montgomery({
          P,
          type: "x25519",
          powPminus2: (x) => {
            const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
            return mod(pow2(pow_p_5_8, _3n4, P) * b2, P);
          },
          adjustScalarBytes: adjustScalarBytes2
        });
      })();
      ELL2_C12 = /* @__PURE__ */ (() => (ed25519_CURVE_p + _3n4) / _8n3)();
      ELL2_C2 = /* @__PURE__ */ (() => Fp2.pow(_2n7, ELL2_C12))();
      ELL2_C3 = /* @__PURE__ */ (() => Fp2.sqrt(Fp2.neg(Fp2.ONE)))();
      ELL2_C1_EDWARDS = /* @__PURE__ */ (() => FpSqrtEven(Fp2, Fp2.neg(BigInt(486664))))();
      ed25519_hasher = /* @__PURE__ */ (() => createHasher2(ed25519_Point, (scalars) => map_to_curve_elligator2_edwards25519(scalars[0]), {
        DST: "edwards25519_XMD:SHA-512_ELL2_RO_",
        encodeDST: "edwards25519_XMD:SHA-512_ELL2_NU_",
        p: ed25519_CURVE_p,
        m: 1,
        k: 128,
        expand: "xmd",
        hash: sha512
      }))();
      SQRT_M1 = ED25519_SQRT_M1;
      SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
      INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
      ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
      D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
      invertSqrt2 = (number) => uvRatio2(_1n9, number);
      MAX_255B = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
      bytes255ToNumberLE = (bytes) => Fp2.create(bytesToNumberLE(bytes) & MAX_255B);
      _RistrettoPoint = class __RistrettoPoint extends PrimeEdwardsPoint {
        // Do NOT change syntax: the following gymnastics is done,
        // because typescript strips comments, which makes bundlers disable tree-shaking.
        // prettier-ignore
        static BASE = /* @__PURE__ */ (() => new __RistrettoPoint(ed25519_Point.BASE))();
        // prettier-ignore
        static ZERO = /* @__PURE__ */ (() => new __RistrettoPoint(ed25519_Point.ZERO))();
        // prettier-ignore
        static Fp = /* @__PURE__ */ (() => Fp2)();
        // prettier-ignore
        static Fn = /* @__PURE__ */ (() => Fn2)();
        constructor(ep) {
          super(ep);
        }
        static fromAffine(ap) {
          return new __RistrettoPoint(ed25519_Point.fromAffine(ap));
        }
        assertSame(other) {
          if (!(other instanceof __RistrettoPoint))
            throw new Error("RistrettoPoint expected");
        }
        init(ep) {
          return new __RistrettoPoint(ep);
        }
        static fromBytes(bytes) {
          abytes(bytes, 32);
          const { a, d } = ed25519_CURVE;
          const P = ed25519_CURVE_p;
          const mod2 = (n) => Fp2.create(n);
          const s = bytes255ToNumberLE(bytes);
          if (!equalBytes(Fp2.toBytes(s), bytes) || isNegativeLE(s, P))
            throw new Error("invalid ristretto255 encoding 1");
          const s2 = mod2(s * s);
          const u1 = mod2(_1n9 + a * s2);
          const u2 = mod2(_1n9 - a * s2);
          const u1_2 = mod2(u1 * u1);
          const u2_2 = mod2(u2 * u2);
          const v = mod2(a * d * u1_2 - u2_2);
          const { isValid, value: I } = invertSqrt2(mod2(v * u2_2));
          const Dx = mod2(I * u2);
          const Dy = mod2(I * Dx * v);
          let x = mod2((s + s) * Dx);
          if (isNegativeLE(x, P))
            x = mod2(-x);
          const y = mod2(u1 * Dy);
          const t = mod2(x * y);
          if (!isValid || isNegativeLE(t, P) || y === _0n8)
            throw new Error("invalid ristretto255 encoding 2");
          return new __RistrettoPoint(new ed25519_Point(x, y, _1n9, t));
        }
        /**
         * Converts ristretto-encoded string to ristretto point.
         * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
         * @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
         */
        static fromHex(hex) {
          return __RistrettoPoint.fromBytes(hexToBytes(hex));
        }
        /**
         * Encodes ristretto point to Uint8Array.
         * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
         */
        toBytes() {
          let { X, Y, Z, T } = this.ep;
          const P = ed25519_CURVE_p;
          const mod2 = (n) => Fp2.create(n);
          const u1 = mod2(mod2(Z + Y) * mod2(Z - Y));
          const u2 = mod2(X * Y);
          const u2sq = mod2(u2 * u2);
          const { value: invsqrt } = invertSqrt2(mod2(u1 * u2sq));
          const D1 = mod2(invsqrt * u1);
          const D2 = mod2(invsqrt * u2);
          const zInv = mod2(D1 * D2 * T);
          let D;
          if (isNegativeLE(T * zInv, P)) {
            let _x = mod2(Y * SQRT_M1);
            let _y = mod2(X * SQRT_M1);
            X = _x;
            Y = _y;
            D = mod2(D1 * INVSQRT_A_MINUS_D);
          } else {
            D = D2;
          }
          if (isNegativeLE(X * zInv, P))
            Y = mod2(-Y);
          let s = mod2((Z - Y) * D);
          if (isNegativeLE(s, P))
            s = mod2(-s);
          return Fp2.toBytes(s);
        }
        /**
         * Compares two Ristretto points.
         * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
         */
        equals(other) {
          this.assertSame(other);
          const { X: X1, Y: Y1 } = this.ep;
          const { X: X2, Y: Y2 } = other.ep;
          const mod2 = (n) => Fp2.create(n);
          const one = mod2(X1 * Y2) === mod2(Y1 * X2);
          const two = mod2(Y1 * Y2) === mod2(X1 * X2);
          return one || two;
        }
        is0() {
          return this.equals(__RistrettoPoint.ZERO);
        }
      };
      ristretto255 = { Point: _RistrettoPoint };
      ristretto255_hasher = {
        Point: _RistrettoPoint,
        /**
        * Spec: https://www.rfc-editor.org/rfc/rfc9380.html#name-hashing-to-ristretto255. Caveats:
        * * There are no test vectors
        * * encodeToCurve / mapToCurve is undefined
        * * mapToCurve would be `calcElligatorRistrettoMap(scalars[0])`, not ristretto255_map!
        * * hashToScalar is undefined too, so we just use OPRF implementation
        * * We cannot re-use 'createHasher', because ristretto255_map is different algorithm/RFC
          (os2ip -> bytes255ToNumberLE)
        * * mapToCurve == calcElligatorRistrettoMap, hashToCurve == ristretto255_map
        * * hashToScalar is undefined in RFC9380 for ristretto, we are using version from OPRF here, using bytes255ToNumblerLE will create different result if we use bytes255ToNumberLE as os2ip
        * * current version is closest to spec.
        */
        hashToCurve(msg, options) {
          const DST = options?.DST || "ristretto255_XMD:SHA-512_R255MAP_RO_";
          const xmd = expand_message_xmd(msg, DST, 64, sha512);
          return ristretto255_hasher.deriveToCurve(xmd);
        },
        hashToScalar(msg, options = { DST: _DST_scalar }) {
          const xmd = expand_message_xmd(msg, options.DST, 64, sha512);
          return Fn2.create(bytesToNumberLE(xmd));
        },
        /**
         * HashToCurve-like construction based on RFC 9496 (Element Derivation).
         * Converts 64 uniform random bytes into a curve point.
         *
         * WARNING: This represents an older hash-to-curve construction, preceding the finalization of RFC 9380.
         * It was later reused as a component in the newer `hash_to_ristretto255` function defined in RFC 9380.
         */
        deriveToCurve(bytes) {
          abytes(bytes, 64);
          const r1 = bytes255ToNumberLE(bytes.subarray(0, 32));
          const R1 = calcElligatorRistrettoMap(r1);
          const r2 = bytes255ToNumberLE(bytes.subarray(32, 64));
          const R2 = calcElligatorRistrettoMap(r2);
          return new _RistrettoPoint(R1.add(R2));
        }
      };
      ristretto255_oprf = /* @__PURE__ */ (() => createORPF({
        name: "ristretto255-SHA512",
        Point: _RistrettoPoint,
        hash: sha512,
        hashToGroup: ristretto255_hasher.hashToCurve,
        hashToScalar: ristretto255_hasher.hashToScalar
      }))();
      ED25519_TORSION_SUBGROUP = [
        "0100000000000000000000000000000000000000000000000000000000000000",
        "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
        "0000000000000000000000000000000000000000000000000000000000000080",
        "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
        "ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f",
        "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
        "0000000000000000000000000000000000000000000000000000000000000000",
        "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa"
      ];
    }
  });

  // node_modules/@noble/curves/secp256k1.js
  var secp256k1_exports = {};
  __export(secp256k1_exports, {
    schnorr: () => schnorr,
    secp256k1: () => secp256k1,
    secp256k1_hasher: () => secp256k1_hasher
  });
  function sqrtMod(y) {
    const P = secp256k1_CURVE.p;
    const _3n5 = BigInt(3), _6n = BigInt(6), _11n2 = BigInt(11), _22n2 = BigInt(22);
    const _23n = BigInt(23), _44n2 = BigInt(44), _88n2 = BigInt(88);
    const b2 = y * y * y % P;
    const b3 = b2 * b2 * y % P;
    const b6 = pow2(b3, _3n5, P) * b3 % P;
    const b9 = pow2(b6, _3n5, P) * b3 % P;
    const b11 = pow2(b9, _2n8, P) * b2 % P;
    const b22 = pow2(b11, _11n2, P) * b11 % P;
    const b44 = pow2(b22, _22n2, P) * b22 % P;
    const b88 = pow2(b44, _44n2, P) * b44 % P;
    const b176 = pow2(b88, _88n2, P) * b88 % P;
    const b220 = pow2(b176, _44n2, P) * b44 % P;
    const b223 = pow2(b220, _3n5, P) * b3 % P;
    const t1 = pow2(b223, _23n, P) * b22 % P;
    const t2 = pow2(t1, _6n, P) * b2 % P;
    const root = pow2(t2, _2n8, P);
    if (!Fpk1.eql(Fpk1.sqr(root), y))
      throw new Error("Cannot find square root");
    return root;
  }
  function taggedHash(tag, ...messages) {
    let tagP = TAGGED_HASH_PREFIXES[tag];
    if (tagP === void 0) {
      const tagH = sha256(asciiToBytes(tag));
      tagP = concatBytes(tagH, tagH);
      TAGGED_HASH_PREFIXES[tag] = tagP;
    }
    return sha256(concatBytes(tagP, ...messages));
  }
  function schnorrGetExtPubKey(priv) {
    const { Fn: Fn3, BASE } = Pointk1;
    const d_ = Fn3.fromBytes(priv);
    const p = BASE.multiply(d_);
    const scalar = hasEven(p.y) ? d_ : Fn3.neg(d_);
    return { scalar, bytes: pointToBytes(p) };
  }
  function lift_x(x) {
    const Fp3 = Fpk1;
    if (!Fp3.isValidNot0(x))
      throw new Error("invalid x: Fail if x \u2265 p");
    const xx = Fp3.create(x * x);
    const c = Fp3.create(xx * x + BigInt(7));
    let y = Fp3.sqrt(c);
    if (!hasEven(y))
      y = Fp3.neg(y);
    const p = Pointk1.fromAffine({ x, y });
    p.assertValidity();
    return p;
  }
  function challenge(...args) {
    return Pointk1.Fn.create(num(taggedHash("BIP0340/challenge", ...args)));
  }
  function schnorrGetPublicKey(secretKey) {
    return schnorrGetExtPubKey(secretKey).bytes;
  }
  function schnorrSign(message, secretKey, auxRand = randomBytes(32)) {
    const { Fn: Fn3 } = Pointk1;
    const m = abytes(message, void 0, "message");
    const { bytes: px, scalar: d } = schnorrGetExtPubKey(secretKey);
    const a = abytes(auxRand, 32, "auxRand");
    const t = Fn3.toBytes(d ^ num(taggedHash("BIP0340/aux", a)));
    const rand = taggedHash("BIP0340/nonce", t, px, m);
    const { bytes: rx, scalar: k } = schnorrGetExtPubKey(rand);
    const e = challenge(rx, px, m);
    const sig = new Uint8Array(64);
    sig.set(rx, 0);
    sig.set(Fn3.toBytes(Fn3.create(k + e * d)), 32);
    if (!schnorrVerify(sig, m, px))
      throw new Error("sign: Invalid signature produced");
    return sig;
  }
  function schnorrVerify(signature, message, publicKey) {
    const { Fp: Fp3, Fn: Fn3, BASE } = Pointk1;
    const sig = abytes(signature, 64, "signature");
    const m = abytes(message, void 0, "message");
    const pub = abytes(publicKey, 32, "publicKey");
    try {
      const P = lift_x(num(pub));
      const r = num(sig.subarray(0, 32));
      if (!Fp3.isValidNot0(r))
        return false;
      const s = num(sig.subarray(32, 64));
      if (!Fn3.isValidNot0(s))
        return false;
      const e = challenge(Fn3.toBytes(r), pointToBytes(P), m);
      const R = BASE.multiplyUnsafe(s).add(P.multiplyUnsafe(Fn3.neg(e)));
      const { x, y } = R.toAffine();
      if (R.is0() || !hasEven(y) || x !== r)
        return false;
      return true;
    } catch (error) {
      return false;
    }
  }
  var secp256k1_CURVE, secp256k1_ENDO, _0n9, _2n8, Fpk1, Pointk1, secp256k1, TAGGED_HASH_PREFIXES, pointToBytes, hasEven, num, schnorr, isoMap, mapSWU, secp256k1_hasher;
  var init_secp256k1 = __esm({
    "node_modules/@noble/curves/secp256k1.js"() {
      init_sha2();
      init_utils();
      init_curve();
      init_hash_to_curve();
      init_modular();
      init_weierstrass();
      init_utils2();
      secp256k1_CURVE = {
        p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
        n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
        h: BigInt(1),
        a: BigInt(0),
        b: BigInt(7),
        Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
        Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
      };
      secp256k1_ENDO = {
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
        basises: [
          [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
          [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
        ]
      };
      _0n9 = /* @__PURE__ */ BigInt(0);
      _2n8 = /* @__PURE__ */ BigInt(2);
      Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
      Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
        Fp: Fpk1,
        endo: secp256k1_ENDO
      });
      secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha256);
      TAGGED_HASH_PREFIXES = {};
      pointToBytes = (point) => point.toBytes(true).slice(1);
      hasEven = (y) => y % _2n8 === _0n9;
      num = bytesToNumberBE;
      schnorr = /* @__PURE__ */ (() => {
        const size = 32;
        const seedLength = 48;
        const randomSecretKey = (seed = randomBytes(seedLength)) => {
          return mapHashToField(seed, secp256k1_CURVE.n);
        };
        return {
          keygen: createKeygen(randomSecretKey, schnorrGetPublicKey),
          getPublicKey: schnorrGetPublicKey,
          sign: schnorrSign,
          verify: schnorrVerify,
          Point: Pointk1,
          utils: {
            randomSecretKey,
            taggedHash,
            lift_x,
            pointToBytes
          },
          lengths: {
            secretKey: size,
            publicKey: size,
            publicKeyHasPrefix: false,
            signature: size * 2,
            seed: seedLength
          }
        };
      })();
      isoMap = /* @__PURE__ */ (() => isogenyMap(Fpk1, [
        // xNum
        [
          "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
          "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
          "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
          "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
        ],
        // xDen
        [
          "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
          "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
          // LAST 1
        ],
        // yNum
        [
          "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
          "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
          "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
          "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
        ],
        // yDen
        [
          "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
          "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
          "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
          // LAST 1
        ]
      ].map((i) => i.map((j) => BigInt(j)))))();
      mapSWU = /* @__PURE__ */ (() => mapToCurveSimpleSWU(Fpk1, {
        A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
        B: BigInt("1771"),
        Z: Fpk1.create(BigInt("-11"))
      }))();
      secp256k1_hasher = /* @__PURE__ */ (() => createHasher2(Pointk1, (scalars) => {
        const { x, y } = mapSWU(Fpk1.create(scalars[0]));
        return isoMap(x, y);
      }, {
        DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
        encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
        p: Fpk1.ORDER,
        m: 1,
        k: 128,
        expand: "xmd",
        hash: sha256
      }))();
    }
  });

  // noble-curves-entry.js
  var { p256: p2562, p384: p3842, p521: p5212 } = (init_nist(), __toCommonJS(nist_exports));
  window.nobleCurves = {
    ed448: (init_ed448(), __toCommonJS(ed448_exports)).ed448,
    ed25519: (init_ed25519(), __toCommonJS(ed25519_exports)).ed25519,
    p256: p2562,
    p384: p3842,
    p521: p5212,
    secp256k1: (init_secp256k1(), __toCommonJS(secp256k1_exports))
  };
})();
/*! Bundled license information:

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/oprf.js:
@noble/curves/abstract/weierstrass.js:
@noble/curves/nist.js:
@noble/curves/abstract/edwards.js:
@noble/curves/abstract/montgomery.js:
@noble/curves/ed448.js:
@noble/curves/ed25519.js:
@noble/curves/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/

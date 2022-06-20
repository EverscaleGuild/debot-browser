import * as wasm from './debot_browser_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_36(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4744a0a57c0024ce(arg0, arg1);
}

function __wbg_adapter_39(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4c6823d9796c6840(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_42(arg0, arg1, arg2) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h77bcc98fee7cbd55(retptr, arg0, arg1, addHeapObject(arg2));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function __wbg_adapter_45(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hc4f9ec2733da7151(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_48(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbadc417f8001e3b4(arg0, arg1, addHeapObject(arg2));
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                state.a = 0;

            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_51(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hd711d19270240cb1(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_54(arg0, arg1) {
    wasm._dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hf54b1cb356d0d8b1(arg0, arg1);
}

/**
*/
export function init_log() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.init_log(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* Starts Terminal DeBot Browser with main DeBot.
*
* Fetches DeBot by address from blockchain and runs it according to pipechain.
* @param {any} url
* @param {any} wallet
* @param {any} pubkey
* @param {any} phrase
* @param {any} manifest
* @returns {Promise<any | undefined>}
*/
export function run_debot_browser(url, wallet, pubkey, phrase, manifest) {
    var ret = wasm.run_debot_browser(addHeapObject(url), addHeapObject(wallet), addHeapObject(pubkey), addHeapObject(phrase), addHeapObject(manifest));
    return takeObject(ret);
}

/**
* Creates new instance of DeBot Browser and insert it into Global Browser Table.
* Returns handle as reference for the Browser. This handle can be used later to
* run Browser or to destroy it.
*
* endpoint - string with blockchain network url.
* debot_addr - string with DeBot address.
* default_wallet - optional user default wallet address. Used by UserInfo interface.
* default_pubkey - optional user public key. Used by UserInfo interface.
* @param {string} endpoint
* @param {string} debot_addr
* @param {string | undefined} default_wallet
* @param {string | undefined} default_pubkey
* @returns {Promise<BigInt>}
*/
export function create_browser(endpoint, debot_addr, default_wallet, default_pubkey) {
    var ptr0 = passStringToWasm0(endpoint, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(debot_addr, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = isLikeNone(default_wallet) ? 0 : passStringToWasm0(default_wallet, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = isLikeNone(default_pubkey) ? 0 : passStringToWasm0(default_pubkey, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ret = wasm.create_browser(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
    return takeObject(ret);
}

const u32CvtShim = new Uint32Array(2);

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);
/**
* Destroys DeBot browser by its handle.
* handle - DeBot Browser id in Browser Table.
* @param {BigInt} handle
* @returns {Promise<void>}
*/
export function destroy_browser(handle) {
    uint64CvtShim[0] = handle;
    const low0 = u32CvtShim[0];
    const high0 = u32CvtShim[1];
    var ret = wasm.destroy_browser(low0, high0);
    return takeObject(ret);
}

/**
* Runs previously created DeBot Browser instance.
*
* handle - number used as reference to DeBot Browser instance created by `create_browser`.
* manifest - optional object with DeBot manifest.
* @param {BigInt} handle
* @param {any} manifest
* @returns {Promise<any>}
*/
export function run_browser(handle, manifest) {
    uint64CvtShim[0] = handle;
    const low0 = u32CvtShim[0];
    const high0 = u32CvtShim[1];
    var ret = wasm.run_browser(low0, high0, addHeapObject(manifest));
    return takeObject(ret);
}

/**
* Allows to update user settings in DeBot Browser
* This settings are used by UserInfo interface.
* handle - DeBot Browser id created by `create_browser`.
* settings - UserSettings object.
* @param {BigInt} handle
* @param {any} settings
* @returns {Promise<void>}
*/
export function update_user_settings(handle, settings) {
    uint64CvtShim[0] = handle;
    const low0 = u32CvtShim[0];
    const high0 = u32CvtShim[1];
    var ret = wasm.update_user_settings(low0, high0, addHeapObject(settings));
    return takeObject(ret);
}

/**
* Generates new ed25519 signing keypair
* @returns {any}
*/
export function generate_keypair() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generate_keypair(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* Allows to sign string inside DeBot Browser
* @param {any} keys
* @param {Uint8Array} unsigned
* @returns {any}
*/
export function sign(keys, unsigned) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passArray8ToWasm0(unsigned, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.sign(retptr, addHeapObject(keys), ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {BigInt} handle
* @param {any} dapp_box
* @returns {Promise<number>}
*/
export function register_signing_box(handle, dapp_box) {
    uint64CvtShim[0] = handle;
    const low0 = u32CvtShim[0];
    const high0 = u32CvtShim[1];
    var ret = wasm.register_signing_box(low0, high0, addHeapObject(dapp_box));
    return takeObject(ret);
}

/**
* @param {BigInt} handle
* @param {number} sbox_handle
* @returns {Promise<void>}
*/
export function close_signing_box(handle, sbox_handle) {
    uint64CvtShim[0] = handle;
    const low0 = u32CvtShim[0];
    const high0 = u32CvtShim[1];
    var ret = wasm.close_signing_box(low0, high0, sbox_handle);
    return takeObject(ret);
}

/**
* @param {BigInt} handle
* @param {number} sbox_handle
* @returns {Promise<any>}
*/
export function signing_box_public_key(handle, sbox_handle) {
    uint64CvtShim[0] = handle;
    const low0 = u32CvtShim[0];
    const high0 = u32CvtShim[1];
    var ret = wasm.signing_box_public_key(low0, high0, sbox_handle);
    return takeObject(ret);
}

/**
* @param {string} data
* @returns {string}
*/
export function sha256(data) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.sha256(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
    }
}

/**
* @param {any} params
* @returns {string}
*/
export function chacha20(params) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.chacha20(retptr, addHeapObject(params));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
            ptr0 = 0; len0 = 0;
            throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
    }
}

/**
* @param {any} params
* @returns {string}
*/
export function scrypt(params) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scrypt(retptr, addHeapObject(params));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
            ptr0 = 0; len0 = 0;
            throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
    }
}

/**
* @param {number} length
* @returns {string}
*/
export function generate_random_bytes(length) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generate_random_bytes(retptr, length);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
            ptr0 = 0; len0 = 0;
            throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
function __wbg_adapter_242(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h02cee2ce248cc2ed(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_boolean_get(arg0) {
    const v = getObject(arg0);
    var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

export function __wbindgen_number_get(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'number' ? obj : undefined;
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    var ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbindgen_is_string(arg0) {
    var ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

export function __wbindgen_bigint_new(arg0, arg1) {
    var ret = BigInt(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_string_new(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbg_sign_d9b811e766a8fc83(arg0, arg1, arg2) {
    var ret = getObject(arg0).sign(getArrayU8FromWasm0(arg1, arg2));
    return addHeapObject(ret);
};

export function __wbg_getpublickey_d93f1881846d136b(arg0) {
    var ret = getObject(arg0).get_public_key();
    return addHeapObject(ret);
};

export function __wbg_then_f3d2ca9551125610(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export function __wbindgen_cb_drop(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};

export function __wbindgen_object_clone_ref(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbg_Window_e2d90a08fe8bf335(arg0) {
    var ret = getObject(arg0).Window;
    return addHeapObject(ret);
};

export function __wbindgen_is_undefined(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg_WorkerGlobalScope_e36777b81ac97fe3(arg0) {
    var ret = getObject(arg0).WorkerGlobalScope;
    return addHeapObject(ret);
};

export function __wbindgen_is_null(arg0) {
    var ret = getObject(arg0) === null;
    return ret;
};

export function __wbg_randomFillSync_d2ba53160aec6aba(arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
};

export function __wbg_getRandomValues_e57c9b75ddead065(arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
};

export function __wbg_self_86b4b13392c7af56() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_crypto_b8c92eaac23d0d80(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

export function __wbg_msCrypto_9ad6677321a08dd8(arg0) {
    var ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

export function __wbg_require_f5521a5b85ad2542(arg0, arg1, arg2) {
    var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
};

export function __wbg_getRandomValues_dd27e6b0652b3236(arg0) {
    var ret = getObject(arg0).getRandomValues;
    return addHeapObject(ret);
};

export function __wbg_static_accessor_MODULE_452b4680e8614c81() {
    var ret = module;
    return addHeapObject(ret);
};

export function __wbindgen_number_new(arg0) {
    var ret = arg0;
    return addHeapObject(ret);
};

export function __wbg_String_c8baaa0740def8c6(arg0, arg1) {
    var ret = String(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_get_2d1407dba3452350(arg0, arg1) {
    var ret = getObject(arg0)[takeObject(arg1)];
    return addHeapObject(ret);
};

export function __wbg_set_f1a4ac8f3a605b11(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};

export function __wbg_instanceof_Window_434ce1849eb4e0fc(arg0) {
    var ret = getObject(arg0) instanceof Window;
    return ret;
};

export function __wbg_indexedDB_1f37e0a6280bf986() { return handleError(function (arg0) {
    var ret = getObject(arg0).indexedDB;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_clearTimeout_0ca9612f07e1cdae(arg0, arg1) {
    getObject(arg0).clearTimeout(arg1);
};

export function __wbg_fetch_427498e0ccea81f4(arg0, arg1) {
    var ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_setTimeout_1c75092906446b91() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
    return ret;
}, arguments) };

export function __wbg_setonblocked_41d9c99eb22760b9(arg0, arg1) {
    getObject(arg0).onblocked = getObject(arg1);
};

export function __wbg_setonupgradeneeded_20f0ca679878c9ef(arg0, arg1) {
    getObject(arg0).onupgradeneeded = getObject(arg1);
};

export function __wbg_instanceof_Response_ea36d565358a42f7(arg0) {
    var ret = getObject(arg0) instanceof Response;
    return ret;
};

export function __wbg_url_6e564c9e212456f8(arg0, arg1) {
    var ret = getObject(arg1).url;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_status_3a55bb50e744b834(arg0) {
    var ret = getObject(arg0).status;
    return ret;
};

export function __wbg_text_aeba5a5bbfef7f15() { return handleError(function (arg0) {
    var ret = getObject(arg0).text();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_open_ae7f237eca208633() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).open(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_result_86c5cd0515f694ca() { return handleError(function (arg0) {
    var ret = getObject(arg0).result;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_error_ac777d8b2aa794c6() { return handleError(function (arg0) {
    var ret = getObject(arg0).error;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_readyState_6eeefefa9aee540b(arg0) {
    var ret = getObject(arg0).readyState;
    return addHeapObject(ret);
};

export function __wbg_setonsuccess_b87f9950da9e0a5b(arg0, arg1) {
    getObject(arg0).onsuccess = getObject(arg1);
};

export function __wbg_setonerror_71f38880fbcb2f32(arg0, arg1) {
    getObject(arg0).onerror = getObject(arg1);
};

export function __wbg_data_44aaea098b9f4c6b(arg0) {
    var ret = getObject(arg0).data;
    return addHeapObject(ret);
};

export function __wbg_headers_1a60dec7fbd28a3b(arg0) {
    var ret = getObject(arg0).headers;
    return addHeapObject(ret);
};

export function __wbg_newwithstrandinit_c07f0662ece15bc6() { return handleError(function (arg0, arg1, arg2) {
    var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_delete_56e326dee0e4f01f() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).delete(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_get_4448787e42b51551() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).get(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_put_7bd8bc65ebed9efa() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).put(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_target_e560052e31e4567c(arg0) {
    var ret = getObject(arg0).target;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export function __wbg_log_fbd13631356d44e4(arg0) {
    console.log(getObject(arg0));
};

export function __wbg_indexedDB_cb329d5c940ebec9() { return handleError(function (arg0) {
    var ret = getObject(arg0).indexedDB;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };

export function __wbg_setonabort_2811e18214489a91(arg0, arg1) {
    getObject(arg0).onabort = getObject(arg1);
};

export function __wbg_setoncomplete_3dc0ba554a7d164a(arg0, arg1) {
    getObject(arg0).oncomplete = getObject(arg1);
};

export function __wbg_setonerror_2e5cc1fe79f2a88f(arg0, arg1) {
    getObject(arg0).onerror = getObject(arg1);
};

export function __wbg_objectStore_d9403814ec4c771a() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).objectStore(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_objectStoreNames_1ffe882c543c8e87(arg0) {
    var ret = getObject(arg0).objectStoreNames;
    return addHeapObject(ret);
};

export function __wbg_setonversionchange_0b223c05a23d2aeb(arg0, arg1) {
    getObject(arg0).onversionchange = getObject(arg1);
};

export function __wbg_createObjectStore_65e7a072edacfa31() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).createObjectStore(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_transaction_060621a1204d5aca() { return handleError(function (arg0, arg1, arg2, arg3) {
    var ret = getObject(arg0).transaction(getStringFromWasm0(arg1, arg2), takeObject(arg3));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_setonopen_c398a1a152e85bb6(arg0, arg1) {
    getObject(arg0).onopen = getObject(arg1);
};

export function __wbg_setonerror_5b2b08538f86d976(arg0, arg1) {
    getObject(arg0).onerror = getObject(arg1);
};

export function __wbg_setonmessage_7b6b02a417012ab3(arg0, arg1) {
    getObject(arg0).onmessage = getObject(arg1);
};

export function __wbg_new_9d38005ad72b669a() { return handleError(function (arg0, arg1) {
    var ret = new WebSocket(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_newwithstr_40ffb5985f57e166() { return handleError(function (arg0, arg1, arg2, arg3) {
    var ret = new WebSocket(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_close_dfed2f697da2eca4() { return handleError(function (arg0) {
    getObject(arg0).close();
}, arguments) };

export function __wbg_send_2bad75269a8cc966() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).send(getStringFromWasm0(arg1, arg2));
}, arguments) };

export function __wbg_message_ed16bb8f4ce69db9(arg0, arg1) {
    var ret = getObject(arg1).message;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_item_4d1fae0dfa05b190(arg0, arg1, arg2) {
    var ret = getObject(arg1).item(arg2 >>> 0);
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_set_f9448486a94c9aef() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_get_f45dff51f52d7222(arg0, arg1) {
    var ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};

export function __wbg_length_7b60f47bde714631(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

export function __wbg_new_16f24b0728c5e67b() {
    var ret = new Array();
    return addHeapObject(ret);
};

export function __wbindgen_is_function(arg0) {
    var ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

export function __wbg_newnoargs_f579424187aa1717(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_new_b563cacb0bf27b31() {
    var ret = new Map();
    return addHeapObject(ret);
};

export function __wbg_next_c7a2a6b012059a5e(arg0) {
    var ret = getObject(arg0).next;
    return addHeapObject(ret);
};

export function __wbg_next_dd1a890d37e38d73() { return handleError(function (arg0) {
    var ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_done_982b1c7ac0cbc69d(arg0) {
    var ret = getObject(arg0).done;
    return ret;
};

export function __wbg_value_2def2d1fb38b02cd(arg0) {
    var ret = getObject(arg0).value;
    return addHeapObject(ret);
};

export function __wbg_iterator_4b9cedbeda0c0e30() {
    var ret = Symbol.iterator;
    return addHeapObject(ret);
};

export function __wbg_get_8bbb82393651dd9c() { return handleError(function (arg0, arg1) {
    var ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_call_89558c3e96703ca1() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_d3138911a89329b0() {
    var ret = new Object();
    return addHeapObject(ret);
};

export function __wbg_isArray_8480ed76e5369634(arg0) {
    var ret = Array.isArray(getObject(arg0));
    return ret;
};

export function __wbg_push_a72df856079e6930(arg0, arg1) {
    var ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

export function __wbg_instanceof_ArrayBuffer_649f53c967aec9b3(arg0) {
    var ret = getObject(arg0) instanceof ArrayBuffer;
    return ret;
};

export function __wbg_values_71935f80778b5113(arg0) {
    var ret = getObject(arg0).values();
    return addHeapObject(ret);
};

export function __wbg_instanceof_Error_4287ce7d75f0e3a2(arg0) {
    var ret = getObject(arg0) instanceof Error;
    return ret;
};

export function __wbg_new_55259b13834a484c(arg0, arg1) {
    var ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_message_1dfe93b595be8811(arg0) {
    var ret = getObject(arg0).message;
    return addHeapObject(ret);
};

export function __wbg_call_94697a95cb7e239c() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_set_e543156a3c4d08a8(arg0, arg1, arg2) {
    var ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export function __wbg_isSafeInteger_91192d88df6f12b9(arg0) {
    var ret = Number.isSafeInteger(getObject(arg0));
    return ret;
};

export function __wbg_getTime_f8ce0ff902444efb(arg0) {
    var ret = getObject(arg0).getTime();
    return ret;
};

export function __wbg_getTimezoneOffset_41211a984662508b(arg0) {
    var ret = getObject(arg0).getTimezoneOffset();
    return ret;
};

export function __wbg_new0_57a6a2c2aaed3fc5() {
    var ret = new Date();
    return addHeapObject(ret);
};

export function __wbg_entries_38f300d4350c7466(arg0) {
    var ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_new_4beacc9c71572250(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_242(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        var ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_resolve_4f8f547f26b30b27(arg0) {
    var ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_then_a6860c82b90816ca(arg0, arg1) {
    var ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_then_58a04e42527f52c6(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export function __wbg_self_e23d74ae45fb17d1() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_window_b4be7f48b24ac56e() { return handleError(function () {
    var ret = window.window;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_globalThis_d61b1f48a57191ae() { return handleError(function () {
    var ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_global_e7669da72fd7f239() { return handleError(function () {
    var ret = global.global;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_buffer_5e74a88a1424a2e0(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export function __wbg_new_e3b800e570795b3c(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_set_5b8081e9d002f0df(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export function __wbg_length_30803400a8f15c59(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

export function __wbg_instanceof_Uint8Array_8a8537f46e056474(arg0) {
    var ret = getObject(arg0) instanceof Uint8Array;
    return ret;
};

export function __wbg_newwithlength_5f4ce114a24dfe1e(arg0) {
    var ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_subarray_a68f835ca2af506f(arg0, arg1, arg2) {
    var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_has_3850edde6df9191b() { return handleError(function (arg0, arg1) {
    var ret = Reflect.has(getObject(arg0), getObject(arg1));
    return ret;
}, arguments) };

export function __wbg_set_c42875065132a932() { return handleError(function (arg0, arg1, arg2) {
    var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };

export function __wbg_stringify_f8bfc9e2d1e8b6a0() { return handleError(function (arg0) {
    var ret = JSON.stringify(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_debug_string(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_memory() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper3773(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 751, __wbg_adapter_36);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper3774(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 757, __wbg_adapter_39);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper3776(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 753, __wbg_adapter_42);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper3778(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 755, __wbg_adapter_45);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper14870(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 4057, __wbg_adapter_48);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper14948(arg0, arg1, arg2) {
    var ret = makeClosure(arg0, arg1, 4065, __wbg_adapter_51);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper14950(arg0, arg1, arg2) {
    var ret = makeClosure(arg0, arg1, 4061, __wbg_adapter_54);
    return addHeapObject(ret);
};


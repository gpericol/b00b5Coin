"use strict";

const crypto = require('crypto');
let EC = require('elliptic').ec;
let ec = new EC('ed25519');

class CryptoUtils{
    static minify(obj){
        return JSON.stringify(obj, null, 0);
    }
    
    static hash(msg){
        return crypto.createHash('sha256').update(msg).digest('hex');
    }

    generateKeys(){
        let key = ec.genKeyPair();
        return {
            public: key.getPublic('hex'),
            private: key.getPrivate('hex')
        }
    }

    sign(msg, privateKey){
        var privKey = ec.keyFromPrivate(privateKey, 'hex');
        let hash = this.hash(msg);
        let signature = privKey.sign(hash);
        let derSign = signature.toDER('hex');
        return derSign;
    }

    verify(msg, sign, publicKey){
        let hash = this.hash(msg);
        let key = ec.keyFromPublic(publicKey, 'hex');
        return key.verify(hash, sign);
    }
}

module.exports = CryptoUtils;
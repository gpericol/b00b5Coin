"use strict";

const crypto = require('crypto');
let EC = require('elliptic').ec;
let ec = new EC('ed25519');

class CryptoUtils{
    /**
     * minify() minify an object to string
     * @param {Object} obj
     * @return {String} string 
     */
    static minify(obj){
        return JSON.stringify(obj, null, 0);
    }
    
    /**
     * hash() SHA256 HEX
     * @param {String} msg 
     * @return {String} string
     */
    static hash(msg){
        return crypto.createHash('sha256').update(msg).digest('hex');
    }

    /**
     * shortAddress() generates address from publicKey
     * @param {String} publicKey 
     * @return {String} string
     */
    static shortAddress(publicKey){
        return crypto.createHash('ripemd160').update(crypto.createHash('sha256').update(publicKey).digest()).digest('hex');
    }

    /**
     * generateKeys() generates a keypair ECDSA ed25519
     * @return {Object} keys
     */
    generateKeys(){
        let key = ec.genKeyPair();
        return {
            public: key.getPublic('hex'),
            private: key.getPrivate('hex')
        }
    }

    /**
     * sign() signs message msg with privateKey using ECDSA ed25519
     * @param {String} msg 
     * @param {String} privateKey 
     * @return {String} signature
     */
    sign(msg, privateKey){
        var privKey = ec.keyFromPrivate(privateKey, 'hex');
        let hash = this.hash(msg);
        let signature = privKey.sign(hash);
        let derSign = signature.toDER('hex');
        return derSign;
    }

    /**
     * verify() verify signature sign using publickey and msg
     * @param {String} msg 
     * @param {String} sign 
     * @param {String} publicKey
     * @return {Boolean} verify result 
     */
    static verify(msg, sign, publicKey){
        let hash = this.hash(msg);
        let key = ec.keyFromPublic(publicKey, 'hex');
        return key.verify(hash, sign);
    }
}

module.exports = CryptoUtils;
"use strict";

let Ajv = require('ajv');
const Crypto = require('../utils/crypto-utils');

const paymentSchema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "Payment",
    "description": "a payment transaction",
    "type": "object",
    "properties": {
        "tx": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                },
                "from": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "minItems": 1,
                    "uniqueItems": true
                },
                "to": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "address":{
                                "type": "string"
                            },
                            "amount": {
                                "type": "integer",
                                "exclusiveMinimum": 0
                            }
                        },
                        "required": ["address", "amount"]
                    },
                    "minItems": 1,
                },
                "msg": {
                    "type": "string",
                    "maxLength": 254
                },
                "fee": {
                    "type": "integer",
                    "exclusiveMinimum": 0
                }
            },
            "required": ["id", "from", "to", "msg", "fee"]
        },
        "sign": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "minItems": 1,
            "uniqueItems": true
        }
    },
    "required" : ["tx", "sign"]
}

const rewardSchema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "Reward",
    "description": "a reward transaction",
    "type": "object",
    "properties": {
        "tx": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string",
                    "pattern": "^[0-9a-f]{64}$"
                },
                "to": {
                    "type": "object",
                    "properties": {
                        "address":{
                            "type": "string"
                        },
                        "amount": {
                            "type": "integer",
                            "exclusiveMinimum": 0
                        }
                    },
                    "required": ["address", "amount"]
                },
                "msg": {
                    "type": "string",
                    "maxLength": 254
                }
            },
            "required": ["id", "to", "msg"]
        },
        "sign": {
            "type": "string"
        }
    },
    "required" : ["tx", "sign"]
}


class Transaction{
    /**
     * validateTransaction() validates a new transaction using schema, counting signatures and checking them
     * @param {*} transaction 
     * @return {boolean} validation
     */
    validateTransaction(transaction){
        let ajv = new Ajv();
        let validate = ajv.compile(paymentSchema);

        // validate with schema
        if (!validate(transaction)){
            return false;
        }

        //signatures mismatch
        if(transaction.tx.from.length != transaction.sign.length){
            return false;
        }
        
        //check signatures
        let tx = Crypto.minify(transaction.tx);

        for(let i = 0; i< transaction.sign.length; i++){
            if(!Crypto.verify(tx, transaction.sign[i], transaction.tx.from[i])){
                return false;
            }
        }

        return true;
    }

    /**
     * validateReward() validates a new transaction using schema, counting signatures and checking them
     * @param {*} transaction 
     * @return {boolean} validation
     */
    validateReward(transaction){
        let ajv = new Ajv();
        let validate = ajv.compile(rewardSchema);

        // validate with schema
        if (!validate(transaction)){
            return false;
        }
        
        //check signatures
        let tx = Crypto.minify(transaction.tx);

        if(!Crypto.verify(tx, transaction.sign, transaction.tx.to.address)){
            return false;
        }

        return true;
    }

    /**
     * createReward() creates a reward giving a private and public key
     * @param {Object} address 
     */
    createReward(address){
        let transaction = {
            tx: {
                to:{
                    address: address.publicKey,
                    amount: 10
                },
                msg: address.poolName
            },
            sign: ""
        }
        let tx = Crypto.minify(transaction.tx);
        transaction.sign = Crypto.sign(tx, address.privateKey);
        return transaction;
    }
}

module.exports = Transaction;
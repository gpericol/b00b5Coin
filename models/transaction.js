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



class Transaction{
    /**
     * validate() validates a new transaction using schema, counting signatures and checking them
     * @param {*} transaction 
     * @return {boolean} validation
     */
    validate(transaction){
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
}

module.exports = Transaction;
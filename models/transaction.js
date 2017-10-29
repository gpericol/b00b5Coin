"use strict";

let Ajv = require('ajv');
const Crypto = require('../utils/crypto-utils');

const paymentSchema = require('./schemas/payment.json');
const rewardSchema = require('./schemas/reward.json');

class Transaction{
    constructor(){
        this.ajv = new Ajv();
        this.validatePayment = this.ajv.compile(paymentSchema);
        this.validateReward = this.ajv.compile(rewardSchema);
    }

    /**
     * validateTransaction() validates a new transaction using schema, counting signatures and checking them
     * @param {*} transaction 
     * @return {boolean} validation
     */
    validateTransaction(transaction){
        // validate with schema
        if (!this.validatePayment(transaction)){
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
        // validate with schema
        if (!validateReward(transaction)){
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
"use strict";

const crypto = require('crypto');
const EU = require('../utils/elliptic-utils');

class Transaction{
    constructor(){
        this.eu = new EU();
    }
    
    shortAddress(publicKey){
        return crypto.createHash('ripemd160').update(publicKey).digest('hex');
    }

    create(from, to, amount){
        let tx = {
            id: crypto.randomBytes(32).toString('hex'),
            from: from.public,
            to: to,
            amount: amount
        }

        let sign = this.eu.sign(JSON.stringify(tx, null, 0), from.private);

        return {
            tx: tx,
            sign: sign
        }
    }

    validate(transaction){
        if(!transaction.tx || !transaction.sign){
            return false;
        }
        let tx = transaction.tx;

        if(!tx.from || !tx.to || !tx.amount){
            return false;
        }
        
        return this.eu.verify(JSON.stringify(tx, null, 0), transaction.sign, tx.from);
    }
   
}

module.exports = Transaction;
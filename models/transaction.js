"use strict";

const Crypto = require('../utils/crypto-utils');

class Transaction{
/*
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
*/ 
}

module.exports = Transaction;
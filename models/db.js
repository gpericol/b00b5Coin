"use strict";

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const TYPE_PAYMENT = 0;
const TYPE_REWARD = 1;

class DB{
    constructor(){
        this.installDB();
        this.db = new sqlite3.Database('./db/b00b5.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('[*] Connected to the b00b5 database.');
        });
    }

    installDB(){
        let db = new sqlite3.Database('./db/b00b5.db');
        let sql = fs.readFileSync('./db/schema.sql', 'utf8');
        db.exec(sql);
        db.close();
    }

    getBlock(depth){
        let block = {};
        let sql = "SELECT * FROM block WHERE Depth  = ?";
        // first row only
        this.db.get(sql, [depth], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            if(!row){
                return false;
            }
            let transactions = this._getTransactions(depth);
            block = {
                depth: row.depth,
                timestamp: row.timestamp,
                transactions: transactions, //array deep copy
                before: row.before,
                nipples: row.nipples,
                nonce: row.nonce
            }
        });
    }

    _getTransactions(depth){
        let sql = "SELECT * FROM transaction WHERE block_depth  = ? ORDER BY position ASC";
        /*
        db.all(sql, [], (err, rows) => {
            if (err) {
              throw err;
            }
            rows.forEach((row) => {
              console.log(row.name);
            });
        });
        */
    }
    _getPaymentFrom(tx_id){
        let sql = "SELECT * FROM from WHERE tx_id  = ? ORDER BY position ASC";
    }
    _getPaymentTo(tx_id){
        let sql = "SELECT * FROM to WHERE tx_id  = ? ORDER BY position ASC";
    }
    _getPaymentSign(tx_id){
        let sql = "SELECT * FROM sign WHERE tx_id  = ? ORDER BY position ASC";
    }
    _getRewardTo(tx_id){
        let sql = "SELECT * FROM to WHERE tx_id  = ? ORDER BY position ASC";
    }
    _getRewardSign(tx_id){
        let sql = "SELECT * FROM sign WHERE tx_id  = ? ORDER BY position ASC";
    }
   

    saveBlock(block, hash){
        this.db.run("begin transaction");
        let sql = "INSERT INTO block (depth, timestamp, hash, before, nipples, nonce) VALUES (?, ?, ?, ?, ?, ?)";
        let params = [block.depth, block.timestamp, hash, block.before, block.nipples, block.nonce];
        
        this.db.run(sql, params, function(err) {
            if (err) {
                return console.log(err.message);
            }
        }); 
        this._saveTransactions(block.transactions, block.depth);

        this.db.run("commit");
        console.log("\x1b[32m[*]\x1b[0m Inserted Block #" + block.depth);
        this.getBlock(block.depth);
    }

    _saveTransactions(transactions, depth){
        for(let i = 0; i < transactions.length; i++){
            let tx =  transactions[i];
            let type = tx.from ? TYPE_PAYMENT : TYPE_REWARD;
            let fee = tx.from ? tx.tx.fee : null;

            let sql = "INSERT INTO tx (tx_id, type, block_depth, position, msg, fee) VALUES (?, ?, ?, ?, ?, ?)";
            let params = [tx.tx.id, type, depth, i, tx.tx.msg, fee];

            this.db.run(sql, params, function(err) {
                if (err) {
                    return console.log(err.message);
                }
            }); 

            if(type == TYPE_PAYMENT){
                this._savePaymentTo(tx.tx.to, tx.tx.id);
                this._savePaymentFrom(tx.tx.from, tx.tx.id);
                this._savePaymentSign(tx.sign, tx.tx.id);
            }else{
                this._saveRewardTo(tx.tx.to, tx.tx.id);
                this._saveRewardSign(tx.sign, tx.tx.id);
            }
        }
    }
    
    _savePaymentTo(to, id){
        for(let i = 0; i < to.length; i++){
            let t = to[i];
            let sql = "INSERT INTO output (tx_id, position, address, amount) VALUES (?, ?, ?, ?)";
            let params = [id, i, t.address, t.amount];

            this.db.run(sql, params, function(err) {
                if (err) {
                    return console.log(err.message);
                }
            }); 
        }
    }

    _savePaymentFrom(from, id){
        for(let i = 0; i < from.length; i++){
            let f = from[i];
            let sql = "INSERT INTO input (tx_id, position, address) VALUES (?, ?, ?)";
            let params = [id, i, f.address];

            this.db.run(sql, params, function(err) {
                if (err) {
                    return console.log(err.message);
                }
            }); 
        }
    }

    _savePaymentSign(sign, id){
        for(let i = 0; i < sign.length; i++){
            let s = sign[i];
            let sql = "INSERT INTO sign (tx_id, position, sign) VALUES (?, ?, ?)";
            let params = [id, i, s.sign];

            this.db.run(sql, params, function(err) {
                if (err) {
                    return console.log(err.message);
                }
            }); 
        }
    }

    _saveRewardTo(to, id){
        let sql = "INSERT INTO output (tx_id, position, address, amount) VALUES (?, ?, ?, ?)";
        let params = [id, -1, to.address, to.amount];

        this.db.run(sql, params, function(err) {
            if (err) {
                return console.log(err.message);
            }
        });
    }

    _saveRewardSign(sign, id){
        let sql = "INSERT INTO sign (tx_id, position, sign) VALUES (?, ?, ?)";
        let params = [id, -1, sign];

        this.db.run(sql, params, function(err) {
            if (err) {
                return console.log(err.message);
            }
        }); 
    }

    destructor(){
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('[*] Close the database connection.');
        });
    }
}

module.exports = DB;
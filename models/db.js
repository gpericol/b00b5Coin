"use strict";

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')

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

    saveBlock(block, hash){
        let sql = "INSERT INTO block (depth, timestamp, hash, before, nipples, nonce) VALUES (?, ?, ?, ?, ?, ?)";
        let params = [block.depth, block.timestamp, hash, block.before, block.nipples, block.nonce];
        
        this.db.run(sql, params, function(err) {
            if (err) {
                return console.log(err.message);
            }         
            console.log("[*] Inserted Block #" + block.depth);
        }); 
        this.saveTransactions(block.transactions, block.depth);   
    }

    saveTransactions(transactions, depth){
        for(let i = 0; i < transactions.length; i++){
            let tx =  transactions[i];
            let type = tx.from ? 0 : 1;
            let fee = tx.from ? tx.tx.fee : null;

            let sql = "INSERT INTO tx (tx_id, type, block_depth, position, msg, fee) VALUES (?, ?, ?, ?, ?, ?)";
            let params = [tx.tx.id, type, depth, i, tx.tx.msg, fee];

            this.db.run(sql, params, function(err) {
                if (err) {
                    return console.log(err.message);
                }
            }); 
            this.saveTo(tx.tx.to, tx.tx.id);
        }
    }

    saveTo(to, id){

        for(let i = 0; i < to.length; i++){
            let t = to[i];
            let sql = "INSERT INTO output (tx_id, position, address, amount) VALUES (?, ?, ?, ?)";
            let params = [id, i, depth, i, t.address, t.amount];

            this.db.run(sql, params, function(err) {
                if (err) {
                    return console.log(err.message);
                }
            }); 
        }
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
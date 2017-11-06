"use strict";

const sqlite3 = require('sqlite3').verbose();

class DB{
    constructor(){
        this.db = new sqlite3.Database('./db/b00b5.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('[*] Connected to the b00b5 database.');
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
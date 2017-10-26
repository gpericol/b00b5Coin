"use strict";

let crypto = require('../utils/crypto-utils');
let miner = require('../utils/miner-utils');

const genesisHash = "b0000000000000000000000000000000000000000000000000000000000000b5";

class BlockChain{
    constructor(){
        this.chain = [];
        this.transactions = [];
    }

    lastBlock(){
        if(this.chain.length > 0){
            return this.chain[this.chain.length-1];
        }
        return null;
    }

    hashBlock(block){
        return crypto.hash(crypto.minify(block))
    }
   
    addBlock(){
        let beforeBlock = genesisHash;
        let lastBlock = this.lastBlock();

        if(lastBlock){
            beforeBlock = this.hashBlock(this.chain[this.chain.length-1]);
        }
        
        // add block to the chain
        let block = {
            depth: this.chain.length + 1,
            timestamp: + new Date(),
            transactions: this.transactions.slice(), //array deep copy
            before: beforeBlock,
            nipples: 0,
            nonce: 0
        }

        this.proofOfWork(block);
       
        this.transactions = [];
        this.chain.push(block);
        return block;
    }

    proofOfWork(block){
        let hash = this.hashBlock(block);

        while (!miner.validHash(hash, block.nipples)){
            block.nonce++;
            hash = this.hashBlock(block);
        }
    }
   
    /*
    addTransaction(transaction){
        this.transactions.push(transaction);
        return this.lastBlock().index + 1;
    }
   
    validChain(chain){
        for(let i = 0, limit = chain.length-1; i < limit; i++){
            // the hash is valid and 
            if(!this.validProof(chain[i]) || chain[i+1].before !== this.hashBlock(chain[i])){
                return false;
            }
        }
        
        if(!this.validProof(this.lastBlock())){
            return false;
        }
        
        return true;
    }
    */
}

module.exports = BlockChain;
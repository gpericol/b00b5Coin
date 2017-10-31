"use strict";
let Accountability = require('./accountability.js')
let crypto = require('../utils/crypto-utils');
let miner = require('../utils/miner-utils');

const genesisHash = "b0000000000000000000000000000000000000000000000000000000000000b5";
const startNipples = 0;
const expectedTime = 0x101; // LOL
const nipplesAvg = 0xA55; // ASS

class BlockChain{
    constructor(){
        this.chain = [];
        this.transactions = [];
        this.accountability = new Accountability();
    }

    /**
     * lastblock() returns last block
     * @return {Object} block
     */
    lastBlock(){
        if(this.chain.length > 0){
            return this.chain[this.chain.length-1];
        }
        // empty chain, no block
        return null;
    }

    /**
     * hashBlock() returns the hash of the block
     * @param {Object} block
     * @return {String} hash  
     */
    hashBlock(block){
        return crypto.hash(crypto.minify(block))
    }

    /**
     * nipplesDiff() makes an average of the time difference of 0xA55 blocks and increment or decrement the difficulty
     * @return {int} -1 | 0 | 1 
     */
    nipplesDiff(){
        // every nipplesAvg blocks
        if(this.chain.length % nipplesAvg === 0){
            let sum = 0;
            for(let i = this.chain.length - nipplesAvg + 1 ; i < this.chain.length; i++){
                sum += Math.floor((this.chain[i].timestamp - this.chain[i-1].timestamp) / 1000);
            }
            let avgTime = sum / (nipplesAvg-1);
            if(avgTime < expectedTime){
                console.log("[*] Difficulty +1, TimeAVG:" + avgTime);
                return 1;
            }else{
                console.log("[*] Difficulty -1, TimeAVG:" + avgTime);
                return -1;
            }
        }
        return 0;
    }

    /**
     * addblock() generate a mine a new block
     * @return {Object} block
     */
    addBlock(){
        let beforeBlock = genesisHash;
        let nipples = startNipples;
        let lastBlock = this.lastBlock();

        if(lastBlock){
            nipples = lastBlock.nipples + this.nipplesDiff();
            if(nipples < 0){
                nipples = 0;
            }
            beforeBlock = this.hashBlock(this.chain[this.chain.length-1]);
        }
        
        let block = {
            depth: this.chain.length + 1,
            timestamp: + new Date(),
            transactions: this.transactions.slice(), //array deep copy
            before: beforeBlock,
            nipples: nipples,
            nonce: 0
        }

        this.proofOfWork(block);
       
        this.transactions = [];
        this.accountability.approveTransactions();
        this.chain.push(block);
        return block;
    }

    /**
     * proofOfWork() function that do the mining incrementing block's nonce
     * @param {Object} block 
     */
    proofOfWork(block){
        let hash = this.hashBlock(block);

        while (!miner.validHash(hash, block.nipples)){
            block.nonce++;
            hash = this.hashBlock(block);
        }
        console.log("[*] New block mined #" + block.depth);
    }

    /**
     * addTransaction() adds a transaction to the transactions pool
     * @param {Object} transaction 
     * @return {integer} depth of next block
     */
    addTransaction(transaction){
        if(this.accountability.addTransaction(transaction.tx)){
            this.transactions.push(transaction);
            return this.chain.length + 1;    
        }
        return -1;
    }

    /**
     * addReward() adds a reward transaction to the transactions pool
     * @param {Object} transaction 
     * @return {integer} depth of next block
     */
    addReward(transaction){
        this.transactions.push(transaction);
        this.accountability.addReward(transaction.tx);
        return this.chain.length + 1;
    }
}

module.exports = BlockChain;
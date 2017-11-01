"use strict"

const Crypto = require('../utils/crypto-utils');

class Accountability{
    constructor(chain){
        this.emptyAddresses = [];
        this.transactions = [];
        this.addresses = [];
        this.reward = {};
    }

    /**
     * addTransaction() validates if coins can be spent and add transaction to transactions pool 
     * @param {object} transaction 
     * @return {boolean} result
     */
    addTransaction(transaction){
        let totalIn = 0;
        let totalOut = 0;
        
        // check that addresses exists and isn't in the same block
        for(let i = 0, tot = transaction.from.length; i < tot; i++){
            let address = Crypto.shortAddress(transaction.from[i]);
            let a = this.addresses.find( element => element.address === address );
            
            if(!a || this.emptyAddresses.indexOf(address) != -1){
                return false;
            }
            totalIn += a.amount;
        }

        // count amount
        for(let i = 0, tot = transaction.to.length; i < tot; i++){
            totalOut += transaction.to[i].amount;
        }

        totalOut += transaction.fee;

        //verify that input = output
        if(totalIn != totalOut){
            return false;
        }

        //fill addresses to empty
        for(let i = 0; i < transaction.from.length; i++){
            this.emptyAddresses.push(Crypto.shortAddress(transaction.from[i]));
        }

        this.transactions.push(transaction);
        return true;    
    }

    /**
     * addReward() adds reward to the accountability for this transaction pool
     * @param {Object} reward 
     */
    addReward(reward){
        this.reward = reward;
    }

    /**
     * approveTransactions() approves transactions pool and move the amounts & fees in the new wallets
     */
    approveTransactions(){
        this.removeAddresses();
        let rewardAddress = Crypto.shortAddress(this.reward.to.address);
        for(let i = 0; i < this.transactions.length; i++){
            let tx = this.transactions[i];
            for(let j = 0; j < tx.to.length; j++){
                this.addAmount(tx.to[j].address, tx.to[j].amount);
            }
            this.addAmount(rewardAddress, tx.fee);
        }
        
        //add reward amount to address
        this.addAmount(rewardAddress, this.reward.to.amount);
        
        //clean addresses
        this.transactions = [];
        this.reward = {};
    }

    /**
     * addAmount() adds an amount to an address or create a new address with the given amount
     * @param {string} address 
     * @param {int} amount 
     */
    addAmount(address, amount){
        let a = this.addresses.find( element => element.address === address );
        if(!a){
            this.addresses.push({
                address: address,
                amount: amount
            });
        }else{
            a.amount += amount;
        }
    }

    /**
     * removeAddresses() clean addresses from this.addresses that are spent on this transaction pool
     */
    removeAddresses(){
        for(let i=this.addresses.length-1 ; i>=0; i--){
            if(this.emptyAddresses.indexOf(this.addresses[i].address) != -1 && this.addresses[i].amount > 0){
                this.addresses.splice(i, 1);
            }
        }
        this.emptyAddresses = [];
    }
}

module.exports = Accountability;
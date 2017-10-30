const Crypto = require('../utils/crypto-utils');

class Accountability{
    contructor(chain){
        this.chain = chain;
        this.emptyAddresses = [];
        this.transactions = [];
        this.addresses = [];
        this.reward = {};
    }

    /**
     * addTransaction() validates if there are credits in addresses and add transaction to transactions list 
     * @param {object} transaction 
     * @return {boolean} result
     */
    addTransaction(transaction){
        let totalIn = 0;
        let totalOut = 0;
        
        // check that addresses exists
        for(let i = 0, tot = transaction.from.length; i < tot; i++){
            let address = Crypto.shortAddress(transaction.from[i]);
            let a = this.addresses.find( element => element.address === address );
            if(!a || this.emptyAddresses.indexOf(address) != -1){
                return false;
            }
            totalIn += a.amount;
        }

        for(let i = 0, tot = transaction.to.length; i < tot; i++){
            totalOut += transaction.to[i].amount;
        }

        totalOut += transaction.fee;

        if(totalIn != totalOut){
            return false;
        }

        this.emptyAddresses = this.emptyAddresses.concat(transaction.from);

        this.transactions.push(transaction);
        //check if wallet has coins
        return true;    
    }

    addReward(reward){
        this.reward = reward;
    }


    approveTransactions(){

        //add reward amount to address
        
        //clean addresses
        this.transactions = [];
        return true;
    }

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

    removeAddresess(){
        for(let i=this.addresses.length-1 ; i>=0; i--){
            if(this.emptyAddresses.indexOf(this.addresses[i].address) != -1 && this.addresses[i].amount > 0){
                delete this.addresses[i];
            }
        }
    }
}

module.exports = Accountability;
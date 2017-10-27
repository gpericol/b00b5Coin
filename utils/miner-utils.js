"use strict";

class MinerUtils{

    /**
     * calculateHashDifficulty() calculates the difficulty level of the hash
     * @param {String} hash 
     * @return {int} difficulty
     */
    static calculateHashDifficulty(hash){
        let difficulty = 0;
        if(!hash.startsWith("b00")){
            return -1;
        }
        
        // count 0es and closes b00[0]*b5
        let i = 0;
        for(i = 3; i < 62; i++){
            if(hash[i] == '0'){
                difficulty += 4;
            }
            else if(hash[i]=='b' && hash[ i + 1 ] == '5'){
                i += 2;
                break;
            }
            else{
                return -1;
            }
        }
        
        
        if(i === 62){
            if(hash[i] == 'b' && hash[i+1] == '5'){
                // b0000000000000000000000000000000000000000000000000000000000000b5 DING! DING! DING!
                return difficulty;
            }
            else{
                // very beautiful hash but no b00b5 here!
                return -1;
            }
        }
        
        // hex2dec
        let value = parseInt('0x' + hash[i]);
        
        if(value > 7)
            return difficulty;
        if(value > 3)
            return difficulty + 1;
        if(value > 1)
            return difficulty + 2;
        if(value > 0)
            return difficulty + 3;

        // b00[0]*b50 is wrong, bad hash    
        return -1;
    }

    /**
     * validHash() returns true if hash difficulty is >= the target
     * @param {String} hash 
     * @param {int} target 
     * @return {boolean} hash is valid
     */
    static validHash(hash, target){
	    if(this.calculateHashDifficulty(hash) >= target){
		    return true;
	    }
        return false;
    }
}

module.exports = MinerUtils;
"use strict";

class MinerUtils{
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

    static validHash(hash, difficulty){
	    if(this.calculateHashDifficulty(hash) >= difficulty){
		    return true;
	    }
        return false;
    }
}

module.exports = MinerUtils;
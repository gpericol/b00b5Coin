const config = require('./config.json');
let express = require('express');
const bodyParser = require('body-parser');
let app = express();

let Blockchain = require('./models/blockchain');
let blockchain = new Blockchain();

/*
let Transaction = require('./models/transaction');


let transaction = new Transaction();

*/
app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.json({ 
        message: "We all l0v3 b00b5",
    }); 
});


app.get('/chain', function (req, res) {
    res.json({ 
        chain: blockchain.chain,
        length: blockchain.chain.length
    }); 
});


app.get('/mine', function (req, res) {
    let block = blockchain.addBlock();

    res.json({
        message: "New Block Forged",
        index: block.index,
        transactions: block.transactions,
        nonce: block.nonce,
        previous_hash: block.before
    });
});
/*
app.post('/transaction', function (req, res) {
    let tx = req.body;
    
    if(!transaction.validate(tx)){
        res.status(400).send({ error: 'Wrong Transaction' });
        next();
    }

    let index = blockchain.addTransaction(tx);
    res.json({ 
        message: "Transaction will be added at block #" + index,
    }); 
});
*/



server = app.listen(config.port, function(){
    console.log("[*] Listening on port "+ config.port);
});
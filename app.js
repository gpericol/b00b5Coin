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


/**
 * Just a welcome message
 */
app.get('/', function (req, res) {
    res.json({ 
        message: "We all l0v3 b00b5",
    }); 
});

/**
 * return all the chain
 */
app.get('/chain', function (req, res) {
    res.json({ 
        chain: blockchain.chain,
        length: blockchain.chain.length
    }); 
});

/**
 * return requestd block or the last one
 * @param {int} depth
 */
app.get('/block/:depth?', function (req, res) {
    let depth = blockchain.chain.length-1;
    if(req.params.depth && parseInt(req.params.depth)){
        let value = parseInt(req.params.depth) - 1;
        if(value >= 0 && value < blockchain.chain.length){
            depth = value;
        }
    }

    res.json({
        block: blockchain.chain[depth],
        hash: blockchain.hashBlock(blockchain.chain[depth])
    }); 
});

/**
 * mine a new block
 */
app.get('/mine', function (req, res) {
    let block = blockchain.addBlock();
    res.json(blockchain.lastBlock());
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
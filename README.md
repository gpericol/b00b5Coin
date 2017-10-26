# b00b5Chain [ (oYo) ]
Another cryptocurrency built for study (!scentific) purposes.
Designed and built with all love in the world by Gianluca Pericoli

## Algorithms
### Proof of Work
is just the HEX representation of SHA256 of the JSON Object (minified) on one block
the difficulty is caluclated in NIPPLES
```
           .-''-''-.
          /   '-'  .: __
  .._    /  /|||\\  Y`  `\
 |:  `-.J  /__ __.., )   |
 |  .   ( ( ==|<== : )   |
 :   `.(  )\ _L__ /( )   |
  \    \(  )\\__//(  )   |
   \    \  ):`'':(  /    \
    -_   -.-   .'-'` ` . |
     `. :           .  ' :
      )            :    /
     /    : /   _   :  :   | . . .-. .-. .-. .   .-. .-. 
    @)    : |  (@)  | : <--| |\|  |  |-' |-' |   |-  `-. 
     \   /   \     / /     | ' ` `-' '   '   `-' `-' `-'
      `i`     `---' /
```


0 Nip: b000b5FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF 
1 Nip: b000b57FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF 
2 Nip: b000b53FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF 
3 Nip: b000b51FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF 
4 Nip: b0000b5FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF 
...
236 Nip: b0000000000000000000000000000000000000000000000000000000000000b5

for less significant bit after b00[0]*5:
1111: f
0111: 7
0011: 3
0001: 1
0000: 0 ---> adds a 0 in b00b5

### Transactions
for signing transactions we will use ECDSA
https://it.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm

we will use "ed25519" curve for address generation:
https://en.wikipedia.org/wiki/Curve25519

why?
https://safecurves.cr.yp.to/
and it's also supported by elliptic library for nodeJS
```
                             .-.
\___________________________() ^`-, < B4rK
 |  I'm not a mathematician   |'""' 
 \    ______________________ /
  //\\                    //\\
  "" ""                   "" ""
```


### Block Generation
a block is generated every LOL 101hex seconds, 257seconds minutes, ~ 4 minutes
nipples are calculated with an average ASS 455hex blocks, 2545 blocks, if time > 101hex go up else go down


## Transaction
```json
"payment":{
    "tx":{
        "id": "random generated id",
        "from": [
            "Public Key 1",
            "Public Key 2"
        ],
        "to":[
            {
                "address": "ripemd160 public key 3",
                "amount": 1
            },
            {
                "address": "ripemd160 public key 4",
                "amount": 1
            }
        ],
        "fee": 1
    },
    "sign": [
        "signature from Private Key 1",
        "signature from Private Key 2"
    ]
}

"reward":{
    "tx":{
        "id": "random generated id",
        "to":[
            {
                "address": "public key 1",
                "amount": 1
            }
        ]
    },
    "sign": "signature from Private Key 1",
}
```

## blockchain
```json
{
    "depth": 0, // block depth
    "timestamp": 1234,
    "transactions": [],
    "before": "hash of the previous block",
    "nonce": 0, // number to increment for calculation
    "nipples": 1 // difficulty
}
```
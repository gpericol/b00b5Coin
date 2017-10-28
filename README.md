# b00b5Coin [ (oYo) ]
Another cryptocurrency built for study (!scientific) purposes.
Designed and built with all the love in the world by Gianluca Pericoli

## Algorithms
### Proof of Work
it's just the HEX representation of SHA256 of the JSON Object (minified) on one block
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

How nipples work:
```
0 Nip: b000b5FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF 
1 Nip: b000b57FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF 
2 Nip: b000b53FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF 
3 Nip: b000b51FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF 
4 Nip: b0000b5FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF 
...
236 Nip: b0000000000000000000000000000000000000000000000000000000000000b5
```

for less significant bit after b00[0]*5:
```
1111: f
0111: 7
0011: 3
0001: 1
0000: 0 ---> adds a 0 in b00b5
```


### Transactions
for signing transactions we will use ECDSA

https://it.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm

we will use "ed25519" curve for address generation:

https://en.wikipedia.org/wiki/Curve25519

why?

https://safecurves.cr.yp.to/

and it's also supported by the elliptic library for nodeJS
```
                             .-.
\___________________________() ^`-, < B4rK
 |  I'm not a mathematician   |'""' 
 \    ______________________ /
  //\\                    //\\
  "" ""                   "" ""
```

### Address
address is generated from the public key: 
```
RIPEMD160( SHA256( publicKey ) )
```


### Block Generation
a block is generated every LOL 101hex seconds, 257seconds minutes, ~ 4 minutes

nipples are calculated with an average ASS A55hex blocks, 2545 blocks, if time > 101hex go up else go down

## Transaction
### Payment
```json
{
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
        "msg": "message",
        "fee": 1
    },
    "sign": [
        "signature from Private Key 1",
        "signature from Private Key 2"
    ]
}
```

### Payment Example
```json
{
    "tx": {
        "id": "c443383309ec0313329e6b7a556156d9e78e1139c350d56e928a3b18d60d7f76",
        "from": [
            "044d5f1822470e00bb2b8d8bf7585fe60e120bff0ae1f413936c9d4fdf3f98c5d33ae9c559c113c50ff4ea5833ad93c68359afd2fcd2f5f747c2ae37b9e0a0bb8e",
            "040c976796344195f9db02d61cd715a6ca998749385b1b03cfcd23bd6d9f6124b95d47c0fd323cb9c67df1a4d8767aaff6d6e3c04ad49ff361996afe1a0799f576"
        ],
        "to": [
            {
                "address": "06e6d4c30ed7b0488c8ffc924222831ae15ad216",
                "amount": 123
            },
            {
                "address": "8279445a65100f8889fb351e3e334a329fb27f03",
                "amount": 123
            }
        ],
        "msg": "B00b5 r b34ut1Ful",
        "fee": 1
    },
    "sign": [
        "304402200554a27ed8e80f94ef97745da925d8c3a799cc3326fe86962889bae0033b0167022009b647dcfe4be1df491ed0fda134102797fee92c3249c9f7971e1507e7e1b547",
        "3044022006386ebe05f4c0ff1486604839d0d0c362766d6e91816838649efcf9e29c595a022002b724c2ba0649c749bda6e5cce27c31da5df43e0327bbdd34161300e943ec44"
    ]
}
```

### Reward
```json
{
    "tx":{
        "id": "random generated id",
        "to":{
            "address": "public key 1",
            "amount": 1
        },
        "msg": "message"
    },
    "sign": "signature from Private Key 1",
}
```

## BlockChain
### Block
```json
{
    "depth": 0,
    "timestamp": 1234,
    "transactions": [],
    "before": "hash of the previous block",
    "nonce": 0,
    "nipples": 1
}
```

### Block Example
```json
{
    "depth": 1,
    "timestamp": 1509194576004,
    "transactions": [
        {
            "tx": {
                "id": "c443383309ec0313329e6b7a556156d9e78e1139c350d56e928a3b18d60d7f76",
                "from": [
                    "044d5f1822470e00bb2b8d8bf7585fe60e120bff0ae1f413936c9d4fdf3f98c5d33ae9c559c113c50ff4ea5833ad93c68359afd2fcd2f5f747c2ae37b9e0a0bb8e",
                    "040c976796344195f9db02d61cd715a6ca998749385b1b03cfcd23bd6d9f6124b95d47c0fd323cb9c67df1a4d8767aaff6d6e3c04ad49ff361996afe1a0799f576"
                ],
                "to": [
                    {
                        "address": "06e6d4c30ed7b0488c8ffc924222831ae15ad216",
                        "amount": 123
                    },
                    {
                        "address": "8279445a65100f8889fb351e3e334a329fb27f03",
                        "amount": 123
                    }
                ],
                "msg": "B00b5 r b34ut1Ful",
                "fee": 1
            },
            "sign": [
                "304402200554a27ed8e80f94ef97745da925d8c3a799cc3326fe86962889bae0033b0167022009b647dcfe4be1df491ed0fda134102797fee92c3249c9f7971e1507e7e1b547",
                "3044022006386ebe05f4c0ff1486604839d0d0c362766d6e91816838649efcf9e29c595a022002b724c2ba0649c749bda6e5cce27c31da5df43e0327bbdd34161300e943ec44"
            ]
        },
        {
            "tx": {
                "to": {
                    "address": "042ae6b5c7801232d4c12a24743d4f58dab9912a8939be4ea49b6968938ba140e33680cb40f84b6fb57d4d0383d41126719348ebcee73c49a541bf3434c788274a",
                    "amount": 10
                },
                "msg": "b00b13"
            },
            "sign": "3044022002b4367b311f62824adf834f83493cc9b4d4956531a8641d10661d6481786a75022007224410f5626fd43e7995156549cf445a58d6221cf2d4f6d774e3afcabc9c2a"
        }
    ],
    "before": "b0000000000000000000000000000000000000000000000000000000000000b5",
    "nipples": 0,
    "nonce": 26749
}
```
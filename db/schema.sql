DROP TABLE IF EXISTS block;
CREATE TABLE block(
    depth INTEGER PRIMARY KEY,
    timestamp INTEGER NOT NULL,
    hash VARCHAR(64) NOT NULL,
    before VARCHAR(64) NOT NULL,
    nipples TINYINT NOT NULL,    
    nonce INTEGER NOT NULL
);
DROP INDEX IF EXISTS hash_idx;
CREATE INDEX hash_idx ON block(hash);

DROP TABLE IF EXISTS tx;
CREATE TABLE tx(
    tx_id VARCHAR(64) PRIMARY KEY,
    type TINYINT NOT NULL,
    block_depth INTEGER NOT NULL,
    position TINYINT NOT NULL,
    msg TEXT,
    fee INTEGER
);
DROP INDEX IF EXISTS block_depth_idx;
CREATE INDEX block_depth_idx ON tx(block_depth);

DROP TABLE IF EXISTS sign;
CREATE TABLE sign(
    tx_id VARCHAR(64) NOT NULL,
    position TINYINT NOT NULL,
    sign TEXT NOT NULL,
    FOREIGN KEY (tx_id) REFERENCES tx(tx_id)
);
DROP INDEX IF EXISTS sign_tx_id_idx;
CREATE INDEX sign_tx_id_idx ON sign(tx_id);

DROP TABLE IF EXISTS input;
CREATE TABLE input(
    tx_id VARCHAR(64) NOT NULL,
    position TINYINT NOT NULL,
    address TEXT NOT NULL,
    FOREIGN KEY (tx_id) REFERENCES tx(tx_id)
);
DROP INDEX IF EXISTS input_tx_id_idx;
CREATE INDEX input_tx_id_idx ON input(tx_id);

DROP TABLE IF EXISTS output;
CREATE TABLE output(
    tx_id VARCHAR(64) NOT NULL,
    position TINYINT NOT NULL,
    address TEXT NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY (tx_id) REFERENCES tx (tx_id)
);
DROP INDEX IF EXISTS output_tx_id_idx;
CREATE INDEX output_tx_id_idx ON output(tx_id);

DROP TABLE IF EXISTS accountability;
CREATE TABLE accountability(
    address TEXT PRIMARY KEY,
    amount INTEGER NOT NULL
);
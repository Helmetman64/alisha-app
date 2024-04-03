USE ALISHA;

IF OBJECT_ID('ITEMS') IS NOT NULL
DROP TABLE ITEMS;

CREATE TABLE ITEMS
(
    itemName NVARCHAR(100),
    itemPrice MONEY,
    itemQTY INT,
    imageName NVARCHAR(100),
    PRIMARY KEY (itemName)
);

IF OBJECT_ID('HISTORY') IS NOT NULL
DROP TABLE HISTORY;

-- CREATE TABLE HISTORY
-- (
--     historyID BIGINT,
--     itemID INT,
--     itemQTY INT,
--     itemPrice MONEY,
--     saleDate DATE,
--     PRIMARY KEY (historyID),
--     FOREIGN KEY (itemID) REFERENCES ITEMS
-- );

INSERT INTO ITEMS
VALUES
    ('Duck', 20.00, 100, 'duck'),
    ('Flower', 15.00, 20, 'flower'),
    ('Small bag', 15.00, 10, 'smallBag'),
    ('Duck blind bag', 1.00, 10, 'duckBag'),
    ('Miffy keychain', 15.00, 15, 'miffyKeychain'),
    ('Miffy plush', 35.00, 15, 'miffyPlush');

SELECT *
FROM ITEMS

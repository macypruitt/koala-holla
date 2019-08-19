const express = require('express');
const koalaRouter = express.Router();


// DB CONNECTION
const pool = require('../modules/pool');

// GET
koalaRouter.get('/', (req, res) => {
    const queryText = 'SELECT * FROM "koalas";';

    pool.query(queryText)
        .then((result) => {
            console.log(result)
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('Error: ', err);
            res.sendStatus(500);
        });
});

// POST
koalaRouter.post('/', (req, res) => {
    const newKoala = req.body;
    const queryText = `INSERT INTO "koalas" ("name", "gender", "age", "ready_to_transfer", "notes")
                        VALUES ($1, $2, $3, $4, $5);`;
    console.log('Meow', newKoala.readyForTransfer);
    pool.query(queryText, [newKoala.name, newKoala.gender, newKoala.age, newKoala.readyForTransfer, newKoala.notes ])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('Error posting: ', err);
            res.sendStatus(500);
        });

});

// PUT
koalaRouter.put('/:id', (req, res) => {
    // const koalaObject = req.body;
    const koalaId = req.params.id;
    
    const queryText = `UPDATE "koalas" SET "ready_to_transfer"='Y' WHERE id=$1;`;

    pool.query(queryText, [koalaId])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('Error updating database: ', err);
            res.sendStatus(500);
        });
});


// DELETE
koalaRouter.delete('/:id', (req, res) => {
    console.log(req.params);

    const queryText = `DELETE FROM "koalas" WHERE id=$1`;

    pool.query(queryText, [req.params.id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('Error deleting: ', err);
            res.sendStatus(500);
        });
});

module.exports = koalaRouter;
const pg = require('pg');


const Pool = pg.Pool;
const pool = new Pool({
    database: 'koala_holla',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
});

pool.on('connect', () => {
    console.log('Pool is connected');
})

pool.on('error', (error) => {
    console.log('ERROR: ', error);
});

module.exports = pool;
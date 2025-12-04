import sql from 'mssql';

const dbConfig = {
    user:'Admin',
    password:'admin12345',
    server:'localhost',
    database:'OnlyFreshBD',
    port: 1433,
    options: {
        trustServerCertificate: true
    }
}  

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => console.error('Database Connection Failed!', err));

export { sql, poolPromise };
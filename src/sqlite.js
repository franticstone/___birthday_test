const sqlite3 = require('sqlite3');
const db = new sqlite3.Database("databse.sqlite");

const requiredTables = [
    "persons"
]

const initiate = async () => {
    return new Promise((a,r) => {
        const processedTables = [];

        const processedTableConfirmation = name => {
            processedTables.push(name);

            if(requiredTables.length === processedTables.length) {
                a();
            }
        }

        for(let tableName of requiredTables) {
            db.run(`CREATE TABLE IF NOT EXISTS ${tableName} ( first_name VARCHAR(100), last_name VARCHAR(100), dob_yyyy VARCHAR(4), dob_mm VARCHAR(2), dob_date VARCHAR(2), email VARCHAR(100), telephone VARCHAR(100));`, () => {
                processedTableConfirmation(tableName)
            });
        }
    });
}

module.exports.select = async ({
    tableName,
    query
}) => {
    await initiate();

    return new Promise((a,r) => {
        const mappedQueryObjects = query.map(m => `${m.k} = '${m.v}'`).join(" AND ");
        const queryString = `SELECT * FROM ${tableName} WHERE ${mappedQueryObjects}`;
        db.all(queryString, (err, results) => {
            if(err) return r(err);
            return a(results ? results : [])
        })
    })
}

module.exports.insert = async ({
    tableName,
    data
}) => {
    await initiate();

    return new Promise((a,r) => {
        const mappedQueryColumns = Object.keys(data).join(', ');
        const mappedQueryValues = Object.values(data).map(m => `'${m}'`).join(', ');

        const finalisedQuery = `INSERT INTO ${tableName} (${mappedQueryColumns}) VALUES(${mappedQueryValues})`;
        db.run(finalisedQuery, (err, results) => {
            if(err) return r(err);
            return a(results ? results : null);
        })
    })
}
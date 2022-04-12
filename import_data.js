const fs = require('fs');
const { select, insert } = require('./src/sqlite');

const processRows = async (rows) => {
    return new Promise(async (a,r) => {
        for(let row of rows) {
            const {
                first_name,
                last_name,
                date_of_birth,
                email,
                telephone
            } = row;
            const dobSplit = date_of_birth.split('/');
            const constitutedDOB = {
                dd: parseInt(dobSplit.pop()),
                mm: parseInt(dobSplit[1]),
                yyyy: parseInt(dobSplit[0])
            }

            const searchResults = await select({
                tableName: "persons",
                query: [
                    {
                        k: "first_name",
                        v: first_name
                    }, {
                        k: "last_name",
                        v: last_name
                    }, {
                        k: "email",
                        v: email
                    }
                ]
            });

            if(searchResults.length === 0) {
                await insert({
                    tableName: "persons",
                    data: {
                        first_name,
                        last_name,
                        email,
                        telephone,
                        dob_yyyy: constitutedDOB.yyyy,
                        dob_mm: constitutedDOB.mm,
                        dob_date: constitutedDOB.dd
                    }
                });
            } 
        }
        a();
    })
}

try {
    const filedata = fs.readFileSync(process.argv.pop(), 'utf-8');
    
    const splitRowsIntoArray = filedata.split('\n');
    
    const keys = splitRowsIntoArray[0].split(',').map(m => m.trim());
    const rows = splitRowsIntoArray.splice(1).map((row) => {
       return row.split(',').reduce((result, field, index) => {
          result[keys[index]] = field.trim();
          return result;
        }, {});
    });

    processRows(rows).then(() => {
        console.log('All Completed')
        process.exit(1);
    })

} catch(err) {
    console.log('An error occurred -- ', err);
}
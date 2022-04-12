const { select } = require('./src/sqlite');
const { sendSms } = require('./src/sms');

(async () => {

    let date, month;

    const { argv } = process;

    if(argv.length !== 4) {
        const dateObject = new Date();
        month = dateObject.getMonth();
        date = dateObject.getDate();
    } else {
        date = parseInt(argv.filter(f => f.includes('date='))[0].split('=').pop()) || null;
        month = parseInt(argv.filter(f => f.includes('month='))[0].split('=').pop()) || null;
    }
    
    if(!date || !month) {
        console.error('Date or Month not correctly configured.')
        process.exit(1);
    }

    if(month === 2 && date === 29) date = 28;

    const selectFromPersons = await select({
        tableName: "persons",
        query: [{
            k: "dob_mm",
            v: month
        }, {
            k: "dob_date",
            v: date
        }]
    });

    for(let person of selectFromPersons) {
        await sendSms({
            to: person.telephone,
            body:`Hi ${person.first_name}. Wishing you well on your birthday and many happy returns.`
        })
    }

    console.log(selectFromPersons.length > 0 ? `Sent ${selectFromPersons.length} sms messages` : `Nothing to send no ones birthday`);

})()
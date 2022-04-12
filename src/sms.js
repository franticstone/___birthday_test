const accountSid = "ACd9ac942c2bd65de4e3f6c5ed34415b91";
const authToken = "395807b834107648c6e7773ca7980a1d";
const phoneNumber = "+15183367053"
const client = require('twilio')(accountSid, authToken);

module.exports.sendSms = async ({to, body}) => {
    return new Promise((a,r) => {
        client.messages.create({to, body, from: phoneNumber}).then(message => a(message)).catch(e => console.log(e));
    })
}
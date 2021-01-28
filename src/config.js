require('dotenv').config();
global.SALT_KEY = process.env.SALT_KEY;
global.EMAIL_TMPL =  process.env.EMAIL_TMPL;
console.log(process.env.CONNECT_STRING)
module.exports = {
    connectionString: process.env.CONNECT_STRING,
    sendgridKey: process.env.SENDGRID_KEY,
    containerConnectionString: process.env.CONTAINER_CONNECTION_STRING
}
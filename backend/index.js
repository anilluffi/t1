require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env. PORT || 3003
const app = express(PORT, () => console.log('server started on PORT = ${Port}'))
const start = async () => {
    try {
        app.lissen()
    } catch (e){
        console.log(e);
    }
}

start()
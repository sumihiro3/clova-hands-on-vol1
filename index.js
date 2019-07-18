const clova = require('@line/clova-cek-sdk-nodejs');
const express = require('express');

// ファイル読み込み
require('dotenv').config();
const clovaSkillHandler = require('./clova');

const app = new express();
const port = 3000;

// Clova
const clovaMiddleware = clova.Middleware({ applicationId: process.env.EXTENSION_ID });
app.post('/clova', clovaMiddleware, clovaSkillHandler);

app.listen(port, () => console.log(`Server running on ${port}`));

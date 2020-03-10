const express =require('express');
const path = require('path');
const dataRouter = express.Router();
const DataService = require('./data-service')
const jsonParser = express.json()
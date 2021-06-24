/**
         * Feed mechanism for diplaying content
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

'use strict';
var express = require('express');
var router = express.Router();
const core = require('../public/js/func/core.js');
const config = require(process.cwd() + '/config/config.json');

//QAuth athentication middleware
const qauth = require('../public/js/func/qauth');

/* GET home page. */
router.get('/index/:index', function (req, res) {


    var content = core.getFeed(req.params.index, config.group);
   
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(JSON.stringify(content));
            

});

module.exports = router;
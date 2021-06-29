/**
         * Entry point for the application
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

'use strict';
var express = require('express');
var router = express.Router();
const util = require('../public/js/func/utility');
const core = require('../public/js/func/core');
const config = require(process.cwd() + '/config/config.json');
const fs = require('fs');

//QAuth athentication middleware
const qauth = require('../public/js/func/qauth');


/* GET local request. */
router.get('/local', qauth.QAuthMiddleware, function (req, res) {
    
    //Integrity checks
    //In case the archives or shares folder got deleted
    //If the archives folder was deleted then need to delete the index too. (tbd)
    //All the content will be lost so we need a backup functionality. (tbd)
    if (!fs.existsSync('archives\\')) {

        fs.mkdirSync('archives\\');
        fs.mkdirSync('archives\\shares\\');

    }

    //In case there's no shares folder
    if (!fs.existsSync('archives\\shares\\')) {

        fs.mkdirSync('archives\\shares\\');

    }
 
    //Update the content index if there are have been any shares
    //Load the local timeline from this function because javascript is asynchronous and we have to make sure
    //the shares get indexed before loading the page. 
    
    util.getShares(res, config.alias, config.ngrok_url, config.ngrok_url, config.group);                     
    
});

/* GET remote request. */
router.get('/remote', qauth.QAuthMiddleware, function (req, res) {

     
        //Update the content index if there are have been any shares
        //Load the local timeline from this function because javascript is asynchronous and we have to make sure
        //the shares get indexed before loading the page. 
        util.getShares(res, req.query.alias, req.query.request, config.ngrok_url, config.group);
    
});

/* Load the client framework */
router.get('/', qauth.QAuthMiddleware, function (req, res) {

    //Load the main framework
    core.loadMain(res);
                  
 });
    
module.exports = router;
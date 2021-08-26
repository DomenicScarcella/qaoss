/**
         * All Things Server Side Message
         * Create, Delete
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

'use strict';
var express = require('express');
var router = express.Router();
const fs = require('fs');
const util = require('../public/js/func/utility.js');
var MAX_CONTENT_LENGTH_ACCEPTED = 12000;

//QAuth athentication middleware
const qauth = require('../public/js/func/qauth');

function maxLengthMiddleware(req, res, next) {
   
    if (req.params.body.length > MAX_CONTENT_LENGTH_ACCEPTED) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(JSON.parse('{\"result\":\"Content too big\",\"status\":\"400\"}'));
    } else {
        next();
    }
}

router.get('/new', qauth.QAuthMiddleware, function (req, res, next) {

    //Open a window with the new messages in it. 
    var messagesJson = util.getMessageIndex();
    var message = '';
    var messages = [];
    var count = 0;

    if (messagesJson < 0) {

        //Error handling here
        res.setHeader('Content-Type', 'application/json');
        res.json(JSON.parse('{\"messages\":[' + messages + ']}'));

    } else {
        for (var index = 0; index < messagesJson.length; index++) {

            message = fs.readFileSync(process.cwd() + '/messages/' + messagesJson[index].folder + '/' + messagesJson[index].content, 'utf8');

            if (JSON.parse(message).preview.read == 0) {
                messages[count] = message;
                count++;
            } 
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.json(JSON.parse('{\"messages\":[' + messages + ']}'));
    }
});

router.get('/read', qauth.QAuthMiddleware, function (req, res, next) {

    //Open a window with the read messages in it. 
    var messagesJson = util.getMessageIndex();
    var message = '';
    var messages = [];
    var count = 0;

    if (messagesJson < 0) {

        //Error handling here
        res.setHeader('Content-Type', 'application/json');
        res.json(JSON.parse('{\"messages\":[' + messages + ']}'));

    } else {
        for (var index = 0; index < messagesJson.length; index++) {

            message = fs.readFileSync(process.cwd() + '/messages/' + messagesJson[index].folder + '/' + messagesJson[index].content, 'utf8');

            if (JSON.parse(message).preview.read == 1) {
                messages[count] = message;
                count++;
            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.json(JSON.parse('{\"messages\":[' + messages + ']}'));
    }

});

router.get('/queued', qauth.QAuthMiddleware, function (req, res, next) {

    //Get the message queue index.
    var queuedMessage;
    var messagesJson = util.getMessageQueueIndex();
    var messageQueueJson = JSON.parse('[]');
   
    if (messagesJson != "") {
       
        for (var index = 0; index < messagesJson.length; index++) {
          
            messageQueueJson.push(JSON.parse(fs.readFileSync(process.cwd() + '/messages/queue/' + messagesJson[index].folder + '/' + messagesJson[index].content, 'utf8')));
            
        }
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.parse('{\"messages\": ' + JSON.stringify(messageQueueJson) + '}'));
});

router.post('/name/:name', qauth.QAuthMiddleware, function (req, res, next) {

    //Mark a message as read when it's opened for reading. 
    var messagesJson = util.getMessageIndex();
    var messageJson;
    var message = '';
    
    if (messagesJson < 0) {

        //Error handling here
        res.setHeader('Content-Type', 'application/json');
        res.json(JSON.parse('{\"messages\":[' + messages + ']}'));

    } else {
        
        for (var index = 0; index < messagesJson.length; index++) {
            
            if (messagesJson[index].content == req.params.name) {
                
                message = fs.readFileSync(process.cwd() + '/messages/' + messagesJson[index].folder + '/' + messagesJson[index].content, 'utf8');

                messageJson = JSON.parse(message);
                messageJson.preview.read = 1;
               
                fs.writeFileSync(process.cwd() + '/messages/' + messagesJson[index].folder + '/' + messagesJson[index].content, JSON.stringify(messageJson) ,'utf8');

            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.json(JSON.parse('{\"result\":\"success\"}'));
    }

});

router.post('/delete/name/:name', qauth.QAuthMiddleware, function (req, res, next) {

    //Delete a message
    var messagesJson = util.getMessageIndex();

    for (var i = 0; i < messagesJson.length; i++) {
        //console.log(contentJson[i].folder + '/' + contentJson[i].content + " : " + req.params.post);
        if (messagesJson[i].content == req.params.name) {

            //delete the content json file
            var folder = messagesJson[i].folder;

            fs.unlink("./messages/" + folder + "/" + req.params.name, (err) => {

                if (err) {
                    util.writeLog("error", "failed to delete post from archives:" + err);
                }
            });

            //remove the post from the content index
            fs.writeFileSync('messages.json', util.deleteMessageIndex(messagesJson, req.params.name), 'utf8');


        }
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.parse('{\"result\":\"success\"}'));

});

router.post('/deletequeued/name/:name', qauth.QAuthMiddleware, function (req, res, next) {

    //Delete a queued message after being sent
    var messagesJson = util.getMessageQueueIndex();

    for (var i = 0; i < messagesJson.length; i++) {
        //console.log(contentJson[i].folder + '/' + contentJson[i].content + " : " + req.params.post);
        if (messagesJson[i].content == req.params.name) {

            //delete the content json file
            var folder = messagesJson[i].folder;

            fs.unlink("./messages/queue/" + folder + "/" + req.params.name, (err) => {

                if (err) {
                    util.writeLog("error", "failed to delete post from archives:" + err);
                }
            });

            //remove the post from the content index
            fs.writeFileSync('messagequeue.json', util.deleteMessageQueueIndex(messagesJson, req.params.name), 'utf8');


        }
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.parse('{\"result\":\"success\"}'));

});

router.post('/body/:body/request/:request', qauth.QAuthMiddleware, maxLengthMiddleware, function (req, res, next) {

    //Send a new message
    //Decode the url parameters
    var body = util.decodeParam(req.params.body);
    var url = util.decodeParam(req.params.url);
    
    //Generate the time stamp
    var today = new Date();
    var seconds = new Date().getTime() / 1000
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    
        if (fs.existsSync('messages\\' + date)) {
            try {
                fs.writeFileSync('messages\\' + date + '\\content-' + seconds + '.json', util.serializeContent(body, url, '\"read\":\"0\"', "photo_" + date, seconds, req.params.request, "Create"), 'utf8');
            } catch (e) {
                util.writeLog("error", e);

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json(JSON.parse('{\"result\":\"error\"}'));
            }
        } else {
            try {
                if (fs.existsSync('messages\\')) {
                    
                    fs.mkdirSync('messages\\' + date);
                } else {
                    fs.mkdirSync('messages\\');
                    fs.mkdirSync('messages\\' + date);
                }

                
                fs.writeFileSync('messages\\' + date + '\\content-' + seconds + '.json', util.serializeContent(body, url, '\"read\":\"0\"', "photo_" + date, seconds, req.params.request, "Create"), 'utf8');
            } catch (e) {

                util.writeLog("error", e);

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json(JSON.parse('{\"result\":\"error\"}'));
            }
        }
   
        //Get the message index.
        var contentJson = util.getMessageIndex();

        if (contentJson < 0) {

            try {
                fs.writeFileSync('messages.json', '[{\"folder\":\"' + date + '\", \"content\":\"' + 'content-' + seconds + '.json' + '\"}]', 'utf8');
            } catch (e) {
                util.writeLog("error", e);

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json(JSON.parse('{\"result\":\"error\"}'));
            }

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(JSON.parse('{\"result\":\"success\",\"status\":\"200\"}'));

        } else {
   
            contentJson.push({ "folder":date, "content": 'content-' + seconds + '.json' });
            var content = JSON.stringify(contentJson);
            try {
                fs.writeFileSync('messages.json', content, 'utf8');
            } catch (e) {
                util.writeLog("error", e);

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json(JSON.parse('{\"result\":\"error\"}'));
            }
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(JSON.parse('{\"result\":\"success\",\"status\":\"200\"}'));

        }

    
});

router.post('/body/:body/recipient/:recipient', qauth.QAuthMiddleware, maxLengthMiddleware, function (req, res, next) {
    
    //Queue a new message
    //Decode the url parameters
    var body = util.decodeParam(req.params.body);
    var url = util.decodeParam(req.params.url);

    //Generate the time stamp
    var today = new Date();
    var seconds = new Date().getTime() / 1000
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    if (fs.existsSync('messages\\queue\\' + date)) {
        try {
            fs.writeFileSync('messages\\queue\\' + date + '\\content-' + seconds + '.json', util.serializeContent(body, url, '\"read\":\"0\"',"", seconds, req.params.recipient, "Create"), 'utf8');
        } catch (e) {
            util.writeLog("error", e);

            
        }
    } else {
        try {
            if (fs.existsSync('messages\\queue\\')) {
                
                fs.mkdirSync('messages\\queue\\' + date);
            } else {
                if (fs.existsSync('messages\\')) {
                    
                    fs.mkdirSync('messages\\queue\\');
                    fs.mkdirSync('messages\\queue\\' + date);
                } else {
                    fs.mkdirSync('messages\\');
                    fs.mkdirSync('messages\\queue\\');
                    fs.mkdirSync('messages\\queue\\' + date);
                }
            }


            fs.writeFileSync('messages\\queue\\' + date + '\\content-' + seconds + '.json', util.serializeContent(body, url, '\"read\":\"0\"', "", seconds, req.params.recipient, "Create"), 'utf8');
        } catch (e) {

            util.writeLog("error", e);

            
        }
    }

    //Get the message queue index.
    var contentJson = util.getMessageQueueIndex();

    if (contentJson < 0) {

        try {
            fs.writeFileSync('messagequeue.json', '[{\"folder\":\"' + date + '\", \"content\":\"' + 'content-' + seconds + '.json' + '\"}]', 'utf8');
        } catch (e) {
            util.writeLog("error", e);

           
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(JSON.parse('{\"result\":\"success\",\"status\":\"200\"}'));

    } else {

        contentJson.push({ "folder": date, "content": 'content-' + seconds + '.json' });
        var content = JSON.stringify(contentJson);
        try {
            fs.writeFileSync('messagequeue.json', content, 'utf8');
        } catch (e) {
            util.writeLog("error", e);

            
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(JSON.parse('{\"result\":\"success\",\"status\":\"200\"}'));

    }


});

module.exports = router;
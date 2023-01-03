/**
         * All Things Server Side for Managing Friends Lists
         * Create, Edit, Delete
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

'use strict';
var express = require('express');
var router = express.Router();
const fs = require('fs');
const util = require('../public/js/func/utility.js');

//QAuth athentication middleware
const qauth = require('../public/js/func/qauth');

//constants
var protocol = 'https://';
var domain = '.loca.lt'


/* Register new friend locally */
router.post('/request/:request/alias/:alias/group/:group', qauth.QAuthMiddleware, function (req, res) {

    var url = protocol + req.params.request + domain;
    let authToken = Math.random().toString(36).replace('0.', '');
    var isFriend = false;
    let peers;

    
    if (fs.existsSync('peers.json')) {
        //read the peers.json in in order to append to it.

        var rawPeers = fs.readFileSync('peers.json', 'utf8');
        peers = JSON.parse(rawPeers);
        
        if (peers.length > 0) {
            //Check if the peer already exists, if so then update it if the alias or domain have changed
            
            for (var index = 0; index < peers.length; index++) {

               if (peers[index].xurl == req.params.request && peers[index].alias == req.params.alias) {
                  //trying to add a friend that already exists so don't do anything
                    isFriend = true;
                    break;

                }
            }
            if (!isFriend) {
               
                peers.push({ "xurl": req.params.request, "url": url, "group": req.params.group, "alias": req.params.alias, "authToken": authToken, "accessToken": "" });
            }
        } else {
           
            peers.push({ "xurl": req.params.request, "url": url, "group": req.params.group, "alias": req.params.alias, "authToken": authToken, "accessToken": "" });
        }

    } else {

        peers = [];
        peers.push({ "xurl": req.params.request, "url": url, "group": req.params.group, "alias": req.params.alias, "authToken": authToken, "accessToken": "" });
    }
    
    fs.writeFileSync('peers.json', JSON.stringify(peers), 'utf8');

    res.setHeader('Content-Type', 'application/json');       
    res.json(peers);

});

/* Edit friend */
router.post('/request/:request/alias/:alias/group/:group/index/:index', qauth.QAuthMiddleware, function (req, res) {

    let url = protocol + req.params.request + domain;
    let index = req.params.index;
    let peers;

    //read the peers.json in in order to append to it.
    let rawPeers = fs.readFileSync('peers.json', 'utf8');
    peers = JSON.parse(rawPeers);

    peers[index].group = req.params.group;
    peers[index].alias = req.params.alias;
    peers[index].xurl = req.params.request;
    peers[index].url = url;

    fs.writeFileSync('peers.json', JSON.stringify(peers), 'utf8');

    res.setHeader('Content-Type', 'application/json');
    res.json(peers);

});

/* Register new friend from friend request */
router.post('/request/accept/friend/:friend/authToken/:authToken/accessToken/:accessToken/group/:group/message/:message', qauth.QAuthMiddleware, function (req, res) {

    var url = protocol + req.params.friend + domain;
    let peers;


    if (fs.existsSync('peers.json')) {
        //read the peers.json in in order to append to it.

        var rawPeers = fs.readFileSync('peers.json', 'utf8');
        peers = JSON.parse(rawPeers);

    } else {

        peers = [];
    }

    peers.push({ "xurl": req.params.friend, "url": url, "group": req.params.group, "alias": req.params.friend, "authToken": req.params.accessToken, "accessToken": req.params.authToken });

    fs.writeFileSync('peers.json', JSON.stringify(peers), 'utf8');

    //Delete request
    var messagesJson = util.getMessageIndex();
    for (var index = 0; index < messagesJson.length; index++) {

        
        if (messagesJson[index].content == req.params.message) {
            //delete the content json file
            var folder = messagesJson[index].folder;

            fs.unlink("./messages/" + folder + "/" + messagesJson[index].content, (err) => {

                if (err) {
                    util.writeLog("error", "failed to delete post from archives:" + err);
                }
            });

            //remove the post from the content index
            fs.writeFileSync('messages.json', util.deleteMessageIndex(messagesJson, req.params.message), 'utf8');
        }


        
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(peers);

});

/* Delete new friend request message */
router.delete('/request/reject/message/:message', qauth.QAuthMiddleware, function (req, res) {

    
    //Delete request
    var messagesJson = util.getMessageIndex();
    for (var index = 0; index < messagesJson.length; index++) {

        
        if (messagesJson[index].content == req.params.message) {
            //delete the content json file
            var folder = messagesJson[index].folder;

            fs.unlink("./messages/" + folder + "/" + messagesJson[index].content, (err) => {

                if (err) {
                    util.writeLog("error", "failed to delete post from archives:" + err);
                }
            });

            //remove the post from the content index
            fs.writeFileSync('messages.json', util.deleteMessageIndex(messagesJson, req.params.message), 'utf8');
        }



    }

    res.setHeader('Content-Type', 'application/json');
    res.json({result: success});

});

//Friend accepted request, update peers list.
router.post('/request/accept/friend/:friend/accessToken/:accessToken', function (req, res, next) {

    let peers;

    if (fs.existsSync('peers.json')) {
        //read the peers.json in in order to modify it.

        var rawPeers = fs.readFileSync('peers.json', 'utf8');
        peers = JSON.parse(rawPeers);

    } else {

        peers = [];
    }
    
    for (var index = 0; index < peers.length; index++) {

        if (peers[index].xurl == req.params.friend) {
            peers[index].accessToken = req.params.accessToken;
            break;
        }
    }
    
    fs.writeFileSync('peers.json', JSON.stringify(peers), 'utf8');

    res.setHeader('Content-Type', 'application/json');
    res.json(peers);

});

//Send request to new peer
router.post('/origin/:origin/request/:request/authtoken/:authtoken/group/:group', function (req, res, next) {

    
    //Decode the url parameters
    var body = req.params.origin;
    var group = req.params.group;
    
    //Generate the time stamp
    var today = new Date();
    var seconds = new Date().getTime() / 1000
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    if (fs.existsSync('messages\\' + date)) {
        try {
            
            fs.writeFileSync('messages\\' + date + '\\content-' + seconds + '.json', util.serializeContent(body, group, '\"read\":\"2\"', req.params.authtoken, seconds, req.params.request, "Create"), 'utf8');
            
        } catch (e) {
            util.writeLog("error", e);

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({result: e});
        }
    } else {
        try {
            if (fs.existsSync('messages\\')) {

                fs.mkdirSync('messages\\' + date);
            } else {
                fs.mkdirSync('messages\\');
                fs.mkdirSync('messages\\' + date);
            }


            fs.writeFileSync('messages\\' + date + '\\content-' + seconds + '.json', util.serializeContent(body, group, '\"read\":\"2\"', req.params.authtoken, seconds, req.params.request, "Create"), 'utf8');
        } catch (e) {

            util.writeLog("error", e);

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({result: e});
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
            res.json({result:error});
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({result:'success',status:200});

    } else {

        contentJson.push({ "folder": date, "content": 'content-' + seconds + '.json' });
        var content = JSON.stringify(contentJson);
        try {
            fs.writeFileSync('messages.json', content, 'utf8');
        } catch (e) {
            util.writeLog("error", e);

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({ result: e });
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ result: 'success', status: 200 });

    }


});

//Get the requests
router.get('/requests', qauth.QAuthMiddleware, function (req, res, next) {

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

            if (JSON.parse(message).preview.read == 2) {
                messages[count] = message;
                count++;
            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.json(JSON.parse('{\"messages\":[' + messages + ']}'));
    }
});

//Delete a peer
router.delete('/alias/:alias', qauth.QAuthMiddleware, function (req, res) {

    //read the peers.json in in order to append to it.
    var rawPeers = null;
    var peers = null;

    try {
        rawPeers = fs.readFileSync('peers.json', 'utf8');
        peers = JSON.parse(rawPeers);
    } catch (e) {
        util.writeLog("error", e);
    }

    try {
    //need to find the index in the peers array of the peer we want to delete
        for (var index = 0; index < peers.length; index++) {

            if (peers[index].xurl === req.params.alias) {

                const i = peers.findIndex(x => x.alias === peers[index].xurl);

                if (i !== undefined) peers.splice(index, 1);
                peers = JSON.stringify(peers);

                fs.writeFileSync('peers.json', peers, 'utf8');

                res.setHeader('Content-Type', 'application/json');
                res.json({result:'success'});

                break;

            }
        }
    }catch (e) {
            util.writeLog("error", e);
    }

});

module.exports = router;
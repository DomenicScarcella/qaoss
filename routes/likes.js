/**
         * All Things Server Side Like
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

//QAuth athentication middleware
const qauth = require('../public/js/func/qauth');

/* Create like */
router.post('/post/:post/alias/:alias/request/:request', qauth.QAuthMiddleware, function (req, res) {

    //Get the content index.
    var contentJson = util.getContentIndex();
    
    var index = -99;
    var likes=0;
    var crement=0;


    for (var i = 0; i < contentJson.length; i++) {
        //console.log(contentJson[i].folder + '/' + contentJson[i].content);
        if (contentJson[i].content == req.params.post) {

            var folder = contentJson[i].folder;
            var content = JSON.parse(fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8'));

            if (content['likes'].length != 0) {

                //iterate over the likers and make sure they haven't liked the post before
                for (var j = 0; j < content['likes'].length; j++) {
                    if (content['likes'][j].user == req.params.request) {
                        index = j; //this user already liked it so remove the like
                        break;
                    }
                }
                //User hasn't liked it before
                if (index == -99) {

                    content['likes'].push({ "user": req.params.request });
                    likes = content['likes'].length;

                    content = JSON.stringify(content);
                    fs.writeFileSync("./archives/" + folder + "/" + req.params.post, content, 'utf8');

                    crement = 1;

                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json(JSON.parse('{\"likes\":' + likes + ',\"crement\":' + crement + '}'));

                } else {
                    //User has liked it so decrement his like
                    content.likes.splice(index,1);
                    likes = content['likes'].length;

                    content = JSON.stringify(content);
                    fs.writeFileSync("./archives/" + folder + "/" + req.params.post, content, 'utf8');

                    crement = 0;

                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json(JSON.parse('{\"likes\":' + likes + ',\"crement\":' + crement + '}'));
                }


            } else {


                content['likes'].push({ "user": req.params.request });
                likes = content['likes'].length;

                content = JSON.stringify(content);
                fs.writeFileSync("./archives/" + folder + "/" + req.params.post, content, 'utf8');

                crement = 1;

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json(JSON.parse('{\"likes\":' + likes + ',\"crement\":' + crement + '}'));
            }



        }
    }


    
});

module.exports = router;
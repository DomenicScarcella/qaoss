/**
         * All Things Server Side Comment and Reply
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

/* add a comment */
router.post('/post/:post/comment/:comment/alias/:alias/request/:request', qauth.QAuthMiddleware, function (req, res) {

    //Get the content index.
    var contentJson = util.getContentIndex();

        var folder;
        var result = "success";

        for (var i = 0; i < contentJson.length; i++) {

            if (contentJson[i].content == req.params.post) {

                folder = contentJson[i].folder;
            }
        }

        //Update the json content file
        let rawContent = fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8');
        let content = JSON.parse(rawContent);
        let name = content.name;
        let index = Math.floor(Math.random() * 100000) + 1;
        
       
        content['comments'].push({ "comment": req.params.comment, "user": req.params.alias, "xurl": req.params.request, "index": index, "replies": [] });
        var count = content['comments'].length - 1;
       //var comment = JSON.stringify(content['comments'][count].comment);
        
        content = JSON.stringify(content);
        fs.writeFileSync("./archives/" + folder + "/" + req.params.post, content, 'utf8');

        //Build the response object
        var resObj = {

            "result": result,
            "comment": req.params.comment,
            "xurl": req.params.request,
            "count": count,
            "index": index,
            "name": name

        };
      
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(JSON.parse(JSON.stringify(resObj)));
    
});

//Edit a comment
router.post('/post/:post/comment/:comment/index/:index/request/:request', qauth.QAuthMiddleware, function (req, res) {

    var comment = req.params.comment;
    var result = "success";

    //Get the content index.
    var contentJson = util.getContentIndex();

    for (var i = 0; i < contentJson.length; i++) {
        //console.log(contentJson[i].folder + '/' + contentJson[i].content);
        if (contentJson[i].content == req.params.post) {

            var xurl;
            var index;

            var folder = contentJson[i].folder;
            var post = JSON.parse(fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8'));

            for (var x = 0; x < post.comments.length; x++) {

                if (post.comments[x].index == parseInt(req.params.index)) {

                    post.comments[x].comment = comment;
                    xurl = post.comments[x].xurl;
                    comment = JSON.stringify(post.comments[x].comment);

                    post = JSON.stringify(post);
                    fs.writeFileSync("./archives/" + folder + "/" + req.params.post, post, 'utf8');

                    //Build the response object
                    var resObj = {

                        "result": result,
                        "comment": req.params.comment,
                        "xurl": req.params.request,
                        "count": count,
                        "index": index,
                        "name": name

                    };

                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json(JSON.parse('{\"result\":\"' + result + '\",\"user\":\"' + xurl + '\",\"comment\":' + comment + '}'));

                    break;

                }

            }


            break;

        }
    }
});

//Delete a comment
router.delete('/post/:post/index/:index/request/:request', qauth.QAuthMiddleware, function (req, res) {

    //Only the authorized owner of the comment can delete it.



    //Get the content index.
    var contentJson = util.getContentIndex();
    var folder;
    var result = "success";

   

        for (var i = 0; i < contentJson.length; i++) {

            if (contentJson[i].content == req.params.post) {

                folder = contentJson[i].folder;
            }
        }

        //Update the json content file
        let rawContent = fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8');
        let content = JSON.parse(rawContent);

        for (var x = 0; x < content.comments.length; x++) {

            if (content.comments[x].index == parseInt(req.params.index)) {

                //get the user who made the comment in case of an external attempt to circumvent Qaoss
                if (content.comments[x].xurl == req.params.request) {

                    content.comments.splice(parseInt(x), 1);

                    content = JSON.stringify(content);
                    fs.writeFileSync("./archives/" + folder + "/" + req.params.post, content, 'utf8');

                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json(JSON.parse('{\"result\":\"success\"}'));

                    break;
                } else {
                    var error_code = -1;

                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json(JSON.parse('{\"result\":' + error_code + '}'));
                }

            }

        }
    

});

//Reply to a comment
router.post('/reply/:post/comment/:comment/index/:index/request/:request', qauth.QAuthMiddleware, function (req, res) {

    //Get the content index.
    var contentJson = util.getContentIndex();

        var folder;
        var result = "success";

        for (var i = 0; i < contentJson.length; i++) {

            if (contentJson[i].content == req.params.post) {

                folder = contentJson[i].folder;
            }
        }

        //Read the content file
        let rawContent = fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8');
        let content = JSON.parse(rawContent);
        let name = content.name;
        let index = Math.floor(Math.random() * 100000) + 1;
        var count;
        var reply;

        //add the reply to the comment
        for (i in content['comments']) {

            if (content['comments'][i].index == req.params.index) {

                content['comments'][i].replies.push({ "comment": req.params.comment, "xurl": req.params.request, "index": index });
                count = content['comments'][i].replies.length - 1;
                reply = JSON.stringify(req.params.comment);
            }
        }
       
        content = JSON.stringify(content);
        fs.writeFileSync("./archives/" + folder + "/" + req.params.post, content, 'utf8');

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(JSON.parse('{\"result\":\"' + result + '\", \"reply\":' + reply + ',\"xurl\":\"' + req.params.request + '\",\"count\":\"' + count + '\",\"comment\":\"' + req.params.index + '\",\"index\":\"' + index + '\",\"name\":\"' + name + '\"}'));
    
});

//Edit reply to a comment
router.post('/post/:post/comment/:comment/commentindex/:commentindex/replyindex/:replyindex/request/:request', qauth.QAuthMiddleware, function (req, res) {

    //Get the content index.
    var contentJson = util.getContentIndex();

    var folder;
    var reply;
    var result = "success";

    for (var i = 0; i < contentJson.length; i++) {

        if (contentJson[i].content == req.params.post) {

            folder = contentJson[i].folder;
        }
    }

    //Read the content file
    let rawContent = fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8');
    let content = JSON.parse(rawContent);
    let user;

    //upodate the reply
    for (var i in content['comments']) {

        if (content['comments'][i].index == req.params.commentindex) {

            for (var j = 0; j < content['comments'][i].replies.length; j++) {


                if (content['comments'][i].replies[j].index == req.params.replyindex) {

                    content['comments'][i].replies[j].comment = req.params.comment;
                    user = content['comments'][i].replies[j].xurl;
                    reply = JSON.stringify(content['comments'][i].replies[j].comment);

                }
            }


        }
    }

    content = JSON.stringify(content);
    fs.writeFileSync("./archives/" + folder + "/" + req.params.post, content, 'utf8');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(JSON.parse('{\"result\":\"' + result + '\",\"reply\":' + reply + ',\"user\":\"' + user + '\"}'));

});

//Delete reply to a comment
router.delete('/post/:post/commentindex/:commentindex/replyindex/:replyindex/id/:id/request/:request', qauth.QAuthMiddleware, function (req, res) {

    //Get the content index.
    var contentJson = util.getContentIndex();

    var folder;
    var result = "success";

    for (var i = 0; i < contentJson.length; i++) {

        if (contentJson[i].content == req.params.post) {

            folder = contentJson[i].folder;
        }
    }

    //Read the content file
    let rawContent = fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8');
    let content = JSON.parse(rawContent);
    let user;

    //upodate the reply
    for (var i in content['comments']) {

        if (content['comments'][i].index == req.params.commentindex) {

            for (var j = 0; j < content['comments'][i].replies.length; j++) {


                if (content['comments'][i].replies[j].index == req.params.replyindex) {


                    content['comments'][i].replies.splice(parseInt(j), 1);

                    content = JSON.stringify(content);
                    fs.writeFileSync("./archives/" + folder + "/" + req.params.post, content, 'utf8');

                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.json(JSON.parse('{\"result\":\"' + result + '\",\"id\":\"' + req.params.id + '\"}'));

                    break;


                }

            }


        } else {
            var error_code = -1;

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(JSON.parse('{\"result\":' + error_code + '}'));
        }
    }



});

module.exports = router;
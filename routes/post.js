/**
         * All Things Server Side Post
         * Create, Edit, Delete
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/


'use strict';

var express = require('express');
var router = express.Router();
const fs = require('fs');
var multer = require('multer');
const path = require("path");
const util = require('../public/js/func/utility.js');

//QAuth athentication middleware
const qauth = require('../public/js/func/qauth');

const linkPreviewGenerator = require("link-preview-generator");
var imgext = "";
var today=null, date=null, seconds=null;

var storage = multer.diskStorage({

    destination: function (req, file, cb) {

        //Generate the time stamp
        today = new Date();
        seconds = new Date().getTime() / 1000;
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        req.seconds = seconds;
        req.date = date;

        //Check if today's folder exists
        if (!fs.existsSync('archives\\' + date)) {
            fs.mkdirSync('archives\\' + date);
        }

        // Uploads is the Upload_folder_name 
        cb(null, "archives/" + date)
    },
    filename: function (req, file, cb) {
        cb(null, 'photo-' + seconds + imgext)
    }
});

// Define the maximum size for uploading 
// picture i.e. 1 MB. it is optional 
const maxSize = 4 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        
        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        imgext = path.extname(file.originalname).toLowerCase();

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

    
});  

var editStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        //Get the content index.
        var contentJson = util.getContentIndex();
        var folder;

        for (var i = 0; i < contentJson.length; i++) {
            //console.log(contentJson[i].folder + '/' + contentJson[i].content);
            if (contentJson[i].content == req.params.post) {

                folder = contentJson[i].folder;

            }
        }

        // Uploads is the Upload_folder_name 
        cb(null, "archives/" + folder)
    },
    filename: function (req, file, cb) {
        var seconds = req.params.post.replace('content-', '');
        seconds = seconds.replace('.json', '');
        cb(null, 'photo-' + seconds + imgext)
    }
});

var editUpload = multer({
    storage: editStorage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {

        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        imgext = path.extname(file.originalname).toLowerCase();

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }
});  

var MAX_CONTENT_LENGTH_ACCEPTED = 5 * 1000 * 5000;

function maxLengthMiddleware(req, res, next) {
   
    if (req.params.body.length > MAX_CONTENT_LENGTH_ACCEPTED) {
        res.setHeader('Content-Type', 'application/json');
        res.json({result:"Content too big",status:400});
    } else {
        next();
    }
}

function getPreviewMiddleware(req, res, next) {

    var url = util.parseURL(req.params.url, "url");
    
    if (url != "undefined") {

        (async function () {
            const previewData = await linkPreviewGenerator(url);
            //console.log(previewData);
            if (previewData != "") {
                
                req.preview = '\"title\":\"' + util.formatContent(previewData.title, "Create") + '\", \"description\":\"' + util.formatContent(previewData.description, "Create") + '\", \"img\":\"' + previewData.img + '\"';
                next();

            } else {
                
                req.preview = '\"title\":\"", \"description\":"", \"img\":""';
                next();
            }

        })().catch(() => {
            
            req.preview = '\"title\":\"", \"description\":"", \"img\":""';
            next();
        });
    } else {
        req.preview = '\"title\":\"", \"description\":"", \"img\":""';
        next();
    }

    
    
}

function getEditPreviewMiddleware(req, res, next) {

    var url = util.parseURL(req.params.url, "url");

    let contents = fs.readFileSync('content.json', 'utf8');
    var contentJson = JSON.parse(contents);
    var post;

    for (var i = 0; i < contentJson.length; i++) {
        //console.log(contentJson[i].folder + '/' + contentJson[i].content);
        if (contentJson[i].content == req.params.post) {

            var folder = contentJson[i].folder;
            post = JSON.parse(fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8'));
        }
    }

    if (url != "undefined" && url != post.url) {

        (async function () {

            const previewData = await linkPreviewGenerator(url);
            //console.log(previewData);
            if (previewData != "") {

                req.preview = '{\"title\":\"' + util.formatContent(previewData.title, "Create") + '\", \"description\":\"' + util.formatContent(previewData.description, "Create") + '\", \"img\":\"' + previewData.img + '\"}';
                next();

            } else {

                req.preview = '{\"title\":\"", \"description\":"", \"img\":""}';
                next();
            }

        })().catch(() => {

            req.preview = '{\"title\":\"", \"description\":"", \"img\":""}';
            next();
        });
    } else if (url == "undefined") {
        req.preview = '{\"title\":\"", \"description\":"", \"img\":""}';
        next();

    } else {
        req.preview = "unchanged";
        next();
    }


}

//Create a post
router.post('/body/:body/url/:url/request/:request/authToken/:authToken/accessToken/:accessToken', qauth.QAuthMiddleware, maxLengthMiddleware, getPreviewMiddleware, upload.single("File"), function (req, res, next) {
    
    //Check for file upload
    var photo = '';
    if (typeof req.file !== "undefined")
        photo = date + "/" + req.file.filename;
    else {
        photo = '';

        //Generate the time stamp
        today = new Date();
        seconds = new Date().getTime() / 1000;
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    }

    //Decode the url parameters
    var body = util.decodeParam(req.params.body);
    var url = util.decodeParam(req.params.url);
          
    
        //Check if today's folder exists
        if (!fs.existsSync('archives\\' + date)) {
            fs.mkdirSync('archives\\' + date);
        }
    
        try {
            fs.writeFileSync('archives\\' + date + '\\content-' + seconds + '.json', util.serializeContent(body, url, req.preview, photo, seconds, req.params.request, "Create"), 'utf8');
        } catch (e) {
            util.writeLog("error", e);

        }
        
        //Get the content index.
        var contentJson = util.getContentIndex();

        if (contentJson < 0) {

            try {

                var newIndexArray = JSON.parse('[]');
                newIndexArray.push({ "folder": date, "content": 'content-' + seconds + '.json' });
                var content = JSON.stringify(newIndexArray);

                fs.writeFileSync('content.json', content, 'utf8');
            } catch (e) {
                util.writeLog("error", e);

            }

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({result:"success",status:200});

        } else {

            contentJson.push({ "folder": date, "content": 'content-' + seconds + '.json' });
            var content = JSON.stringify(contentJson);

            try {
                fs.writeFileSync('content.json', content, 'utf8');
            } catch (e) {
                util.writeLog("error", e);

                
            }

            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({ result: "success", status: 200 });

        }

    
});

//Get the content for the edit dialog box
router.get('/content/:content/request/:request/authToken/:authToken/accessToken/:accessToken', qauth.QAuthMiddleware, function (req, res) {
    
    let contentJson = util.getContentIndex();
    var content = util.findFile(contentJson, req.params.content);


    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.json(content);

});

//Edit the post
router.post('/post/:post/body/:body/url/:url/request/:request/authToken/:authToken/accessToken/:accessToken', qauth.QAuthMiddleware, maxLengthMiddleware, getEditPreviewMiddleware, editUpload.single("File"), function (req, res) {

    //Variable definitions
    var body;
    var url;

    //Server side data validation
    if (req.params.body == "undefined")
        body = "";
    else
        body = req.params.body

    if (req.params.url == "undefined")
        url = "";
    else
        url = req.params.url;

    //Get the content index.
    var contentJson = util.getContentIndex();

    //Find the folder where the post is
    for (var i = 0; i < contentJson.length; i++) {

        if (contentJson[i].content == req.params.post) {

            var folder = contentJson[i].folder;
            var post = JSON.parse(fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8'));

            //Edit photo
            if (typeof req.file !== "undefined") {
                if (post.photo == '') {

                    post.photo = folder + "/" + req.params.post.replace('content-', 'photo-').replace('json', imgext.substr(1));


                } else {
                    var photo = post.photo;
                    var photoext = photo.substr(photo.length - 3);

                    if (photoext != imgext.substr(1)) {

                        fs.unlink("./archives/" + post.photo, (err) => {

                            if (err) {
                                util.writeLog("error", "failed to delete photo from archives:" + err);
                            }
                        });

                        post.photo = post.photo.substr(0, post.photo.length - 3) + imgext.substr(1);
                        imgext = "";

                    }
                }
            }


            if (url != '') {
                post.url = url;
            } else
                post.url = "";

            post.body = body;

            //url preview
            if (req.preview != "unchanged") {
                
                var preview = JSON.parse(req.preview);

                post.preview.title = preview.title;
                post.preview.description = preview.description;
                post.preview.img = preview.img;
            }

            post = JSON.stringify(post);
            fs.writeFileSync("./archives/" + folder + "/" + req.params.post, post, 'utf8');
            post = JSON.parse(post);


            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({result:"success", content: post });

        }
    }

});

//Delete a photo from the post
router.delete('/photo/post/:post/request/:request/authToken/:authToken/accessToken/:accessToken', qauth.QAuthMiddleware, function (req, res) {


    //Get the content index.
    var contentJson = util.getContentIndex();

    //Find the folder where the post is
    for (var i = 0; i < contentJson.length; i++) {

        if (contentJson[i].content == req.params.post) {

            var folder = contentJson[i].folder;
            var postJson = JSON.parse(fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8'));

            var photo = postJson.photo;
            postJson.photo = "";

            fs.unlink("./archives/" + photo, (err) => {

                if (err) {
                    util.writeLog("error", "failed to delete photo from archives:" + err);
                }
            });

            var post = JSON.stringify(postJson);
            fs.writeFileSync("./archives/" + folder + "/" + req.params.post, post, 'utf8');

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({ result: "success", content: post });
        }
    }


});

//Delete a post
router.delete('/post/:post/request/:request/authToken/:authToken/accessToken/:accessToken', qauth.QAuthMiddleware, function (req, res) {

    //The req object has the name of the content file to delete which is also in the content.json index.
    //delete the file and the reference in the index.
    var contentJson = util.getContentIndex();

    for (var i = 0; i < contentJson.length; i++) {
        //console.log(contentJson[i].folder + '/' + contentJson[i].content + " : " + req.params.post);
        if (contentJson[i].content == req.params.post) {

            //get the content folder
            var folder = contentJson[i].folder;

            //delete any photos
            var postJson = JSON.parse(fs.readFileSync("./archives/" + folder + "/" + req.params.post, 'utf8'));
            var photo = postJson.photo;
            if (photo != "") {
                fs.unlink("./archives/" + photo, (err) => {

                    if (err) {
                        util.writeLog("error", "failed to delete photo from archives:" + err);
                    }
                });
            }

            //delete the content json file
            fs.unlink("./archives/" + folder + "/" + req.params.post, (err) => {

                if (err) {
                    util.writeLog("error", "failed to delete post from archives:" + err);
                }
            });

            //remove the post from the content index
            fs.writeFileSync('content.json', util.deletePostIndex(contentJson, req.params.post), 'utf8');


        }
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({result:200});

});

module.exports = router;
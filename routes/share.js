
/**
         * All Things Server Side Share
         * Create, Edit, Delete
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/
'use strict';
var express = require('express');
var router = express.Router();
const util = require('../public/js/func/utility');

//QAuth athentication middleware
const qauth = require('../public/js/func/qauth');

router.get('/content/:content/request/:request', function (req, res) {

    //Get the content index.
    var contentJson = util.getContentIndex();

    var folder;
       
    for (var i = 0; i < contentJson.length; i++) {

        if (contentJson[i].content == req.params.content) {

            folder = contentJson[i].folder;
        }
    }
    
   
    res.download(process.cwd() + '\\archives\\' + folder + '\\' + req.params.content , req.params.content, function (err) {
        if (err) {
            // Handle error, but keep in mind the response may be partially-sent
            // so check res.headersSent
            util.writeLog("error", err);
        } else {
            // decrement a download credit, etc.
        }
    });


    
});



module.exports = router;
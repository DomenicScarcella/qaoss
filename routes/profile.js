
/**
         * All Things Server Side for managaing the profile
         * Create, Edit, Delete
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/
'use strict';
var express = require('express');
var router = express.Router();
var multer = require('multer');
const path = require("path");
const fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        // Uploads is the Upload_folder_name 
        cb(null, "public/images")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + ".jpg")
    }
})

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

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

    // mypic is the name of file attribute 
});

//QAuth athentication middleware
const qauth = require('../public/js/func/qauth');

router.post('/', qauth.QAuthMiddleware, upload.any("Profile"), function (req, res, next) {

    
    let config = fs.readFileSync(process.cwd() + '/config/config.json', 'utf8');        
    let JSONConfig = JSON.parse(config);
        
    if (req.body.ProfileAlias != '')
        JSONConfig.alias = req.body.ProfileAlias;
    if (typeof req.body.ProfileGroup === 'undefined') {
        JSONConfig.group = "0";
       
    }
    else if (req.body.ProfileGroup == 'on') {
        JSONConfig.group = "1";
        
    }

    try {
        fs.writeFileSync(process.cwd() + '/config/config.json', JSON.stringify(JSONConfig), 'utf8');
    } catch (e) {
        util.writeLog("error", e);

    }

    res.redirect('/');

});
module.exports = router;
/**
         * Utility functionality
         *
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/


const fs = require('fs');
const core = require(process.cwd() + '/public/js/func/core.js');


module.exports = {

    decodeParam: function (param) {

        if (param == "undefined")
            return "";
        else {
            return param;

        }
    },

    writeLog: function (type, data) {

        var today = new Date();
        var seconds = new Date().getTime() / 1000;
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        if (fs.existsSync('logs\\' + date))
            fs.writeFileSync('logs\\' + date + '\\' + type + '-' + seconds + '.log', data, 'utf8');
        else {
            if (fs.existsSync('logs\\')) {
                fs.mkdirSync('logs\\' + date);
                fs.writeFileSync('logs\\' + date + '\\' + type + '-' + seconds + '.log', data, 'utf8');
            }
            else {
                fs.mkdirSync('logs\\');
                fs.mkdirSync('logs\\' + date);
                fs.writeFileSync('logs\\' + date + '\\' + type + '-' + seconds + '.log', data, 'utf8');
            }

        }


    },

    readFile: function (file, format) {
        try {

            return fs.readFileSync(file, format);

        } catch (e) {

            module.exports.writeLog("Error reading to file: " + file + " : " + e);
            return -1;

        }

    },

    writeFile: function (file, content, format) {

        try {
            fs.writeFileSync(file, content, format);
            return 1;
        } catch (e) {
            module.exports.writeLog("Error writing to file: " + file + " : " + e);
            return -1;
        }

    },

    clearOptions: function (file) {

        let rawContent = module.exports.readFile("./archives/shares/" + file, 'utf8');
        
        if (rawContent != "") {
            let content = JSON.parse(rawContent);

            for (var x = content.likes.length - 1; x >= 0; x--) {

                content.likes.splice(x, 1);

            }

            for (var x = content.comments.length - 1; x >= 0; x--) {

                content.comments.splice(x, 1);

            }

            content = JSON.stringify(content);
            if (module.exports.writeFile("./archives/shares/" + file, content, 'utf8') > 0) {
                return 1;
            } else {
                module.exports.writeLog("Error", "Error reading file: " + "./archives/shares/" + file);
                return -1;
            }
        } else {
            module.exports.writeLog("Error", "Error reading file: " + "./archives/shares/" + file);
            return -1;
        }

    },

    parseURL: function (content, part) {

        var urlRegex = /(https?:\/\/[^ ]*)/;
        if (part == "url") {

            if (content.match(urlRegex) != null) {

                return content.match(urlRegex)[1];

            } else
                return "undefined";

        } else {
            if (content.match(urlRegex) != null)

                return content.substr(0, content.match(urlRegex).index - 1);
            else
                return content;

        }



    },

    deletePostIndex: function (json, post) {

        if (json.length == 1) {
            return '[]';
        } else {
            for (var i = 0; i < json.length; i++) {
                //find the object to delete

                if (json[i].content == post) {

                    var newJson = '[';
                    for (var j = 0; j < json.length; j++) {
                        //rebuild the content.json without the ith object
                        if (j != i) {

                            newJson += JSON.stringify(json[j]) + ',';
                        }


                    }

                }
            }
            //remove the trailing comma
            newJson = newJson.substr(0, newJson.length - 1);

            return newJson += ']';
        }

    },
    deleteMessageIndex: function (json, post) {

        if (json.length == 1) {
            return '[]';
        } else {
            for (var i = 0; i < json.length; i++) {
                //find the object to delete

                if (json[i].content == post) {

                    var newJson = '[';
                    for (var j = 0; j < json.length; j++) {
                        //rebuild the content.json without the ith object
                        if (j != i) {

                            newJson += JSON.stringify(json[j]) + ',';
                        }


                    }

                }
            }
            //remove the trailing comma
            newJson = newJson.substr(0, newJson.length - 1);

            return newJson += ']';
        }

    },
    deleteMessageQueueIndex: function (json, post) {

        if (json.length == 1) {
            return '[]';
        } else {
            for (var i = 0; i < json.length; i++) {
                //find the object to delete

                if (json[i].content == post) {

                    var newJson = '[';
                    for (var j = 0; j < json.length; j++) {
                        //rebuild the content.json without the ith object
                        if (j != i) {

                            newJson += JSON.stringify(json[j]) + ',';
                        }


                    }

                }
            }
            //remove the trailing comma
            newJson = newJson.substr(0, newJson.length - 1);

            return newJson += ']';
        }

    },
    getContentIndex: function () {

        if (fs.existsSync(process.cwd() + '/content.json')) {
            let contents = fs.readFileSync(process.cwd() + '/content.json', 'utf8');

            if (contents == '[]') {
                return -1;
            } else {
                return JSON.parse(contents);
            }
        } else
            return -2;
    },

    getMessageIndex: function () {

        if (fs.existsSync(process.cwd() + '/messages.json')) {
            let contents = fs.readFileSync(process.cwd() + '/messages.json', 'utf8');
            if (contents == '') {
                return -1;
            } else {
                return JSON.parse(contents);
            }
        } else
            return -2;
    },

    getMessageQueueIndex: function () {

        if (fs.existsSync(process.cwd() + '/messagequeue.json')) {
            let contents = fs.readFileSync(process.cwd() + '/messagequeue.json', 'utf8');
            if (contents == '') {
                return -1;
            } else {
                return JSON.parse(contents);
            }
        } else
            return -2;
    },

    findFile: function (contentJson, file) {

        for (var i = 0; i < contentJson.length; i++) {
            //console.log(contentJson[i].folder + '/' + contentJson[i].content);
            if (contentJson[i].content == file) {

                var folder = contentJson[i].folder;
                return JSON.parse(fs.readFileSync("./archives/" + folder + "/" + file, 'utf8'));

            }
        }
    },

    isAuthorized: function (friend, authToken, accessToken) {
        var peers = JSON.parse(module.exports.getPeers());

        for (var i = 0; i < peers.length; i++) {

            if (peers[i].xurl == friend) {

                if (peers[i].authToken === accessToken && peers[i].accessToken === authToken) {
                   
                    return true;
                }

            }

        }
        return false;
    },

    checkNewMessage: function () {

        var messagesJson = module.exports.getMessageIndex();
        if (messagesJson < 0) {

            //Error handling here
            

        } else {
            for (var index = 0; index < messagesJson.length; index++) {

                message = fs.readFileSync(process.cwd() + '/messages/' + messagesJson[index].folder + '/' + messagesJson[index].content, 'utf8');

                if (JSON.parse(message).preview.read == 0) {
                    return 1;
                } 
            }
            return 0;

            
        }
    },
    checkNewRequest: function () {

        var messagesJson = module.exports.getMessageIndex();
        if (messagesJson < 0) {

            //Error handling here


        } else {
            var count = 0;
            for (var index = 0; index < messagesJson.length; index++) {

                message = fs.readFileSync(process.cwd() + '/messages/' + messagesJson[index].folder + '/' + messagesJson[index].content, 'utf8');

                if (JSON.parse(message).preview.read == 2) {
                    count++;
                }
            }
            
            return count;


        }
    },

    getContent: function () {

        if (fs.existsSync(process.cwd() + '/content.json')) {
            let contents = fs.readFileSync(process.cwd() + '/content.json', 'utf8');
            if (contents == '') {
                return '';
            } else {
                var contentJson = JSON.parse(contents);

                //build the include paths
                var content = '';
                for (var i = 1; i <= contentJson.length; i++) {


                    content += fs.readFileSync(process.cwd() + '/archives/' + contentJson[contentJson.length - i].folder + '/' + contentJson[contentJson.length - i].content, 'utf8') + ',';

                }

                //trim the trailing comma and put it in a json array.
                content = '[' + content.substr(0, content.length - 1) + ']';

                return JSON.parse(content);

            }
        } else {
            return '';
        }

    },

    getPeers: function () {
        if (fs.existsSync(process.cwd() + '/peers.json')) {
            return fs.readFileSync(process.cwd() + '/peers.json', 'utf8');
        }
    },

    getUserAlias: function (url) {

        let peers = fs.readFileSync(process.cwd() + '/peers.json', 'utf8');
        var peersJson = JSON.parse(peers.trim());

        if (peersJson.length > 0) {

            for (var i = 0; i < peersJson.length; i++) {

                if (peersJson[i].xurl == url) {
                    return peersJson[i].alias;
                }
            }

            //res.send(contents);


        }
        return "";



    },

    formatContent: function (content, mode) {

        if (mode === 'Create') {
            
            return content.replace(/(\r\n|\n|\r)/gm, "\\n").replace(/\t/g, "   ").replace(/"/g, '\\"');
        }
        else
            return content.replace(/(\\r\\n|\\n|\\r)/gm, "\\n").replace(/\t/g, "   ");
    },

    serializeContent: function (body, url, preview, photo, seconds, xurl, mode) {
        
        body = module.exports.formatContent(body, mode);
        
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var content = '{"body":"' + body + '","photo":"' + photo + '","url":"' + url + '","xurl": "' + xurl + '","preview":{' + preview + '},"date":"' + date.toString() + ' ' + time + '","likes":[],"comments":[] ,"name":"content-' + seconds + '.json"}';
        
        return content;
    },

    getShares: function (res, alias, request, ngrok_url, group) {

        //Get the content index.
        //If it's -1 then it's empty, if it's -2 then the file doesn't exist
        var contentJson = module.exports.getContentIndex();
        var found = false;

        if (contentJson < 0) {
            
            module.exports.writeFile('content.json', '[]', 'utf8');
            contentJson = JSON.parse('[]');
           
            fs.readdir(process.cwd() + '/archives/shares', function (err, files) {

                if (err) {
                    module.exports.writeLog("error", "Error reading shares directory in index.js: " + err);

                } else {
                    for (var x = 0; x < files.length; x++) {

                        for (var y = 0; y < contentJson.length; y++) {
                            if (contentJson[y].content == files[x]) {

                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            contentJson.push({ "folder": "shares", "content": files[x] });
                           
                            //Need to zero out the likes and comments arrays
                            if (module.exports.clearOptions(files[x]) < 0) {
                                module.exports.writeLog("Error", "Couldn't clear options in shares");
                            }

                        } else
                            found = false;

                    }
                    var content = JSON.stringify(contentJson);
                    module.exports.writeFile('content.json', content, 'utf8');
                    
                    core.getRequest(res, core.getContent(), module.exports.checkNewMessage(), module.exports.checkNewRequest(), alias, request, ngrok_url, group);
                    return 1;

                }
            });


        } else {
            
            fs.readdir(process.cwd() + '/archives/shares', function (err, files) {

                if (err) {
                    module.exports.writeLog("error", "Error reading shares directory in index.js: " + err);

                } else {
                    for (var x = 0; x < files.length; x++) {

                        for (var y = 0; y < contentJson.length; y++) {
                            if (contentJson[y].content == files[x]) {

                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            contentJson.push({ "folder": "shares", "content": files[x] });

                            //Need to zero out the likes and comments arrays
                            if (module.exports.clearOptions(files[x]) < 0) {
                                module.exports.writeLog("Error", "Couldn't clear options in shares");
                            }

                        } else
                            found = false;

                    }
                    var content = JSON.stringify(contentJson);
                    module.exports.writeFile('content.json', content, 'utf8');
                   
                    //Load the local timeline.
                    core.getRequest(res, core.getContent(), module.exports.checkNewMessage(), module.exports.checkNewRequest(), alias, request, ngrok_url, group);

                    return 1;

                }
            });
        }

    }
}

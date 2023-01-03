/**
         * All Things Core to Qaoss
         *
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

const fs = require('fs');
const config = require(process.cwd() + '/config/config.json');


module.exports = {

    parseURL: function (url) {

        var urlRegex = /(https?:\/\/[^ ]*)/;
        if (url.match(urlRegex) != null)
            return url.match(urlRegex)[1];
        else
            return '';


    },

    deletePostIndex:function(json, post) {

        if (json.length == 1) {
            return '';
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

    getContent: function(){

        if (fs.existsSync(process.cwd() + '/content.json')) {
            let contents = fs.readFileSync(process.cwd() + '/content.json', 'utf8');
            var seconds = new Date().getTime() / 1000
            
            if (contents == '') {
                return '';
            } else {
                var contentJson = JSON.parse(contents);
               
                //build the include paths
                var content = '';
                for (var i = 1; i <= contentJson.length; i++) {

                    content += fs.readFileSync(process.cwd() + '/archives/' + contentJson[contentJson.length - i].folder + '/' + contentJson[contentJson.length - i].content, 'utf8') + ',';
                    if (i == 2) break;
                }

                //trim the trailing comma and put it in a json array.
                content = '[' + content.substr(0, content.length - 1) + ']';
                
                return JSON.parse(content);

            }
        } else {
            return '';
        }

    },
    getMessages: function () {

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
                    if (i == 2) break;
                }

                //trim the trailing comma and put it in a json array.
                content = '[' + content.substr(0, content.length - 1) + ']';

                return JSON.parse(content);

            }
        } else {
            return '';
        }

    },

    getFeed: function (index, group) {

        if (fs.existsSync(process.cwd() + '/content.json')) {
            let contents = fs.readFileSync(process.cwd() + '/content.json', 'utf8');
            if (contents == '') {
                return '';
            } else {
                var contentJson = JSON.parse(contents);

                //build the include paths
                var content = '';

                if (index < contentJson.length) {
                    content += fs.readFileSync(process.cwd() + '/archives/' + contentJson[(contentJson.length - 1) - index].folder + '/' + contentJson[(contentJson.length - 1) - index].content, 'utf8') + ',';

                    //trim the trailing comma and put it in a json array.
                    content = '[' + content.substr(0, content.length - 1) + ',{\"group\":' + group + '}]';
                } else {
                    //trim the trailing comma and put it in a json array.
                    content = '[]';
                }

                return JSON.parse(content);

            }
        } else {
            return '';
        }

    },

    getPeers: function () {

        return JSON.parse(fs.readFileSync(process.cwd() + '/peers.json', 'utf8'));
    },

    loadMain: function (res) {

        //Run an integrity check on the content index and archives folder
        //Any index entry that doesn't exist in the folder must be deleted and logged
        //Anything in the archives folder that isn't in the index needs to be added to the index
        //
        /*add logic here*/
        //

        if (fs.existsSync(process.cwd() + '/peers.json')) {
            //let peers = fs.readFileSync(process.cwd() + '/peers.json', 'utf8');
            var peersJson = module.exports.getPeers();

            if (peersJson.length > 0) {

            // Render the local framework - left and right columns
            //
            // url: ngork url of the local user from config.json
            // alias: alias of the local user from config.json
            // peers: peers list from peers.json
            // port: port the app is running on from config.json
            // request: nogrok url of the requesting client from config.json
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.render('Framework', { 'url': config.subdomain, 'alias': config.alias, 'peers': peersJson, 'port': config.port, 'request': config.subdomain, 'group': config.group});

            } else {
                let peers0 = '[{ \"url\": \"users\", \"alias\": \"No Friends\" }]';
                var peersJson0 = JSON.parse(peers0);
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.render('Framework', { 'url': config.subdomain, 'alias': config.alias, 'peers': peersJson0, 'port': config.port, 'group': config.group});
            }
        } else {
            let peers = '[{ \"url\": \"users\", \"alias\": \"No Friends\" }]';
            var peersJson = JSON.parse(peers);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.render('Framework', { 'url': config.subdomain, 'alias': config.alias, 'peers': peersJson, 'port': config.port, 'group': config.group});
        }


    },


    getRequest: function (res, contents, message, friend, alias, request, local, group) {
       
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
       
        res.json(JSON.parse('{\"contents\":' + JSON.stringify(contents) + ',\"message\":\"' + message + '\", \"friend\":\"' + friend + '\",\"port\":\"' + config.port  + '\",\"alias\":\"' + alias + '\",\"request\": \"' + request + '\",\"local\":\"' + local +'\",\"group\":\"' + group +'\"}'));
        
    },

    formatContent: function (content) {

        return content.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>").replace(/\r/g, "<br>").replace(/\t/g, "   ")
    },

    serializeContent: function(title, content, seconds) {

        var url = module.exports.parseURL(content);

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var content = '{"header":"' + title + '","body":"' + content + '","url":"' + module.exports.parseURL(content) + '","date":"' + date.toString() + ' ' + time + '","likes":"0","comments":[] ,"name":"content-' + seconds + '.json"}';

        return module.exports.formatContent(content);
    }
    
}

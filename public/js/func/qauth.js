/**
         * Qaoss Authentication Middleware
         * Prevent accessing resources from outside the context of Qaoss
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/


const requestIp = require('request-ip');
const util = require(process.cwd() + '/public/js/func/utility.js');

module.exports = {

    isLocalClient: function (req) {

        if (requestIp.getClientIp(req) == '::ffff:127.0.0.1' || requestIp.getClientIp(req) == '::1' || requestIp.getClientIp(req) == '127.0.0.1') {
            return true;

        } else {
            return false;
        }

    },

    QAuthMiddleware: function (req, res, next) {
        console.log('base url: ' + req.baseUrl + ' path: ' + req.path);
        var isAuthorized = false;
        var baseUrl = req.baseUrl;
        var path = req.path;
        var paths = ["/post", "/feed", "/comments", "/likes", "/messages", "/peers", "/profile", "/share"];
        
        //Is it a request to load the framework and the local timeline
        if (req.path == '/' || req.path == '/local') {

            //Being made by the local client
            if (module.exports.isLocalClient(req)) {
                isAuthorized = true;
            } 
        //Is it a request from a remote peeer to load the timeline?
        } else {
            if (path == "/remote/") {

                var request = req.query.origin;
                var authToken = req.query.authToken;
                var accessToken = req.query.accessToken;
                var peers = JSON.parse(util.getPeers());


                for (var i = 0; i < peers.length; i++) {

                    if (peers[i].xurl == request) {

                        if (peers[i].authToken === accessToken && peers[i].accessToken === authToken) {
                            isAuthorized = true;
                            break

                        }

                    }

                }

            }else {
                //Is it the local client requesting something?
                if (module.exports.isLocalClient(req)) {
                    isAuthorized = true;

                } else { //Is it a remote client requesting something?
                   
                    for (var i = 0; i < paths.length; i++) {
                       
                        if (baseUrl == paths[i]) {
                            
                            var request = req.params.request;
                            var peers = JSON.parse(util.getPeers());

                            //Since remote users are allowed to post functionalities in groups
                            //if it's a remote user then the qauth tokens will come 
                            //in the query string rather than in the payload
                            //othewise they'll be 'undefined'
                            var authToken;
                            var accessToken;

                            if (baseUrl === "/post") {
                                
                                authToken = req.params.authToken;
                                accessToken = req.params.accessToken;

                            } else {

                                authToken = req.body.authToken;
                                accessToken = req.body.accessToken;

                            }
                            
                            for (var j = 0; j < peers.length; j++) {
                                
                                if (peers[j].xurl == request) {

                                    if (peers[j].authToken === accessToken && peers[j].accessToken === authToken) {
                                        isAuthorized = true;
                                        break

                                    }

                                }

                            }

                        }

                    }

                }
            }
  
        }
        //isAuthorized = true;
        if (isAuthorized) {
            
            next();
        }
        else {
            
           res.sendStatus(403);
        }   
        
    }

   
}


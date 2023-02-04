/**
         * Sanitize the JSON object's data structure and types upon request
         *
         *
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

//List of properties to expect
var contentPropArray = ['alias', 'friend', 'group', 'local', 'message', 'port', 'request', 'contents'];
var postPropArray = ['body', 'photo', 'url', 'xurl', 'preview', 'date', 'likes', 'comments', 'name'];
var previewPropArray = ['title', 'description', 'img'];
var likesPropArray = ['user'];
var commentsPropArray = ['comment', 'user', 'xurl', 'index', 'replies'];
var repliesPropArray = ['comment', 'xurl', 'index'];

// Ensure only the expected properties are present
// Ensure the expected data structures are correct
// Ensure the expected data types are correct
// Ensure there is no scripting
// Pass expected list of properties
// returns obj or null
function metaDataCheck(parsedObj) {

    let contentsArray = null;
    let likesArray = null;
    let commentsArray = null;
    let repliesArray = null;
    var safeContent = {};
    let result = 1;
   
     
    //Returned contents should be a JSON object
    if (Object.prototype.toString.call(parsedObj)) {
       //Iterate over the properties in the JSON object
        contentPropArray.forEach(function (prop) {
            //If the property is present
            if (parsedObj.hasOwnProperty(prop)) {
                //Contents sould be a JSON array of JSON objects
                if (prop === "contents") {
                    //Contents should be an array
                    if (Array.isArray(parsedObj[prop])) {                       
                        //Iterate over the contents array
                        contentsArray = parsedObj[prop];
                        contentsArray.forEach(function (obj) {
                            //Iterate over the post properties
                            postPropArray.forEach(function (prop) {
                                //If it exists
                                if (obj.hasOwnProperty(prop)) {
                                    if (prop === 'likes') {
                                        //Likes should be an array
                                        if (Array.isArray(obj[prop])) {
                                            likesArray = obj[prop];
                                            //iterate through the likes array
                                            if (likesArray.length > 0) {
                                                likesArray.forEach(function (like) {
                                                    likesPropArray.forEach(function (prop) {
                                                        if (like.hasOwnProperty(prop)) {
                                                            if (typeof like[prop] !== 'string') {
                                                                alert('The requested data is missing the ' + prop + ' property. Error Code 5');
                                                                result = -1;
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        } else {
                                            alert('Likes should be an array. Error Code 4');
                                            result = -1;
                                        }

                                    } else if (prop === 'comments') {
                                        //Comments should be an array
                                        if (Array.isArray(obj[prop])) {
                                            commentsArray = obj[prop];
                                            //iterate over the comments array
                                            if (commentsArray.length > 0) {
                                                commentsArray.forEach(function (comment) {
                                                    commentsPropArray.forEach(function (prop) {
                                                        if (comment.hasOwnProperty(prop)) {
                                                            if (prop === 'index' && typeof comment[prop] !== 'number') {
                                                                alert('Comment index should be a number. Error Code 11');
                                                                result = -1;
                                                            } else if (prop === 'replies') {
                                                                //Replies should be an array
                                                                if (Array.isArray(comment[prop])) {
                                                                    repliesArray = comment[prop]
                                                                    if (repliesArray.length > 0) {
                                                                        //Iterate over the replies
                                                                        repliesArray.forEach(function (reply) {
                                                                            repliesPropArray.forEach(function (prop) {
                                                                                if (reply.hasOwnProperty(prop)) {
                                                                                    if (prop === 'index' && typeof reply[prop] !== 'number') {
                                                                                        alert('Reply index should be a number. Error Code 13');
                                                                                        result = -1;
                                                                                    } else if (prop !== 'index' && typeof reply[prop] !== 'string') {
                                                                                        alert('Reply data should be string. Error Code 9');
                                                                                        result = -1;
                                                                                    }
                                                                                } else {
                                                                                    alert('Replies array is missing the ' + prop + ' property. Error Code 8');
                                                                                    result = -1;
                                                                                }
                                                                            });
                                                                        });
                                                                    }
                                                                } else {
                                                                    alert('Replies should be an array. Error Code 7');
                                                                    result = -1;
                                                                }
                                                            }
                                                        } else {
                                                            alert('The requested data is missing the ' + prop + ' property. Error Code 6');
                                                            result = -1;
                                                        }
                                                    });
                                                });
                                            }

                                        } else {
                                            alert('Comments should be an array. Error Code 10');
                                            result = -1;
                                        }
                                    } else if (prop === 'preview') {
                                        if (!Object.prototype.toString.call(obj[prop])) {
                                            alert('Preview should be object. Error Code 14');
                                            result = -1;
                                        } else {
                                            let previewObject = obj[prop];
                                            previewPropArray.forEach(function (prop) {
                                                if (typeof previewObject[prop] !== 'string') {
                                                    alert('Preview property ' + prop + ' should be a string. Error Code 15');
                                                    result = -1;
                                                }
                                            });
                                        }

                                    } else if (typeof obj[prop] !== 'string') {
                                            alert('Reponse content property ' + prop + ' should be string. Error Code 12');
                                            result = -1;                                        
                                    }

                                } else {

                                    alert('The requested data is missing the ' + prop + ' property. Error Code 2');
                                    result = -1;
                                }
                            });

                        });

                    } else {

                        alert('Contents should be an array. Error Code 3');
                        result = -1;
                    }

                } else {

                }
            } else {
                alert('The requested data is missing the ' + prop + ' property. Error Code 1');
                result = -1;
            }
        });

    } else {
      //Not a JSON object
        alert('The requested data object is not in the correct format. Error Code 0');
        result = -1;
        
    }

    return result;
    
}
     
            
       
    
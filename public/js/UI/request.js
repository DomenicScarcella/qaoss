/**
         * Request a friend's timeline
         * 
         *
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

$(document).ready(function () {
    $('[id = "friends-list"], [id = "groups-list"]').on("click", '[id ^= "peer"]', function () {
       
        if(event != undefined)
            event.preventDefault();
        
        let url = this.getAttribute('href');
        let peer = this.getAttribute('id');
        let alias = this.getAttribute('alias');
        let remote = this.getAttribute('remote');
       
        let i = url.toString().indexOf('?');
        let querystring=url.toString().substr(i);
        let urlParams = new URLSearchParams(querystring);

        //qauth tokens
        let authToken = urlParams.get('authToken');
        let accessToken = urlParams.get('accessToken');

        //Set the authentication data payload for all remote posts, comments, likes, edits and delete requests after the initial get.
        //The initial Get already has the tokens in the url.
        //This is to prevent malicious access using an API client like Postman or something else. 
        //The peers have to be friends and send the correct qauth token pair.
        data = { authToken: authToken, accessToken: accessToken };

        //Check remote server availability
        let img = document.body.appendChild(document.createElement("img"));
        img.src = remote + '/images/profile.jpg';
        
        img.onerror = function () {
            alert(alias + ' is currently offline');
        };
        
        var origin = $('#content').attr('origin');
       
        //Get the remote timeline
        $.get(url, function (content) {

            
            if (content.result == -1) {
                alert("You are not a registered contact");
            } else {
                //Need to sanitize the content before displaying
                //first check the correct properties, correct data structures and property types
                //Then sanitize for malicious html and scripting
                if (metaDataCheck(content) == 1) {

                    $("#content").empty();
                    var alias = content.alias;
                    var profile = false;

                    if (content.contents != '') {
                        for (var index = 0; index < 2; index++) {

                            //variables
                            var like, comment, edits;
                            var anchorImg;
                            var commentsList = "";

                            //Get the post properties
                            var request = content.local;
                            var liked = content.contents[index].likes;
                            var name = content.contents[index].name;

                            //Append any photos to the body of the post
                            var photo = content.contents[index].photo;
                            var body;
                            if (photo != "")
                                body = content.contents[index].body + "<br><br><a href=" + remote + '/' + photo + "><img src=" + remote + '/' + photo + " width=750 height=450></a>";
                            else
                                body = content.contents[index].body

                            var url = content.contents[index].url;
                            var prevImg = content.contents[index].preview.img;
                            var prevTitle = content.contents[index].preview.title;
                            var prevDesc = content.contents[index].preview.description;
                            var date = content.contents[index].date;
                            var likes = content.contents[index].likes.length;
                            var comments = content.contents[index].comments;
                            var xurl = content.contents[index].xurl;


                            if (content.group == 0) {
                                if (profile == false) {
                                    profile = true;
                                    $("#content").append(htmlProfile(request, alias, remote, peer, 0));
                                }

                                edits = "<div></div>" +
                                    "<div class='post-header'></div>" +
                                    "<div class='post-header'>" + xurl + "</div>" +
                                    "<div class='post-header'>" +
                                    "<span class='dialog-form" + index + "' style='display:none' title='Edit Post'>" +
                                    "<div class='grid-container-dialog'>" +
                                    "<div>" +
                                    "<textarea class='textarea-edit-post' style='border: none' name='edit-body" + index + "' id='edit-body" + index + "'> " + body + "</textarea>" +
                                    "</div>" +
                                    "</div>" +
                                    "</span>" +
                                    "</div>";
                            } else {

                                if (profile == false) {
                                    profile = true;
                                    $("#content").append(htmlProfile(request, alias, remote, peer, 1));
                                }

                                //If the requester made the post on the group timeline allow him to edit it
                                if (origin == xurl) {
                                    edits = "<div></div>" +
                                        "<div class='post-header'></div>" +
                                        "<div class='post-header'>" + xurl + "</div>" +
                                        "<div class='post-header'>" +
                                        "<span class='context-menu-one' id='context-menu-" + index + "' value={\"post\":\"" + name + "\",\"request\":\"" + request + "\",\"origin\":\"" + origin + "\"}><i class='fas fa-ellipsis-h'></i></span>" +
                                        "<span class='dialog-form" + index + "' style='display:none' title='Edit Post'>" +
                                        "<div class='grid-container-dialog'>" +
                                        "<div>" +
                                        "<textarea class='textarea-edit-post' style='border: none' name='edit-body" + index + "' id='edit-body" + index + "'> " + body + "</textarea>" +
                                        "</div>" +
                                        "</div>" +
                                        "</span>" +
                                        "</div>";
                                } else {
                                    edits = "<div></div>" +
                                        "<div class='post-header'></div>" +
                                        "<div class='post-header'>" + xurl + "</div>" +
                                        "<div class='post-header'>" +
                                        "<span class='dialog-form" + index + "' style='display:none' title='Edit Post'>" +
                                        "<div class='grid-container-dialog'>" +
                                        "<div>" +
                                        "<textarea class='textarea-edit-post' style='border: none' name='edit-body" + index + "' id='edit-body" + index + "'> " + body + "</textarea>" +
                                        "</div>" +
                                        "</div>" +
                                        "</span>" +
                                        "</div>";
                                }


                            }


                            if (prevImg == "") {
                                anchorImg = "<a href ='" + url + "' target = _blank>" + url + "</a>";

                            } else {
                                anchorImg = "<a href ='" + url + "' target = _blank><img src='" + prevImg + "' width='670' height='400'></a>";

                            }

                            //Need to check if this user liked the post
                            var found = false;

                            for (var x = 0; x < likes; x++) {
                                if (liked[x].user == request) {
                                    found = true;
                                }

                            }

                            if (found) {
                                like = "<span value='{\"content\":\"" + name + "\",\"alias\":\"" + alias + "\",\"request\":\"" + request + "\",\"url\":\"" + request + "\"}' id='like" + index + "'> <img id='img" + index + "' src='/images/liked0.png' width='150' height='35'> </span>";
                                comment = "<img src='/images/comments.png' id='comment-button" + index + "' width='150' height='35'>";


                            } else {
                                like = "<span value='{\"content\":\"" + name + "\",\"alias\":\"" + alias + "\",\"request\":\"" + request + "\",\"url\":\"" + request + "\"}' id='like" + index + "'> <img id='img" + index + "' src='/images/likes.png' width='150' height='35'> </span>";
                                comment = "<img src='/images/comments.png' id='comment-button" + index + "' width='150' height='35'>";

                            }

                            var replyStage = [];
                            commentsList += "<div id='grid-container-comments" + index + "'>";
                            //Build the comments list

                            for (var count = 0; count < comments.length; count++) {
                                if (origin == comments[count].xurl) {
                                    commentsList += "<div id='grid-container-comment" + index + count + "' class='grid-container-comment'>" +
                                        "<div id='comment" + index + count + "'>" +
                                        "<div id='comment-edit" + index + count + "'>" +
                                        "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + request + "')\" id='comment-text" + index + count + "'></textarea>" +
                                        "</div>" +
                                        "<div id='comment-display" + index + count + "'>" +
                                        "<div id='comment-user" + index + count + "'>" + comments[count].xurl + "</div><br>" +
                                        "<div id='comment-content" + index + count + "'>" + comments[count].comment + "</div>" +
                                        "</div>" +
                                        "</div>" +
                                        "<div>" +
                                        "<span class='context-menu-two' id='context-menu-two" + index + "' value='{\"content\":\"" + name + "\",\"id\":\"" + index + count + "\",\"index\":\"" + comments[count].index + "\",\"localURL\":\"" + request + "\",\"user\":\"" + comments[count].xurl + "\"}'><i class='fas fa-ellipsis-h fa-xs'></i></span>" +
                                        "</div>" +
                                        "<div>" +
                                        "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + request + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                        "</div > " +
                                        "<div></div>";

                                    for (i in comments[count].replies) {
                                        if (origin == comments[count].replies[i].xurl) {
                                            replyStage[i] = "<div class='grid-container-reply' id='grid-container-reply" + index + count + i + "'>" +
                                                "<div style='display:none' id='comment-edit-reply" + index + count + i + "'>" +
                                                "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentReplyEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + comments[count].replies[i].index + "','" + request + "')\" id='comment-text-reply" + index + count + i + "'></textarea>" +
                                                "</div>" +
                                                "<div id='comment-display-reply" + index + count + i + "'>" +
                                                "<div id='comment-user-reply" + index + count + i + "'>" + comments[count].replies[i].xurl + "</div><br>" +
                                                "<div id='comment-content-reply" + index + count + i + "'>" + comments[count].replies[i].comment + "</div>" +
                                                "</div>" +

                                                "<div id='reply-edit" + index + count + i + "'>" +
                                                "<span class='context-menu-four' id='context-menu-four" + index + count + "' value='{\"content\":\"" + name + "\",\"id\":\"" + index + count + i + "\",\"replyIndex\":\"" + comments[count].replies[i].index + "\",\"localURL\":\"" + request + "\",\"commentIndex\":\"" + comments[count].index + "\"}'><i class='fas fa-ellipsis-h fa-xs'></i></span>" +
                                                "</div>" +
                                                "<div id='reply-icon" + index + count + i + "'>" +
                                                "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + request + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                                "</div > " +
                                                "<div></div>" +
                                                "</div>";
                                        } else {
                                            replyStage[i] = "<div class='grid-container-reply' id='grid-container-reply" + index + count + i + "'>" +
                                                "<div style='display:none' id='comment-edit-reply" + index + count + i + "'>" +
                                                "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentReplyEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + comments[count].replies[i].index + "','" + request + "')\" id='comment-text-reply" + index + count + i + "'></textarea>" +
                                                "</div>" +
                                                "<div id='comment-display-reply" + index + count + i + "'>" +
                                                "<div id='comment-user-reply" + index + count + i + "'>" + comments[count].replies[i].xurl + "</div><br>" +
                                                "<div id='comment-content-reply" + index + count + i + "'>" + comments[count].replies[i].comment + "</div>" +
                                                "</div>" +
                                                "<div id='reply-edit" + index + count + i + "'>" +
                                                "<span</span>" +
                                                "</div>" +
                                                "<div id='reply-icon" + index + count + i + "'>" +
                                                "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + request + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                                "</div > " +
                                                "<div></div>" +
                                                "</div>";
                                        }

                                    }
                                    for (var i = 0; i < comments[count].replies.length; i++) {
                                        commentsList += replyStage[i] + "<div id='comment-grid-spacer" + comments[count].index + comments[count].replies[i].index + "' ></div>";
                                    }
                                    commentsList += "</div>";
                                } else {

                                    commentsList += "<div id='grid-container-comment" + index + count + "' class='grid-container-comment'>" +
                                        "<div id='comment" + index + count + "'>" +
                                        "<div id='comment-edit" + index + count + "'>" +
                                        "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + request + "')\" id='comment-text" + index + count + "'></textarea>" +
                                        "</div>" +
                                        "<div id='comment-display" + index + count + "'>" +
                                        "<div id='comment-user" + index + count + "'>" + comments[count].xurl + "</div><br>" +
                                        "<div id='comment-content" + index + count + "'>" + comments[count].comment + "</div>" +
                                        "</div>" +
                                        "</div>" +
                                        "<div>" +
                                        "</div>" +
                                        "<div class='comment-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\", \"alias\":\"" + alias + "\",\"request\":\"" + request + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a>" +
                                        "</div > " +
                                        "<div></div>";
                                    for (i in comments[count].replies) {
                                        if (origin == comments[count].replies[i].xurl) {
                                            replyStage[i] = "<div class='grid-container-reply' id='grid-container-reply" + index + count + i + "'>" +
                                                "<div style='display:none' id='comment-edit-reply" + index + count + i + "'>" +
                                                "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentReplyEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + comments[count].replies[i].index + "','" + request + "')\" id='comment-text-reply" + index + count + i + "'></textarea>" +
                                                "</div>" +
                                                "<div id='comment-display-reply" + index + count + i + "'>" +
                                                "<div id='comment-user-reply" + index + count + i + "'>" + comments[count].replies[i].xurl + "</div><br>" +
                                                "<div id='comment-content-reply" + index + count + i + "'>" + comments[count].replies[i].comment + "</div>" +
                                                "</div>" +
                                                "<div id='reply-edit" + index + count + i + "'>" +
                                                "<span class='context-menu-four' id='context-menu-four" + index + count + "' value='{\"content\":\"" + name + "\",\"id\":\"" + index + count + i + "\",\"replyIndex\":\"" + comments[count].replies[i].index + "\",\"localURL\":\"" + request + "\",\"commentIndex\":\"" + comments[count].index + "\"}'><i class='fas fa-ellipsis-h fa-xs'></i></span>" +
                                                "</div>" +
                                                "<div id='reply-icon" + index + count + i + "'>" +
                                                "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + request + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                                "</div > " +
                                                "<div></div>" +
                                                "</div>";
                                        } else {
                                            replyStage[i] = "<div class='grid-container-reply' id='grid-container-reply" + index + count + i + "'>" +
                                                "<div style='display:none' id='comment-edit-reply" + index + count + i + "'>" +
                                                "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentReplyEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + comments[count].replies[i].index + "','" + request + "')\" id='comment-text-reply" + index + count + i + "'></textarea>" +
                                                "</div>" +
                                                "<div id='comment-display-reply" + index + count + i + "'>" +
                                                "<div id='comment-user-reply" + index + count + i + "'>" + comments[count].replies[i].xurl + "</div><br>" +
                                                "<div id='comment-content-reply" + index + count + i + "'>" + comments[count].replies[i].comment + "</div>" +
                                                "</div>" +
                                                "<div id='reply-edit" + index + count + i + "'>" +
                                                "<span</span>" +
                                                "</div>" +
                                                "<div id='reply-icon" + index + count + i + "'>" +
                                                "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + request + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                                "</div > " +
                                                "<div></div>" +
                                                "</div>";
                                        }

                                    }
                                    for (var i = 0; i < comments[count].replies.length; i++) {
                                        commentsList += replyStage[i] + "<div id='comment-grid-spacer" + comments[count].index + comments[count].replies[i].index + "' ></div>";
                                    }

                                }


                            }
                            commentsList += "</div>";

                            //Initially post just the first two posts, then let the feed do the rest
                            $("#Content-Wrapper").append(htmlTimeline(index, body, edits, anchorImg, prevTitle, prevDesc, date, likes, comments.length, like, comment, name, alias, origin, request, commentsList));

                        }
                    }

                } else {
                    alert('data structure corrupt, timeline not loaded');

                }
            }
        });
    
    });
});
 



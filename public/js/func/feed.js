/**
         * Content Feed Mechanism
         *
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

$(document).ready(function () {
    (function () {

        var index = 2;
        var isLocal = false;
        var isRemote = false;

        $("#middle").scroll($.debounce(500, false, function () {
            //Get local posts to display
            var origin = $('#content').attr('origin');
            var request = $('#grid-container-profile').attr('value');
            var url = "";
            var pic = "";
            
            if (origin == request) {
                if (isRemote == true) {

                    isLocal = true;
                    isRemote = false;

                    index = 2;

                    url = "/feed/index/";
                } else {
                    isLocal = true;
                    url = "/feed/index/";
                }     
                
            }
            else {
                if (isLocal == true) {

                    isLocal = false;
                    isRemote = true;

                    index = 2;

                    url = "https://" + request + ".loca.lt/feed/index/";
                } else {

                    url = "https://" + request + ".loca.lt/feed/index/";
                }

                
            }
            
            $.get(url + index, function (result) {
                
                if (result.length > 2) {

                    var content = JSON.parse(result);
                    var alias = $('#alias').text();
                    var liked = content[0].likes;
                    var like, comment, edits, options;
                    var commentsList = "";

                    //Get the post properties and sanitize them
                    var name = content[0].name;

                    //Append any photos to the body of the post
                    var photo = content[0].photo;
                    var body;
                    if (photo != "" && (origin == request))
                        body = content[0].body + "<br><br><a href=" + photo + "><img src=" + photo + " width=750 height=450></a>";
                    else if (photo != "" && (origin != request))
                        body = content[0].body + "<br><br><a href=https://" + request + ".loca.lt/" + photo + "><img src=https://" + request + ".loca.lt/" + photo + " width=750 height=450></a>";
                    else
                        body = content[0].body;

                    var url = content[0].url;
                    var prevImg = content[0].preview.img;
                    var prevTitle = content[0].preview.title;
                    var prevDesc = content[0].preview.description;
                    var date = content[0].date;
                    var likes = content[0].likes.length;
                    var comments = content[0].comments;
                    var xurl = content[0].xurl;
                    var group = content[1].group;
                    var anchorImg;
                    var hide = false;                    
            
                    if (prevImg == "") {
                        anchorImg = "<a id='previewurl" + index + "' href ='" + url + "' target = _blank>" + url + "<img id='previewimg" + index + "' src='' width='670' height='400'></a>";
                        hide = true;
                    } else {
                        anchorImg = "<a id='previewurl" + index + "' href ='" + url + "' target = _blank><img id='previewimg" + index + "' src='" + prevImg + "' width='670' height='400'></a>";
                        hide = false;
                    }

                    //Need to check if this user liked the post
                    var found = false;
                    for (var x = 0; x < likes; x++) {
                        if (liked[x].user == request) {
                            found = true;
                        }

                    }

                    if (found) {
                        like = "<span value='{\"content\":\"" + name + "\",\"alias\":\"" + alias + "\",\"request\":\"" + origin + "\",\"url\":\"" + request + "\"}' id='like" + index + "'> <img id='img" + index + "' src='/images/liked0.png' width='150' height='35'> </span>";
                        comment = "<img src='/images/comments.png' id='comment-button" + index + "' width='150' height='35'>";
                        
                          
                    } else {
                        like = "<span value='{\"content\":\"" + name + "\",\"alias\":\"" + alias + "\",\"request\":\"" + origin + "\",\"url\":\"" + request + "\"}' id='like" + index + "'> <img id='img" + index + "' src='/images/likes.png' width='150' height='35'> </span>";
                        comment = "<img src='/images/comments.png' id='comment-button" + index + "' width='150' height='35'>";
                        
                    }

                    //Editing allowed locally but no share on your own timeline
                    if (origin == request) {
                        if (group == 1 && origin == xurl) {
                            edits = "<div></div><div class='post-header'></div>" +
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

                            options = "<div class='grid-container-options'>" +
                                "<div class='like'>" + like +
                                "</div>" +
                                "<div class='comment'>" + comment +
                                "</div>" +
                                "</div>";

                        } else if(group == 1 && origin != xurl) {

                            edits = "<div></div><div class='post-header'></div>" +
                                "<div class='post-header'>" + xurl + "</div>" +
                                "<div class='post-header'></div>";

                            options = "<div class='grid-container-options'>" +
                                "<div class='like'>" + like +
                                "</div>" +
                                "<div class='comment'>" + comment +
                                "</div>" +
                                "</div>";
                        } else if (group == 0) {

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

                            options = "<div class='grid-container-options'>" +
                                "<div class='like'>" + like +
                                "</div>" +
                                "<div class='comment'>" + comment +
                                "</div>" +
                                "</div>";
                        }

                    } else if (group == 1 && origin == xurl) { //Editing allowed and sharing if it's a group
                        edits = "<div></div><div class='post-header'></div>" +
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

                        options = "<div class='grid-container-request-options'>" +
                            "<div class='like'>" + like +
                            "</div>" +
                            "<div class='comment'>" + comment +
                            "</div>" +
                            "<div><span id='share" + index + "' value='{\"content\":\"" + name + "\", \"request\":\"" + request + "\"}'><img src='/images/shares.png' id='img#{index}' width='150' height='35'></span></div>" +
                            "</div>";

                    } else if (group == 1 && origin != xurl) {
                        
                        edits = "<div></div><div class='post-header'></div>" +
                            "<div class='post-header'>" + xurl + "</div>" +
                            "<div class='post-header'></div>";

                        options = "<div class='grid-container-request-options'>" +
                            "<div class='like'>" + like +
                            "</div>" +
                            "<div class='comment'>" + comment +
                            "</div>" +
                            "<div><span id='share" + index + "' value='{\"content\":\"" + name + "\", \"request\":\"" + request + "\"}'><img src='/images/shares.png' id='img#{index}' width='150' height='35'></span></div>" +
                            "</div>";


                    } else if (group == 0){ //No editing allowed but sharing is on someone else's timeline
                        edits = "<div></div>" +
                            "<div class='post-header'></div>" +
                            "<div class='post-header'>" + xurl + "</div>" +
                            "<div class='post-header'></div>";
                            

                        options = "<div class='grid-container-request-options'>" +
                            "<div class='like'>" + like +
                            "</div>" +
                            "<div class='comment'>" + comment +
                            "</div>" +
                            "<div><span id='share" + index + "' value='{\"content\":\"" + name + "\", \"request\":\"" + request + "\"}'><img src='/images/shares.png' id='img#{index}' width='150' height='35'></span></div>" +
                            "</div>";
                        
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
                                "<span class='comment-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + origin + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                "</div> " +
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
                                        "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + origin + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
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
                                        "<span></span>" +
                                        "</div>" +
                                        "<div id='reply-icon" + index + count + i + "'>" +
                                        "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + origin + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                        "</div > " +
                                        "<div></div>" +
                                        "</div>";
                                }

                            }
                            for (var j = 0; j < comments[count].replies.length; j++) {
                                commentsList += replyStage[j] + "<div id='comment-grid-spacer" + comments[count].index + comments[count].replies[j].index + "' ></div>";
                            }
                            commentsList += "</div>"
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
                                "<div class='comment-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\", \"alias\":\"" + alias + "\",\"request\":\"" + origin + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a>" +
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
                                        "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + origin + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
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
                                        "<span></span>" +
                                        "</div>" +
                                        "<div id='reply-icon" + index + count + i + "'>" +
                                        "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + origin + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                        "</div > " +
                                        "<div></div>" +
                                        "</div>";
                                }

                            }
                            for (var j = 0; j < comments[count].replies.length; j++) {
                                commentsList += replyStage[j] + "<div id='comment-grid-spacer" + comments[count].index + comments[count].replies[j].index + "' ></div>";
                            }
                            commentsList += "</div>"
                        }

                        //need to zero out reply stage after each comment
                        replyStage.splice(0, replyStage.length - 1);
                    }
                    commentsList += "</div>";
                    
                    //Build the feed one post at a time
                    $(".Content-Wrapper").append(htmlTimeline(index, body, edits, anchorImg, prevTitle, prevDesc, date, likes, comments.length, like, comment, name, alias, origin, request, commentsList));

                    if(hide)
                        $('#previewimg' + index).hide();

                    index++;
                }


            });


        }))
    })();
});
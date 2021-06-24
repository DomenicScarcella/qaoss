/**
         * Loads the local timeline after the framework has loaded
         *
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

$(window).bind("load", function () {
    
    event.preventDefault();

    var origin = $('#content').attr('origin');
    var group = $('#content').attr('group');
    
        //Load the local timeline
        $.get('/local', function (content) {
           
            //Set the color of the new messages icon
            //Green if there are new messages, blue otherwise.
            if (content.message == 1) {
                $('.fas.fa-envelope').css('color', 'green');
                $('#new-label').css('color', 'green');
            } else if (content.message == 0) {
                $('.fas.fa-envelope').css('color', 'blue');
                $('#new-label').css('color', 'blue');
            } 
            
            if (content.friend > 0) {
                $('#request-count').text("Requests - " + content.friend);
                $('#request-count').css('color', 'green');
            }
            else {
                $('#request-count').text("Requests - 0");
                $('#request-count').css('color', 'blue');
            }

            //Empty the content in case we had a remote timeline previously
            $("#content").empty(); 
            
            var alias = content.alias;
            $("#content").append(htmlProfile(origin, alias, null, null));

            if (content.contents != '') {
                for (var index = 0; index < 2; index++) {

                    //Variables
                    var anchorImg;
                    var like, comment, edits;
                    var commentsList = "";
                    var hide = false;
                    
                    //Get the post properties and sanitize them
                    var request = content.request;
                    var local = content.local;
                    var liked = content.contents[index].likes;
                    var name = content.contents[index].name;

                    //Append any photos to the body of the post
                    var photo = content.contents[index].photo;
                    var body;
                    if (photo != "")
                        body = content.contents[index].body + "<br><br><a href=" + photo + "><img src=" + photo + " width=750 height=650></a>";
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

                    edits = htmlEdits(group, origin, xurl, index, name, local, body);

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
                        like = "<span value='{\"content\":\"" + name + "\",\"alias\":\"" + alias + "\",\"request\":\"" + request + "\",\"url\":\"" + local + "\"}' id='like" + index + "'> <img id='img" + index + "' src='/images/liked0.png' width='150' height='35'> </span>";
                        comment = "<img src='/images/comments.png' id='comment-button" + index + "' width='150' height='35'>";


                    } else {
                        like = "<span value='{\"content\":\"" + name + "\",\"alias\":\"" + alias + "\",\"request\":\"" + request + "\",\"url\":\"" + local + "\"}' id='like" + index + "'> <img id='img" + index + "' src='/images/likes.png' width='150' height='35'> </span>";
                        comment = "<img src='/images/comments.png' id='comment-button" + index + "' width='150' height='35'>";

                    }

                    var replyStage = [];
                    commentsList += "<div id='grid-container-comments" + index + "'>";

                    //Build the comments list. Check where we are and who made each comment in 
                    //order to give edit permissions or not.
                    for (var count = 0; count < comments.length; count++) {
                        if (origin == comments[count].xurl) {
                            commentsList += "<div id='grid-container-comment" + index + count + "' class='grid-container-comment'>" +
                                "<div id='comment" + index + count + "'>" +
                                "<div id='comment-edit" + index + count + "'>" +
                                "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + local + "')\" id='comment-text" + index + count + "'></textarea>" +
                                "</div>" +
                                "<div id='comment-display" + index + count + "'>" +
                                "<div id='comment-user" + index + count + "'>" + comments[count].xurl + "</div><br>" +
                                "<div id='comment-content" + index + count + "'>" + comments[count].comment + "</div>" +
                                "</div>" +
                                "</div>" +
                                "<div>" +
                                "<span class='context-menu-two' id='context-menu-two" + index + "' value='{\"content\":\"" + name + "\",\"id\":\"" + index + count + "\",\"index\":\"" + comments[count].index + "\",\"localURL\":\"" + local + "\",\"user\":\"" + comments[count].xurl + "\"}'><i class='fas fa-ellipsis-h fa-xs'></i></span>" +
                                "</div>" +
                                "<div>" +
                                "<span class='comment-reply' id ='reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + request + "\",\"url\":\"" + local + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                "</div > " +
                                "<div></div>";
                            
                            for (i in comments[count].replies) {
                                if (origin == comments[count].replies[i].xurl) {
                                    replyStage[i] = "<div class='grid-container-reply' id='grid-container-reply" + index + count + i + "'>" +
                                        "<div style='display:none' id='comment-edit-reply" + index + count + i + "'>" +
                                        "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentReplyEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + comments[count].replies[i].index + "','" + local + "')\" id='comment-text-reply" + index + count + i + "'></textarea>" +
                                        "</div>" +
                                        "<div id='comment-display-reply" + index + count + i + "'>" +
                                        "<div id='comment-user-reply" + index + count + i + "'>" + comments[count].replies[i].xurl + "</div><br>" +
                                        "<div id='comment-content-reply" + index + count + i + "'>" + comments[count].replies[i].comment + "</div>" +
                                        "</div>" +
                                        "<div id='reply-edit" + index + count + i + "'>" +
                                        "<span class='context-menu-four' id='context-menu-four" + index + count + "' value='{\"content\":\"" + name + "\",\"id\":\"" + index + count + i + "\",\"replyIndex\":\"" + comments[count].replies[i].index + "\",\"localURL\":\"" + local + "\",\"commentIndex\":\"" + comments[count].index + "\"}'><i class='fas fa-ellipsis-h fa-xs'></i></span>" +
                                        "</div>" +
                                        "<div id='reply-icon" + index + count + i + "'>" +
                                        "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + request + "\",\"url\":\"" + local + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                        "</div > " +
                                        "<div></div>" +
                                        "</div>";
                                } else {
                                    replyStage[i] = "<div class='grid-container-reply' id='grid-container-reply" + index + count + i + "'>" +
                                        "<div style='display:none' id='comment-edit-reply" + index + count + i + "'>" +
                                        "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentReplyEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + comments[count].replies[i].index + "')\" id='comment-text-reply" + index + count + i + "','" + local + "'></textarea>" +
                                        "</div>" +
                                        "<div id='comment-display-reply" + index + count + i + "'>" +
                                        "<div id='comment-user-reply" + index + count + i + "'>" + comments[count].replies[i].xurl + "</div><br>" +
                                        "<div id='comment-content-reply" + index + count + i + "'>" + comments[count].replies[i].comment + "</div>" +
                                        "</div>" +
                                        "<div id='reply-edit" + index + count + i + "'>" +
                                        "<span</span>" +
                                        "</div>" +
                                        "<div id='reply-icon" + index + count + i + "'>" +
                                        "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + request + "\",\"url\":\"" + local + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
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
                                "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + local + "')\" id='comment-text" + index + count + "'></textarea>" +
                                "</div>" +
                                "<div id='comment-display" + index + count + "'>" +
                                "<div id='comment-user" + index + count + "'>" + comments[count].xurl + "</div><br>" +
                                "<div id='comment-content" + index + count + "'>" + comments[count].comment + "</div>" +
                                "</div>" +
                                "</div>" +
                                "<div>" +
                                "</div>" +
                                "<div class='comment-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\", \"alias\":\"" + alias + "\",\"request\":\"" + request + "\",\"url\":\"" + local + "\"}'><a href='#'><i class='fas fa-reply'></i></a>" +
                                "</div > " +
                                "<div></div>";
                            for (i in comments[count].replies) {
                                if (origin == comments[count].replies[i].xurl) {
                                    replyStage[i] = "<div class='grid-container-reply' id='grid-container-reply" + index + count + i + "'>" +
                                        "<div style='display:none' id='comment-edit-reply" + index + count + i + "'>" +
                                        "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentReplyEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + comments[count].replies[i].index + "','" + local + "')\" id='comment-text-reply" + index + count + i + "'></textarea>" +
                                        "</div>" +
                                        "<div id='comment-display-reply" + index + count + i + "'>" +
                                        "<div id='comment-user-reply" + index + count + i + "'>" + comments[count].replies[i].xurl + "</div><br>" +
                                        "<div id='comment-content-reply" + index + count + i + "'>" + comments[count].replies[i].comment + "</div>" +
                                        "</div>" +
                                        "<div id='reply-edit" + index + count + i + "'>" +
                                        "<span class='context-menu-four' id='context-menu-four" + index + count + "' value='{\"content\":\"" + name + "\",\"id\":\"" + index + count + i + "\",\"replyIndex\":\"" + comments[count].replies[i].index + "\",\"localURL\":\"" + local + "\",\"commentIndex\":\"" + comments[count].index + "\"}'><i class='fas fa-ellipsis-h fa-xs'></i></span>" +
                                        "</div>" +
                                        "<div id='reply-icon" + index + count + i + "'>" +
                                        "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + request + "\",\"url\":\"" + local + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                        "</div > " +
                                        "<div></div>" +
                                        "</div>";
                                } else {
                                    replyStage[i] = "<div class='grid-container-reply' id='grid-container-reply" + index + count + i + "'>" +
                                        "<div style='display:none' id='comment-edit-reply" + index + count + i + "'>" +
                                        "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentReplyEdit(this.id, this.value,'" + name + "','" + comments[count].index + "','" + comments[count].replies[i].index + "','" + local + "')\" id='comment-text-reply" + index + count + i + "'></textarea>" +
                                        "</div>" +
                                        "<div id='comment-display-reply" + index + count + i + "'>" +
                                        "<div id='comment-user-reply" + index + count + i + "'>" + comments[count].replies[i].xurl + "</div><br>" +
                                        "<div id='comment-content-reply" + index + count + i + "'>" + comments[count].replies[i].comment + "</div>" +
                                        "</div>" +
                                        "<div id='reply-edit" + index + count + i + "'>" +
                                        "<span</span>" +
                                        "</div>" +
                                        "<div id='reply-icon" + index + count + i + "'>" +
                                        "<span class='reply-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + comments[count].index + "\",\"request\":\"" + request + "\",\"url\":\"" + local + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                                        "</div > " +
                                        "<div></div>" +
                                        "</div>";
                                }

                            }
                            for (var i = 0; i < comments[count].replies.length; i++) {
                                commentsList += replyStage[i] + "<div id='comment-grid-spacer" + comments[count].index + comments[count].replies[i].index + "' ></div>";
                            }
                            commentsList += "</div>"
                               
                        }


                    }
                    commentsList += "</div>";
                    
                    //Initially, post just the first two posts then let the feed mechanism do the rest
                    $("#Content-Wrapper").append(htmlTimeline(index, body, edits, anchorImg, prevTitle, prevDesc, date, likes, comments.length, like, comment, name, alias, origin, request, commentsList));

                    
                    if (hide)
                        $('#previewimg' + index).hide();
                }
            }

            
        });
    
});
 



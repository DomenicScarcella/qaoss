//COMMENT REPLIES
//Create a comment input for replying to a comment
$(document).ready(function () {
    $('[id = "content"]').on('click', '[id ^= "reply"]', function (event) {
        event.preventDefault();

        var commentContainerIndex = this.getAttribute('id').replace('reply', '');
        var elem = document.getElementById('comment-reply-field' + commentContainerIndex);

        if (elem == null) {

            //Get the endpoint to the post to reply to
            var comment = this.getAttribute('value');
            var commentJson = JSON.parse(comment);
            var content = commentJson.content;
            var index = commentJson.index;
            var request = commentJson.request;
            var id = $(this).attr('id');
            var parentComment = id.replace('reply', 'grid-container-comment');

            //Create the reply input box
            var commentInput = "<div id='comment-reply-field" + commentContainerIndex + "'>" +
                "<textarea class='textarea-reply-comment' data-autoresize rows='1' onkeypress=\"submitCommentReply(this.id, this.value,'" + content + "','" + index + "','" + request + "','" + commentContainerIndex + "')\" id='comment-field" + index + "' size='92'></textarea>" +
                "</div>"

            $('#' + parentComment).append(commentInput);
        }


    });
});


//Reply to a comment
function submitCommentReply(id, value, content, index, request, comment) {

    var elem = document.getElementById(id);
    var origin = $('#content').attr('origin');
    var url = "";

    elem.onkeyup = function (e) {

        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();

            //Validate and sanitize data before sending to server.

            if (origin == request) {

                url = "/comments/reply/" + content + "/comment/" + encodeURIComponent(value) + "/index/" + index + "/request/" + encodeURIComponent(origin);
            } else {
                url = "https://" + request + ".local.lt/comments/reply/" + content + "/comment/" + encodeURIComponent(value) + "/index/" + index + "/request/" + encodeURIComponent(origin);
            }

            //Local requests don't need authentication
            if (typeof data === 'undefined') {
                data = { authToken: null, accessToken: null };
            }

            $.post(url, data, function (result) {
                if (result.result == -1) {
                    alert("You are not a registered friend.");
                } else {
                    var count = result.count;
                    var name = result.name;
                    var xurl = result.xurl;
                    var reply = result.reply;
                    var replyIndex = result.index;
                    var commentIndex = result.comment;

                    //Append replies to the comment container the users replied to
                    $("#grid-container-comment" + comment).append(

                        "<div class='grid-container-reply' id='grid-container-reply" + comment + count + "'>" +
                        "<div style='display:none' id='comment-edit-reply" + comment + count + "'>" +
                        "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentReplyEdit(this.id, this.value,'" + name + "','" + index + "','" + replyIndex + "','" + request + "')\" id='comment-text-reply" + comment + count + "'></textarea>" +
                        "</div>" +
                        "<div id='comment-display-reply" + comment + count + "'>" +
                        "<div id='comment-user-reply" + comment + count + "'>" + xurl + "</div><br>" +
                        "<div id='comment-content-reply" + comment + count + "'>" + reply + "</div>" +
                        "</div>" +
                        "<div id='reply-edit" + comment + count + "'>" +
                        "<span class='context-menu-four' id='context-menu-four" + comment + "' value='{\"content\":\"" + name + "\",\"id\":\"" + comment + count + "\",\"commentIndex\":\"" + commentIndex + "\",\"replyIndex\":\"" + replyIndex + "\",\"localURL\":\"" + request + "\",\"user\":\"" + xurl + "\"}'><i class='fas fa-ellipsis-h fa-xs'></i></span>" +
                        "</div>" +
                        "<div id='reply-icon" + comment + count + "'>" +
                        "<span class='reply-reply' id = 'reply" + comment + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + commentIndex + "\",\"request\":\"" + request + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                        "</div>" +
                        "<div></div>" +

                        "</div>"

                    );

                    //The comment grid is two columns so we need to add an item after the reply for the second column and
                    //give it an ID so we can delete it if the user deletes the reply.
                    $("#grid-container-comment" + comment).append(
                        "<div id='comment-grid-spacer" + commentIndex + replyIndex + "' ></div>"
                    );

                    //Remove the textarea used to enter the reply
                    $("div#comment-reply-field" + comment).remove();
                }


            });

        }
    }
}

//Provide an input for editing a comment reply
function editCommentReply(value) {

    if ($("div#comment-display-reply" + value).is(":visible")) {

        var content = $('div#comment-content-reply' + value).text();
        $('div#comment-edit-reply' + value).show();
        $('textarea#comment-text-reply' + value).val(content);
        $("div#comment-display-reply" + value).hide();

    }

}

//edit a comment
function submitCommentReplyEdit(id, value, content, commentIndex, replyIndex, request) {

    var elem = document.getElementById(id);
    var suffix = id.replace('comment-text-reply', '');
    var origin = $('#content').attr('origin');
    //var request = JSON.parse($('#like0').attr('value')).url;
    var url = "";

    elem.onkeyup = function (e) {

        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();

            if (origin == request) {
                url = "/comments/post/" + content + "/comment/" + encodeURIComponent(value) + "/commentindex/" + commentIndex + "/replyindex/" + replyIndex + "/request/" + origin;
            } else {
                url = "https://" + request + ".local.lt/comments/post/" + content + "/comment/" + encodeURIComponent(value) + "/commentindex/" + commentIndex + "/replyindex/" + replyIndex + "/request/" + origin;
            }

            //Local requests don't need authentication
            if (typeof data === 'undefined') {
                data = { authToken: null, accessToken: null };
            }

            //alert(url);
            $.post(url, data, function (result) {

                if (result.result == "success") {

                    if ($("div#comment-edit-reply" + suffix).is(":visible")) {

                        $("div#comment-user-reply" + suffix).text(result.user);
                        $("div#comment-content-reply" + suffix).text(result.reply);
                        $("div#comment-display-reply" + suffix).show();
                        $("div#comment-edit-reply" + suffix).hide();

                    } else {
                        alert("There was a problem editing the comment");
                        location.reload();
                    }
                }

            });

        }
    }
}

$(function () {
    $.contextMenu({
        selector: '.context-menu-four',
        trigger: 'hover',
        callback: function (key, opt) {

            var commentJSON = JSON.parse($(this).attr('value'));

            var post = commentJSON.content;
            var commentIndex = commentJSON.commentIndex;
            var id = commentJSON.id;
            var user = commentJSON.user;
            var request = commentJSON.localURL;
            var replyIndex = commentJSON.replyIndex;
            var origin = $('#content').attr('origin');
            //var request = JSON.parse($('#like0').attr('value')).url;

            //check who made the comment before allowing editing.
            switch (key) {
                case "edit":

                    editCommentReply(id);

                    break;
                case "delete":

                    //Need authToken to modify options on other's timelines in order to prevent 
                    //unsecure modifications outside the context of Qaoss.
                    var r = confirm("Are you sure you want to delete this comment?");
                    if (r == true) {

                        var url = "";

                        //Url to delete the comment
                        if (origin == request)
                            url = "/comments/post/" + post + "/commentindex/" + commentIndex + "/replyindex/" + replyIndex + "/id/" + id + "/request/" + origin;
                        else
                            url = "https://" + request + ".local.lt/comments/post/" + post + "/commentindex/" + commentIndex + "/replyindex/" + replyIndex + "/id/" + id + "/request/" + origin;

                        //Local requests don't need authentication
                        if (typeof data === 'undefined') {
                            data = { authToken: null, accessToken: null };
                        }

                        $.ajax({
                            url: url,
                            type: 'DELETE',
                            data: data,
                            success: function (data, textStatus, jqXHR) {
                                $('#comment-grid-spacer' + commentIndex + replyIndex).remove();
                                $('#grid-container-reply' + data.id).remove();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                alert(jqXHR.responseText + " : " + textStatus + " : " + errorThrown);
                            }

                        });


                    }


                    break;
                default:
                // code block
            }
        },
        items: {
            "edit": { name: "Edit", icon: "edit" },
            "delete": { name: "Delete", icon: "delete" },
            "quit": {
                name: "Quit", icon: function () {
                    return 'context-menu-icon context-menu-icon-quit';
                }
            }
        }
    });
});

// COMMENTS
//Give the comment field focus on pressing the comment button
$(document).ready(function () {

    $('[id = "content"]').on('click', '[id ^= "comment-button"]', function (event) {
        //Get the id of the comment button pressed
        var id = $(this).attr('id');
        if (!(id.includes('comment-text') || id.includes('comment-edit') || id.includes('comment-field'))) {
            //Get the id of the like indicator to update

            var target = id.replace('comment-button', 'comment-field');
            document.getElementById(target).focus();
        }
    });
});

//make a comment
function submitComment(id, value, content, alias, request, count) {

    var elem = document.getElementById(id);
    var index = id.replace('comment-field', '');
    var origin = $('#content').attr('origin');
    var url = "";

    elem.onkeyup = function (e) {
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();

            //Validate and sanitize data before sending to server.
            if (origin == request) {
                url = "/comments/post/" + content + "/comment/" + encodeURIComponent(value) + "/alias/" + encodeURIComponent(alias) + "/request/" + encodeURIComponent(origin);
            } else {
                url = "https://" + request + ".local.lt/comments/post/" + content + "/comment/" + encodeURIComponent(value) + "/alias/" + encodeURIComponent(alias) + "/request/" + encodeURIComponent(origin);
            }

            //Local requests don't need authentication
            if (typeof data === 'undefined') {
                data = { authToken: null, accessToken: null };
            }

            $.post(url, data, function (result) {
                if (result.result == -1) {
                    alert("You are not a registered friend.");
                } else {
                    var count = result.count;
                    var name = result.name;
                    var xurl = result.xurl;
                    var comment = result.comment;
                    var commentIndex = result.index;

                    $("#grid-container-comments" + index).append(
                        "<div id='grid-container-comment" + index + count + "' class='grid-container-comment'>" +
                        "<div id='comment" + index + count + "'>" +
                        "<div style='display:none' id='comment-edit" + index + count + "'>" +
                        "<textarea class='textarea-edit-comment' data-autoresize rows='1' onkeypress=\"submitCommentEdit(this.id, this.value,'" + name + "','" + commentIndex + "','" + request + "')\" id='comment-text" + index + count + "'></textarea>" +
                        "</div>" +
                        "<div id='comment-display" + index + count + "'>" +
                        "<div id='comment-user" + index + count + "'>" + xurl + "</div><br>" +
                        "<div id='comment-content" + index + count + "'>" + comment + "</div>" +
                        "</div>" +

                        "</div>" +
                        "<div>" +
                        "<span class='context-menu-two' id='context-menu-two" + index + "' value='{\"content\":\"" + name + "\",\"id\":\"" + index + count + "\",\"index\":\"" + commentIndex + "\",\"localURL\":\"" + request + "\",\"user\":\"" + xurl + "\"}'><i class='fas fa-ellipsis-h fa-xs'></i></span>" +
                        "</div>" +
                        "<div>" +
                        "<span class='comment-reply' id = 'reply" + index + count + "' value = '{\"content\":\"" + name + "\",\"index\":\"" + commentIndex + "\",\"request\":\"" + request + "\",\"url\":\"" + request + "\"}'><a href='#'><i class='fas fa-reply'></i></a></span>" +
                        "</div > " +
                        "<div></div>" +
                        "</div>"
                    );

                    $('#' + id).val("Write a comment...");
                    $('#' + id).css("height", "auto");
                    //location.reload();
                }


            });

        }
    }
}

//edit a comment
function submitCommentEdit(id, value, content, index, request) {

    var elem = document.getElementById(id);
    var suffix = id.replace('comment-text', '');
    var origin = $('#content').attr('origin');
    //var request = JSON.parse($('#like0').attr('value')).url;
    var url = "";

    elem.onkeyup = function (e) {
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();

            //Check if it's a local or remote request
            if (origin == request) {
                url = "/comments/post/" + content + "/comment/" + encodeURIComponent(value) + "/index/" + index + "/request/" + origin;
            } else {
                url = "https://" + request + ".local.lt/comments/post/" + content + "/comment/" + encodeURIComponent(value) + "/index/" + index + "/request/" + origin;
            }

            //Local requests don't need authentication
            if (typeof data === 'undefined') {
                data = { authToken: null, accessToken: null };
            }

            //alert(url);
            $.post(url, data, function (result) {

                if (result.result == "success") {

                    if ($("div#comment-edit" + suffix).is(":visible")) {

                        $("div#comment-user" + suffix).text(result.user);
                        $("div#comment-content" + suffix).text(result.comment);
                        $("div#comment-display" + suffix).show();
                        $("div#comment-edit" + suffix).hide();

                    } else {
                        alert("There was a problem editing the comment");
                        location.reload();
                    }
                }

            });

        }
    }
}

//Provide an input for editing a comment
function editComment(value) {

    if ($("div#comment-display" + value).is(":visible")) {

        var content = $('div#comment-content' + value).text();
        $('div#comment-edit' + value).show();
        $('textarea#comment-text' + value).val(content);
        $("div#comment-display" + value).hide();

    }

}


$(function () {
    $.contextMenu({
        selector: '.context-menu-two',
        trigger: 'hover',
        callback: function (key, opt) {

            var commentJSON = JSON.parse($(this).attr('value'));

            var post = commentJSON.content;
            var comment = commentJSON.id;
            var user = commentJSON.user;
            var request = commentJSON.localURL;
            var index = commentJSON.index;
            var origin = $('#content').attr('origin');
            //var request = JSON.parse($('#like0').attr('value')).url;

            //check who made the comment before allowing editing.
            switch (key) {
                case "edit":

                    editComment(comment);

                    break;
                case "delete":


                    //Need authToken to modify options on other's timelines in order to prevent 
                    //unsecure modifications outside the context of Qaoss.
                    var r = confirm("Are you sure you want to delete this comment?");
                    if (r == true) {

                        var url = "";

                        //Url to delete the comment
                        if (origin == request)
                            url = "/comments/post/" + post + "/index/" + index + "/request/" + origin;
                        else
                            url = "https://" + request + ".local.lt/comments/post/" + post + "/index/" + index + "/request/" + origin;

                        //Local requests don't need authentication
                        if (typeof data === 'undefined') {
                            data = { authToken: null, accessToken: null };
                        }

                        $.ajax({
                            url: url,
                            type: 'DELETE',
                            data: data,
                            success: function (data, textStatus, jqXHR) {
                                $('#grid-container-comment' + comment).remove();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                alert(jqXHR.responseText + " : " + textStatus + " : " + errorThrown);
                            }

                        });

                    }


                    break;
                default:
                // code block
            }
        },
        items: {
            "edit": { name: "Edit", icon: "edit" },
            "delete": { name: "Delete", icon: "delete" },
            "quit": {
                name: "Quit", icon: function () {
                    return 'context-menu-icon context-menu-icon-quit';
                }
            }
        }
    });
}); 

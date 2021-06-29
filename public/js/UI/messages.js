/**
         * Everything Message
         * Create, Send, Read, Delete
         *
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

function sendQueuedMessages() {

    //Check the unsent message queue
    $.get("/messages/queued", function (result) {
        
        //Send the messages if any
        //alert(result.messages[1].body)
        if (result != '') {
            var body, request;
            var img = document.body.appendChild(document.createElement("img"));
            var origin = $('#content').attr('origin');
            
            for (var i = 0; i < result.messages.length; i++) {
                //Check remote server availability
                request = result.messages[i].xurl;
                body = result.messages[i].body;
                name = result.messages[i].name;

                
                //try to send the queued messages
                $.post('https://' + request + '.ngrok.io/messages/body/' + encodeURIComponent(body) + '/request/' + encodeURIComponent(origin), data, function (result) {
                    if (result.status == 200)
                        $.post('messages/deletequeued/name/' + name, function () {
                            //Do something here :)

                        });
                    else
                        alert("Error send message to: " + request + " try again later.");
                        

                });
            }



        }


    });
       
}

//Read new message
$(document).ready(function () {
    $('[id = "new"]').on('click', function (event) {
        event.preventDefault();

        var child = document.getElementById('sender-new0');
        var contains = document.getElementById('new').contains(child);
        
        if (!contains) {
            $.get("/messages/new", function (result) {
                
                for (var index = 0; index < result.messages.length; index++) {

                    $("#new").append('<div id=sender-xurl-new' + index + ' class=sender><li>' + result.messages[index].xurl + '<div id=sender-message' + index + ' class=new-message>' + result.messages[index].body.substring(0, 20) + ' ...' + ' <span id=sender-new' + index + ' class=context-menu-five value={\"xurl\":\"' + result.messages[index].xurl + '\",\"body\":\"' + encodeURIComponent(result.messages[index].body) + '\",\"name\":\"' + result.messages[index].name + '\",\"state\":\"new\",\"index\":\"' + index + '\"}><i class="fas fa-ellipsis-h fa-xs"></i></span></li></div></div>');
                    
                }


            });
        } else {

            $("#new").find("div").remove();
            $("#new").find("br").remove();

        }
    });

});

//Read old messages
$(document).ready(function () {
    $('[id = "read"]').on('click', function (event) {
        event.preventDefault();

        var child = document.getElementById('sender-read0');
        var contains = document.getElementById('read').contains(child);
       

        if (!contains) {
            $.get("/messages/read", function (result) {
                

                for (var index = 0; index < result.messages.length; index++) {
                    $("#read").append('<div id=sender-xurl-read' + index + ' class=sender><li>' + result.messages[index].xurl + '<div id=sender-message' + index + ' class=read-message>' + result.messages[index].body.substring(0, 20) + ' ...' + '<span id=sender-read' + index + ' class=context-menu-five value={\"xurl\":\"' + result.messages[index].xurl + '\",\"body\":\"' + encodeURIComponent(result.messages[index].body) + '\",\"name\":\"' + result.messages[index].name + '\",\"state\":\"read\",\"index\":\"' + index + '\"}><i class="fas fa-ellipsis-h"></i></span></li></div></div>');
                }


            });
        } else {
            
            $("#read").find("div").remove();
            $("#read").find("br").remove();
            
        }
    });

});

$(function () {
    $.contextMenu({
        selector: '.context-menu-five',
        trigger: 'hover',
        callback: function (key, opt) {

            
            var messageJSON = JSON.parse($(this).attr('value'));
            var messageBody = decodeURIComponent(messageJSON.body);
            var messageState = messageJSON.state;
            var messageName = messageJSON.name;
            var index = messageJSON.index;
            

            switch (key) {
                case "open":
                    
                    alert(messageBody);

                    $.post("/messages/name/" + messageName, function (result) {

                        $('#sender-xurl-new' + index).remove();
                        $('.fas.fa-envelope').css('color', 'blue');
                        $('#new-label').css('color', 'blue');
                        
                    });

                    break;

                case "delete":

                    var r = confirm("Are you sure you want to delete this message?");
                    var url;

                    if (r == true) {

                        $.post("/messages/delete/name/" + messageName, function (result) {

                            $('#sender-xurl-' + messageState + index).remove();

                        });
                    }


                    break;
                default:
                // code block
            }
        },
        items: {
            "open": { name: "Open", icon: "fas fa-envelope-open-text" },
            "delete": { name: "Delete", icon: "delete" },
            "quit": {
                name: "Quit", icon: function () {
                    return 'context-menu-icon context-menu-icon-quit';
                }
            }
        }
    });
});
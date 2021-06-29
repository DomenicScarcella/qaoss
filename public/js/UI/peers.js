/**
         * All Things UI Peers
         * Add, Edit, Send messages, Delete, Requests
         *
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/
var Peer = (function () {
    
    return {

        init: function () {
            
    		this.bindControls();
        },

        bindControls: function () {
            var isOpen = false;

            //Modify friend
            $(document).ready(function () {
                $('[id^=friends-list],[id^=groups-list]').on('click', '[id^=modify-friend-button]', function (event) {

                    //Get all the required parameters//////////////////
                    let alias = $('#textarea-friend-alias').val();
                    let request = $('#textarea-friend-xurl').val();
                    let group = $('#checkbox-new-group:checked').val();
                    let index = $(this).attr('id').replace('modify-friend-button', '');
                    let origin = $('#content').attr('origin');
                    let authToken, accessToken, alias0, request0, group0;
                    let anchor = document.getElementById('peer' + index).getAttribute('href');
                    let i = anchor.toString().indexOf('?');
                    let querystring = anchor.substr(i);
                    let urlParams = new URLSearchParams(querystring);
                    ////////////////////////////////////////////////////

                    //Get the query string parameters
                    alias0 = urlParams.get('alias');
                    request0 = urlParams.get('request');
                    group0 = $('#peer' + index).attr('group');
                    authToken = urlParams.get('authToken');
                    accessToken = urlParams.get('accessToken');
                    /////////////////////////////////

                    //if the values are empty just set to the existing values
                    if (alias == '')
                        alias = alias0;
                    if (request == '')
                        request = request0;
                    if (group == 'undefined')
                        group = group0;
                    
                    /////////////////////////////////////////////////////////

                    //////////Post the changes///////////////////////////////
                    $.post('peers/request/' + request + '/alias/' + alias + '/group/' + group + '/index/' + index, function (result) {

                        let id;

                        //it's not a group and they didn't check the group box so same list
                        if (group0 == 0 && typeof group === 'undefined') {
                            id = 'friends-list-item' + index;

                            let nextFriend = $('#' + id).next();
                            if (nextFriend.length === 0) {

                                $('#' + id).remove();
                                $('#friends-list').append(htmlAddPeer(id, index, request, alias, 0, origin, authToken, accessToken));
                            } else {

                                $('#' + id).remove();
                                $('#' + nextFriend.attr('id')).before(htmlAddPeer(id, index, request, alias, 0, origin, authToken, accessToken));

                            }
                            //it was a group but they unchecked the group box to change it to a friend.
                            //jumps from group list to friend list
                        } else if (group0 == 1 && typeof group === 'undefined') {

                            id = 'friends-list-item' + index;
                            //remove from group list
                            $('#groups-list-item' + index).remove();
                            //append to friend list
                            $('#friends-list').append(htmlAddPeer(id, index, request, alias, 0, origin, authToken, accessToken));
                            

                        } else if (group0 == 0 && group == 'on') {
                            //It wasn't a group but they want to make it a group
                            id = 'groups-list-item' + index;
                            //remove from group list
                            $('#friends-list-item' + index).remove();
                            //append to friend list
                            $('#groups-list').append(htmlAddPeer(id, index, request, alias, 1, origin, authToken, accessToken));
                        } else {
                            //it was a group and it's still a group so same list
                            id = 'groups-list-item' + index;
                          
                            let nextFriend = $('#' + id).next();
                            if (nextFriend.length === 0) {

                                $('#' + id).remove();
                                $('#groups-list').append(htmlAddPeer(id, index, request, alias, 1, origin, authToken, accessToken));
                            } else {

                                $('#' + id).remove();
                                $('#' + nextFriend.attr('id')).before(htmlAddPeer(id, index, request, alias, 1, origin, authToken, accessToken));

                            }

                        }



                               
                    });
                    ////////////////////////////////////////////////////////////

                    $('#grid-container-modify-friend' + index).remove();
                    isOpen = false;
    
                });
                
            });

                
                $.contextMenu({
                    selector: '.context-menu-three',
                    trigger: 'hover',
                    callback: function (key, opt) {
                        
                        let messageJSON = JSON.parse($(this).attr('value'));
                        let peer = messageJSON.peer;
                        let index = messageJSON.index;
                        let request = messageJSON.request;
                        let group = messageJSON.group;
                        let alias = messageJSON.alias;
                        let authToken = messageJSON.authToken;
                        let accessToken = messageJSON.accessToken;
                        
                        
                        //Set the authentication data payload for messages in case they haven't requested the recipient's timeline
                        //This is to prevent malicious access using an API client like Postman or something else. 
                        //The peers have to be friends and send the correct qauth token pair.
                        data = { authToken: authToken, accessToken: accessToken };

                        switch (key) {
                            
                            case "edit":
                                /////////
                                if (!isOpen) {
                                    isOpen = true;
                                    let list;

                                    if (group == 0)
                                        list = '#friends-list-item';
                                    else
                                        list = '#groups-list-item';

                                    $(list + index).append(htmlEditPeerForm(index, alias, peer)); //grid-container-new-friend

                                    if (group == 1)
                                        document.getElementById("checkbox-new-group").checked = true;
                                    else
                                        document.getElementById("checkbox-new-group").checked = false;
                                } else {
                                    $('#grid-container-modify-friend' + index).remove();
                                    isOpen = false;
                                }

                                ////
                                break;
                            case "message":
                                var dialog
                                
                                dialog = $('#message-form' + index).dialog({
                                    autoOpen: false,
                                    height: 650,
                                    width: 500,
                                    modal: true,
                                    classes: {

                                    },
                                    buttons: {
                                        "Send": function () {

                                            var body = $('#message-form' + index).find('textarea[name="message-body' + index + '"]').val();

                                            //Check remote server availability
                                            var img = document.body.appendChild(document.createElement("img"));
                                            img.src = 'https://' + peer + '.ngrok.io/images/profile.jpg';
                                           
                                            img.onerror = function () {
                                                alert(peer + ' is currently offline. Your message will be sent when ' + peer + ' is online.');
                                                $.post('/messages/body/' + body + '/recipient/' + peer, data, function (result) {

                                                });
                                            };
                                           
                                            if (body == "") {
                                                alert("The body of the message cannot be empty");
                                            } else {
                                                
                                                $.post('https://' + peer + '.ngrok.io/messages/body/' + encodeURIComponent(body) + '/request/' + encodeURIComponent(request), data, function (result) {
                                                    if (result.status == 200)
                                                        alert("Message sent to: " + peer);
                                                    else
                                                        alert("Error send message to: " + peer + " try again later.");

                                                });
                                                
                                            }
                                            dialog.dialog('close');
                                        },
                                        //Cancel: function () {
                                        //    dialog.dialog("close");
                                        //}
                                    },

                                });
                                dialog.dialog("open");
                                //this.doMessageDialog('message-form' + index, peer);

                                break;
                            case "delete":

                                var r = confirm("Are you sure you want to delete friend " + peer + "?");
                                if (r == true) {

                                    $.ajax({
                                        url: "/peers/alias/" + encodeURIComponent(peer),
                                        type: 'DELETE',
                                        success: function (data, textStatus, jqXHR) {
                                            location.reload();
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
                    }, items: {
                        "message": { name: "Message", icon: "fas fa-envelope-open-text" },
                        "edit": { name: "Edit", icon: "edit" },
                        "delete": { name: "Delete", icon: "delete" },
                        "quit": {
                            name: "Quit", icon: function () {
                                return 'context-menu-icon context-menu-icon-quit';
                            }
                        }
                    }
                });

                //Form for adding a new friend
                $(document).ready(function () {
                    $('#add-friend').on('click', function (event) {

                        event.preventDefault();
                        
                        var source = event.target || event.srcElement;
                        var child = document.getElementById('grid-container-new-friend');
                        var contains = document.getElementById('add-friend').contains(child);

                        if (!contains) {
                            $('#add-friend').append(htmlCreatePeerForm()); //grid-container-new-friend
                        } else if (source.id == 'new-friend-label') {
                            $('#grid-container-new-friend').remove();
                        } 
                        
                    });
                    
                });

            //Check peer status
            function checkPeer(alias, request, group, message) {
                
                var list;

                //Need to know which list to get
                if (typeof group === 'undefined') {
                    list = document.getElementById("friends-list");
                } else {
                    list = document.getElementById("groups-list");
                }
                var listItems = list.getElementsByTagName("li");
                var i, querystring, urlParams, alias0, request0;

                    for (var index = 0; index < listItems.length; ++index) {

                        i = listItems[index].firstElementChild.toString().indexOf('?');
                        querystring = listItems[index].firstElementChild.toString().substr(i);
                        urlParams = new URLSearchParams(querystring);

                        alias0 = urlParams.get('alias');
                        request0 = urlParams.get('request');

                        if (alias0 == alias && request0 == request) {
                            alert(alias + message);
                            return true;


                        } 
                        
                    }
                    return false;
                    
            };

                //Add the new friend
                $(document).ready(function () {
                    $('#add-friend').on('click', '#add-new-friend-button', function (event) {

                        
                        var alias = $('#textarea-friend-alias').val();
                        var request = $('#textarea-friend-xurl').val();
                        var group = $('#checkbox-new-group:checked').val();
                        

                        //These are for sending the request to the peer
                        var origin = $('#content').attr('origin');
                        var requestgroup = $('#content').attr('group');

                        if (alias == '')
                            alert('Alias cannot be empty');
                        else if (request == '')
                            alert('Domain name cannot be empty');
                        else {

                           //Need to check if the new peer is online. If not then queue the request
                            
                                $.post('peers/request/' + request + '/alias/' + alias + '/group/' + group, function (result) {

                                    //Check if this friend already exists in the list
                                    var isPeer = checkPeer(alias, request, group, ' is already a friend');

                                    //Close the Manage Friends form
                                    $('#grid-container-new-friend').remove();
                                    if (!isPeer) {

                                        //reset everything just to make sure
                                        i = "";
                                        querystring = "";
                                        urlParams = null;
                                        alias0 = "";
                                        request0 = "";
                                    

                                        //Add new friend to friends list                                    
                                        var index = result.length - 1;
                                        var authToken = result[index].authToken;
                                        var accessToken = result[index].accessToken;
                                       

                                        if (result[index].group == "undefined") {
                                            var id = 'friends-list-item' + index;
                                            $('#friends-list').append(htmlAddPeer(id, index, request, alias, 0, origin, authToken, accessToken));
                                           
                                        } else {
                                            var id = 'groups-list-item' + index;
                                            $('#groups-list').append(htmlAddPeer(id, index, request, alias, 1, origin, authToken, accessToken));
                                           
                                        }

                                        //if successful, then send the authToken to the new friend.
                                        $.post(result[index].url + '/peers/origin/' + origin + "/request/" + request + "/authToken/" + result[index].authToken + "/group/" + requestgroup, function (result) {

                                            alert('Friend Request Sent to ' + request);
                                        });
                                    }
                                
                                });
                             }

                    });
                });

                //Open the list of new friend requests
                $(document).ready(function () {
                    $('[id = "requests"]').on('click', function (event) {
                        event.preventDefault();
                        
                        var child = document.getElementById('request-new0');
                        var contains = document.getElementById('requests').contains(child);

                        if (!contains) {
                            $.get("/peers/requests", function (result) {
                               

                                for (var index = 0; index < result.messages.length; index++) {

                                    $("#requests").append('<div id=request-new' + index + ' class=sender><li><div id=request-message' + index + ' class=new-message>' + result.messages[index].body.substring(0, 20) + '...<span id=request-new' + index + ' class=context-menu-six value={\"xurl\":\"' + result.messages[index].xurl + '\",\"body\":\"' + encodeURIComponent(result.messages[index].body) + '\",\"name\":\"' + result.messages[index].name + '\",\"authToken\":\"' + result.messages[index].photo + '\",\"index\":\"' + index + '\",\"group\":\"' + ((result.messages[index].url==1) ? "on" : "undefined") + '\"}><i class="fas fa-ellipsis-h fa-xs"></i></span></li></div></div>');

                                }


                            });
                        } else {

                            $("#requests").find("div").remove();
                            

                        }
                    });

                });

            //$(function () {
                $.contextMenu({
                    selector: '.context-menu-six',
                    trigger: 'hover',
                    callback: function (key, opt) {


                        var messageJSON = JSON.parse($(this).attr('value'));
                        var messageBody = decodeURIComponent(messageJSON.body);
                        var authToken = messageJSON.authToken;
                        var messageName = messageJSON.name;
                        var group = messageJSON.group;
                        var friend = messageJSON.xurl;
                        var index = messageJSON.index;
                        var origin = $('#content').attr('origin');


                        switch (key) {
                            case "accept":

                                //Generate access token for requester
                                var accessToken = Math.random().toString(36).replace('0.', '');

                               //Accept friend request
                                $.post("https://" + messageBody + ".ngrok.io/peers/request/accept/friend/" + friend + "/accessToken/" + accessToken, function (result) {

                                    $('#request-new' + index).remove();
                                    var requestcount = $('#request-count').text().replace('Requests - ', '');

                                    if (requestcount > 0) {
                                        $('#request-count').text("Requests - " + (requestcount - 1));
                                        $('#request-count').css('color', 'green');
                                    }
                                    else {
                                        $('#request-count').text("Requests - 0");
                                        $('#request-count').css('color', 'blue');
                                    }

                                    //add new friend whose request I just accepted and delete the request
                                    $.post("peers/request/accept/friend/" + messageBody + "/authToken/" + authToken + "/accessToken/" + accessToken + "/group/" + group + "/message/" + messageName, function (result) {

                                        var newIndex = result.length - 1;

                                        var request = result[newIndex].xurl;
                                        var alias = result[newIndex].alias;
                                        var authToken = result[newIndex].authToken;
                                        var accessToken = result[newIndex].accessToken;            

                                        if (group == "undefined") {
                                            $('#friends-list').append(htmlAddPeer("friends-list-item"+newIndex, newIndex, request, alias, 0, origin, authToken, accessToken));
                                          
                                        } else {

                                            $('#groups-list').append(htmlAddPeer("groups-list-item" + newIndex, newIndex, request, alias, 1, origin, authToken, accessToken));
                                         
                                        }

                                    });
                                 

                                });

                                break;

                            case "reject":

                                var r = confirm("Are you sure you want to reject this friend?");
                                
                                if (r == true) {

                                    $.ajax({
                                        url: "/peers/request/reject/message/" + messageName,
                                        type: 'DELETE',
                                        success: function (data, textStatus, jqXHR) {

                                            $('#request-new' + index).remove();
                                            var requestcount = $('#request-count').text().replace('Requests - ', '');

                                            if (requestcount > 0) {
                                                $('#request-count').text("Requests - " + (requestcount - 1));
                                                $('#request-count').css('color', 'green');
                                            }
                                            else {
                                                $('#request-count').text("Requests - 0");
                                                $('#request-count').css('color', 'blue');
                                            }
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
                        "accept": { name: "Accept", icon: "fas fa-envelope-open-text" },
                        "reject": { name: "Reject", icon: "delete" },
                        "quit": {
                            name: "Quit", icon: function () {
                                return 'context-menu-icon context-menu-icon-quit';
                            }
                        }
                    }
                });
           // });
                       
            
        },
        
    };
       
})();

(function($) {
    $(function () {
        Peer.init();
    });
}(window.jQuery));
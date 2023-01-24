/**
         * HTML Templates
         *
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

function htmlProfile(origin, alias, remote, peer, group) {

    var profilePic, postTextArea, postInput;

    if (peer == null) {

        profilePic = "<div> <a href='/images/profile.jpg'><img id='profile-img' src='/images/profile.jpg'></a></div>";
        postTextArea = "<textarea class='textarea-create-post' data-autoresize rows='1' style='border: none' request='" + origin + "' name='body' id='body'></textarea>";
        postInput = "<input type='text' maxlength='40' name='post' id='post' value='Whats on your mind?'>";

    } else {
        if (group == 0) {
            profilePic = "<div> <a href='" + remote + "/images/profile.jpg'><img id='profile-img' src='" + remote + "/images/profile.jpg'></a></div>";
            postTextArea = "";
            postInput = "";

        } else {
            profilePic = "<div> <a href='" + remote + "/images/profile.jpg'><img id='profile-img' src='" + remote + "/images/profile.jpg'></a></div>";
            postTextArea = "<textarea class='textarea-create-post' data-autoresize rows='1' style='border: none' request='" + origin + "' remote='" + remote + "' peer='" + peer + "' name='body' id='body'></textarea>";
            postInput = "<input type='text' maxlength='40' name='post' id='post' value='Whats on your mind?'>";
        }
    }

        return "<div id='grid-container-profile' class='grid-container-profile' value='" + origin + "'>" +
            "<div></div>" +
            profilePic +
            "<div></div>" +
            "<div></div>" +
            "<div class='alias' id='alias'>" + alias + "</div>" +
            "<div></div>" +
            "<div class='publish'>" +
            postInput +
            "<span class='post' id='post-dialog' title='Create Post'>" +
            "<div class='grid-container-dialog'>" +
            "<div>" +
            postTextArea +
            "</div>" +
            "</div>" +
            "</span>" +
            "</div>" +
            "</div>" +
            "<div id='Content-Wrapper' class='Content-Wrapper'>"
    
}
function htmlTimeline(index, body, edits, anchorImg, prevTitle, prevDesc, date, likes, commentsLength, like, comment, name, alias, origin, request, commentsList) {

    var options;

    if (origin == request) {
        //options-Container-content
        options = "<div class='grid-container-options'>" +
            "<div class='like'>" + like +
            "</div>" +
            "<div class='comment'>" + comment +
            "</div>" +
            "</div>";
        //options-Container-content
    } else {
        options = "<div class='grid-container-request-options'>" +
            "<div class='like'>" + like +
            "</div>" +
            "<div class='comment'>" + comment +
            "</div>" +
            "<div>" +
            "<span id='share" + index + "' value='{\"content\":\"" + name + "\", \"request\":\"" + request + "\"}'><img src='/images/shares.png' id='img#{index}' width='150' height='35'></span>" +
            "</div >" +
            "</div>" ;
    }

    //grid-container-content
    return "<div class='grid-container-content' id='grid-container-content" + index + "'>" +
        "<div></div>" +
        "<div></div>" +
        edits +
        "<div></div>" +
        "<div class='body" + index + "'>" +
        "<span class='preview-body' id='previewbody" + index + "'>" + body + "</span>" +
        anchorImg +
        "<h5 id='previewtitle" + index + "'>" + prevTitle + "</h5>" +
        "<preview id='previewdesc" + index + "'> " + prevDesc + "</preview></br>" +
        "<h6> " + date + "</h6>" +
        "</div>" +
        "<div></div>" +
        "<div></div>" +
        "<div class='grid-container-likes'>" +
        "<div class='like-count' id='like-count" + index + "'>" + likes +
        "</div>" +
        "<div class='likes-image'>" +
        "<img src='/images/like.jpg' width='30' height='30'>" +
        "</div>" +
        "</div>" +
        "<div></div>" +
        "<div>" +
        "</div>" +

        //options-Container-content
         options +
        //options-Container-content

        "<div>" +
        "</div>" +
        "<div>" +
        "</div>" +
        "<div>" +
        "<textarea class='textarea-create-comment' data-autoresize rows='1' onkeypress=\"submitComment(this.id, this.value,'" + name + "','" + alias + "','" + request + "','" + commentsLength + "')\" id='comment-field" + index + "' placeholder='Write a comment...' size='92'></textarea>" +
        "</div>" +
        "<div>" +
        "</div>" +

        "<div>" +
        "</div>" +
        commentsList +

        "</div>" +
        "</div>"
        //grid-container-content

}
function htmlEdits(group, origin, xurl, index, name, local, body) {

    var edits;

    //Allow the poster to edit the post otherwise not. This is to account for groups when the group owner loads the group timeline.
    //but it also has to work for non-group timelines locally.
    if (group == 1) {
        if (origin == xurl) {
            edits =
                "<div></div>" +
                "<div class='post-header'></div>" +
                "<div class='post-header'>" + xurl + "</div>" +
                "<div class='post-header'>" +
                "<span class='context-menu-one' id='context-menu-" + index + "' value={\"post\":\"" + name + "\",\"request\":\"" + local + "\",\"origin\":\"" + origin + "\"}><i class='fas fa-ellipsis-h'></i></span>" +
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
    } else {
        edits = "<div></div>" +
            "<div class='post-header'></div>" +
            "<div class='post-header'>" + xurl + "</div>" +
            "<div class='post-header'>" +
            "<span class='context-menu-one' id='context-menu-" + index + "' value={\"post\":\"" + name + "\",\"request\":\"" + local + "\",\"origin\":\"" + origin + "\"}><i class='fas fa-ellipsis-h'></i></span>" +
            "<span class='dialog-form" + index + "' style='display:none' title='Edit Post'>" +
            "<div class='grid-container-dialog'>" +
            "<div>" +
            "<textarea class='textarea-edit-post' style='border: none' name='edit-body" + index + "' id='edit-body" + index + "'> " + body + "</textarea>" +
            "</div>" +
            "</div>" +
            "</span>" +
            "</div>";
    }

    return edits;

}
function htmlAddPeer(id, index, request, alias, group, origin, authToken, accessToken ) {

    return "<li id=" + id + "><a href=https://" + request + ".loca.lt/remote/?alias=" + alias + "&origin=" + origin + "&request=" + request + "&authToken=" + authToken + "&accessToken=" + accessToken + " alias=" + alias + " remote=https://" + request + ".loca.lt group=" + group + " id=peer" + index + ">" + alias + "</a>" +
        "<span>(" + request + ")</span>" +
        "<span class=context-menu-three id=context-menu-" + index + " value={\"peer\":\"" + request + "\",\"alias\":\"" + alias + "\",\"group\":\"" + group + "\",\"index\":\"" + index + "\",\"request\":\"" + origin + "\",\"authToken\":\"" + authToken + "\",\"accessToken\":\"" + accessToken + "\"} title=Manage Friend><i class='fas fa-ellipsis-h'></i></span><span class=message-form id=message-form" + index + " style=display:none title=Create Message><div class=grid-container-dialog><div><textarea class=textarea-create-post data-autoresize rows=1 style=border: none name=message-body" + index + " id=message-body" + index + "></textarea></div></div></span></li>";

}
function htmlEditPeerForm(index, alias, domain) {
   
    return '<div class=grid-container-modify-friend id=grid-container-modify-friend' + index + '>' +
        '<div>' +
        '<textarea id=textarea-friend-alias>' + alias + '</textarea>' +
        '</div> ' +
        '<div>' +
        'Alias' +
        '</div > ' +
        '<div>' +
        '<textarea id=textarea-friend-xurl>' + domain + '</textarea>' +
        '</div> ' +
        '<div>' +
        'Domain' +
        '</div > ' +
        '<div>' +
        '<input type=checkbox id=checkbox-new-group name=checkbox-new-group onclick=event.stopPropagation() />' +
        '</div>' +
        '<div>' +
        'Group' +
        '</div>' +
        '<div class=grid-container-manage-friends-buttons>' +
        '<i id=modify-friend-button' + index + ' class="modify-friend fas fa-plus-circle fa-2x"></i>' +
        '</div>' +
        '<div>' +
        '</div>' +
        '</div>';


}
function htmlCreatePeerForm() {

    return '<div class=grid-container-new-friend id=grid-container-new-friend>' +
        '<div>' +
        '<textarea id=textarea-friend-alias></textarea>' +
        '</div> ' +
        '<div>' +
        'Alias' +
        '</div > ' +
        '<div>' +
        '<textarea id=textarea-friend-xurl></textarea>' +
        '</div> ' +
        '<div>' +
        'Domain' +
        '</div > ' +
        '<div>' +
        '<input type=checkbox id=checkbox-new-group name=checkbox-new-group onclick=event.stopPropagation() />' +
        '</div>' +
        '<div>' +
        'Group' +
        '</div>' +
        '<div class=grid-container-manage-friends-buttons>' +
        '<i id=add-new-friend-button class="add-friend fas fa-plus-circle fa-2x"></i>' +
        '<div class=peers-tooltip >' + htmlAddNewFriendToolTip() + '</div>' +


        '</div>' +
        '<div>' +

        '</div>' +

        '</div>';
}
function htmlAddNewFriendToolTip() {

    return "<span><p>Provide an Alias and tunnelme domain name to add a new friend to your friend's network.</p>" +
        "<p>You must enter an Alias and a Domain name, no spaces in the Alias</p></span >" +
        "<p>Check the group checkbox if the friend you are adding has a group timeline.</p>";
}
function htmlModifyFriendToolTip() {

    return "<p>Modify the Alias or Domain name.</p></span >" +
        "<p>Check the group checkbox if the friend you are modifying has a group timeline.</p>";
}
function htmlProfileForm(alias) {
    return "<div id=grid-container-profile-admin></br>" +
        '<form method=POST enctype="multipart/form-data" action=/profile id=ProfileForm>' +
            '<label for="ProfileFile">Profile Picture:</label>' +
            '<input type=file name=Profile class=form-control id=ProfileFile accept=image/* onclick=event.stopPropagation() /></br>' +
            '<label for=ProfileAlias>Alias</label>' +
            '<input type=text class=profile-alias name=ProfileAlias id=ProfileAlias value="' + alias + '" /></br >' +
            '<label for=ProfileGroup>Group Timeline</label>' +
            '<input type=checkbox name=ProfileGroup id=ProfileGroup onclick=event.stopPropagation() /></br>' +
            '<input type=submit value=Update id=ProfileSubmit onclick=event.stopPropagation() />' +
        '</form>' +
    '</div>'
       
}

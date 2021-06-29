//Share a post
$(document).ready(function () {
    $('[id = "content"]').on('click', '[id ^= "share"]', function (event) {
        event.preventDefault();

        var contentJSON = JSON.parse($(this).attr('value'));

        var request = contentJSON.request;
        var content = contentJSON.content;
        var origin = $('#content').attr('origin');

        var url = 'https://' + request + '.ngrok.io/share/content/' + content + '/request/' + origin;
        var result = window.open(url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
        if (result === null)    
            alert("Error sharing post");


    });
});
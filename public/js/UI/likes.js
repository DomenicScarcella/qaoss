//Like a post
$(document).ready(function () {
    $('[id = "content"]').on('click', '[id ^= "like"]', function (event) {
        event.preventDefault();
       
        //Get the endpoint to the post to like
        var content = this.getAttribute('value');
        var contentJson = JSON.parse(content);

        var request = contentJson.url;
        var origin = $('#content').attr('origin');

        //Get the id of the like button pressed
        var id = $(this).attr('id');
        var url = "";

        //Get the id of the like indicator to update
        var target = id.replace('like', 'like-count');
        var image = id.replace('like', 'img');

        if (origin == request)
            url = "/likes/post/" + contentJson.content + "/alias/" + contentJson.alias + "/request/" + contentJson.request;
        else
            url = "https://" + request + ".ngrok.io/likes/post/" + contentJson.content + "/alias/" + contentJson.alias + "/request/" + origin;

        //Local requests don't need authentication
        if (typeof data === 'undefined') {
            data = { authToken: null, accessToken: null };
        }

        $.post(url, data, function (result) {

            if (result.result == -1)
                alert("You are not a registered friend.");
            else {
                //Update the like indicator asynchronously
                $('#' + target).html(result.likes);
                if (result.crement == 0)
                    $('#' + image).attr("src", "/images/likes.png");
                else
                    $('#' + image).attr("src", "/images/liked0.png");
            }

        });


    });
});
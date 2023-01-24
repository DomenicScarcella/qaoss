/**
         * Everything UI Post
         * Create, Edit, Delete
         *
         *
         * @author Don Cooper<qaoss@yahoo.com>
         *
**/

function doPostDialog() {
    var dialog;
    dialog = $('#post-dialog').dialog({
        autoOpen: false,
        height: 'auto',
        width: 500,
        resizable: false,
        modal: true,
        postFileData: JSON.parse('{}'),
        close: function (event, ui) {
            $('.post').find('textarea[name="body"]').val('');
            dialog.find("PostForm").remove();
            dialog.dialog('destroy');
           
           
        },
        buttons: [
            {
                text: "Photo",
                id: 'photobtn',
                class: '',
                icons: { primary: "ui-icon-image" },

                click: function (input) {
                    
                    //Create an input form for pics if it doesn't already exist
                    if (!$('#PostForm').length) {
                        $('.ui-dialog-buttonpane').append(

                            '<form id="PostForm" runat="server">' +
                            '<img id="PostPhoto" src="" /> <br />' +
                            '<input type=file id="PostFile" accept=image/* />' +
                            '</form>'

                        );
                        $('#PostPhoto').hide();
                    } else {
                        $('#PostForm').remove();
                    }

                    //Function to see the selected pic
                    function readURL(input) {
                        if (input.files && input.files[0]) {
                            var reader = new FileReader();

                            reader.onload = function (e) {
                                $('#PostPhoto').attr('src', e.target.result);
                                $('#PostPhoto').show();

                            }

                            reader.readAsDataURL(input.files[0]);

                        }
                    }

                    //Event listener to handle selecting the pic
                    $("#PostFile").change(function () {
                        postFileData = this.files[0];
                        readURL(this);

                    });
                }
            },
            {
                text: "Save",
                id: 'postbtn',
                class: 'saveButtonClass',
                icons: { primary: "ui-icon-plusthick" },

                click: function () {


                    //Need to encode the '?' in the text if there is any.
                    var body = $('.post').find('textarea[name="body"]').val();
                    var remote = $('.post').find('textarea[name="body"]').attr('remote');
                    var request = $('.post').find('textarea[name="body"]').attr('request');
                    var peer = $('.post').find('textarea[name="body"]').attr('peer');
                    var origin = $('#content').attr('origin');
                    var cors = false;

                    var postURL = "";
                    var requestUrl;
                    var postFormData;

                    if (origin == request)
                        requestUrl = '/post/body/';
                    else {
                        requestUrl = remote + '/post/body/';
                        cors = true;

                    }

                    var urlRegex = /(https?:\/\/[^ \n]*)/;
                    if (body.match(urlRegex) != null) {
                        postURL = body.match(urlRegex)[1];
                        body = body.replace(postURL, '');

                    }
                    else
                        postURL = "undefined";

                    if (body == "")
                        body = "undefined";
                    else
                        body = body;

                    if (body == "undefined" && postURL == "undefined") {

                        alert("The body of the post cannot be empty");
                    } else {

                        requestUrl = requestUrl + encodeURIComponent(body) + '/url/' + encodeURIComponent(postURL) + '/request/' + origin;

                        if (typeof postFileData !== "undefined") {
                            postFormData = new FormData();
                            postFormData.append('File', postFileData);
                        } else {
                            postFormData = new FormData();
                            postFormData.append('File', null);
                        }

                        //Local requests don't need authentication but remote group posts do
                        //We can't send the tokens in the data payload because processData has 
                        //to be set to 'fasle' in order to process the form data.
                        //we could add the tokens to the form data but then we'd have to modify the Multer middleware
                        //cleaner to do it like this.
                        if (typeof data !== 'undefined') {
                            requestUrl += '/authToken/' + data.authToken + '/accessToken/' + data.accessToken;
                        } else {
                            requestUrl += '/authToken/null/accessToken/null';
                        }
                        
                        
                        $('.progress').show();
                        $.ajax({

                            url: requestUrl,
                            type: "POST",
                            data: postFormData,
                            processData: false,
                            contentType: false,
                            headers: 'Content-type: multipart/form-data',

                            success: function (data, textStatus, jqXHR) {
                                $('.progress').hide();
                                dialog.dialog('close');

                                $('.post').find('textarea[name="body"]').val("");

                                if (remote == null)
                                    location.reload();
                                else
                                    $('#' + peer).click();

                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                alert(jqXHR.responseText + " : " + textStatus + " : " + errorThrown);
                            }

                        });
                    }
                }
            }
            
        ],

    });
    dialog.dialog("open");


}

//New post
$(document).ready(function () {
    $('[id="content"]').on('click', '[id="post"]', function (event) {
        doPostDialog();
    });
});

//Edit posts dialog
function doEditDialog(elem, index, content, url, origin, request) {
    var dialog;

    dialog = $('.' + elem).dialog({
        autoOpen: false,
        height: 650,
        width: 500,
        resizable: false,
        modal: true,
        fileData: JSON.parse('{}'),
        close: function (event, ui) {
            dialog.find("form1").remove();
            dialog.dialog('destroy');

        },
        buttons: [
            {
                text: "Photo",
                id: 'photobtn',
                class: '',
                icons: { primary: "ui-icon-image" },

                click: function (input) {

                    //Create an input form for pics if it doesn't already exist
                    if (!$('#form1').length) {
                        $('.ui-dialog-buttonpane').append(

                            '<form id="form1" runat="server">' +
                            '<img id="Photo" src="" /> <br />' +
                            '<input type=file id="File" accept=image/* />' +
                            '</form>'

                        );
                        $('#Photo').hide();
                    } else {
                        $('#form1').remove();
                    }

                    function readURL(input) {
                        if (input.files && input.files[0]) {
                            var reader = new FileReader();

                            reader.onload = function (e) {
                               
                                $(".ui-dialog-buttonpane").append('<img id="Photo" src=""/>');
                                $('#Photo').attr('src', e.target.result);
                                $('#PhotoEdit').remove();
                                $('#Photo').show();


                            }

                            reader.readAsDataURL(input.files[0]);

                        }
                    }

                    $("#File").change(function () {
                        fileData = this.files[0];
                        readURL(this);

                    });
                }
            },
            {
                text: "Delete Photo",
                id: 'deletebtn',
                class: 'deleteButtonClass',
                icons: { primary: "ui-icon-minusthick" },

                click: function () {

                    var url = '';

                    if (origin == request) {
                        url = "/post/photo/post/" + content.name + '/request/' + origin + '/authToken/null/accessToken/null';
                    } else {
                        url = "https://" + request + ".loca.lt/post/photo/post/" + content.name + '/request/' + origin + '/authToken/' + data.authToken + '/accessToken/' + data.accessToken;
                    }
                    if (confirm('Are you sure you want to delete the photo?')) {
                        $('.progress').show();
                        $.ajax({
                            url: url,
                            type: 'DELETE',
                            success: function (data, textStatus, jqXHR) {
                                $('.progress').hide();
                                $('#Photo').remove();
                                dialog.dialog('close');


                                $('#previewbody' + index).html(data.content.body);

                                if (data.content.preview.img == '')
                                    $('#previewimg' + index).hide();
                                else {
                                    $('#previewimg' + index).show();
                                    $('#previewimg' + index).attr("src", data.content.preview.img);
                                }

                                $('#previewurl' + index).attr("href", data.content.url);
                                $('#previewtitle' + index).text(data.content.preview.title);
                                $('#previewdesc' + index).text(data.content.preview.description);
                            }
                        });
                    }
                }

            },
            {
                text: "Save",
                id: 'savebtn',
                class: 'saveButtonClass',
                icons: { primary: "ui-icon-plusthick" },

                click: function () {

                    //Need to encode the '?' in the text if there is any.

                    var body = $('.' + elem).find('textarea[name="edit-body' + index + '"]').val();    
                    var postURL = "";
                    var requestUrl;
                    var formData;
                    
                    var urlRegex = /(https?:\/\/[^ \n]*)/;
                    if (body.match(urlRegex) != null)
                        postURL = body.match(urlRegex)[1];
                    else
                        postURL = "undefined";

                    body = body.replace(postURL, '');

                    if (body == "")
                        body = "undefined";

                    if (body == "undefined" && postURL == "undefined") {
                        alert("The body of the post cannot be empty");
                    } else {
                        if (origin == request) {

                            requestUrl = url + '/body/' + encodeURIComponent(body) + '/url/' + encodeURIComponent(postURL) + "/request/" + origin + "/authToken/null/accessToken/null";
                        }else
                            requestUrl = url + '/body/' + encodeURIComponent(body) + '/url/' + encodeURIComponent(postURL) + "/request/" + origin + "/authToken/" + data.authToken + "/accessToken/" + data.accessToken;

                        if (typeof fileData !== "undefined") {
                            formData = new FormData();
                            formData.append('File', fileData);
                        } else {
                            formData = new FormData();
                            formData.append('File', null);
                        }

                        $('.progress').show();
                        $.ajax({

                            url: requestUrl,
                            type: "POST",
                            data: formData,
                            processData: false,
                            contentType: false,
                            headers: 'Content-type: multipart/form-data',

                            success: function (data, textStatus, jqXHR) {

                                $('.progress').hide();
                                dialog.dialog('close');

                                if (data.content.photo != "") {
                                    if (origin == request) {
                                        $('#previewbody' + index).html(data.content.body + "<br><br><a href=" + data.content.photo + "><img src=" + data.content.photo + '?' + Math.random() + " width=750 height=450></a>");
                                    } else {
                                        $('#previewbody' + index).html(data.content.body + "<br><br><a href=" + data.content.photo + "><img src=https://" + request + ".loca.lt/" + data.content.photo + "?" + Math.random() + " width=750 height=450></a>");

                                    }
                                } else {
                                    $('#previewbody' + index).html(data.content.body);
                                }

                                if (data.content.preview.img == '')
                                    $('#previewimg' + index).hide();
                                else {
                                    $('#previewimg' + index).show();
                                    $('#previewimg' + index).attr("src", data.content.preview.img);
                                }

                                $('#previewurl' + index).attr("href", data.content.url);
                                $('#previewtitle' + index).text(data.content.preview.title);
                                $('#previewdesc' + index).text(data.content.preview.description);
                            },

                            error: function (jqXHR, textStatus, errorThrown) {
                                $('.progress').hide();
                                dialog.dialog('close');
                                alert(jqXHR.responseText + " : " + textStatus + " : " + errorThrown);
                            }
                        });
                    }
                }
            }
        ],
        open: function (event, ui) {
            var editBody = '';
            if (content.body != '' && content.url != '')
                editBody = content.body + "\n" + content.url;
            else if (content.body != '' && content.url == '')
                editBody = content.body;
            else
                editBody = content.url;

            var photo = '';
            $("#edit-body" + index).val(editBody);

            if (origin == request) {
               photo = '<img id="PhotoEdit" src="' + content.photo + '?' + Math.random() + '"/>'
            } else {
               photo = '<img id=PhotoEdit src=https://' + request + '.loca.lt/' + content.photo + '?' + Math.random() + '/>'
            }

            if (content.photo != '') {
                $(".ui-dialog-buttonpane").append(photo);
                $('#PhotoEdit').show();
                $('#deletebtn').show();
            } else {
                $('.ui-dialog-buttonpane button:contains("Delete Photo")').button().hide();
                
            }

        }

    });

    dialog.dialog("open");

}

$(function () {
    $.contextMenu({
        selector: '.context-menu-one',
        trigger: 'hover',
        callback: function (key, opt) {
           
            var commentJSON = JSON.parse($(this).attr('value'));
            var origin = commentJSON.origin;
            var request = commentJSON.request;
            var post = commentJSON.post;
            var id = $(this).attr('id');
            var target = id.replace('context-menu-', '');
            var url;

            switch (key) {
                case "edit":
                    if (origin == request) {
                        $.get("/post/content/" + post + "/request/" + origin + "/authToken/null/accessToken/null", function (content) {

                            url = "/post/post/" + post;
                            
                            doEditDialog("dialog-form" + target, target, content, url, origin, request);
                        });
                    } else {

                        $.get("https://" + request + ".loca.lt/post/content/" + post + "/request/" + origin + "/authToken/" + data.authToken + "/accessToken/" + data.accessToken, function (content) {

                            url = "https://" + request + ".loca.lt/post/post/" + post;

                            doEditDialog("dialog-form" + target, target, content, url, origin, request);
                        });
                    }

                    break;

                case "delete":

                    var r = confirm("Are you sure you want to delete this post?");
                    var requestUrl;

                    if (r == true) {

                        if (origin == request) {
                            requestUrl = "/post/post/" + post + "/request/" + origin + "/authToken/null/accessToken/null";
                        } else {
                            requestUrl = "https://" + request + ".loca.lt/post/post/" + post + "/request/" + origin + "/authToken/" + data.authToken + "/accessToken/" + data.accessToken;
                        }
                        var id = $(this).attr('id');
                        $.ajax({

                            url: requestUrl,
                            type: "DELETE",
                            processData: false,
                            contentType: false,
                            
                            success: function (data, textStatus, jqXHR) {
                                
                                $('#grid-container-content' + target).remove();
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

//Automatically resize text areas
$(document).ready(function () {
    $(document).on('click keypress', 'textarea', function (event) {
        document.querySelectorAll('[data-autoresize]').forEach(function (element) {
            element.style.boxSizing = 'border-box';
            var offset = element.offsetHeight - element.clientHeight;
            element.addEventListener('input', function (event) {
                event.target.style.height = 'auto';
                event.target.style.height = event.target.scrollHeight + offset + 'px';
            });
            element.removeAttribute('data-autoresize');
        });
    });
});
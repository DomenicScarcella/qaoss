//Form for modifying profile
$(document).ready(function () {
    $('#profile').on('click', function (event) {

        event.preventDefault();
                
        var source = event.target || event.srcElement;
        var child = document.getElementById('grid-container-profile-admin');
        var contains = document.getElementById('profile').contains(child);

        var group = $('#content').attr('group');
        var alias = $('#content').attr('alias');

        if (!contains) {
            $('#profile').append(htmlProfileForm(alias)); //grid-container-new-friend
            
        } else if (source.id == 'profile-label') {
            $('#grid-container-profile-admin').remove();
        } 

                
    });
});


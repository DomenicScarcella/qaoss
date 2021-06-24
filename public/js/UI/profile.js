//Form for adding a new friend
$(document).ready(function () {
    $('#profile').on('click', function (event) {

        event.preventDefault();
                
        var source = event.target || event.srcElement;
        var child = document.getElementById('grid-container-profile-admin');
        var contains = document.getElementById('profile').contains(child);

        if (!contains) {
            $('#profile').append(htmlProfileForm()); //grid-container-new-friend
        } else if (source.id == 'profile-label') {
            $('#grid-container-profile-admin').remove();
        } 

                
    });
});


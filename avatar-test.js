// Generate Avatar the last Gater
let avatarAPI = "https://cors-anywhere.herokuapp.com/" + "https://avatars.dicebear.com/v2/:sprites/:seed.svg";

function generateAvatar() {
    $.ajax({
        url: avatarAPI,
        method: "GET"
    }).then(function(response){
        console.log(response);
    

    })
}

// event listener for the modal button
$("#avatar-button").on("click", generateAvatar);

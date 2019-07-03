// Generate Avatar the last Gater
let avatarMaleAPI = "https://cors-anywhere.herokuapp.com/" + "https://avatars.dicebear.com/v2/male/:seed.svg";
let avatarFemaleAPI = "https://cors-anywhere.herokuapp.com/" + "https://avatars.dicebear.com/v2/female/:seed.svg";



function generateMaleAvatar() {
    $.ajax({
        url: avatarMaleAPI,
        method: "GET"
    }).then(function(response){
        console.log(response);
        avatarDiv = $("<div>");
        avatarImage = $("<img>");
        avatarImage.attr("src", response.images.url);
        avatarDiv.append(avatarDiv);
        $("#avatar-button").prepend(avatarDiv);
    

    })
}

function generateFemaleAvatar() {
    $.ajax({
        url: avatarfemaleAPI,
        method: "GET"
    }).then(function(response){
        console.log(response);
        avatarDiv = $("<div>");
        avatarImage = $("<img>");
        avatarImage.attr("src", response.images.url);
        avatarDiv.append(avatarDiv);
        $("#avatar-button").prepend(avatarDiv);
    

    })
}

// event listener for the modal button
$("#avatar-button").on("click", generateAvatar);

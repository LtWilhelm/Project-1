let firebaseConfig = {
    apiKey: "AIzaSyCfu5kEk-9UxRv2-F3Qa6hELFINV1GUPVM",
    authDomain: "lernding.firebaseapp.com",
    databaseURL: "https://lernding.firebaseio.com",
    projectId: "lernding",
    storageBucket: "lernding.appspot.com",
    messagingSenderId: "20200720094",
    appId: "1:20200720094:web:7fc7a41473127f9c"
  };
firebase.initializeApp(firebaseConfig);

let database = firebase.database();

database.ref('wargame/users').set('');
// TODO push new users to firebase (wargame/users)


// variables 
let corsInsultApi = "https://cors-anywhere.herokuapp.com/" + "https://evilinsult.com/generate_insult.php?lang=en";
let compliment = "https://complimentr.com/api";
let wins = 0;

// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("insultBtn");
let btn2 = document.getElementById("complimentBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
  // modal.style.display = "block";
}
btn2.onclick = function() {
  // modal.style.display = "block";
}



// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// create a function for insults AJAX request
function generateInsult() {
  $.ajax({
    url: corsInsultApi,
    method: "GET"
  }).then(function(response){
    console.log("this is insult: " + response);
    $("#insult-body").html(response);
    $("#insultModal").modal("show");
  })
}

function generateCompliment() {
  $.ajax({
    url: compliment,
    method: "GET"
  }).then(function(response){
    console.log(response);
    $("#compliment-body").html(response.compliment);
    $("#complimentModal").modal("show");
  })
}




// event listener for the modal button
$("#insultBtn").on("click", generateInsult);
$("#complimentBtn").on("click", generateCompliment);


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


// ajax request for insults
let corsInsultApi = "https://cors-anywhere.herokuapp.com/" + "https://evilinsult.com/generate_insult.php?lang=en";
let compliment = "https://complimentr.com/api";
let wins = 0;

// create a function for AJAX request
function generateInsult() {
  $.ajax({
    url: corsInsultApi,
    method: "GET"
  }).then(function(response){
    console.log(response);

    let results = response;
  })

}
// crete a variable to hold wins counter
// create a coniditional = for every 3 wins, choose to insult or compliment
// find a way to disable a button until coniditional is fulfilled
// have the button turn from red to green when condition is fulfilled
// create a event listener button
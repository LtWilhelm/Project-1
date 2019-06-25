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
$("button").on("click", function(){
  let insults = $(this).attr("data-random");
  let queryURL = "https://lakerolmaker-insult-generator-v1.p.rapidapi.com/?mode=random" + insults +
        "&api_key=e81fe77619msh2471c50a974c11ap1de96ejsn5cd6e19541c6";
  
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response){
      console.log(queryURL);
      console.log(response);
    })


})
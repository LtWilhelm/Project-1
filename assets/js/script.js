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

$('#test').on('click', function(){
    unirest.get("https://lakerolmaker-insult-generator-v1.p.rapidapi.com/?mode=random")
.header("X-RapidAPI-Host", "lakerolmaker-insult-generator-v1.p.rapidapi.com")
.header("X-RapidAPI-Key", "8b6a11da3amsh22c8752de3dfc39p18a004jsn22160229d123")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
});
});


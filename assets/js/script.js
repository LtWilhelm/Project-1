let gameName;
let gameList = ['placeholder'];
let userName = 'test';
let wins = 0;
let losses = 0;


/* #region  firebase init */
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

/* #endregion */
database.ref('wargame/users').set('');
// TODO push new users to firebase (wargame/users)

database.ref('wargame').once('value').then(function(snapshot) {
  console.log(snapshot.val());
});

function createDBListeners () {
  database.ref('wargame/games/' + gameName).on('value', function(snapshot){
    let data = snapshot.val();
    console.log(data);
    if (data.user1.status && data.user2.status) {
      database.ref('wargame/games/' + gameName + '/isOpen').set(false);
    }
  });
}

function joinGame () {
  // window.location.href = './game.html';
  console.log(gameName);
  createDBListeners();
}

function findGame (mode) {
  switch (mode) {
    case 'random':
      (function () {
        gameList.forEach
      });
  }
}

function createGame(name) {
  gameName = name;
  
  database.ref('wargame/games/' + gameName).once('value').then(function(snapshot){
    console.log(snapshot.val());
    if (!snapshot.val() && gameName !== 'placeholder') {
      database.ref('wargame/games/' + gameName).set({
        isOpen: true,
        user1: {
          name: userName,
          wins: wins,
          losses: losses,
          status: true
        },
        user2: {
          name: userName,
          wins: wins,
          losses: losses,
          status: false
        }
      });
      $('.modal').remove();
      gameList.push(gameName);
      joinGame();
    } else {
      $('#error').text('This game already exists, please choose a new name')
    }
  });
}

$('#create-game').on('click', function () {
  let modal = $('<div>')
  modal.addClass('modal')
  modal.html('<form class="modal-content"><h2>Create new game:</h2><hr><input type="text" id="game-name" placeholder="Give it a name..."><button id="create">Create</button><small id="error"></small></form>');
  $('body').append(modal);
});
$(document).on('click', '#create', function () {
  event.preventDefault();
  let name = $('#game-name').val();
  if (name) {
    createGame(name);
  } else {
    $('#error').text('Please put in a game name');
  }
});
let gameName;
let gameList = ['placeholder'];
let userName = 'test';
let user;
let wins = 0;
let losses = 0;
let corsInsultApi = "https://cors-anywhere.herokuapp.com/" + "https://evilinsult.com/generate_insult.php?lang=en";
let compliment = "https://complimentr.com/api";
let avatarAPI = "https://cors-anywhere.herokuapp.com/" + "https://avatars.dicebear.com/v2/:sprites/:seed.svg"

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


// TODO push new users to firebase (wargame/users)

// All-Chat listener
database.ref('wargame/chat').on('child_added', function (childSnapshot) {
    let data = childSnapshot.val();
    let p = $('<p>').html(data);
    let ch = document.getElementById('all-chat-history')
    if (ch) {
        $('#all-chat-history').append(p);
        ch.scrollTop = ch.scrollHeight;    
    }
});


initializeGame();

/* #region  func dec */
function initializeGame() {
    if (document.title.includes('Game')) {
        name = sessionStorage.name;
        gameName = sessionStorage.game;
        createDBListeners();
        console.log('works');
    }
}

function createDBListeners() {
    database.ref('wargame/games/' + gameName).on('value', function (snapshot) {
        let data = snapshot.val();
        if (data.user1.status && data.user2.status) {
            database.ref('wargame/games/' + gameName + '/isOpen').set(false);
        } else if (!data.user1.status || !data.user2.status) {
            database.ref('wargame/games/' + gameName + '/isOpen').set(true);
        }
    });
    database.ref('wargame/games/' + gameName + '/chat').on('child_added', function (childSnapshot) {
        console.log(childSnapshot.val());
        let data = childSnapshot.val();
        let p = $('<p>').html(data);
        let ch = document.getElementById('chat-history')
        $('#chat-history').append(p);
        ch.scrollTop = ch.scrollHeight;    
    });
}

function joinGame() {
    database.ref('wargame/games/' + gameName).once('value').then(function (snapshot) {
        let data = snapshot.val();
        if (!data.user1.status) {
            user = 'user1';
            enemy = 'user2';
        } else if (!data.user2.status) {
            user = 'user2';
            enemy = 'user1';
        } else {
            console.error('It broke...')
        }
        if (user) {
            database.ref('wargame/games/' + gameName + '/' + user + '/name').set(userName);
            database.ref('wargame/games/' + gameName + '/' + user + '/status').set(true);
            console.log('happy days', user)
        }
        sessionStorage.setItem('user', user);
        sessionStorage.setItem('enemy', enemy);
    });
    sessionStorage.setItem('name', userName);
    sessionStorage.setItem('game', gameName);
    window.location.href = './game.html';
}

function findGame() {
    database.ref('wargame/games').once('value').then(function (snapshot) {
        let data = snapshot.val();
        console.log(data);
        
        for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
                const element = data[prop];
                console.log(element.isOpen)
                if (element.isOpen && element.gameName) {
                    gameName = element.gameName;
                    joinGame();
                }
            }
        }
    })
}

function createGame(name) {
    gameName = name;
    
    database.ref('wargame/games/' + gameName).once('value').then(function (snapshot) {
        console.log(snapshot.val());
        if (!snapshot.val() && gameName !== 'placeholder') {
            database.ref('wargame/games/' + gameName).set({
                isOpen: true,
                gameName: gameName,
                chat: '',
                user1: {
                    name: '',
                    wins: wins,
                    losses: losses,
                    status: false
                },
                user2: {
                    name: '',
                    wins: wins,
                    losses: losses,
                    status: false
                }
            });
            $('.modal').remove();
            joinGame();
        } else {
            $('#error').text('This game already exists, please choose a new name')
        }
    });
}

creatGameCards();
function creatGameCards() {
    database.ref('wargame/games').on('value', function (snapshot) {
        let data = snapshot.val();
        $('#game-cards').empty();
        for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
                const element = data[prop];
                let div = $('<div class="game-card">');
                let h2 = $('<h2>');
                let btn = $('<button class=join>');
                let indicator = $('<div class=indicator>');
                h2.text(element.gameName);
                btn.text('Join');
                btn.attr('data-value', element.gameName);
                if (element.isOpen) {
                    indicator.attr('style', 'background-color:green');
                } else {
                    indicator.attr('style', 'background-color:red');
                    btn.attr('disabled', true);
                }
                div.append(h2, btn, indicator);
                $('#game-cards').append(div);
            }
        }
    });
}


/* #endregion */

/* #region  click handlers */
$('#create-game').on('click', function () {
    let modal = $('<div>')
    modal.addClass('modal')
    modal.html('<form class="modal-content"><h2>Create new game:</h2><hr><input type="text" id="game-name" placeholder="Give it a name..."><button id="create">Create</button><small id="error"></small></form>');
    $('body').append(modal);
});

$(document).on('click', '#create', function () {
    event.preventDefault();
    let name = $('#game-name').val().trim();
    if (name) {
        createGame(name);
    } else {
        $('#error').text('Please put in a game name');
    }
});

$('#game-cards').on('click', '.join', function () {
    gameName = $(this).attr('data-value');
    joinGame();
});

$('#random-game').on('click', findGame);

$('#all-chat-send').on('click', function () {
    event.preventDefault();
    let input = $('#all-chat-input')
    if (input.val())
    database.ref('wargame/chat').push('<strong>' + userName + ':</strong> ' + input.val());
    input.val('');
});

$('#chat-send').on('click', function () {
    event.preventDefault();
    let input = $('#chat-input')
    if (input.val())
    database.ref('wargame/games/' + gameName + '/chat').push('<strong>' + userName + ':</strong> ' + input.val());
    input.val('');
});
/* #endregion */

// create a function for insults AJAX request
function generateInsult() {
  $.ajax({
    url: corsInsultApi,
    method: "GET"
  }).then(function(response){
    console.log(response);
    let modal = $('<div>')
    modal.addClass('modal')
    modal.html('<div class="modal-content"><h2>' + response + '</h2></div>');
    $('body').prepend(modal);
  })
}

function generateCompliment() {
  $.ajax({
    url: compliment,
    method: "GET"
  }).then(function(response){
    console.log(response.compliment);
    let modal = $('<div>')
    modal.addClass('modal')
    modal.html('<form class="modal-content"><h2>Create new game:</h2><hr><input type="text" id="game-name" placeholder="Give it a name..."><button id="create">Create</button><small id="error"></small></form>');
    $('.vh-100').prepend(modal);
  })
}

// Generate Avatar the last Gater
function geenerateAvatar() {
    $.ajax({
        url: avatarAPI,
        method: "GET"
    }).then(function(response){
        console.log(response);
    

    })
}

// event listener for the modal button
$("#insult").on("click", generateInsult);
$("#flirt").on("click", generateCompliment);

/* #endregion */
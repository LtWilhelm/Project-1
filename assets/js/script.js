let gameName;
let userName = 'test';
let avatar;
let user;
let enemy;
let wins = 0;
let losses = 0;
let loginModal = $('#hide-stuff');
let formModal = $('#form-modal')

let deckID;
let draw;
let winPile = [];

let hiddenName = $('#hidden-name')
let genderSelect;

hiddenName.hide();
formModal.hide();
if (!document.title.includes('Game')) {
    $('button').button('toggle')
}
$('#new-user').on('click', function () {
    loginModal.hide();
    formModal.show();
    $('#form-modal label').on('click', function(){
      $('#form-modal label.active').toggleClass('active');
    });
    $('#gender-selection').on('click', function (event) {
        event.preventDefault();
        genderSelect = $('#form-modal label.active').attr('data-gender');
        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/https://uinames.com/api/?region=united+states&gender=' + genderSelect,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            formModal.hide();
            hiddenName.show();
            userName = response.name + " " + response.surname;
            avatar = 'https://avatars.dicebear.com/v2/' + genderSelect + '/' + response.name + '.svg'
            $('#username-given').html(userName)
            $('#avatar-given').attr('src', avatar)
            sessionStorage.setItem('name', userName);
            sessionStorage.setItem('avatar', avatar);
            database.ref("wargame/users").push({
                name: userName,
                avatar: avatar
            });
        })
    })
})
$('#sign-in').on('click', function () {
    $('#login-modal').html('<div><form><input type="text" name="username" id="username-input" placeholder="Name..."><button id="username-submit">Login</button></form><small id="error"></small></div>');
    $('#username-submit').on('click', function () {
        event.preventDefault();
        database.ref('wargame/users').once('value').then(function (snapshot) {
            let data = snapshot.val()
            console.log(snapshot.val());
            let checkName = $('#username-input').val();
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element = data[key];
                    console.log(element.name);
                    if (element.name.toLowerCase() === checkName.toLowerCase()) {
                        userName = checkName;
                        avatar = element.avatar;
                        console.log(userName, avatar);
                        sessionStorage.setItem('name', userName);
                        sessionStorage.setItem('avatar', avatar);
                        $('.cmodal').hide('fast')
                        $('#user-name-display').text(userName);
                        $('#avatar-display').attr('src', avatar);                    
                    } else {
                        $('#error').text("Username doesn't exist, please type a valid username");
                    }
                }
            }
        });
    });
  });

$(document).ready(function(){
  $("#close").click(function(){ 
    $(".cmodal").remove();
    $('#user-name-display').text(userName);
    $('#avatar-display').attr('src', avatar);
  });
});



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
        gameName = sessionStorage.game;
        userName = sessionStorage.name;
        avatar = sessionStorage.avatar;
        user = sessionStorage.user;
        enemy = sessionStorage.enemy;
        database.ref('wargame/games/' + gameName + '/' + user + '/avatar').set(avatar)
        database.ref('wargame/games/' + gameName + '/' + user + '/username').set(userName)
        $('#user-name-display').text(userName);
        $('#avatar-display').attr('src', avatar);      
        createDBListeners(createDeck);
    }
}

function createDBListeners(callback) {
    database.ref('wargame/games/' + gameName + '/deckID').once('value').then(function (snapshot) {
        deckID = snapshot.val();
        callback();
    });
    database.ref('wargame/games/' + gameName).on('value', function (snapshot) {
        let data = snapshot.val();
        if (data.user1.status && data.user2.status) {
            database.ref('wargame/games/' + gameName + '/isOpen').set(false);
        } else if (!data.user1.status || !data.user2.status) {
            database.ref('wargame/games/' + gameName + '/isOpen').set(true);
        }

        if (data[enemy].draw) {
            $('#enemy-card-img').attr('src', data[enemy].cardImage);
            $('#enemy-card').show('fast');
        }
        if (data[user].draw) {
            $('#friendly-card-img').attr('src', data[user].cardImage);
            $('#friendly-card').show('fast');
        }

        if (data[enemy].taunt) {
            generateInsult();
            database.ref('wargame/games/' + gameName + '/' + enemy + '/taunt').set(false);
            setTimeout(() => {
                $('.cmodal').remove();
            }, 5000);
        }
        if (data[enemy].flirt) {
            generateCompliment();
            database.ref('wargame/games/' + gameName + '/' + enemy + '/flirt').set(false);
            setTimeout(() => {
                $('.cmodal').remove();
            }, 5000);
        }
        
        if (data[enemy].status) {
          $('#enemy-name-display').text(data[enemy].username);
          $('#enemy-avatar-display').attr('src', data[enemy].avatar);      
        }

        let draw1 = data.user1.draw;
        let draw2 = data.user2.draw;
        if (draw1 && draw2) {
            let result = compareValue(convertValue(draw1), convertValue(draw2));
            $('#friendly-card .card').toggleClass('flipped');
            $('#enemy-card .card').toggleClass('flipped');

            setTimeout(() => {
                switch (result) {
                    case user:
                        addToPile(user);
                        break;
                    case enemy:
                        addToPile(enemy);
                        break;
                    case 'war':
                        war();
                }
                database.ref('wargame/games/' + gameName + '/' + user + '/draw').set('');
                $('#friendly-card .card').toggleClass('flipped');
                $('#enemy-card .card').toggleClass('flipped');

                $('#friendly-card').hide('fast');
                $('#enemy-card').hide('fast');

            }, 1000);
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

function war() {
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/" + deckID + "/pile/" + user + "/draw/bottom/?count=4&cards=",
        method: "GET"
    }).then(function (response) {
        console.log(response)
        let drawPile = [];
        for (let i = 0; i < response.cards.length; i++) {
            winPile.push(response.cards[i].code)
            drawPile.push(response.cards[i].value)
            console.log(response.cards[i].code)
        }
        database.ref('wargame/games/' + gameName + '/' + user + '/draw').set(drawPile[drawPile.length - 1]);

    });
}

function addToPile(pileName) {
    let queryURL;
    if (winPile) {
        queryURL = "https://deckofcardsapi.com/api/deck/" + deckID + "/pile/" + pileName + "/add/?cards=" + draw + ',' + winPile.join(',')
    } else {
        "https://deckofcardsapi.com/api/deck/" + deckID + "/pile/" + pileName + "/add/?cards=" + draw
    }

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        winPile = [];
    });
    draw = '';
}

function createDeck() {
    if (!deckID) {
        $.ajax({
            url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
            method: "GET"
        }).then(function (response) {
            console.log(response)
            deckID = response.deck_id;
            database.ref('wargame/games/' + gameName + '/deckID').set(deckID);
            drawHand();
        })
    } else {
        drawHand();
    }
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
                deckID: '',
                user1: {
                    name: '',
                    wins: wins,
                    losses: losses,
                    status: false,
                    draw: '',
                    cardImage: ''
                },
                user2: {
                    name: '',
                    wins: wins,
                    losses: losses,
                    status: false,
                    draw: '',
                    cardImage: ''
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
    modal.addClass('cmodal')
    modal.html('<form class="cmodal-content"><h2>Create new game:</h2><hr><input type="text" id="game-name" placeholder="Give it a name..."><button id="create">Create</button><small id="error"></small></form>');
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

$('#play-card').on('click', function () {
    if (!draw) {
        $.ajax({
            url: "https://deckofcardsapi.com/api/deck/" + deckID + "/pile/" + user + "/draw/bottom/?cards=",
            method: "GET"
        }).then(function (response) {
            console.log(response);
            draw = response.cards[0].code
            database.ref('wargame/games/' + gameName + '/' + user + '/cardImage').set(response.cards[0].image)
            database.ref('wargame/games/' + gameName + '/' + user + '/draw').set(response.cards[0].value)

        })
    }
});

/* #endregion */


/* #region  insult/flirt */
// variables 
let corsInsultApi = "https://cors-anywhere.herokuapp.com/" + "https://evilinsult.com/generate_insult.php?lang=en";
let compliment = "https://complimentr.com/api";

// create a function for insults AJAX request
function generateInsult() {
    $.ajax({
        url: corsInsultApi,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        let modal = $('<div>')
        modal.addClass('cmodal')
        modal.html('<div class="cmodal-content"><h2>' + response + '</h2></div>');
        $('body').prepend(modal);
    })
}

function generateCompliment() {
    $.ajax({
        url: compliment,
        method: "GET"
    }).then(function (response) {
        console.log(response.compliment);
        let modal = $('<div>')
        modal.addClass('cmodal')
        modal.html('<div class="cmodal-content"><h2>' + response.compliment + '</h2></div>');
        $('body').prepend(modal);
    })
}




// event listener for the modal button
$("#insult").on("click", function () {
    database.ref('wargame/games/' + gameName + '/' + user + '/taunt').set(true)
});
$("#flirt").on("click", function () {
    database.ref('wargame/games/' + gameName + '/' + user + '/flirt').set(true)
});

/* #endregion */

/* #region  game functionality */
let playerDraw = $('#player-draw')
let enemyDraw = $('#enemy-draw')

function drawHand() {
    let queryURL = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=26"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (draw) {
        console.log(draw)
        let pile1 = []
        for (let x = 0; x < draw.cards.length; x++) {
            console.log(draw.cards[x].code);
            pile1.push(draw.cards[x].code);
        }
        $.ajax({
            url: "https://deckofcardsapi.com/api/deck/" + deckID + "/pile/" + user + "/add/?cards=" + pile1.join(","),
            method: "GET"
        }).then(function (player1) {

            console.log(player1)
        })
    })
}


function convertValue(card) {
    switch (card) {
        case 'ACE':
            return 14;
            break;
        case 'KING':
            return 13;
            break;
        case 'QUEEN':
            return 12;
            break;
        case 'JACK':
            return 11;
            break;
        default:
            return parseInt(card);
            break;
    }
}

function compareValue(card1, card2) {
    if (parseInt(card1) > parseInt(card2)) {
        console.log('Player 1 win', card1, card2)
        return 'user1';
    } else if (parseInt(card1) === parseInt(card2)) {
        console.log('TIE', card1, card2)
        return 'war';
    } else {
        console.log('Player 2 win', card1, card2)
        return 'user2';
    }
}


/* #endregion */

$('.card').on('click', function () {
    $(this).toggleClass('flipped');
    console.log('hello')
})
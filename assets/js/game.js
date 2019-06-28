$(document).ready(function () {
    let playerDraw = $('#player-draw')
    let enemyDraw = $('#enemy-draw')
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
        method: "GET"
    }).then(function (response) {
        console.log(response)
        let queryURL = "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/draw/?count=26"
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
                url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player1/add/?cards=" + pile1.join(","),
                method: "GET"
            }).then(function (player1) {
                
                console.log(player1)
                $.ajax({
                    url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player1/draw/?cards=",
                    method: "GET"
                }).then(function (draw) {
                    console.log(draw)
                    playerDraw.attr('data-card-value', convertValue(draw.cards[0].value))
                })
            })
        })
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (draw) {
            console.log(draw)
            let pile2 = []
            for (let x = 0; x < draw.cards.length; x++) {
                console.log(draw.cards[x].code)
                pile2.push(draw.cards[x].code);
            }
            $.ajax({
                url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player2/add/?cards=" + pile2.join(","),
                method: "GET"
            }).then(function drawPile2(player2) {
                console.log(player2)
                $.ajax({
                    url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player2/draw/",
                    method: "GET"
                }).then(function (draw) {
                    console.log(draw)
                    enemyDraw.attr('data-card-value', convertValue(draw.cards[0].value))

                })
            })
        })
    })

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

    function compareValue(user1card, user2card) {
        if (user1card >= user2card) {
            console.log('Player 1 wins round')
        } else {
            console.log('player 2 wins round')
        }
    }


    $('#play-card').on('click', function () {
        $('#player-draw').empty();
        $('#enemy-draw').empty();
        $('#player-draw').text(playerDraw.attr('data-card-value'))
        $('#enemy-draw').text(enemyDraw.attr('data-card-value'))
        let card1 = $('#player-draw').text(playerDraw.attr('data-card-value'))
        let card2 = $('#enemy-draw').text(enemyDraw.attr('data-card-value'))
        compareValue(card1, card2)
    })
})
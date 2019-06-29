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
                $('#play-card').on('click', function playCard() {
                    $.ajax({
                        url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player2/draw/",
                        method: "GET"
                    }).then(function (draw) {
                        for (let i = 0; i < draw.cards.length; i++) {
                            console.log(draw)
                            enemyDraw.attr('data-card-value', convertValue(draw.cards[i].value))
                            enemyDraw.empty();
                            enemyDraw.text(enemyDraw.attr('data-card-value'))
                        }
                    })
                    $.ajax({
                        url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player1/draw/?cards=",
                        method: "GET"
                    }).then(function (draw) {
                        for (let i = 0; i < draw.cards.length; i++) {
                            playerDraw.attr('data-card-value', convertValue(draw.cards[i].value))
                            playerDraw.empty();
                            playerDraw.text(playerDraw.attr('data-card-value'))
                            let card1 = playerDraw.attr('data-card-value')
                            let card2 = enemyDraw.attr('data-card-value')
                            compareValue(card1, card2)
                            console.log(card1, card2)
                            console.log(draw.cards[i].value)
                        }
                    })
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

function compareValue(card1, card2) {
    if (parseInt(card1) >= parseInt(card2)) {
        console.log('Player 1 wins round', card1, card2)
    } else {
        console.log('player 2 wins round', card1, card2)
    }
}

})


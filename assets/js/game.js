$(document).ready(function () {
    let winPile = []
    let playerDraw = $('#player-draw')
    let enemyDraw = $('#enemy-draw')

    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
        method: "GET"
    }).then(function (response) {
        playerDraw.attr('data-deck-id', response.deck_id)
        let queryURL = "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/draw/?count=26"
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (draw) {
            let pile1 = []
            for (let x = 0; x < draw.cards.length; x++) {
                pile1.push(draw.cards[x].code);
            }
            $.ajax({
                url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player1/add/?cards=" + pile1.join(","),
                method: "GET"
            }).then(function (player1) {
                $('#play-card').on('click', function playCard() {
                    winPile = []
                    $.ajax({
                        url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player2/draw/bottom/",
                        method: "GET"
                    }).then(function (draw) {
                        for (let i = 0; i < draw.cards.length; i++) {
                            enemyDraw.attr('data-card-value', convertValue(draw.cards[i].value))
                            winPile.push(draw.cards[i].code)
                            enemyDraw.empty();
                            enemyDraw.text(enemyDraw.attr('data-card-value'))
                        }
                    })
                    $.ajax({
                        url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player1/draw/bottom/",
                        method: "GET"
                    }).then(function (draw) {
                        for (let i = 0; i < draw.cards.length; i++) {
                            playerDraw.attr('data-card-value', convertValue(draw.cards[i].value))
                            winPile.push(draw.cards[i].code)
                            playerDraw.empty();
                            playerDraw.text(playerDraw.attr('data-card-value'))
                            let card1 = playerDraw.attr('data-card-value')
                            let card2 = enemyDraw.attr('data-card-value')
                            compareValue(card1, card2)
                        }
                    })
                })
            })
        })
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (draw) {
        let pile2 = []
        for (let x = 0; x < draw.cards.length; x++) {
            pile2.push(draw.cards[x].code);
        }
        $.ajax({
            url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player2/add/?cards=" + pile2.join(","),
            method: "GET"
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

})


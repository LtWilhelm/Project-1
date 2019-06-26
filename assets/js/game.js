$(document).ready(function () {
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
                console.log(draw.cards[x].code)
                pile1.push(draw.cards[x].code);
            }
            $.ajax({
                url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player1/add/?cards=" + pile1.join(","),
                method: "GET"
            }).then(function (player1) {
                console.log(player1)
                $.ajax({
                    url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player1/draw/?cards=" + pile1[0],
                    method: "GET"
                }).then(function (draw) {
                    console.log(draw)
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
            }).then(function (player2) {
                console.log(player2)
                $.ajax({
                    url: "https://deckofcardsapi.com/api/deck/" + response.deck_id + "/pile/player2/draw/?cards=" + pile2[0],
                    method: "GET"
                }).then(function (draw) {
                    console.log(draw)
                })
            })
        })
    })
})
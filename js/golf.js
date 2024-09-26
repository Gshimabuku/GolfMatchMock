var snake = []; // ヘビ履歴

$(function () {
    // scoreStart();
});

function scoreStart() {
    $('.menu').hide();
    $('.score-hole').show();
    $('.hole-1').show();
}

// スコア・パットの変更（±1）
$('.fluctuation-score-plus').click(function () {
    var member = $(this).val();
    var score = Number($('#score-' + member).val());
    $('#score-' + member).val(score + 1);
});

$('.fluctuation-score-minus').click(function () {
    var member = $(this).val();
    var score = Number($('#score-' + member).val());
    var putt = Number($('#putt-' + member).val());
    if (score > 1) {
        if (score - 1 == putt) {
            var member = $(this).val();
            $('#putt-' + member).val(putt - 1);
        }
        $('#score-' + member).val(score - 1);
    }
});

$('.fluctuation-putt-plus').click(function () {
    var member = $(this).val();
    var putt = Number($('#putt-' + member).val());
    var score = Number($('#score-' + member).val());
    if (putt + 1 < score) {
        $('#putt-' + member).val(putt + 1);
    }
});

$('.fluctuation-putt-minus').click(function () {
    var member = $(this).val();
    var putt = Number($('#putt-' + member).val());
    if (putt > 0) {
        $('#putt-' + member).val(putt - 1);
    }
});

// オリンピック選択時の色変更
// $('.olympic-select').change(function() {
//     var collar = $(this).val();
//     if (collar == 0) {
//         $(this).css('background','#ffffff');
//     } else if (collar == 1) {
//         $(this).css('background','#ffd700');
//     } else if (collar == 2) {
//         $(this).css('background','#d6d6d6');
//     } else if (collar == 3) {
//         $(this).css('background','#cd7f32');
//     } else if (collar == 4) {
//         $(this).css('background','#86918f');
//     } else if (collar == 5) {
//         $(this).css('background','#b9f2ff');
//     } 
// });

$('.snake-plus').click(function() {
    $('.snake-score').css('color', 'black');
    $(this).parent().find('.snake-score').css('color', 'red');
    var player = $(this).val();
    snake.push(player);
    var snakeScore = Number($(this).parent().find('.snake-score').text());
    $(this).parent().find('.snake-score').text(snakeScore + 1);
});

$('.snake-back').click(function() {
    var backPlayer = snake.pop();
    var backPlayerScore = $('#' + backPlayer).text();
    var nowLastPlayer = snake.slice(-1)[0];
    $('.snake-score').css('color', 'black');
    $('#' + nowLastPlayer).css('color', 'red');
    $('#' + backPlayer).text(backPlayerScore - 1);
});

$('.hole-button').click(function() {
    var hole = $(this).val();
    holeChange(hole);
});

$('#hole-back').click(function() {
    var hole = Number($('#hole-now').text());
    if (hole > 1) {
        holeChange(hole - 1);
    }
});

$('#hole-next').click(function() {
    var hole = Number($('#hole-now').text());
    if (hole < 18) {
        holeChange(hole + 1);
    }
});

function holeChange(holeNumber) {
    $('.hole').hide();
    $('.hole-' + holeNumber).show();
    $('#hole-now').text(holeNumber);
}
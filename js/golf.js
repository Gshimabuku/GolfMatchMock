$(function () {
    // scoreStart();
});

function scoreStart() {
    $('.menu').hide();
    $('.score-hole').show();
    $('.hole-1').show();
}

$('.fluctuation-score-plus').click(function () {
    var score = Number($(this).parent().parent().find('.hole-score').val());
    $(this).parent().parent().find('.hole-score').val(score + 1);
});

$('.fluctuation-score-minus').click(function () {
    var score = Number($(this).parent().parent().find('.hole-score').val());
    var patt = Number($(this).parent().parent().parent().find('.hole-patt').val());
    if (score > 1) {
        if (score - 1 == patt) {
            $(this).parent().parent().parent().find('.hole-patt').val(patt - 1);
        }
        $(this).parent().parent().find('.hole-score').val(score - 1);
    }
});

$('.fluctuation-patt-plus').click(function () {
    var patt = Number($(this).parent().parent().find('.hole-patt').val());
    var score = Number($(this).parent().parent().parent().find('.hole-score').val());
    if (patt + 1 < score) {
        $(this).parent().parent().find('.hole-patt').val(patt + 1);
    }
});

$('.fluctuation-patt-minus').click(function () {
    var patt = Number($(this).parent().parent().find('.hole-patt').val());
    if (patt > 0) {
        $(this).parent().parent().find('.hole-patt').val(patt - 1);
    }
});

$('.olympic-select').change(function() {
    var collar = $(this).val();
    if (collar == 0) {
        $(this).css('background','none');
    } else if (collar == 1) {
        $(this).css('background','#ffd700');
    } else if (collar == 2) {
        $(this).css('background','#c0c0c0');
    } else if (collar == 3) {
        $(this).css('background','#cd7f32');
    } else if (collar == 4) {
        $(this).css('background','#808080');
    } else if (collar == 5) {
        $(this).css('background','#bcaec');
    } 
});
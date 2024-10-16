/**
 * ハンバーガーメニュー
 */
$(function () {
    $('.icon-hamburger').on('click', function () {
        if ($('.header-container .hamburger-menu').css('display') === 'block') {
            $('.header-container .hamburger-menu').slideUp('1500');
        } else {
            $('.header-container .hamburger-menu').slideDown('1500');
        }
    });
});
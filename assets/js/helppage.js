'use strict';

$(document).on('scroll', function () {
    if ($(window).scrollTop() > 100) {
        $('.scroll-top-wrapper').addClass('show');
    } else {
        $('.scroll-top-wrapper').removeClass('show');
    }
});

$('a[href*=#]').click(function () {
    var id = $(this).attr('href') + '';
    if ($(this).data('toggle') === 'tab') {
        $(this).tab('show');
    } else {
        $('html, body').animate({
            scrollTop: $(id).offset().top
        }, 750, 'swing');
    }
});

$(function () {
    $('.lang-sequence, .language-sequence')
        .unwrap('pre').removeClass('language-sequence').removeClass('lang-sequence').css('background', 'none').sequenceDiagram({ theme: 'simple' });
    $('.prettyprint, code[class^=lang-], code[class^=language-]')
        .each(function (i, block) {
            hljs.highlightBlock(block);
        });
    $('section > h1 > a, section > h2 > a')
        .each(function () {
            var $a = $(this);
            if (!$a.hasClass('anchor-link')) {
                $a.addClass('anchor-link').attr('href', '#' + $a.attr('name')).append('<span class="glyphicon glyphicon-link"></span>');
            }
            $a.parent().append($a);
        });
});

$(function() {

    $('.sliderWrap').bxSlider();
    $('.dropdown_menu').on('click', function() {
        $(this).toggleClass('active');
    });
    $('.dropdown_menu').on('mouseleave', function() {
        $(this).removeClass('active');
    });

}); // end of file
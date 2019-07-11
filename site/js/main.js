$(function() {
    var $menuList = $('nav > ul > li');
    var $nav = $('nav');
    var $searchBtn = $('header .upper_nav .search');
    var $header = $('header');

    $('.sliderWrap').bxSlider();

    addEventListener();


    function addEventListener() {
        $('.dropdown_menu').on('click', dropDownMenuClicked);
        $('.dropdown_menu').on('mouseleave', dropDownMenuMouseLeaved);

        $nav.on('mouseenter', navMouseEntered)
            .on('mouseleave', navMouseLeaved);

        $menuList.on('mouseenter', gnbListMouseEntered)
                 .on('mouseleave', gnbListMouseLeaved); 
        $searchBtn.on('click', searchBtnClicked);            
    }

    function dropDownMenuClicked() {
        $(this).toggleClass('active');
    }

    function dropDownMenuMouseLeaved() {
        $(this).removeClass('active');
    }

    function navMouseEntered() {
        $header.addClass('open_sub');
    }

    function navMouseLeaved() {
        $header.removeClass('open_sub');
    }

    function gnbListMouseEntered() {
        var className = $(this).attr('data-class');
        $header.addClass(className);
    }

    function gnbListMouseLeaved() {
        $header.removeClass('corporation products recipe media');
    }

    function searchBtnClicked() {
        
    }

}); // end of file
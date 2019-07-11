$(function() {
    var $menuList = $('nav > ul > li');
    var $nav = $('nav');
    var $searchBtn = $('header .upper_nav .search');
    var $header = $('header');
    var $navCloseBtn = $('nav .background .close');

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
        $navCloseBtn.on('click', navCloseBtnClicked);          
    }

    function dropDownMenuClicked() {
        $(this).toggleClass('active');
    }

    function dropDownMenuMouseLeaved() {
        $(this).removeClass('active');
    }

    function navMouseEntered() {
        if (!$header.hasClass('open_search')) { // 검색창을 열어놓은 경우에는 서브메뉴가 열리지 않는다. 
            $header.addClass('open_sub');
        }
    }

    function navMouseLeaved() {
        $header.removeClass('open_sub');
    }

    function gnbListMouseEntered() {
        if ($header.hasClass('open_sub')) { // 서브메뉴가 열려있는 동안만 이미지를 보여준다. 
            var className = $(this).attr('data-class');
            var $img = $('header nav .background img').filter('.' + className);
            $img.stop().delay(200).fadeIn();
        }
    }

    function gnbListMouseLeaved() {
        var className = $(this).attr('data-class');
        var $img = $('header nav .background img').filter('.' + className);
        $img.stop().hide();
    }

    function searchBtnClicked() {
        $header.toggleClass('open_search');
    }

    function navCloseBtnClicked() {
        $header.removeClass('open_search');
    }

}); // end of file
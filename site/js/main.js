$(document).ready(function () {
  var $window = $(window);
  var $header = $("header");
  var $gnbMenuList = $("header nav > ul > li");
  var $menuBtn = $("header .upper_nav .menu");

  var isMobile = $(window).outerWidth() <= 600 ? true : false;
  var corporationSlideNum = 0;

  var CLASS_SEARCH_OPENED = "open_search";
  var CLASS_SUB_OPENED = "open_sub";
  var CLASS_SETTING_OPENED = "open_setting";
  var CLASS_ACTIVE = "active";

  var bannerSlider;
  var newsSlider;
  var fullPage;

  if (isMobileDevice()) { // 모바일 디바이스인 경우에는 fullpage.js 를 로드하지 않는다. 
    if (!bannerSlider) {
      bannerSlider = $(".sliderWrap").bxSlider({
        pager: false,
        prevSelector: ".banner .left",
        nextSelector: ".banner .right",
        onSliderLoad: function () {
          if (!newsSlider) {
            newsSlider = $(".slider__wrapper--news").bxSlider({
              pager: true,
              controls: false,
              pagerSelector: ".slider__controls--news",
              minSlides: 1,
              maxSlides: 3,
              moveSlides: 1,
              slideWidth: 600,
              slideMargin: 50,
              auto: true,
              pause: 3000,
              scrollBar: true,
              onSliderLoad: function () {
                $('video').each(function () {
                  $(this).get(0).play();
                });
                addEventListener();
              }
            });
          }
        }
      });
    }    
  } else {
    fullPage = new fullpage("#fullpage", {
      //options here
      scrollOverflow: true,
      responsiveWidth: 900,
      afterRender: function () {
        if (!bannerSlider) {
          bannerSlider = $(".sliderWrap").bxSlider({
            pager: false,
            prevSelector: ".banner .left",
            nextSelector: ".banner .right",
            onSliderLoad: function () {
              if (!newsSlider) {
                newsSlider = $(".slider__wrapper--news").bxSlider({
                  pager: true,
                  controls: false,
                  pagerSelector: ".slider__controls--news",
                  minSlides: 1,
                  maxSlides: 3,
                  moveSlides: 1,
                  slideWidth: 600,
                  slideMargin: 50,
                  auto: true,
                  pause: 3000,
                  scrollBar: true,
                  onSliderLoad: function () {
                    addEventListener();
                    fullpage_api.reBuild();   // bxSlider 가 로드되어 높이가 정리된 후엔 rebuild 
                  }
                });
              }
            }
          });
        }
      },
      afterReBuild: function () {
        if ($('.fp-scrollable').length < 1) {
          // fullPage.js 에서 scrollOverflow:true , fp-auto-height-responsive 를 함께 썼을 때
          // window resize를 통해 모바일 구간에서 pc 구간으로 이동하는 경우 
          // 처음 한번은 스크롤 엘리먼트가 제대로 들어오지 않는 이슈 대응.
          setTimeout(function () {
            $(window).resize();
          }, 500);
        }
      }
    });
  }



  function addEventListener() {
    $window.on("resize", resizeHandler);

    $("nav")
      .on("mouseenter", navMouseEntered)
      .on("mouseleave", navMouseLeaved);

    $("nav > ul > li")
      .on("mouseenter", gnbListMouseEntered)
      .on("mouseleave", gnbListMouseLeaved);

    addClassRelated();
  }

  function addClassRelated() {
    $(".dropdown_menu").on("click", handleClass);
    $(".dropdown_menu").on(
      "mouseleave",
      {
        func: "remove"
      },
      handleClass
    );
    $("header .upper_nav .search").on(
      "click",
      {
        className: CLASS_SEARCH_OPENED,
        target: $header
      },
      handleClass
    );

    $("header .upper_nav .option").on(
      "click",
      {
        className: CLASS_SETTING_OPENED,
        target: $header
      },
      handleClass
    );

    $("nav .background .close").on(
      "click",
      {
        className: CLASS_SEARCH_OPENED,
        target: $header,
        func: "remove"
      },
      handleClass
    );

    $menuBtn.on(
      "click",
      {
        // 메뉴 버튼이 눌렸을 때 active 되어있던 li는 초기화해준다.
        target: $gnbMenuList,
        func: "remove"
      },
      handleClass
    );
    $menuBtn.on(
      "click",
      {
        className: CLASS_SUB_OPENED,
        target: $header
      },
      handleClass
    );

    $gnbMenuList.on("click", handleClass);
  }

  /*
   * 클릭했을 때 특정 클래스 넣고 빼고만 하는 경우
   * className: 클래스이름. 디폴트는 active
   * target: 어디에 동작할 것인지. 없으면 this 사용.
   * func: 어떤 함수를 사용할 것인지. remove 인경우 removeClass, 디폴트는 toggleClass
   */

  function handleClass(e) {
    e.preventDefault();

    var target = $(this);
    var className = CLASS_ACTIVE;
    var func = "toggle";
    if (e.data) {
      target = e.data.target ? e.data.target : $(this);
      className = e.data.className ? e.data.className : CLASS_ACTIVE;
      func = e.data.func ? e.data.func : "toggle";
    }

    if (func === "remove") {
      target.removeClass(className);
    } else {
      target.toggleClass(className);
    }
  }

  function resizeHandler(e) {
    var width = $(window).outerWidth();
    if (width > 600 && isMobile) {
      // pc
      isMobile = false;
      // 값이 바뀔 때 한 번만 header 안의 class를 정리해준다.
      $header.removeClass(
        CLASS_SEARCH_OPENED +
        " " +
        CLASS_SUB_OPENED +
        " " +
        CLASS_SETTING_OPENED
      );
    } else if (width <= 600 && isMobile) {
      // mobile
      isMobile = true;
      $header.removeClass(
        CLASS_SEARCH_OPENED +
        " " +
        CLASS_SUB_OPENED +
        " " +
        CLASS_SETTING_OPENED
      );
    }
    fullpage_api.reBuild(); // 화면 높이, 너비 등등이 바뀌고 나면 풀페이지 라이브러리 재로드. 
  }

  function navMouseEntered() {
    if (!$header.hasClass(CLASS_SEARCH_OPENED)) {
      // 검색창을 열어놓은 경우에는 서브메뉴가 열리지 않는다.
      $header.addClass(CLASS_SUB_OPENED);
    }
  }

  function navMouseLeaved() {
    if (!isMobile) {
      $header.removeClass(CLASS_SUB_OPENED);
    }
  }

  function gnbListMouseEntered() {
    if ($header.hasClass(CLASS_SUB_OPENED) && !isMobile) {
      // 서브메뉴가 열려있는 동안만 이미지를 보여준다.
      var className = $(this).attr("data-class");
      var $img = $("header nav .background img").filter("." + className);
      $img
        .stop()
        .delay(200)
        .fadeIn();
    }
  }

  function gnbListMouseLeaved() {
    var className = $(this).attr("data-class");
    var $img = $("header nav .background img").filter("." + className);
    $img.stop().hide();
  }

  function isMobileDevice() {
    if (/Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  }
}); // end of file

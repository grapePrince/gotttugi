$(document).ready(function() {
  var $window = $(window);
  var $header = $('header');
  var $gnbMenuList = $('header nav > ul > li');
  var $menuBtn = $('header .upper_nav .menu');
  var $scrollDown = $('.m_scroll_down');
  var $goTop = $('.m_back_to_top');
  var $recipeFixedImage = $('.recipe__main__image--fixed__container');
  var $recipeProcessCircles = $('.recipe__process__line circle');
  var $recipeProcessDetails = $('.receipe__process__item__detail');
  var $recipeProcessItems = $('.recipe__process__item');


  var CLASS_SEARCH_OPENED = "open_search";
  var CLASS_SUB_OPENED = "open_sub";
  var CLASS_SETTING_OPENED = "open_setting";
  var CLASS_ACTIVE = "active";
  var MOBILE_WIDTH = 600;
  var FULLPAGE_WIDTH = 900;
  var TABLET_WIDTH = 1110;

  var SECTION_BANNER = 0;
  var SECTION_CORP1 = 1;
  var SECTION_CORP2 = 2;
  var SECTION_NEW = 3;
  var SECTION_NEWS = 4;
  var SECTION_POPULAR = 5;
  var SECTION_RECIPE = 6;
  var SECTION_FACTORY = 7;
  var SECTION_MEDIA = 8;

  var bannerSlider;
  var newsSlider;
  var fullPage;
  var firstRebuild = false;

  var isMobile = $(window).outerWidth() <= MOBILE_WIDTH ? true : false;
  var underTabletWidth = $(window).outerWidth() <= TABLET_WIDTH ? true : false;

  var ing_recipeProcess = true;

  if ($(document.body).hasClass('main')) {
    initMain();
    addEventListener();
  } else {
    initSub();
    addEventListener();
  }


  function initMain() {

    // 레시피 자동으로 채워지는 부분
    lineFillNext(0);

    if (isMobileDevice()) {
      // 모바일 디바이스인 경우에는 fullpage.js 를 아예 로드하지 않는다.
      if (!bannerSlider) {
        bannerSlider = $(".sliderWrap").bxSlider({
          pager: false,
          prevSelector: ".banner .left",
          nextSelector: ".banner .right",
          onSliderLoad: function() {
            if (!newsSlider) {
              loadNewsSlider();
            }
          }
        });
      }
    } else {
      fullPage = new fullpage("#fullpage", {
        //options here
        responsiveWidth: FULLPAGE_WIDTH,
        scrollOverflow: true,
        afterRender: function() {
          if (!bannerSlider) {
            bannerSlider = $(".sliderWrap").bxSlider({
              pager: false,
              prevSelector: ".banner .left",
              nextSelector: ".banner .right",
              onSliderLoad: function() {
                if (!newsSlider) {
                  loadNewsSlider();
                }
              }
            });
          }
        },
        afterReBuild: function() {
          if (
            firstRebuild ||
            ($(window).outerWidth() > FULLPAGE_WIDTH &&
              $(".fp-scrollable").length < 1)
          ) {
            // fullPage.js 에서 scrollOverflow:true , fp-auto-height-responsive 를 함께 썼을 때
            // window resize를 통해 모바일 구간에서 pc 구간으로 이동하는 경우
            // 처음 한번은 스크롤 엘리먼트가 제대로 들어오지 않는 이슈 대응.
            setTimeout(function() {
              $(window).resize();
            }, 500);
            firstRebuild = false;
          }
        },
        onLeave: function(origin, destination, direction) {
          if (
            destination.index === SECTION_NEWS 
            || 
            destination.index === SECTION_MEDIA
          ) {
            $scrollDown.hide();
          } else {
            $scrollDown.show();
          } 
          
          if(destination.index === SECTION_RECIPE) {
            $recipeFixedImage.addClass('js-visible');
          } else {
            $recipeFixedImage.removeClass('js-visible');
          }

          if(destination.index === SECTION_FACTORY) {
            $('.l_factory_feature').addClass('js-active');
            $('.factory__image').addClass('js-active');
          }

        }
      });  
    }
  }
  
  function lineFillNext(index) {
    resetRecipeAnimation();

    // TABLETWIDTH 이하거나 ing 중이 아니면 동작하지 않음. 
    if(underTabletWidth || !ing_recipeProcess) { 
      return;
    }

    resetRecipeAnimation();
    $recipeProcessDetails.eq(index).stop().animate({
      opacity: 1
    });
    $recipeProcessCircles.eq(index).stop().animate({
      'stroke-dashoffset': 0
    }, 2000, function() {
      lineFillNext((index+1)%($recipeProcessCircles.length));
    });
  }

  function lineFillOnce(index) {
    resetRecipeAnimation();
    $recipeProcessDetails.eq(index).stop().animate({
      opacity: 1
    });
    $recipeProcessCircles.eq(index).stop().animate({
      'stroke-dashoffset': 0
    }, 2000);
  }

  function resetRecipeAnimation() {
    $recipeProcessCircles.stop().css({
      'stroke-dashoffset': 900
    });
    $recipeProcessDetails.stop().animate({
      opacity: 0
    });
  }

  function loadNewsSlider() {
    var config = {
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      slidesPerView: 'auto',
      loopedSlides: 5,
      spaceBetween: 50,
      speed: 500,
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay: 10000
      },
      on: {
        init: function () {
          if (isMobile) {
            $("video").each(function() {
              $(this)
                .get(0)
                .play();
            });
          }
          if (!isMobileDevice()) {
            // 모바일 디바이스인 경우 풀페이지를 로드하지 않는다.
            // bxSlider 가 로드되어 높이가 정리된 후엔 rebuild 하여 높이 재정리
            // setTimeout 사용하지 않을시 IE 에서 rebuild 함수 호출 오류
            // 정의되지 않음 또는 null 참조인 'createScrollBarForAll' 속성을 가져올 수 없습니다. 확인 필요
            setTimeout(function() {
              firstRebuild = true;
              fullpage_api.reBuild();
            }, 100);
          }
        },
      }
    };

    newsSlider = new Swiper(".swiper-container", config);
  }

  function addEventListener() {
    $window.on("resize", resizeHandler);

    $("nav")
      .on("mouseenter", navMouseEntered)
      .on("mouseleave", navMouseLeaved);

    $("nav > ul > li")
      .on("mouseenter", gnbListMouseEntered)
      .on("mouseleave", gnbListMouseLeaved);

    $recipeProcessItems
      .on('mouseenter', recipeMouseEntered)
      .on('mouseleave', recipeMouseLeaved);
    
    $('.m_tab__header').on('click', mediaTabClicked);  

    $('.m_scroll_down').on('click', scrollDownClicked);
    $('.m_back_to_top').on('click', toTopClicked); 

    addClassRelated();
  }

  function scrollDownClicked(e) {
    e.preventDefault();
    fullpage_api.moveSectionDown();
  }

  function toTopClicked(e) {
    e.preventDefault();
    fullpage_api.silentMoveTo(1);
  }

  function mediaTabClicked() {
    var className = $(this).get(0).classList[$(this).get(0).classList.length-1];
    $('.l_media').removeClass('js-happy');
    $('.l_media').removeClass('js-ramen');
    $('.l_media').removeClass('js-tabasco');
    $('.l_media').addClass(className);
  }

  function recipeMouseEntered() {
    var index = $(this).index();
    ing_recipeProcess = false;
    lineFillOnce(index);
  }

  function recipeMouseLeaved() {
    var index = $(this).index();
    ing_recipeProcess = true;
    lineFillNext((index+1)%($recipeProcessCircles.length));
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
    if (width > MOBILE_WIDTH && isMobile) {
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
    } else if (width <= MOBILE_WIDTH && isMobile) {
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

    // TABLET_WIDTH 경계로 슬라이더 옵션을 변경해서 재로드한다.
    if (width > TABLET_WIDTH && underTabletWidth) {
      underTabletWidth = false;
      loadNewsSlider();
    } else if (width <= TABLET_WIDTH && !underTabletWidth) {
      underTabletWidth = true;
      loadNewsSlider();
    }

    if (typeof fullpage_api !== "undefiend") {
      fullpage_api.reBuild(); // 화면 높이, 너비 등등이 바뀌고 나면 풀페이지 라이브러리 재로드.
    }
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
    if (
      /Mobi/i.test(navigator.userAgent) ||
      /Android/i.test(navigator.userAgent)
    ) {
      return true;
    } else {
      return false;
    }
  }



/* ------------------SUB---------------- */


var PAGE_PROJECT_LIST = 'js-project_list';

var galleryData = [];
var currentIndex = 0;
var addItemCount = 10;

function initSub() {
  if($('.' + PAGE_PROJECT_LIST)) { // PROJECT LIST 페이지인 경우 
    $.getJSON('../data/content.json', initGallery);
  }  
}

function initGallery(data){
  setTimeout(function() {
    //모든 리스트를 alldata 저장  
    galleryData = data;    
    addItems();
    $(window).on('scroll', galleryScroll);
  }, 1000);
}


function galleryScroll(e) {
  if($(window).scrollTop() === $(document).height() - $(window).height() ) {
    addItems();
  }  
}


function addItems(){
    var elements = [],  
        slicedData = galleryData.slice(currentIndex, currentIndex += addItemCount);

    if(slicedData.length > 0) {
      $('.l_product_list_loading').show();
      setTimeout(function() {
        $.each(slicedData, function(i, item){
          var itemHtml = 
          '<div class="product_list__item l_product_list__item s_product_list__item ' + (item['js-big'] ? 'js-big' : '') + '">' +
            '<img src="' + item.image + '" alt="' + item.title + '" class="l_product_list__item__contents__image s_product_list__item__contents__image">' +
            '<h4 class="s_product_list__item__contents__title">' +
            item.title +
            '</h4>' +
          '</div>';
          elements.push($(itemHtml).get(0));
        }); //slicedData item 마다 할일
    
        $('.product_list__list').append(elements);
    
        $('.l_product_list_loading').hide();
      }, 2000);
    }    
}















  }); // end of file    
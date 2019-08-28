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

  var PAGE_PROJECT_LIST = 'js-project_list';
  var PAGE_PROJECT_DETAIL = 'js-project_detail';

  var galleryData = [];
  var currentIndex = 0;
  var addItemCount = 10;

  var currentFilterArray = [];

  var $grid;

  var bannerSlider;
  var newsSlider;

  var fullPage;
  var firstRebuild = false;

  var isMobile = $(window).outerWidth() <= MOBILE_WIDTH ? true : false;
  var underTabletWidth = $(window).outerWidth() <= TABLET_WIDTH ? true : false;
  var isSub = false;

  var ing_recipeProcess = true;

  if ($(document.body).hasClass('main')) {
    initMain();
    addEventListener();
  } else {
    isSub = true;
    initSub();
    addEventListener();
  }

  function initMain() {
    // 레시피 자동으로 채워지는 부분
    lineFillNext(0);

    if (isMobileDevice()) {
      initMobileDevice();      
    } else {
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

      initCorporation();


      // [TODO]
      // 맨 끝에 다다르면 scroll down 버튼을 안보이게 한다. 

      // [TODO]
      // 레시피 구간에 들어가면 할일 
      /*
      if(destination.index === SECTION_RECIPE) {
        $recipeFixedImage.addClass('js-visible');
      } else {
        $recipeFixedImage.removeClass('js-visible');
      }
      */

      // [TODO]
      // 공장 구간 들어가면 할 일 
      /*
      if(destination.index === SECTION_FACTORY) {
        $('.l_factory_feature').addClass('js-active');
        $('.factory__image').addClass('js-active');
      }
      */

      
    }
  }


  function fitVideo() {
    var $container = $('.full-bg');
    var wind = $(this),
    windowWidth = $(window).width(),
    windowHeight = $(window).height(),
    imageRatio = 1920 / 1080,
    browserRatio = windowWidth / windowHeight,
    imageWidth,
    imageHeight,
    imageLeft,
    imageTop;

    if (imageRatio > browserRatio) { // 이미지 가로가 더 길 때는 높이가 브라우저와 같아진다. 
        imageHeight = windowHeight;
        imageTop = 0;
        imageWidth = imageRatio * imageHeight;   
        imageLeft =  (windowWidth - imageWidth) / 2;            
    } else { // 브라우저 가로가 더 길 때는 가로가 브라우저와 같아진다.          
        imageWidth = windowWidth;
        imageLeft = 0;
        imageHeight =  imageWidth / imageRatio;    
        imageTop =  (windowHeight - imageHeight) / 2;   
    }

    $container.css({
        width: imageWidth + 'px',
        height: imageHeight + 'px',
        left: imageLeft + 'px',
        top: imageTop + 'px',
    })
  }

  function initMobileDevice() {
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
    $(document.body).addClass('js-mobile');
    $('.m_scroll_down').hide();
    $('.m_back_to_top').hide();
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
    if(underTabletWidth) {
      $recipeProcessDetails.stop().css({
        opacity: 1
      });
    } else {
      $recipeProcessCircles.stop().css({
        'stroke-dashoffset': 900
      });
      $recipeProcessDetails.stop().animate({
        opacity: 0
      });
    }
  }

  function loadNewsSlider() {
    var config = {
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      slidesPerView: 'auto',
      breakpoints: {
        1110: {
          slidesPerView: 1
        }
      },
      loopedSlides: 30,
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
        },
      }
    };

    if(underTabletWidth) {
      config.slidesPerView = 1;
    }

    if(!newsSlider) {
      newsSlider = new Swiper(".swiper-container", config);
    }
     
  }

  function addEventListener() {
    
    $('.js-href').on('click', hrefHandler);

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

  function hrefHandler() {
    var href = $(this).attr('data-href');
    if(href[0] === 'h') {
      location.href = href;
    } else {
      href = '/gotttugi/' + href;
    }
    location.href = href;
  }

  function scrollDownClicked(e) {
    e.preventDefault();

    // [TODO] 다음 섹션으로 이동한다. 
  }

  function toTopClicked(e) {
    e.preventDefault();
    if (isSub) {
      $('html,body').animate({scrollTop: 0}, 500);
    } else {
      // [TODO] 첫번째 섹션으로 이동한다. 
    }
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

    if($('.open_sub').length > 0 && $(window).outerWidth() <= 600) {
      e.preventDefault();
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
      lineFillNext(0);
    } else if (width <= TABLET_WIDTH && !underTabletWidth) {
      underTabletWidth = true;
      loadNewsSlider();
      resetRecipeAnimation();
    }

    initCorporation();

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

function initSub() {
  
  if($('.' + PAGE_PROJECT_LIST).length > 0) { // PROJECT LIST 페이지인 경우 
    $.getJSON('data/content.json', initGallery);
  }
  if($('.' + PAGE_PROJECT_DETAIL).length > 0) {
    initProjectDetail();
  } 
}

function initGallery(data){
  shuffleArray(data);
  $('.s_product_list__header__desc__em').text(data.length);
  setTimeout(function() {
    //모든 리스트를 alldata 저장  
    galleryData = data;    
    addItems();
    $(window).on('scroll', galleryScroll);
  }, 1000);
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
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
          '<div data-href="product_detail.html" class="js-href product_list__item l_product_list__item s_product_list__item ' + (item['js-big'] ? 'js-big ' : '') + item.sortingClass  +  '" data-popular="'+ item.popular +'" data-recent="'+ item.recent +'" data-views="'+ item.views +'">' +
            '<img src="' + item.image + '" alt="' + item.title + '" class="l_product_list__item__contents__image s_product_list__item__contents__image">' +
            '<h4 class=" s_product_list__item__contents__title">' +
            item.title +
            '</h4>' +
          '</div>';
          elements.push($(itemHtml).get(0));
        }); //slicedData item 마다 할일
    
        // 맨 처음에는 아이템을 넣어두고 isotope를 돌린다.
        if (!$grid) {
          $('.product_list__list').append(elements);
          $grid = $('.product_list__list').isotope({
            itemSelector: '.product_list__item',
            masonry: {
              columnWidth: 276,
              isFitWidth: true
            },
            getSortData: {
              popular: '[data-popular]',
              views: '[data-views]',
              recent: '[data-recent]'
            }
          });

          // 필터 버튼들은 아이템 로드가 끝난 다음 누를 수 있다. 
          $('.product_filter_button').on('click', filterButtonClicked);
          $('.product_list__header__sort__button').on('click', sortButtonClicked);

        } else { // 이미 isotope 가 있는 경우 append 메소드를 사용. 
          $('.product_list__list').append(elements);
          $grid.isotope( 'appended', elements );
        }

        $(elements).on('click', hrefHandler);
    
        $('.l_product_list_loading').hide();
      }, 500);
    }    
}

function filterButtonClicked() {
  var filter = $(this).attr('data-filter');
  
  // all 을 누른 경우 
  if(filter === '.all') {
    if ( !$(this).hasClass('js-active')) {
      currentFilterArray = [];
      $('.product_filter_button').removeClass('js-active');
      $(this).addClass('js-active'); 
      $grid.isotope({ filter: '*' });
    } else {
      $(this).removeClass('js-active'); 
    }
    return;
  }

  $('.product_filter_button[data-filter=".all"]').removeClass('js-active'); 

  if (currentFilterArray.indexOf(filter) === -1) { // 필터를 새롭게 추가.
    $(this).addClass('js-active'); 
    currentFilterArray.push(filter);
    
  } else { // 기존 필터에서 삭제 
    $(this).removeClass('js-active'); 
    var index = currentFilterArray.indexOf(filter);
    currentFilterArray.splice(index, 1);
  }

  $grid.isotope({ filter: currentFilterArray.join(', ') });
  
}

function sortButtonClicked() {
  var sort = $(this).attr('data-sort-value');
  $('.product_list__header__sort__button').removeClass('js-active');
  $(this).addClass('js-active');
  $grid.isotope({ sortBy: sort });

}

function initProjectDetail() {
  $('.product_details__main__left__icon').on('click', function() {
    if($('.cube').hasClass('js-active')) {
      $('.cube').removeClass('js-active');
      $('.l_product_details__main__left__text').text('돌리려면클릭');
    } else {
      $('.cube').addClass('js-active');
      $('.l_product_details__main__left__text').text('멈추려면클릭');
    }
  });

  var waypoint = new Waypoint({
    element: $('.product_details__main__right__attr'),
    handler: function(direction) {
      $('.product_details__main__right__attr').each(function(i, item) {
        var number = $(item).attr('data-number');
        $(item).animateNumber({ 
          number: number 
        }, {
          duration: 1000
        } );
      });
    },
    offset: '100%'
  });

  $('.l__product_details__main__right__origin__header').on('click', clickProductIngredients);

  $('video').get(0).play();

}

function clickProductIngredients() {
  if($('.l__product_details__main__right__origin').hasClass('js-active')) {
    $('.l__product_details__main__right__origin').removeClass('js-active')
    $('.l__product_details__main__right__origin__contents').hide('slide', {direction: 'up'}, 500);
  } else {
    $('.l__product_details__main__right__origin').addClass('js-active')
    $('.l__product_details__main__right__origin__contents').show('slide', {direction: 'up'}, 500);
  }  
}

function initCorporation() {
  var corporation1_up;
  var corporation1_down;
  var corporation2_up;
  var corporation2_down;

  if($(window).outerWidth() > MOBILE_WIDTH) {
    if(!corporation1_up) {
      // 회사소개 - 위쪽경계
      corporation1_up = new Waypoint({
        element: $('.section_corporation1'),
        handler: function(direction) {
          if(direction === "up") {
            $('.section_corporation1').find('video')[0].pause();
            $('.section_corporation1').find('video')[0].currentTime = 0;
          } else {
            $('.section_corporation1').find('video')[0].currentTime = 0;
            $('.section_corporation1').find('video')[0].play();
          }
        },
        offset: '50%'
      });

        // 회사소개 - 아래쪽경계
      corporation1_down = new Waypoint({
        element: $('.section_corporation1'),
        handler: function(direction) {
          if(direction === "up") {
            $('.section_corporation1').find('video')[0].currentTime = 0;
            $('.section_corporation1').find('video')[0].play();          
          } else {
            $('.section_corporation1').find('video')[0].pause();
            $('.section_corporation1').find('video')[0].currentTime = 0;
          }
        },
        offset: '-50%'
      });

      // 회사이념 - 위쪽경계
      corporation2_up = new Waypoint({
        element: $('.section_corporation2'),
        handler: function(direction) {
          if(direction === "up") {
            $('.section_corporation2').find('video')[0].pause();
            $('.section_corporation2').find('video')[0].currentTime = 0;
          } else {
            $('.section_corporation2').find('video')[0].currentTime = 0;
            $('.section_corporation2').find('video')[0].play();
          }
        },
        offset: '50%'
      });

        // 회사이념 - 아래쪽경계
      corporation2_down = new Waypoint({
        element: $('.section_corporation2'),
        handler: function(direction) {
          if(direction === "up") {
            $('.section_corporation2').find('video')[0].currentTime = 0;
            $('.section_corporation2').find('video')[0].play();          
          } else {
            $('.section_corporation2').find('video')[0].pause();
            $('.section_corporation2').find('video')[0].currentTime = 0;
          }
        },
        offset: '-50%'
      });
    }
  } else {
    if(corporation1_up) {
      corporation1_up.destroy();
      corporation1_up = null;
      corporation1_down.destroy();
      corporation1_down = null;
      corporation2_up.destroy();
      corporation2_up = null;
      corporation2_down.destroy();
      corporation2_down = null;
    }
    $('.section_corporation1').find('video')[0].play();
    $('.section_corporation2').find('video')[0].play();
  }
  
}







  }); // end of file    
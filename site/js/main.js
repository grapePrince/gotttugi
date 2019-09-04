$(document).ready(function() {
  var $window = $(window);
  var $header = $('header');
  var $gnbMenuList = $('header nav > ul > li');
  var $menuBtn = $('header .upper_nav .menu');
  var $scrollDown = $('.m_scroll_down');
  var $goTop = $('.m_back_to_top');
  var $recipeProcessCircles = $('.recipe__process__line circle');
  var $recipeProcessDetails = $('.receipe__process__item__detail');
  var $recipeProcessItems = $('.recipe__process__item');

  var CLASS_SEARCH_OPENED = "open_search";
  var CLASS_SUB_OPENED = "open_sub";
  var CLASS_SETTING_OPENED = "open_setting";
  var CLASS_ACTIVE = "active";
  var MOBILE_WIDTH = 600;
  var TABLET_WIDTH = 1110;

  var isMobile = $(window).outerWidth() <= MOBILE_WIDTH ? true : false;
  var underTabletWidth = $(window).outerWidth() <= TABLET_WIDTH ? true : false;

  var PAGE_PRODUCT_LIST = 'js-product_list';
  var PAGE_PRODUCT_DETAIL = 'js-product_detail';
  var PAGE_FACTORY = 'js-factory';

  var galleryData = [];
  var currentIndex = 0;
  var addItemCount = 10;
  var sectionOffset;

  var currentFilterArray = [];

  var $grid;

  var bannerSlider;
  var newsSlider;

  var ing_recipeProcess = true;

  var factoryEventRegistered = false;
  var resizeVideo; 
  var videoQue = [];

  var weatherData = {};

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
          nextSelector: ".banner .right"
        });        
      }
      if (!newsSlider) {
        loadNewsSlider();
      }

      initCorporation();
      initFactory();
      initScrollDown();
      resetSectionOffset();
      initPopular(); 
    }
    initNews();
  }



  function initMobileDevice() {
    if (!bannerSlider) {
      bannerSlider = $(".sliderWrap").bxSlider({
        pager: false,
        prevSelector: ".banner .left",
        nextSelector: ".banner .right"
      });
    }
    if (!newsSlider) {
      loadNewsSlider();
    }
    $(document.body).addClass('js-mobile');
    $('.m_scroll_down').hide();
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
      // breakpoints: {
      //   1110: {
      //     slidesPerView: 1
      //   }
      // },
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
          
          isMobile = $(window).outerWidth() <= MOBILE_WIDTH ? true : false;
          underTabletWidth = $(window).outerWidth() <= TABLET_WIDTH ? true : false;
          
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

    if(!newsSlider) {
     newsSlider = new Swiper(".swiper-container", config);
    } else {
      newsSlider.update();
    }
     
  }

  function bodyClicked(e) {
    if(!$('nav > ul').find(e.target).length > 0) {
      if (!isMobile) {
        $header.removeClass(CLASS_SUB_OPENED);
      }
    } 
  }

  function addEventListener() {    
    $('.js-href').on('click', hrefHandler);

    if($(document.body).hasClass('main')) {
      $window.on("resize", resizeHandler);
    }

    if(isMobileDevice) {
      $('nav > ul > li')
      .on('click', navClicked);
       
      $('body')
      .on('click', bodyClicked);
     
    } else {
      $("nav")
      .on("mouseenter", navMouseEntered)
      .on("mouseleave", navMouseLeaved);
    }

    $gnbMenuList.on("click", gnbMenuClicked);

    $("nav > ul ul li")
      .on("mouseenter", gnbListMouseEntered)
      .on("mouseleave", gnbListMouseLeaved);

    $recipeProcessItems
      .on('mouseenter', recipeMouseEntered)
      .on('mouseleave', recipeMouseLeaved);
    
    $('.m_tab__header').on('click', mediaTabClicked);  

    $('.m_scroll_down').on('click', scrollDownClicked);
    $('.m_back_to_top').on('click', toTopClicked); 

    $('.video__container').on('click', videoClicked);

    $('a[href="#"]').on('click', function(e) { e.preventDefault(); });

    addClassRelated();
  }

  function hrefHandler() {
    var href = $(this).attr('data-href');
    var home_url; 

    if(location.href.indexOf('rahata.dothome.co.kr') !== -1) {
      home_url = location.origin + '/gotttugi';
    } else if (location.href.indexOf('file') !== -1) {
      var home_urls = location.href.split('/');
      home_urls = home_urls.splice(0, home_urls.length - 1);
      home_url = home_urls.join('/');
    } else {
      var home_url = location.origin;
    }

    location.href = home_url + href;
  }

  function resetSectionOffset() {
    sectionOffset = {
      "0": 0,
      "1": $('.section_corporation1 ').offset().top,
      "2": $('.section_corporation2 ').offset().top,
      "3": $('section.new_product').offset().top,
      "4": $('section.section--news').offset().top - $('section.section--news').height()/2,
      "5": $('section.popular').offset().top,
      "6": $('section.recipe').offset().top - 100,
      "7": $('section.factory').offset().top - 100,
      "8": $('section.media').offset().top,
    }
  }

  function scrollDownClicked(e) {
    e.preventDefault();
    var currentScroll = $(window).scrollTop();
    var currentSection = "0";
    for( var key in sectionOffset ) {
      var offset = sectionOffset[key];
      if(currentScroll >= offset) {
        currentSection = key;
      }
    }

    if(currentSection < 8) {
      $('html,body').animate({ 
        scrollTop: sectionOffset[Number(currentSection) + 1] + 10
      });
    }
  }

  function toTopClicked(e) {
    e.preventDefault();
    $('html,body').animate({scrollTop: 0}, 500);
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

  function gnbMenuClicked(e) {
    if(! $('ul  ul').find(e.target).length > 0 ) {
      $(this).toggleClass("active");
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
    } else if (width <= MOBILE_WIDTH && !isMobile) {
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

    if (width > TABLET_WIDTH && underTabletWidth) {
      underTabletWidth = false;      
      lineFillNext(0);
    } else if (width <= TABLET_WIDTH && !underTabletWidth) {
      underTabletWidth = true;
      resetRecipeAnimation();
    }


    initCorporation();
    initFactory();
    initScrollDown();
    resetSectionOffset();
    initPopular();
    initNews();
    loadNewsSlider();
    

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

  function navClicked() {
    if($header.hasClass(CLASS_SUB_OPENED)) {
      if (!isMobile) {
        $header.removeClass(CLASS_SUB_OPENED);
      }
    } else {
      if (!$header.hasClass(CLASS_SEARCH_OPENED)) {
        // 검색창을 열어놓은 경우에는 서브메뉴가 열리지 않는다.
        $header.addClass(CLASS_SUB_OPENED);
      }
    }
  }

  function gnbListMouseEntered() {
    if ($header.hasClass(CLASS_SUB_OPENED) && !isMobile) {
      // 서브메뉴가 열려있는 동안만 이미지를 보여준다.
      var className = $(this).parent().parent().attr("data-class");
      var $img = $("header nav .background img").filter("." + className);
      $img
        .stop()
        .delay(200)
        .fadeIn();
    }
  }

  function gnbListMouseLeaved() {
    var className = $(this).parent().parent().attr("data-class");
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
  if($('.' + PAGE_PRODUCT_LIST).length > 0) { // PROJECT LIST 페이지인 경우 
    $.getJSON('data/content.json', initGallery);
  }
  if($('.' + PAGE_PRODUCT_DETAIL).length > 0) {
    initProjectDetail();
  } 
  if($('.' + PAGE_FACTORY).length > 0) {
    initFactoryPage();
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
          '<div data-href="/product_detail.html" class="js-href product_list__item l_product_list__item s_product_list__item ' + (item['js-big'] ? 'js-big ' : '') + item.sortingClass  +  '" data-popular="'+ item.popular +'" data-recent="'+ item.recent +'" data-views="'+ item.views +'">' +
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
            stopVideo($('.section_corporation1').find('video')[0]);
          } else {
            playVideo($('.section_corporation1').find('video')[0])
          }
        },
        offset: '50%'
      });

        // 회사소개 - 아래쪽경계
      corporation1_down = new Waypoint({
        element: $('.section_corporation1'),
        handler: function(direction) {
          if(direction === "up") {
            playVideo($('.section_corporation1').find('video')[0]);       
          } else {
            stopVideo($('.section_corporation1').find('video')[0]);
          }
        },
        offset: '-50%'
      });

      // 회사이념 - 위쪽경계
      corporation2_up = new Waypoint({
        element: $('.section_corporation2'),
        handler: function(direction) {
          if(direction === "up") {
            stopVideo($('.section_corporation2').find('video')[0]);
          } else {
            playVideo($('.section_corporation2').find('video')[0]);
          }
        },
        offset: '50%'
      });

        // 회사이념 - 아래쪽경계
      corporation2_down = new Waypoint({
        element: $('.section_corporation2'),
        handler: function(direction) {
          if(direction === "up") {
            playVideo($('.section_corporation2').find('video')[0]);          
          } else {
            stopVideo($('.section_corporation2').find('video')[0]);
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


function playVideo(video) {
  if(video.readyState === 4) {
    video.currentTime = 0;
    video.play();
  } else {
    if(videoQue && videoQue.length > 0) {
      if(indexOfVideo(video) == -1) {
        videoQue.push(video);
      }      
    } else {
      videoQue = [];
      videoQue.push(video);
    }
    
  }
}

setInterval(function() {
  for(var i = 0; i < videoQue.length ; i++) {
    var video = videoQue[i];
    if(video.readyState === 4) {
      video.currentTime = 0;
      video.play();
      videoQue.splice(i, 1);
    }
  }
}, 500);

function indexOfVideo(video) {
  for(var i = 0; i < videoQue.length ; i++) {
    var item = videoQue[i];
    if(item == video) {
      return i;
    }
  }
  return -1;
}


function stopVideo(video) {
  if(video.readyState === 4) {
    video.pause();
    video.currentTime = 0;
  } else {
    if(!videoQue) {
      return;
    }
    for(var i = 0; i < videoQue.length ; i++) {
      var item = videoQue[i];
      if(item === video) {
        videoQue.splice(i, 1);
      }
    }
  }
}

function initFactory() {
  if(!factory) {
    var factory = new Waypoint({
      element: $('section.factory'),
      handler: function(direction) {
        if(direction === "down") {          
          $('.l_factory_feature').addClass('js-active');
          $('.factory__image').addClass('js-active');
        }
      },
      offset: '20%'
    });
  }
    
}

function initScrollDown() {
  if($(window).outerWidth() > MOBILE_WIDTH) {
    $scrollDown.show();
    var scrollDown = new Waypoint({
      element: $('section.media'),
      handler: function(direction) {
        if(direction === "up") {
          if($(window).outerWidth() > MOBILE_WIDTH) {
            $scrollDown.show();  
          }
        } else {
          $scrollDown.hide();
        }
      },
      offset: '20%'
    });

  } else {
    if(scrollDown) {
      scrollDown.destroy();
      scrollDown = null;
    }
    $scrollDown.hide();
  }
}


function initPopular() {   
  if (!popular1) {
    var popular1 = new Waypoint({
      element: $('section.popular .popular__details'),
      handler: function(direction) {
        if(direction === "up") {
          stopVideo($('.m_popular__details__video')[0]);
        } else {
          playVideo($('.m_popular__details__video')[0]);
        }
      },
      offset: '90%'
    });

    var popular2 = new Waypoint({
      element: $('.popular__more'),
      handler: function(direction) {
        if(direction === "up") {
          playVideo($('.m_popular__details__video')[0]);
        } else {
          stopVideo($('.m_popular__details__video')[0]);
        }
      },
      offset: '20%'
    });
  }     
}



function videoClicked() {
  var $video = $(this).find('video');
  if($(this).hasClass('js-active')) {
    $(this).removeClass('js-active');
    $window.off('resize', resizeVideo);
    $video.attr('style', '');
  } else {
    $(this).addClass('js-active');
    fitVideo( $video);
    resizeVideo = $window.on("resize", function() {
      fitVideo($video);
    });
  }
}


function fitVideo($video) {
  var windowWidth = $(window).width(),
  windowHeight = $(window).height(),
  videoRatio = 1920 / 1080,
  browserRatio = windowWidth / windowHeight,
  videoWidth,
  videoHeight,
  videoLeft,
  videoTop;

  if (videoRatio > browserRatio) { // 비디오 가로가 더 길 때는 높이가 브라우저와 같아진다. 
    videoHeight = windowHeight;
    videoTop = 0;
    videoWidth = videoRatio * videoHeight;   
    videoLeft =  (windowWidth - videoWidth) / 2;            
  } else { // 브라우저 가로가 더 길 때는 비디오 가로가 브라우저와 같아진다.          
    videoWidth = windowWidth;
    videoLeft = 0;
    videoHeight =  videoWidth / videoRatio;    
    videoTop =  (windowHeight - videoHeight) / 2;   
  }

  $video.css({
      width: videoWidth + 'px',
      height: videoHeight + 'px',
      left: videoLeft + 'px',
      top: videoTop + 'px',
  })
}


function initNews() {
  if($(window).outerWidth() < 650) {
    $('.news_image_2').attr('src', "images/event_2_mobile.jpg");
    $('.news_image_3').attr('src', "images/event_3_mobile.jpg");
  } else {
    $('.news_image_2').attr('src', "images/event_2.jpg");
    $('.news_image_3').attr('src', "images/event_3.jpg");
  }
}


function initFactoryPage() {
  $('.sub_factory')
  .removeClass('js-factory-date js-factory-form')
  .addClass('js-factory-category');
  
  $('.sub_factory_button--next').show();
  $('.sub_factory_button--prev').hide();
  $('.sub_factory_button--cancel').hide();
  
  $('.sub_factory_category__form__label__text:last-child').click();

  if(!factoryEventRegistered) {
    $('.sub_factory_button--next').on('click', factoryNextButton);
    $('.sub_factory_button--prev').on('click', factoryPrevButton);
    $('.sub_factory_button--cancel').on('click', factoryCancelButton);

    $('#sub_factory__form__applicant__name__input').on('change', factoryFormChange);
    $('#sub_factory__form__applicant__phone__input1').on('change', factoryFormChange);
    $('#sub_factory__form__applicant__phone__input2').on('change', factoryFormChange);
    $('#sub_factory__form__applicant__phone__input3').on('change', factoryFormChange);
    $('#sub_factory__form__applicant__email__input').on('change', factoryFormChange);

    factoryEventRegistered = true;

    // 페이지 로딩 처음 한 번만 
    initWeatherInfo();

    initDateOption();
  }

}

function factoryFormChange() {
  $('.sub_factory__form__applicant__validate').removeClass('js-invalid');
}

function initDateOption() {
  var optionHtml = '';
  var now = moment();
  for(var i = now.date() + 1 ; i <= 30 ; i++) {
    optionHtml += '<option>' + i + '</option>'
  }
  $('#sub_factory__date__form__day').html(optionHtml);
}

function initWeatherInfo() {
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/forecast?id=1835848&appid=c9d13b23d0a6283ec7f0171d6e5dbb53&units=metric",
    context: document.body
  }).done(function(data) {
    decodeWeatherData(data);
    drawDateHtml();
  });
}

function decodeWeatherData(data) {
  var now = new moment();
  weatherData = {};
  for(var i = 0 ; i < data.list.length ; i++) {
    var item = data.list[i];
    var time = new moment(item.dt * 1000);
    if(time.date() > now.date()) {
      var key = "" + time.date();
      if(weatherData[key]) {
        var maxTemp = Math.max(weatherData[key].maxTemp, item.main.temp_max);
        var minTemp = Math.min(weatherData[key].minTemp, item.main.temp_min);
      } else {
        var maxTemp = item.main.temp_max;
        var minTemp = item.main.temp_min;
      }
      if(time.hour() === 15) {
        var iconUrl = 'http://openweathermap.org/img/w/' + item.weather[0].icon + '.png';
      }

      weatherData[key] = {
        maxTemp: maxTemp,
        minTemp: minTemp,
        iconUrl: iconUrl
      }
    }
  }
}

function drawDateHtml() {
  for(var key in weatherData) {
    var $el = $('.sub_factory__date__dates__content__day[data-day=' + key + ']');
    var data = weatherData[key];
    var text = Math.floor(data.minTemp) + '도 ~ ' + Math.floor(data.maxTemp) + '도';
    $el.find('.sub_factory__date__dates__content__day__weather__text').text(text);
    $el.find('.sub_factory__date__dates__content__day__weather__icon')
    .css({
      'background': 'url(' + data.iconUrl + ')'
    })
  }
}

function factoryNextButton() {
  if($('.sub_factory').hasClass('js-factory-category')) {
    $('.sub_factory')
    .removeClass('js-factory-category')
    .addClass('js-factory-date');
    $('.sub_factory_button--prev').show();
    $('.sub_factory_button--cancel').show();
  } else if ($('.sub_factory').hasClass('js-factory-date')) {
    $('.sub_factory')
    .removeClass('js-factory-date')
    .addClass('js-factory-form');

    if($('#sub_factory_category__form__input--groups').prop('checked')) {
      $('.sub_factory__form__category__text').text('단체견학');
    } else {
      $('.sub_factory__form__category__text').text('개인견학');
    }

    $('.sub_factory__form__date__text').text('2019년 ' + $('#sub_factory__date__form__month').val() + '월 ' + $('#sub_factory__date__form__day').val() + '일');

    $('#sub_factory__form__applicant__name__input').focus();

  } else if ($('.sub_factory').hasClass('js-factory-form')) {
    if(!$('#sub_factory__form__applicant__name__input').val()) {
      $('.sub_factory__form__applicant__validate').addClass('js-invalid');
      $('.sub_factory__form__applicant__name__input').focus();
    } else if(!$('#sub_factory__form__applicant__phone__input1').val()) {
      $('.sub_factory__form__applicant__validate').addClass('js-invalid');
      $('.sub_factory__form__applicant__phone__input1').focus();
    } else if(!$('#sub_factory__form__applicant__phone__input2').val()) {
      $('.sub_factory__form__applicant__validate').addClass('js-invalid');
      $('.sub_factory__form__applicant__phone__input2').focus();
    } else if(!$('#sub_factory__form__applicant__phone__input3').val()) {
      $('.sub_factory__form__applicant__validate').addClass('js-invalid');
      $('.sub_factory__form__applicant__phone__input3').focus();
    } else if(!$('#sub_factory__form__applicant__email__input').val()) {
      $('.sub_factory__form__applicant__validate').addClass('js-invalid');
      $('.sub_factory__form__applicant__email__input').focus();
    } else {
      $('.sub_factory')
      .removeClass('js-factory-form')
      .addClass('js-factory-complete');
      $('.sub_factory_button--next').hide();
      $('.sub_factory_button--prev').hide();
      $('.sub_factory_button--cancel').hide();
    }

  }
}

function factoryPrevButton() {
  if ($('.sub_factory').hasClass('js-factory-date')) {
    $('.sub_factory')
    .removeClass('js-factory-date')
    .addClass('js-factory-category');
    $('.sub_factory_button--prev').hide();
  } else if ($('.sub_factory').hasClass('js-factory-form')) {
    $('.sub_factory')
    .removeClass('js-factory-form')
    .addClass('js-factory-date');
  }
}

function factoryCancelButton() {
  initFactoryPage();
}


}); // end of file    
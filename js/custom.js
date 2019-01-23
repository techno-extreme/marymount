import { url } from "inspector";

$(document).ready(function () {
  var firstPage = 1;
  var lastPage = 3;
  var multivol = false;

  var indexingFinished = false;
  var currentPage = firstPage;
  var manualpages = [];
  var content = [];

  function indexit() {
    if (currentPage <= lastPage) {
      if (currentPage == 1) {
        document.getElementById("myframe").src = "index" + ".html";
      } else if (currentPage == 2) {
        document.getElementById("myframe").src = "e-books" + ".html";
      } else {
        document.getElementById("myframe").src = "events" + ".html";
      }

      document.getElementById("myframe").onload = function () {
        var dW = document.getElementById("myframe").contentWindow;
        var dD = document.getElementById("myframe").contentDocument;
        var dDContent = "";
        for (var s = 0; s < dD.getElementsByTagName("p").length; s++) {
          var tempString = dD.getElementsByTagName("p")[s].innerHTML;
          dDContent += tempString + " ";
        }
        for (var s = 0; s < dD.getElementsByTagName("h1").length; s++) {
          var tempString = dD.getElementsByTagName("h1")[s].innerHTML;
          dDContent += tempString + " ";
        }
        for (var s = 0; s < dD.getElementsByTagName("a").length; s++) {
          var tempString = dD.getElementsByTagName("a")[s].innerHTML;
          dDContent += tempString + " ";
        }
        for (var s = 0; s < dD.getElementsByTagName("h2").length; s++) {
          var tempString = dD.getElementsByTagName("h2")[s].innerHTML;
          dDContent += tempString + " ";
        }
        for (var s = 0; s < dD.getElementsByTagName("div").length; s++) {
          var tempString = dD.getElementsByTagName("div")[s].innerHTML;
          dDContent += tempString + " ";
        }
        for (var s = 0; s < dD.getElementsByTagName("h3").length; s++) {
          var tempString = dD.getElementsByTagName("h3")[s].innerHTML;
          dDContent += tempString + " ";
        }
        for (var s = 0; s < dD.getElementsByTagName("span").length; s++) {
          var tempString = dD.getElementsByTagName("span")[s].innerHTML;
          dDContent += tempString + " ";
        }
        for (var s = 0; s < dD.getElementsByTagName("button").length; s++) {
          var tempString = dD.getElementsByTagName("button")[s].innerHTML;
          dDContent += tempString + " ";
        }
        content.push({ address: dW.location.href, content: dDContent.toLowerCase() });
        currentPage++;
        indexit();
      };
    } else setTimeout(function () {
      //document.getElementById("result").innerHTML = JSON.stringify(content); 
      indexingFinished = true;
    }, 100)
  }

  function search() {
    var sinput = document.getElementById("searchinput").value;
    if (content.length > 0) {
      var tempContent = "";
      var resultCount = 0;
      for (var i = 0; i < content.length; i++) {
        if (content[i].content.indexOf(sinput) > -1) {
          tempContent += "Result found on Page: <a href='" + content[i].address.split("/").pop() + "'>" + content[i].address.split("/").pop().split(".")[0] + ".html" + "</a><br />";
          resultCount += 1;
        }
      }
      if (resultCount == 0) tempContent = "No result found.";
      document.getElementById("searchresult").innerHTML = tempContent;

      //reset indexer
      content = [];
      currentPage = firstPage;
    } else document.getElementById("searchresult").innerHTML = "No index data."
  }

  function indexAndSearch() {
    indexit();
    var tempTimer = setInterval(function () {
      if (indexingFinished) {
        search();
        indexingFinished = false;
        clearInterval(tempTimer);
      }
    }, 100)
  }

  document.getElementById("searchBtn").onclick = indexAndSearch();

  $('#contact-form').submit({
    function(e) {
      var name = getElementById('inputName'),
        email = getElementById('inputEmail'),
        message = getElementById('inputMessage');
      subject = getElementById('inputSubject');

      if (!name.value || !email.value || !message.value) {
        alert('Please check your entries.');
      } else {
        $.ajax({
          url: "https://formspree.io/tonderaimuchada@gmail.com",
          method: "POST",
          data: $(this).serialize(),
          dataType: "json"
        });
        e.preventDefault();
        $(this).get(0).reset();
        alert('Message sent!')
      }
    }
  })
  // Smooth scrolling
  $(function () {
    $('a[href*="#"]:not([href="#"])').click(function () {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000, 'easeInOutExpo');

          if ($(this).parents('.nav-menu').length) {
            $('.nav-menu .menu-active').removeClass('menu-active');
            $(this).closest('li').addClass('menu-active');
          }

          if ($('body').hasClass('mobile-nav-active')) {
            $('body').removeClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
            $('#mobile-body-overly').fadeOut();
          }
          return false;
        }
      }
    });
  });

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: { opacity: 'show' },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({ id: 'mobile-nav' });
    $mobile_nav.find('> ul').attr({ 'class': '', 'id': '' });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function (e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function (e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function (e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Stick the header at top on scroll
  $("#header").sticky({ topSpacing: 0, zIndex: '50' });

  // Counting numbers

  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Tooltip & popovers
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();

  // Background image via data tag
  $('[data-block-bg-img]').each(function () {
    // @todo - invoke backstretch plugin if multiple images
    var $this = $(this),
      bgImg = $this.data('block-bg-img');

    $this.css('backgroundImage', 'url(' + bgImg + ')').addClass('block-bg-img');
  });

  // jQuery counterUp
  if (jQuery().counterUp) {
    $('[data-counter-up]').counterUp({
      delay: 20,
    });
  }

  //Scroll Top link
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.scrolltop').fadeIn();
    } else {
      $('.scrolltop').fadeOut();
    }
  });

  $('.scrolltop, #logo a').click(function () {
    $("html, body").animate({
      scrollTop: 0
    }, 1000, 'easeInOutExpo');
    return false;
  });

});

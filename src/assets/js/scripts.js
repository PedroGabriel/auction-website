// Progressbar

// var counter = 0;
// setInterval(function() {
//   counter = (counter + 0.2) % 100;
//   $(".progressbar").css("width", counter + "%");
// }, 20);

// Slider

var runJqueryDone = false;
var runJquery = function() {
  // if(runJqueryDone) return false;
  runJqueryDone = true;
  setTimeout(function() {
    $(function() {
      if ($(window).width() >= 1024) {
        $('.slider-bid').slick({
          dots: false,
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 3
        });
        $('.box-car-slides').slick({
          lazyLoad: 'ondemand', // ondemand progressive anticipated
          infinite: true,
          dots: true
        });
      } else {
        $('.slider-bid').slick({
          dots: false,
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1
        });
        $('.box-car-slides').slick({
          lazyLoad: 'ondemand', // ondemand progressive anticipated
          infinite: true,
          dots: true
        });
      }
    });

    // Mascara
    $('#pricemask').click(function() {
      $('#pricemask').mask('#,##0.00', { reverse: true });
    });

    $('#bid-textarea-comment').keyup(function() {
      $('#bid-sendcomment').css('opacity', 1);
    });

    // Galeria
    $('#gallery-viewgrid-big').click(function() {
      $('.gallery-photos-squad img').width('345px');
      $('#gallery-viewgrid-big').addClass('active');
      $('#gallery-viewgrid-med').removeClass('active');
    });

    $('#gallery-viewgrid-med').click(function() {
      $('.gallery-photos-squad img').width('217px');
      $('#gallery-viewgrid-med').addClass('active');
      $('#gallery-viewgrid-big').removeClass('active');
    });
  }, 1);
};

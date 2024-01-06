$(function () {
    $(document).scroll(function () {
      var $nav = $(".navbar");
      $nav.toggleClass('home-nav', $(this).scrollTop() > $nav.height());
    });
  });
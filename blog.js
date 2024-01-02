$(function () {
    $(document).scroll(function () {
      var $nav = $(".navbar");
      $nav.toggleClass('home-nav', $(this).scrollTop() > $nav.height());
    });
  });

$("#hero-expore-button").onclick(function() {
    location.href = "/explore";
});

$("#hero-write-button").onclick(function() {
    location.href = "/write";
});
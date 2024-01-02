$(function () {
    $(document).scroll(function () {
      var $nav = $(".navbar");
      $nav.toggleClass('navbar-dark', $(this).scrollTop() < $nav.height()+200);
    });
  });


$("button").click(function(event) {
    if (event.target.id == "hero-explore-btn") {
        location.href = "/explore";
    } else if (event.target.id == "hero-write-btn") {
        location.href = "/write";
    }
});
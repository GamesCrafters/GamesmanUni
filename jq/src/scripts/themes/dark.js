style.priColor = "white";
style.secColor = "black";
style.font = "13px monospace";

$(function() {
  // color
  $("*").css({
    background: style.secColor,
    color: style.priColor,
    font: style.font
  });

  $(".title").css("font-weight", "bold");
});

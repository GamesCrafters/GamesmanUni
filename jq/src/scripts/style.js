const style = {
  priColor: null,
  secColor: null,
  font: null
};
const lightTheme = "./scripts/themes/light.js";
const darkTheme = "./scripts/themes/dark.js";
const currentTheme = lightTheme;

$(function() {
  $("#themeScript").attr("src", currentTheme);
});

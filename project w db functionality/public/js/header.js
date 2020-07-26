var navContainer = document.getElementById("navMenu");
var navItems = btnContainer.getElementsByClassName("btn");

for (var i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
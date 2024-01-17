const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const item = document.querySelector(".item");
const header = document.getElementsByTagName("header")[0];

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
})
item.addEventListener("click", () => {
    item.classList.toggle("zoom")
    header.classList.toggle("hidden")
})
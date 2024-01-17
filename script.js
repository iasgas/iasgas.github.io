const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const items = document.getElementsByClassName("item");
const header = document.getElementsByTagName("header")[0];

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
})

for (let i = 0; i < items.length; i++) {
    items[i].addEventListener("click", () => {
        items[i].classList.toggle("zoom")
        header.classList.toggle("hidden")
    })

}
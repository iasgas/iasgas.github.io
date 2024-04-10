const Projects = document.querySelector(".dropdown");
const menu = document.querySelector(".menu-container");
const contact = document.querySelector("#contact");
const footer = document.querySelector("footer");
const container = document.querySelector(".page-container");


Projects.addEventListener("click", () => {
    menu.classList.toggle("active")
})


contact.addEventListener("click", () => {
    container.classList.toggle("active")
})
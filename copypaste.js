const Projects = document.querySelector(".dropdown");
const menu = document.querySelector(".menu-container");
const contact = document.querySelector("#contact");
const footer = document.querySelector("footer");
const container = document.querySelector(".page-container");
const html = document.querySelector("html");
const body = document.querySelector("body");


Projects.addEventListener("click", () => {
    menu.classList.toggle("active")
})


contact.addEventListener("click", () => {
    body.classList.toggle("active")
})



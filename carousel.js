const header = document.querySelector("header");
const slideshow = document.querySelector(".Slideshow");
const Name= document.querySelector(".name");
const contact = document.querySelector(".contact");
const contactdrop= document.querySelector(".contact-drop");
const contactclose= document.querySelector(".contact-close");


Name.addEventListener("click", () => {
    contact.classList.toggle("active")
    contactdrop.classList.toggle("active") 
    slideshow.classList.toggle("active")
    Name.classList.toggle("active")
})

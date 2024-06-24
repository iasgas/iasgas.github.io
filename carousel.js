const one = document.querySelectorAll('.one');
const two = document.querySelectorAll('.two');


function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length; 
    showSlide();
}

//  Initial display
one.addEventListener("click", () => {
    two.classList.toggle("active")
})


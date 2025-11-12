let buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
    button.addEventListener('click', function(e){
        this.classList.toggle('active');
        let data = this.dataset.type;
        let divs = "show-" + data
        document.body.classList.toggle(divs)

    })
});

const players = document.querySelectorAll('.player');
players.forEach(player => {
    new Plyr(player, {
        hideControls: false,
        autopause: true,
        controls: ["play", "progress", "mute"],  
    });
});


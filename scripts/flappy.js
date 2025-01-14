const end_message = 'Appuyez sur entrée pour réessayer';

const speed = 3;
const gravity = 0.2;
const jump_velocity = -7.6;
const pipe_gap = 35;

let bird = document.querySelector(".bird");
let bird_box = bird.getBoundingClientRect();
let background_box = document.querySelector(".background").getBoundingClientRect();

let score_value = document.querySelector(".score_value");
let title = document.querySelector(".title");
let score_title = document.querySelector('.score_title');

let game_state = 'start';
let bird_dy = 0;
let pipe_separation = 0;

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') start();
    else if (e.key === 'ArrowUp' || e.key === ' ') click(e);
});
document.addEventListener('pointerdown', () => {
    click();
    start();
});

function start() {
    if (game_state === 'play') return;

    document.querySelectorAll('.pipe').forEach((e) => e.remove());
    bird.style.top = '40vh';
    game_state = 'play';
    title.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_value.innerHTML = '0';
    bird_box = bird.getBoundingClientRect();
    bird_dy = 0;
    requestAnimationFrame(loop);
}

function movePipes() {
    let pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => {
        let pipe_box = pipe.getBoundingClientRect();
        bird_box = bird.getBoundingClientRect();

        if (pipe_box.right <= 0) pipe.remove();
        else {
            if (
                bird_box.left < pipe_box.left + pipe_box.width &&
                bird_box.left + bird_box.width > pipe_box.left &&
                bird_box.top < pipe_box.top + pipe_box.height &&
                bird_box.top + bird_box.height > pipe_box.top
            ) {
                game_state = 'end';
                title.innerHTML = end_message;
                title.style.left = '28vw';
            } else {
                if (
                    pipe_box.right < bird_box.left &&
                    pipe_box.right + speed >= bird_box.left &&
                    pipe.score
                ) {
                    score_value.innerHTML = +score_value.innerHTML + 1;
                }
                pipe.style.left = pipe_box.left - speed + 'px';
            }
        }
    });
}

function applyGravity() {
    bird_dy += gravity;

    if (bird_box.top <= 0 || bird_box.bottom >= background_box.bottom) {
        game_state = 'end';
        title.innerHTML = end_message;
        title.style.left = '28vw';
        return;
    }
    bird.style.top = bird_box.top + bird_dy + 'px';
    bird_box = bird.getBoundingClientRect();
}

function createPipe() {
    if (pipe_separation > 200) {
        pipe_separation = 0;
        let pipe_pos = Math.floor(Math.random() * 43) + 8;

        let pipe_inv = document.createElement('div');
        pipe_inv.className = 'pipe';
        pipe_inv.style.top = pipe_pos - 70 + 'vh';
        pipe_inv.style.left = '100vw';
        document.body.appendChild(pipe_inv);

        let pipe = document.createElement('div');
        pipe.className = 'pipe';
        pipe.style.top = pipe_pos + pipe_gap + 'vh';
        pipe.style.left = '100vw';
        pipe.score = true;
        document.body.appendChild(pipe);
    }
    pipe_separation++;
}

function loop() {
    if (game_state !== 'play') return;

    movePipes();
    applyGravity();
    createPipe();

    requestAnimationFrame(loop);
}

function click(e) {
    if (game_state !== 'play') return;
    e.preventDefault();

    bird_dy = jump_velocity;
}

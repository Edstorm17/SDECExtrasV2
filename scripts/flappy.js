const end_message = 'Appuyez sur entrée pour réessayer';

const singleplayerButton = document.getElementById('singleplayer');
const multiplayerButton = document.getElementById('multiplayer');
const createGameButton = document.getElementById('createGame');

const bird_speed = 3;
const gravity = 0.2;
const jump_velocity = -7.6;
const speed_increase = 0.02;

let speed_multiplier = 1;

const score_value = document.querySelector(".score_value");
const title = document.querySelector(".title");
const score_title = document.querySelector('.score_title');

function singleplayer() {
    hideButtons();

    const pipe_gap = 35;
    const pipe_separation = 200;

    let bird = spawnBird();
    let bird_box = bird.getBoundingClientRect();
    let background_box = document.querySelector(".background").getBoundingClientRect();

    title.innerHTML = 'Touchez ou appuyez sur entrée pour débuter';

    let game_state = 'start';
    let bird_dy = 0;
    let current_pipe_separation = 0;

    document.addEventListener('keydown', e => {
        if (e.key === 'Enter') start();
        else if (e.key === 'ArrowUp' || e.key === ' ') click(e);
    });
    document.addEventListener('pointerdown', e => {
        click(e);
        start();
    });

    function start() {
        if (game_state === 'play') return;

        document.querySelectorAll('.element').forEach((e) => e.remove());
        bird.style.top = '40vh';
        game_state = 'play';
        title.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_value.innerHTML = '0';
        bird_box = bird.getBoundingClientRect();
        bird_dy = 0;
        speed_multiplier = 1;
        requestAnimationFrame(loop);
    }

    function movePipes() {
        let elements = document.querySelectorAll('.element');
        elements.forEach(element => {
            let element_box = element.getBoundingClientRect();

            if (element.classList.contains('pipe')) {
                bird_box = bird.getBoundingClientRect();

                if (element_box.right <= 0) element.remove();
                else {
                    if (
                        bird_box.left < element_box.left + element_box.width &&
                        bird_box.left + bird_box.width > element_box.left &&
                        bird_box.top < element_box.top + element_box.height &&
                        bird_box.top + bird_box.height > element_box.top
                    ) {
                        game_state = 'end';
                        title.innerHTML = end_message;
                        title.style.left = '28vw';
                    } else {
                        if (
                            element_box.right < bird_box.left &&
                            element_box.right + bird_speed * speed_multiplier >= bird_box.left &&
                            element.score
                        ) {
                            score_value.innerHTML = +score_value.innerHTML + 1;
                            speed_multiplier += speed_increase;
                        }
                    }
                }
            }

            element.style.left = element_box.left - bird_speed * speed_multiplier + 'px';
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
        if (current_pipe_separation > pipe_separation / speed_multiplier) {
            current_pipe_separation = 0;
            let pipe_pos = Math.floor(Math.random() * 43) + 8;

            let pipe_inv = document.createElement('div');
            pipe_inv.classList.add('pipe');
            pipe_inv.classList.add('element');
            pipe_inv.style.top = pipe_pos - 70 + 'vh';
            pipe_inv.style.left = '100vw';
            document.body.appendChild(pipe_inv);

            let pipe = document.createElement('div');
            pipe.classList.add('pipe');
            pipe.classList.add('element');
            pipe.style.top = pipe_pos + pipe_gap + 'vh';
            pipe.style.left = '100vw';
            pipe.score = true;
            document.body.appendChild(pipe);

            if (Math.random() <= 1) createOrb();
        }
        current_pipe_separation++;
    }

    function createOrb() {
        // let top = Math.round(Math.random()) === 1;
        //
        // let orb = document.createElement('svg');
        // orb.classList.add('orb');
        // orb.classList.add('element');
        // orb.style.top = (top ? 2 : 92) + 'vh';
        // orb.style.left = 92 + 'vh';
        //
        // document.body.appendChild(orb);
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
}

function multiplayer() {
    hideButtons();

    const socket = io('http://localhost:3000');

    let bird = spawnBird(socket.id);
    let bird_box = bird.getBoundingClientRect();

    let game_state = 'start';
    let bird_dy = 0;

    let bird_map = new Map();

    document.addEventListener('keydown', e => {
        // if (e.key === 'Enter') start();
        if (e.key === 'ArrowUp' || e.key === ' ') click(e);
    });
    document.addEventListener('pointerdown', e => {
        click(e);
        // start();
    });

    function loop() {
        if (game_state !== 'play') return;



        requestAnimationFrame(loop);
    }

    function click(e) {
        e.preventDefault();
        bird_dy = jump_velocity;
        socket.emit('player-jump', { strength: jump_velocity })
    }

    socket.on('player-jump', (data) => {
        if (!bird_map.has(data.id)) return;
        bird_map.get(data.id).dy = data.strength;
        console.log(`Player ${data.id} jumped:`, data)
    });
    socket.on('spawn-player', (data) => {
        bird_map.set(data.id, spawnBird(data.id));
        console.log(`Player ${data.id} spawned:`, data)
    })

}

function setupMultiplayer() {
    hideButtons();
    document.querySelector('.multiplayerMenu').style.display = 'block';
}

function hideButtons() {
    document.querySelector('.mainMenu').style.display = 'none';
    document.querySelector('.multiplayerMenu').style.display = 'none';
}

function spawnBird(id) {
    let bird = document.createElement('img')
    bird.className = 'bird';
    bird.src = '/images/icon-128.png';
    bird.alt = 'Bird';
    if (id) bird.id = id;
    document.body.appendChild(bird);
    return bird;
}

singleplayerButton.addEventListener('click', singleplayer);
multiplayerButton.addEventListener('click', setupMultiplayer);
createGameButton.addEventListener('click', multiplayer);

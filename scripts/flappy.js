const end_message = 'Appuyez sur entrée pour réessayer';

const singleplayerButton = document.getElementById('singleplayer');
const multiplayerButton = document.getElementById('multiplayer');
const createGameButton = document.getElementById('createGame');

const multiplayerMenu = document.querySelector('.multiplayerMenu');

const bird_speed = 3;
const gravity = 0.2;
const jump_velocity = -7.6;
const speed_increase = 0.02;

let speed_multiplier = 1;

const score_value = document.querySelector(".score_value");
const title = document.querySelector(".title");
const score_title = document.querySelector('.score_title');

const background_box = document.querySelector(".background").getBoundingClientRect();

let socket;

function singleplayer() {
    hideButtons();

    const pipe_gap = 35;
    const pipe_separation = 200;

    let bird = spawnBird();
    let bird_box = bird.getBoundingClientRect();

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

function multiplayer(players) {
    hideButtons();

    let bird = spawnBird(socket.id);
    let bird_box = bird.getBoundingClientRect();

    let game_state = 'start';
    let bird_dy = 0;
    let dead = false;

    let bird_map = new Map();

    document.addEventListener('keydown', e => {
        if (e.key === 'Enter') startClick();
        if (e.key === 'ArrowUp' || e.key === ' ') click(e);
    });
    document.addEventListener('pointerdown', e => {
        click(e);
        startClick();
    });

    for (const [key, value] of Object.entries(players)) {
        if (key === socket.id) continue;
        bird_map.set(key, spawnBird(key, value.name));
    }

    function startClick() {
        if (dead) resetBird();
        if (game_state === 'play') return;
        socket.emit('game-start');
    }

    function start() {
        document.querySelectorAll('.element').forEach((e) => e.remove());
        resetBird();
        bird_map.forEach((v, k) => {
            v.style.top = '40vh';
            v.dy = 0;
            v.dead = false;
        });

        requestAnimationFrame(loop);
    }

    function resetBird() {
        dead = false;
        bird.style.top = '40vh';
        title.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_value.innerHTML = '0';
        bird_box = bird.getBoundingClientRect();
        bird_dy = 0;
        speed_multiplier = 1;
        socket.emit('reset-bird');
    }

    function applyGravity() {
        if (!dead) {
            bird_dy += gravity;

            if (bird_box.top <= 0 || bird_box.bottom >= background_box.bottom) {
                die();
                return;
            }
            bird.style.top = bird_box.top + bird_dy + 'px';
        }

        for (const [key, value] of bird_map) {
            if (!value.dead) {
                value.dy += gravity;
                value.style.top = value.getBoundingClientRect().top + value.dy + 'px';
            }
        }

        bird_box = bird.getBoundingClientRect();
    }

    function loop() {
        if (game_state !== 'play') return;
        console.log('frame');

        applyGravity();

        requestAnimationFrame(loop);
    }

    function die() {
        dead = true;
        title.innerHTML = end_message;
        title.style.left = '28vw';

        socket.emit('set-dead', true);
    }

    function click(e) {
        e.preventDefault();
        bird_dy = jump_velocity;
        socket.emit('player-jump', { strength: jump_velocity })
    }

    socket.on('player-jump', (data) => {
        if (!bird_map.has(data.id)) return;
        if (data.id === socket.id) return;
        bird_map.get(data.id).dy = data.strength;
        console.log(`Player ${data.id} jumped:`, data)
    });
    socket.on('player-joined', (data) => {
        if (data.id === socket.id) return;
        bird_map.set(data.id, spawnBird(data.id, data.name));
        console.log(`Player ${data.id} spawned:`, data)
    })
    socket.on('player-disconnected', (data) => {
        if (!bird_map.has(data.id)) return;
        if (data.id === socket.id) return;
        bird_map.delete(data.id);
        document.getElementById(data.id).remove();
        console.log(`Player ${data.id} disconnected:`, data);
    });
    socket.on('update-game-state', (state) => {
        game_state = state;
        if (game_state === 'play') start();
        console.log('Game state:', state);
    });
    socket.on('set-dead', (data) => {
        if (!bird_map.has(data.id)) return;
        if (data.id === socket.id) return;
        bird_map.get(data.id).dead = data.dead;
    });
    socket.on('reset-bird', (playerId) => {
       if (playerId === socket.id) return;
       let bird = bird_map.get(playerId);
       bird.dead = false;
       bird.style.top = '40vh';
       bird.dy = 0;
    });

}

function initMultiplayerMenu() {
    hideButtons();
    multiplayerMenu.style.display = 'block';
    socket = io('http://localhost:3000')

    let currentGamesList = multiplayerMenu.querySelector('.currentGames');
    currentGamesList.addEventListener('click', (e) => {
       if (e.target.classList.contains('instance')) {
           joinGame(e.target.id)
       }
    });

    socket.on('instances-list', (data) => {
        currentGamesList.innerHTML = '';
        for (const [key, value] of Object.entries(data)) {
            console.log(key, value);
            let game = document.createElement('div');
            game.id = key;
            game.classList.add('instance');
            game.innerText = value.name;
            currentGamesList.appendChild(game);
        }
    });

    socket.emit('request-instances');
    let refreshId = setInterval(() => {
        socket.emit('request-instances');
    }, 5000);

    function createGame() {
        let playerName = prompt("Entrez un nom pour votre personnage", "Bob");
        if (!playerName) return;
        let gameName = prompt("Entrez un nom pour la salle", "Salle");
        if (!gameName) return;
        socket.emit('create-instance', { instanceName: gameName, playerName: playerName });

        socket.on('instance-created', (data) => {
            clearInterval(refreshId);
            multiplayer({});
        });
    }

    function joinGame(id) {
        let playerName = prompt("Entrez un nom pour votre personnage", "Bob");
        if (!playerName) return;
        socket.emit('join-instance', { instanceId: id, playerName: playerName });

        socket.on('instance-joined', (data) => {
           clearInterval(refreshId);
           multiplayer(data.currentPlayers);
        });
    }

    createGameButton.addEventListener('click', createGame);
}

function hideButtons() {
    document.querySelector('.mainMenu').style.display = 'none';
    multiplayerMenu.style.display = 'none';
}

function spawnBird(id, username) {
    let container = document.createElement('div');
    let bird = document.createElement('img');
    bird.src = '/images/icon-128.png';
    bird.alt = 'Bird';
    container.className = 'bird';
    if (id) container.id = id;
    if (username) {
        let name = document.createElement('div');
        name.className = 'username';
        name.innerText = username;
        container.appendChild(name);
    }
    container.appendChild(bird);
    document.body.appendChild(container);
    return container;
}

singleplayerButton.addEventListener('click', singleplayer);
multiplayerButton.addEventListener('click', initMultiplayerMenu);

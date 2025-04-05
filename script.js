document.addEventListener("DOMContentLoaded", () => {
    const startModal = document.getElementById("startModal");
    const startButton = document.getElementById("startButton");
    const endModal = document.getElementById("endModal");
    const finalScore = document.getElementById("finalScore");
    
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreDisplay = document.createElement("div");
   

    document.getElementById("startButton").addEventListener("click", function() {
    var audio = document.getElementById("backgroundMusic");
        audio.play(); // 사용자가 버튼을 클릭했을 때 오디오 시작
      });
      
    canvas.width = 400;
    canvas.height = 600;

    const character = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 90,
        width: 60,
        height: 90,
        speed: 10,
        image: new Image()
    };
    character.image.src = "images/boy.png";

    const obstacleImages = [
        "images/obstacle.png",
        "images/obstacle2.png"
    ];
    let obstacles = [];
    let obstacleSpeed = 4;
    let spawnRate = 1000;
    let running = false;

    let gameInterval;
    let startTime;
    let elapsedTime = 0;

    function startGame() {
        if (running) {
            clearInterval(gameInterval);
            obstacles = [];
        }

        startModal.style.display = "none";
        obstacleSpeed = 4;
        spawnRate = 1000;
        startTime = Date.now();
        elapsedTime = 0;
        running = true;
        scoreDisplay.innerText = `SCORE: 0`;

        gameInterval = setInterval(updateGame, 20);
        spawnObstacles();
        increaseDifficulty();
    }

    function spawnObstacles() {
        if (!running) return;

        const numberOfObstacles = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < numberOfObstacles; i++) {
            const obstacle = {
                x: Math.random() * (canvas.width - 80),
                y: -80,
                width: 40,
                height: 40,
                speed: obstacleSpeed,
                image: new Image()
            };

            const randomImageIndex = Math.floor(Math.random() * obstacleImages.length);
            obstacle.image.src = obstacleImages[randomImageIndex];

            obstacle.image.onload = function () {
                obstacles.push(obstacle);
            };
        }

        setTimeout(spawnObstacles, spawnRate);
    }

    function increaseDifficulty() {
        if (!running) return;

        obstacleSpeed += 0.05;
        spawnRate = Math.max(500, spawnRate - 100);
        setTimeout(increaseDifficulty, 5000);
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        scoreDisplay.innerText = `SCORE: ${elapsedTime}`;

        ctx.drawImage(character.image, character.x, character.y, character.width, character.height);

        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].y += obstacles[i].speed;
            ctx.drawImage(obstacles[i].image, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

            if (
                character.x < obstacles[i].x + obstacles[i].width &&
                character.x + character.width > obstacles[i].x &&
                character.y < obstacles[i].y + obstacles[i].height &&
                character.y + character.height > obstacles[i].y
            ) {
                endGame();
                return;
            }
        }

        obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
    }

    function endGame() {
        running = false;
        clearInterval(gameInterval);
        finalScore.innerText = ` score: ${elapsedTime}ms`;
        endModal.style.display = "block";
    }


    document.getElementById("leftButton").addEventListener("click", () => {
        if (character.x > 0) {
            character.x -= character.speed;
        }
    });

    document.getElementById("rightButton").addEventListener("click", () => {
        if (character.x < canvas.width - character.width) {
            character.x += character.speed;
        }
    });

    startButton.addEventListener("click", startGame);
});

/*jslint
    white: true
*/

var canvas = document.getElementById("ds");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

//Plane dimensions
var planeWidth = 123;
var planeHeight = 69;

var playerPlane1;
var playerPlane2;
var playerPlane3;

var explosionGraphic;

//Plane positioning
var planeXPosition = 25;
var planeYPosition = (height / 2) - (planeHeight / 2);

//Controls for the plane
var dKey = false;
var aKey = false;
var wKey = false;
var sKey = false;
var upArrow = false;

//Stats for the game, such as score, lives
//highscore, enemies killed and enemies missed
var score = 0;
var highscore = 0;
var planesShot = 0;
var planesMissed = 0;
var playerHit = false;
var lives = 3;
var gameStarted = false;

//Background image
var background;
var backgroundXPosition = 0;
var backgroundYPosition = 0;
var backgroundXPosition2 = 1200;

//Music and SFX
var backgroundMusic;
var levelMusic;
var gameOverMusic;
var gameOver = false;
var playing;
var gunshot;
var flyby;
var finalExplosion;
var planeShotDown;
var playerDeath;

//Guns
var bullets = 4;
var guns = [];
var bullet;

//To create enemies
var enemyPlane;
var enemyPlanesTotal = 4;
var enemyPlanes = [];
var enemyPlaneWidth = 120;
var enemyPlaneHeight = 87;
var enemyPlaneXPosition = width + enemyPlaneWidth;
var enemyPlaneYPosition = Math.floor(Math.random()*(height - enemyPlaneHeight));
var enemyPlaneSpeed = Math.floor(Math.random()* 6 + 2);
var increaseEnemies = false;

//Adding enemy planes to the 2D array
for(var i = 0; i < enemyPlanesTotal; i++)
{
    enemyPlanes.push([enemyPlaneXPosition, enemyPlaneYPosition, enemyPlaneWidth, enemyPlaneHeight, enemyPlaneSpeed]);
    enemyPlaneYPosition = Math.floor(Math.random()*(height - enemyPlaneHeight));
    enemyPlaneSpeed = Math.floor(Math.random()* 6 + 2);
}

//This function checks if an enemy was hit
//And removes it from the screen to place it in its initial position
function isEnemyHit()
{
    var erase = false;
    for(var i = 0; i < guns.length; i++)
    {
        for(var j = 0; j < enemyPlanes.length; j++)
        {
            if(guns[i][0] >= enemyPlanes[j][0] &&
               guns[i][1] >= enemyPlanes[j][1] &&
               guns[i][1] <= enemyPlanes[j][1] + enemyPlanes[j][3])
            {
                erase = true;
                ctx.drawImage(explosionGraphic, enemyPlanes[j][0], enemyPlanes[j][1]);
                enemyPlanes.splice(j, 1);
                enemyPlaneYPosition = Math.floor(Math.random()*(height - enemyPlaneHeight));
                enemyPlaneSpeed = Math.floor(Math.random()* 6 + 2);
                enemyPlanes.push([enemyPlaneXPosition, enemyPlaneYPosition, enemyPlaneWidth, enemyPlaneHeight, enemyPlaneSpeed]);
            }
        }
        if(erase == true)
        {
            planeShotDown.play();
            guns.splice(i, 1);
            score += 20;
            planesShot += 1;
            erase = false;
        }
    }
}

//This function checks if the player was hit. It resets the player
//And the enemies if it was hit and subtracts one life.
function isPlayerHit()
{
    var playerTopRight = planeXPosition + planeWidth;
    var playerBottomRight = planeYPosition + planeHeight;
    for(var i = 0; i < enemyPlanes.length; i++)
    {
        if(planeXPosition > enemyPlanes[i][0] && planeXPosition < enemyPlanes[i][0] + enemyPlaneWidth
          && planeYPosition > enemyPlanes[i][1] && planeYPosition < enemyPlanes[i][1] + enemyPlaneHeight)
        {
            playerHit = true;
            ctx.drawImage(explosionGraphic, planeXPosition, planeYPosition);
            ctx.drawImage(explosionGraphic, enemyPlanes[i][0], enemyPlanes[i][1]);
            playerDeath.play();
            lives -= 1;
            if(lives >= 0)
            {
                resetTheGame();
            }
        }
        if(playerTopRight > enemyPlanes[i][0] && playerTopRight < enemyPlanes[i][0] + enemyPlaneWidth
          && planeYPosition > enemyPlanes[i][1] && planeYPosition < enemyPlanes[i][1] + enemyPlaneHeight)
        {
            playerHit = true;
            ctx.drawImage(explosionGraphic, planeXPosition, planeYPosition);
            ctx.drawImage(explosionGraphic, enemyPlanes[i][0], enemyPlanes[i][1]);
            playerDeath.play();
            lives -= 1;
            if(lives >= 0)
            {
                resetTheGame();
            }
        }
        if(playerBottomRight > enemyPlanes[i][1] && playerBottomRight < enemyPlanes[i][1] + enemyPlaneHeight
          && planeXPosition > enemyPlanes[i][0] && planeXPosition < enemyPlanes[i][0] + enemyPlaneWidth)
        {
            playerHit = true;
            ctx.drawImage(explosionGraphic, planeXPosition, planeYPosition);
            ctx.drawImage(explosionGraphic, enemyPlanes[i][0], enemyPlanes[i][1]);
            playerDeath.play();
            lives -= 1;
            if(lives >= 0)
            {
                resetTheGame();
            }
        }
        if(playerBottomRight > enemyPlanes[i][1] && playerBottomRight < enemyPlanes[i][1] + enemyPlaneHeight
          && playerTopRight < enemyPlanes[i][0] + enemyPlaneWidth && playerTopRight > enemyPlanes[i][0])
        {
            playerHit = true;
            ctx.drawImage(explosionGraphic, planeXPosition, planeYPosition);
            ctx.drawImage(explosionGraphic, enemyPlanes[i][0], enemyPlanes[i][1]);
            playerDeath.play();
            lives -= 1;
            if(lives >= 0)
            {
                resetTheGame();
            }
        }
    }
}

//Resets the player and the enemies
function resetTheGame()
{
    enemyPlanes = [];
    enemyPlaneXPosition = width + enemyPlaneWidth;
    enemyPlaneYPosition = Math.floor(Math.random()*(height - enemyPlaneHeight));
    enemyPlaneSpeed = Math.floor(Math.random()* 6 + 2);
    for(var i = 0; i < enemyPlanesTotal; i++)
    {
        enemyPlanes.push([enemyPlaneXPosition, enemyPlaneYPosition, enemyPlaneWidth, enemyPlaneHeight, enemyPlaneSpeed]);
        enemyPlaneYPosition = Math.floor(Math.random()*(height - enemyPlaneHeight));
        enemyPlaneSpeed = Math.floor(Math.random()* 6 + 2);
    }
    planeXPosition = 25;
    planeYPosition = (height / 2) - (planeHeight / 2);
}

function setup()
{
    enemyPlane = new Image();
    enemyPlane.src = 'enemy_plane.png';
    playerPlane1 = new Image();
    playerPlane1.src = 'player_plane1.png';
    playerPlane2 = new Image();
    playerPlane2.src = 'player_plane2.png';
    playerPlane3 = new Image();
    playerPlane3.src = 'player_plane3.png';
    explosionGraphic = new Image();
    explosionGraphic.src = 'Explosion.gif';
    bullet = new Image();
    bullet.src = 'gunfire(1).png';
    background = new Image();
    background.src = 'background.jpg';
    backgroundMusic = new Audio();
    backgroundMusic.src = 'Rebirth.wav';
    backgroundMusic.loop = true;
    levelMusic = new Audio();
    levelMusic.src = 'Groove2 90.wav';
    levelMusic.loop = true;
    gameOverMusic = new Audio();
    gameOverMusic.src = 'Shanghai Loop.wav';
    gameOverMusic.loop = true;
    gunshot = new Audio();
    gunshot.src = 'laser.wav';
    flyby = new Audio();
    flyby.src = 'flyby.wav';
    finalExplosion = new Audio();
    finalExplosion.src = 'explosion.wav';
    planeShotDown = new Audio();
    planeShotDown.src = 'planeShotDown.wav';
    playerDeath = new Audio();
    playerDeath.src = 'playerDeath.wav';
    playing = setInterval(looping, 25);
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    canvas.addEventListener('click', startTheGame, false);
}

function startTheGame()
{
    gameStarted = true;
    canvas.removeEventListener('click', startTheGame, false);
}

//Draws the scrolling background
function drawBackground()
{
    ctx.drawImage(background, backgroundXPosition, backgroundYPosition);
    ctx.drawImage(background, backgroundXPosition2, backgroundYPosition);
    if(backgroundXPosition < -1200)
    {
        backgroundXPosition = 1192;
    }
    if(backgroundXPosition2 < -1200)
    {
        backgroundXPosition2 = 1192;
    }
    backgroundXPosition -= 8;
    backgroundXPosition2 -= 8;
}

//Draws the player on the screen
function drawPlane()
{
    if(planeXPosition + planeWidth <= width)
    {
        if(dKey)
        {
            planeXPosition += 3;
        }
    }
    if(planeXPosition > 0)
    {
        if(aKey)
        {
            planeXPosition -= 3;
        }
    }
        
    if(planeYPosition + planeHeight <= height)
    {
        if(sKey)
        {
            planeYPosition += 3;
        }
    }
    if(planeYPosition > 0)
    {
        if(wKey)
        {
            planeYPosition -= 3;
        }
    }
    
    if(wKey && !sKey)
    {
        ctx.drawImage(playerPlane3, planeXPosition, planeYPosition);
    }
    else if(sKey && !wKey)
    {
        ctx.drawImage(playerPlane2, planeXPosition, planeYPosition);
    }
    else
    {
        ctx.drawImage(playerPlane1, planeXPosition, planeYPosition);
    }
}

//To draw enemy planes on the screen 
function drawEnemyPlanes()
{
    for(var i = 0; i < enemyPlanes.length; i++)
    {
        ctx.drawImage(enemyPlane, enemyPlanes[i][0], enemyPlanes[i][1]);
    }
}

//To move enemies from right to left and return them back to right
//if they moved out of the canvas
function moveEnemyPlanes()
{
    for(var i = 0; i < enemyPlanes.length; i++)
    {
        if(enemyPlanes[i][0] > -(enemyPlanes[i][2])) /*width - enemyPlanes[i][2])*/
        {
            enemyPlanes[i][0] -= enemyPlanes[i][4];
        }
        else
        {
            enemyPlanes[i][0] = width + enemyPlaneWidth;
            enemyPlanes[i][1] = Math.floor(Math.random()*(height - enemyPlaneHeight));
            enemyPlanes[i][4] = Math.floor(Math.random()*  6 + 2);
            score -= 50;
            planesMissed += 1;
            flyby.play();
        }
    }
}

//Draws a bullet
function drawBullets()
{
    if(guns.length > 0)
    {
        for(var i = 0; i < guns.length; i++)
        {
            gunshot.play();
            ctx.drawImage(bullet, guns[i][0], guns[i][1]);
        }
    }
}

//Moves bullets on the screen
function moveBullets()
{
    for(var i = 0; i < guns.length; i++)
    {
        if(guns[i][0] < width)
        {
            guns[i][0] += 15;
        }
        else if(guns[i][0] > width)
        {
            guns.splice(i, 1);
        }
    }
}

//Clears canvas
function clear()
{
    ctx.clearRect(0, 0, width, height);
}

//Updates everything and essentially runs the game
function looping()
{
    clear();
    if(gameStarted == false)
    {
        levelMusic.pause();
        levelMusic.currentTime = 0;
        backgroundMusic.play();
    }
    else if(gameStarted)
    {
        gameOverMusic.pause();
        gameOverMusic.currentTime = 0;
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        levelMusic.play();
    }

    if(lives >= 0 && planesMissed <= 5 && gameStarted)
    {
        drawBackground();
        isEnemyHit();
        isPlayerHit();
        drawEnemyPlanes();
        moveEnemyPlanes();
        moveBullets();
        drawPlane();
        drawBullets();
    }
    displayScore();
}

//wasd buttons pressed down
function keyDown(event)
{
    if(event.keyCode == 68)
    {
        dKey = true;
    }
    else if(event.keyCode == 65)
    {
        aKey = true;
    }
    if(event.keyCode == 87)
    {
        wKey = true;
    }
    else if(event.keyCode == 83)
    {
        sKey = true;
    }
    if(event.keyCode == 38 && guns.length <= bullets)
    {
        guns.push([planeXPosition + planeWidth - 30, planeYPosition + planeHeight / 2 + 5, 2, 16]);
    }
}

//wasd buttons released
function keyUp(event)
{
    if(event.keyCode == 68)
    {
        dKey = false;
    }
    else if(event.keyCode == 65)
    {
        aKey = false;
    }
    if(event.keyCode == 87)
    {
        wKey = false;
    }
    else if(event.keyCode == 83)
    {
        sKey = false;
    }
}

//Display all the stats on the screen including the game over screen.
function displayScore()
{
    ctx.font = "bold 15px Play";
    ctx.fillText("SCORE: " + score, width - 130, 20);
    ctx.fillText("ENEMIES KILLED: " + planesShot, width - 300, 20);
    ctx.fillText("ENEMIES MISSED: " + planesMissed, width - 480, 20);
    ctx.fillText("LIVES: " + lives, width - 560, 20);
    if(gameStarted == false)
    {
        ctx.drawImage(background, 0, 0);
        ctx.font = "bold 50px Play";
        ctx.fillStyle = "red";
        ctx.fillText("AIR BATTLE", width / 2 - 100, height / 2 - 100);
        ctx.font = "bold 15px Play";
        ctx.fillStyle = "black";
        ctx.fillText("CONTROLS: WASD KEYS FOR MOVEMENT", width / 2 - 100, height / 2 - 20);
        ctx.fillText("UP ARROW FOR SHOOTING", width / 2 - 100, height / 2);
        ctx.fillText("GOAL: TRY TO GET THE HIGHEST HI SCORE", width / 2 - 100, height / 2 + 20);
        ctx.fillText("GAME OVER: WHEN YOU LOSE 3 LIVES", width / 2 - 100, height / 2 + 40);
        ctx.fillText("OR MISS 5 ENEMY PLANES", width / 2 - 100, height / 2 + 60);
        ctx.fillText("CLICK TO START THE GAME", width / 2 - 100, height / 2 + 100);
    }
    if(highscore > 0)
    {
        ctx.fillText("HISCORE: " + highscore, width - 720, 20);
    }
    if(lives < 0 || planesMissed >= 5)
    {
        ctx.drawImage(background, 0, 0);
        ctx.fillText("SCORE: " + score, width - 130, 20);
        ctx.fillText("ENEMIES KILLED: " + planesShot, width - 300, 20);
        ctx.fillText("ENEMIES MISSED: " + planesMissed, width - 480, 20);
        if(score > highscore)
        {
            highscore = score;
            ctx.fillText("NEW HI SCORE: " + highscore, width / 2 - 80, height / 2 - 20);
        }
        else
        {
            ctx.fillText("YOUR HI SCORE: " + highscore, width / 2 - 80, height / 2 - 20);
        }
        ctx.fillText("GAME OVER", width / 2 - 50, height / 2);
        ctx.fillText("CLICK TO RESTART", width / 2 - 75, height / 2 + 20);
        canvas.addEventListener('click', restart, false);
        clearInterval(playing);
        levelMusic.pause();
        levelMusic.currentTime = 0;
        finalExplosion.play();
        gameOverMusic.pause();
        gameOverMusic.currentTime = 0;
        gameOverMusic.play();
    }
}

//Restarts the game after a game over
function restart()
{
    playerHit = false;
    gameOver = false;
    lives = 3;
    score = 0;
    planesShot = 0;
    planesMissed = 0;
    resetTheGame();
    canvas.removeEventListener('click', restart, false);
    playing = setInterval(looping, 25);
}
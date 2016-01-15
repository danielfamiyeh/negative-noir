(function(){
    var canvas = document.getElementById('canvas'),
                ctx = canvas.getContext('2d'),
                enemyList = [],
                touched = false,
                gameState = 'start',
                deathPlayed = false,
                playColour = '#000000',
                muteColour = '#000000',
                firstTime = true,
                fontSize,
                filled = false,
                adService,
                leaderboard,
                banner,
                bgColourList = ['#87ceeb', '#8F9BFE', '#FF5F4D', '#EB899E', '#9eeb89'],
                loaded,
                practiceText,
                loggedIn,
                maxNum = 1,
                colIndex = 0,
                social,
                practiceLeft = 10,
                scoreText,
                socialService,
                spawnCount = 985,
                count = 0,
                text,
                permaHighScore,
                permaHardHighScore,
                speed,
                started = false,
                hallOfFame = false,
                loggedIn = false,
                score = 0,
                str = score.toString(),
                hardHighScore = /*localStorage.getItem('hardHighScore')|| */0,
                WIDTH = window.innerWidth,
                HEIGHT = window.innerHeight;

            canvas.width = WIDTH;
            canvas.height = HEIGHT;

            speed = ((WIDTH * HEIGHT) / 493996.444444);

            ctx.fillStyle = '#87ceeb';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            var select = new Audio("select.wav");
            var death = new Audio("Explosion2.wav");
            var shoot = new Audio("shoot.wav");
            var laser = new Audio("laser.wav");
            var loss = new Audio("loss.wav");

            var Bullet = function() {
                this.x = player.x;
                this.y = player.y;
                this.size = (WIDTH / 41);
                this.colour = player.colour;
                this.velX = 0;
                this.velY = 0;
                this.isActive = true;
                this.rect = {
                    x: (this.x - (WIDTH / 41)),
                    y: (this.y - (WIDTH / 41)),
                    width: (this.size * 2),
                    height: (this.size * 2)
                };

                this.render = function(context) {
                    context.fillStyle = this.colour;

                    context.beginPath();
                    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                    context.fill();
                };

                this.update = function() {
                    this.x += this.velX;
                    this.y += this.velY;
                    this.rect = {
                        x: (this.x - (WIDTH / 41)),
                        y: (this.y - (WIDTH / 41)),
                        width: (this.size * 2),
                        height: (this.size * 2)
                    };
                };
            };

            var Circle = function(x, y, size, vx, vy){
                this.x = x;
                this.y = y;
                this.size = size;
                this.rgbCol = 'rgba(0,0,0,0.15)';
                this.velX = vx;
                this.velY = vy;
                this.rect = {
                    x : (this.x - (this.size / 2)),
                    y : (this.y - (this.size / 2)),
                    width : this.size,
                    height : this.size
                };

                this.render = function(context) {
                    context.fillStyle = this.rgbCol;
                    context.beginPath();
                    context.arc(this.x, this.y, (this.size / 2), 0, 2 * Math.PI);
                    context.fill();
                }

                this.update = function(){
                    this.x += this.velX;
                    this.y += this.velY;

                    if(this.x <= 0 || this.x >= WIDTH){
                        this.velX *= -1;
                    }

                    if(this.y <= 0 || this.y >= HEIGHT){
                        this.velY *= -1;
                    }
                }
            }

            var circList = [];



            var player = {
                x: (WIDTH / 2),
                y: (HEIGHT / 2),
                size: ((WIDTH / 2) / 7.6875),
                bullets: [],
                state: 'black',
                colour: '#000000',
                rgbCol: 'rgba(0,0,0)',
                isActive: true,
                rect: {
                    x: ((WIDTH / 2) - ((WIDTH / 2) / 7.6875)),
                    y: ((HEIGHT / 2) - ((WIDTH / 2) / 7.6875)),
                    width: ((WIDTH / 2) / 3.84375),
                    height: ((WIDTH / 2) / 3.84375)
                },

                render: function(context) {
                    context.fillStyle = this.rgbCol;
                    context.beginPath();
                    context.arc(this.x, this.y, (this.size / 2), 0, 2 * Math.PI);
                    context.fill();

                    context.beginPath();
                    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                    context.fill();
                },

                update: function() {
                    if (this.state == 'black') {
                        this.colour = '#000000';
                        this.rgbCol = 'rgba(0,0,0,0.5)';
                    } else if (this.state == 'white') {
                        this.colour = '#ffffff';
                        this.rgbCol = 'rgba(255,255,255,0.5)';
                    }
                },

                switchColour: function(){
                    if(this.state == 'black'){
                        this.state = 'white';
                    }

                    else if(this.state == 'white'){
                        this.state = 'black';
                    }
                }
            };

            var spawnPoints = [{
                id: 'tl',
                x: 0,
                y: 0
            }, {
                id: 'tr',
                x: (WIDTH - (WIDTH / 15.375)),
                y: 0
            }, {
                id: 'bl',
                x: 0,
                y: (HEIGHT - (WIDTH / 15.125))
            }, {
                id: 'br',
                x: (WIDTH - (WIDTH / 15.125)),
                y: (HEIGHT - (WIDTH / 15.125))
            }];

            var Enemy = function(x, y, w, h) {
                this.x = x;
                this.y = y;
                this.originX = x;
                this.originY = y;
                this.width = w;
                this.height = h;
                this.isActive = false;
                this.state;
                this.colour;
                this.rgbCol;
                this.spawnPoint;

                this.render = function(context) {
                    if (this.state === 'white') {
                        this.colour = '#ffffff';
                        this.rgbCol = 'rgba(255,255,255,0.7)';
                    }

                    if (this.state === 'black') {
                        this.colour = '#000000';
                        this.rgbCol = 'rgba(0,0,0,0.7)';
                    }

                    context.fillStyle = this.rgbCol;
                    context.fillRect(this.x, this.y, this.width, this.height);
                };

                this.update = function() {
                    if (this.spawnPoint === 0) {
                        if (this.x < player.x - (WIDTH / 15.125)) {
                            this.x += speed;
                        }
                        if (this.y < player.y - (WIDTH / 15.125)) {
                            this.y += speed;
                        }
                    }

                    if (this.spawnPoint === 1) {
                        if (this.x > player.x) {
                            this.x -= speed;
                        }
                        if (this.y < player.y - (WIDTH / 15.125)) {
                            this.y += speed;
                        };
                    }

                    if (this.spawnPoint === 2) {
                        if (this.x < player.x - (WIDTH / 15.125)) {
                            this.x += speed;
                        }
                        if (this.y > player.y) {
                            this.y -= speed;
                        };
                    }

                    if (this.spawnPoint === 3) {
                        if (this.x > player.x) {
                            this.x -= speed;
                        }
                        if (this.y > player.y) {
                            this.y -= speed;
                        }
                    };
                }
            };
/*
            function showInterstitial(){
                interstitial.on("load", function(){
                    loaded = true;
                });

                interstitial.on("dismiss", function(){
                    loaded = false;
                });
                return loaded;
            }
*/


            function randNum(upperBound) {
                return Math.floor(Math.random() * upperBound);
            };

            function AABBCollision(shapeA, shapeB) {
                if (shapeA.x + shapeA.width > shapeB.x &&
                    shapeA.x < shapeB.x + shapeB.width &&
                    shapeA.y + shapeA.height > shapeB.y &&
                    shapeA.y < shapeB.y + shapeB.height) {
                    return true;
                }
            };

            function getFont(fontSize) {
                var ratio = fontSize / (984); // calc ratio
                var size = WIDTH * ratio; // get font size based on current width
                return (size | 0) + 'px lato'; // set font
            }

            canvas.addEventListener('touchstart', touchHandler, false);
            canvas.addEventListener('touchend', touchEndHandler, false);

            function touchHandler(event) {
                touchX = event.targetTouches[0].clientX;
                touchY = event.targetTouches[0].clientY;
                console.log(touchX);
                console.log(touchY);

                if (gameState === 'start') {
                    if(touchX > (WIDTH / 8.41025641) &&
                        touchY > (HEIGHT / 2.52456647) &&
                        touchX < (WIDTH / 3.11392405) &&
                        touchY < (HEIGHT / 1.65592417)){

                        gameState = 'help';
                    }

                    if(touchX > (WIDTH / 1.80882353) &&
                        touchY > (HEIGHT / 2.54664726) &&
                        touchX < (WIDTH / 1.11818182) &&
                        touchY < (HEIGHT / 1.59981685)){
                        socialService.showLeaderboard(function(error){
                            if (error)
                                console.error("showLeaderbord error: " + error.message);
                        });
                        console.log('leaderboard');
                    }

                    if(touchX > (WIDTH / 8) &&
                        touchY > (HEIGHT / 1.36912226) &&
                        touchX < (WIDTH / 1.03114187) &&
                        touchY < (HEIGHT / 1.28834808)){

                        socialService.showAchievements(function(error){
                            if (error)
                                console.error("showLeaderbord error: " + error.message);
                        });
                        console.log('achievements');
                    }
                }

                if(gameState == 'start' || gameState == 'dead'){

                    if(touchX > (WIDTH / 2.48484848) &&
                        touchX < (WIDTH / 1.62376238) &&
                        touchY >(HEIGHT / 1.153125) &&
                        touchY < (HEIGHT / 1.10810811)) {
                        if(muteColour == '#000000'){
                            muteColour = '#ffffff';
                        }
                        else if(muteColour == '#ffffff'){
                            muteColour = '#000000';
                            select.play();
                        };
                    }
                }

                else if (gameState === 'help') {
                    if (touchX > ((WIDTH / 2) / 1.394) &&
                        touchX < ((WIDTH / 2) / 0.748) &&
                        touchY > ((HEIGHT / 2) + ((HEIGHT / 2) / 2.09975962)) &&
                        touchY < (HEIGHT / 2) / 0.617) {
                        enemyList = [];
                        player.bullets = [];
                        gameState = 'play';
                    }
                }

                if (gameState == 'play' || gameState == 'help') {

                    if(touchX > player.rect.x &&
                        touchX < player.rect.x + player.rect.width &&
                        touchY > player.rect.y &&
                        touchY < player.rect.y + player.rect.height){
                        if(muteColour == '#000000'){
                            select.currentTime = 0;
                            select.play();
                        }
                        player.switchColour();
                    }

                    else{
                        b = new Bullet()
                        directionX = (touchX - player.x);
                        directionY = (touchY - player.y);

                        magnitude = Math.sqrt(directionY * directionY + directionX * directionX);


                        b.velX = (directionX / magnitude) * ((WIDTH * HEIGHT) / 49115.6571);
                        b.velY = (directionY / magnitude) * ((WIDTH * HEIGHT) / 49115.6571);

                        if(muteColour == '#000000'){
                            laser.currentTime = 0;
                            laser.play();
                        };

                        player.bullets.push(b);
                    }
                }

                else if (gameState === 'dead') {
                    if(touchX > (WIDTH / 8.41025641) &&
                        touchY > (HEIGHT / 2.52456647) &&
                        touchX < (WIDTH / 3.11392405) &&
                        touchY < (HEIGHT / 1.65592417)){

                        score = 0
                        gameState = 'play';
                    }

                    if(touchX > (WIDTH / 8) &&
                        touchY > (HEIGHT / 1.36912226) &&
                        touchX < (WIDTH / 1.03114187) &&
                        touchY < (HEIGHT / 1.28834808)){

                        socialService.showAchievements(function(error){
                            if (error)
                                console.error("showLeaderbord error: " + error.message);
                        });
                        console.log('achievements');
                    }

                    if(touchX > (WIDTH / 1.80882353) &&
                        touchY > (HEIGHT / 2.54664726) &&
                        touchX < (WIDTH / 1.11818182) &&
                        touchY < (HEIGHT / 1.59981685)){
                        socialService.showLeaderboard(function(error){
                            if (error)
                                console.error("showLeaderbord error: " + error.message);
                        });
                        console.log('leaderboard');
                    }
                };
            };

            function touchEndHandler(){
               // touchX = null;
               // touchY = null;
            }

            function createMob(){
                newEnemy = new Enemy(spawnPoints[spawnPointNum].x, spawnPoints[spawnPointNum].y, (WIDTH / 15.375), (WIDTH / 15.375));
                newEnemy.state = colourList[colour];
                newEnemy.isActive = true;
                newEnemy.spawnPoint = spawnPointNum;

                for(var i = 0; i < enemyList.length; i++){
                    if(AABBCollision(newEnemy, enemyList[i])){
                        newEnemy.isActive = false;
                    }
                }

                enemyList.push(newEnemy);
            };

            function render() {
                ctx.clearRect(0,0,WIDTH,HEIGHT);
                ctx.fillStyle = bgColourList[colIndex];

                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                for(var i = 0; i < circList.length; i++){
                    circList[i].render(ctx);
                }

                if (gameState === 'help') {
                    ctx.fillStyle = '#000000';
                    ctx.font = getFont(56);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('tap the screen to shoot.', (WIDTH / 2), (HEIGHT / 13.765));
                    ctx.fillText('tap yourself to change colour.', (WIDTH / 2), (HEIGHT / 9.495));
                    ctx.fillText('black bullets hit small black boxes.', (WIDTH / 2), (HEIGHT / 7.279));
                    ctx.fillText('white bullets hit small white boxes.', (WIDTH / 2), (HEIGHT / 5.902));
                    ctx.fillText('switch colours to hit them all.', (WIDTH / 2), (HEIGHT / 4.963));
                    ctx.fillText('there is a penalty for colour mismatch.', (WIDTH / 2), (HEIGHT / (4.263)));
                    ctx.fillText('tap play to begin.', (WIDTH / 2), (HEIGHT / (2.963)));
                    ctx.font = getFont(128);
                    ctx.fillText('play', (WIDTH / 2), ((HEIGHT / 2) + ((HEIGHT / 2) / 2.09975962)));

                    if(player.isActive){
                        player.render(ctx)
                    }

                    for (var i = 0; i < enemyList.length; i++) {
                        if (enemyList[i].isActive) {
                            enemyList[i].render(ctx);
                        }
                    }

                    for (var i = 0; i < player.bullets.length; i++) {
                        if (player.bullets[i].isActive) {
                            player.bullets[i].render(ctx);
                        }
                    }
                };

                if (gameState === 'start') {

                    ctx.font = getFont(124);
                    ctx.fillStyle = '#000000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    //ctx.fillText('normal', (WIDTH / 2), ((HEIGHT / 2) - (HEIGHT / 14.0887097)));
                    //ctx.fillText('hard', (WIDTH / 2), ((HEIGHT / 2) + (HEIGHT / 14.0887097)));

                    ctx.strokeStyle = 'black';
                    ctx.beginPath();
                    ctx.moveTo(WIDTH/8, HEIGHT/2.5);
                    ctx.lineTo(WIDTH-WIDTH/1.5, HEIGHT/2);
                    ctx.lineTo(WIDTH/8, HEIGHT/1.625);
                    ctx.lineTo(WIDTH/8, HEIGHT/2.5);
                    ctx.fillStyle = 'rgba(0,0,0,0.8)';
                    ctx.fill();

                    ctx.fillRect((WIDTH - (WIDTH / 3)), HEIGHT / 1.625, (WIDTH / 9.84), -(HEIGHT / 4.6462766));
                    ctx.fillRect((WIDTH - (WIDTH / 3)) - (WIDTH / 8.94545455), HEIGHT / 1.625, (WIDTH / 9.84), -(HEIGHT / 6.28417266));
                    ctx.fillRect((WIDTH - (WIDTH / 3)) + (WIDTH / 8.94545455), HEIGHT / 1.625, (WIDTH / 9.84), -(HEIGHT / 9.29255319));

                    ctx.fillStyle = '#000000'
                    ctx.font = getFont(168);
                    ctx.fillText('negative', ((WIDTH / 2) - ((WIDTH / 2) / 3.375)), (HEIGHT / 4.9));

                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText('noir', ((WIDTH / 2) + ((WIDTH / 2) / 1.74285714)), (HEIGHT / 4.9));

                    
                    ctx.fillStyle = muteColour;
                    ctx.font = getFont(96);
                    ctx.fillText('mute', (WIDTH / 2), (HEIGHT / -11.80800) + (HEIGHT / 1.06329884));

                    ctx.fillStyle = '#000000';
                    ctx.font = getFont(128);
                    ctx.fillText('achievements', (WIDTH / 2), (HEIGHT / 1.34384615));

                }
              

                if (gameState === 'play') {

                    ctx.fillRect(0, 0, WIDTH, HEIGHT);

                    if(player.isActive){
                        player.render(ctx);
                    }

                    for (var i = 0; i < enemyList.length; i++) {
                        if (enemyList[i].isActive) {
                            enemyList[i].render(ctx);
                        }
                    }

                    for (var i = 0; i < player.bullets.length; i++) {
                        if (player.bullets[i].isActive) {
                            player.bullets[i].render(ctx);
                        }
                    }

                    ctx.font = getFont(96);


                    ctx.fillStyle = (score % 2 === 0) ? '#000000' : '#FFFFFF';

                    str = score.toString();

                    scoreText = 'score: ';
                    scoreText += score;
                    ctx.fillText(score, (WIDTH) - (WIDTH / 2), (HEIGHT / 21.8375));
                }

                if (gameState === 'dead') {
                    ctx.font = getFont(64);
                    ctx.fillStyle = 'black';
                    text = 'you got: ';
                    text += score;
                    text += '.';
                    ctx.fillText(text, (WIDTH / 2), (HEIGHT / 6.69348659));


                    if (score > permaHardHighScore) {
                        ctx.fillText('Congratulations!', (WIDTH / 2), (HEIGHT / 4.58530184));
                        ctx.font = getFont(64);
                        ctx.fillText('You beat your hard high score.', (WIDTH / 2), (HEIGHT / 3.86504425));
                    };

                    ctx.font = getFont(64);
                    text = 'your high score is: ';
                    text += hardHighScore;
                    text += '.';

                    ctx.fillText(text, (WIDTH / 2), (HEIGHT / 10.91874));

                    ctx.strokeStyle = 'black';
                    ctx.beginPath();
                    ctx.moveTo(WIDTH/8, HEIGHT/2.5);
                    ctx.lineTo(WIDTH-WIDTH/1.5, HEIGHT/2);
                    ctx.lineTo(WIDTH/8, HEIGHT/1.625);
                    ctx.lineTo(WIDTH/8, HEIGHT/2.5);
                    ctx.fillStyle = 'rgba(0,0,0,0.8)';
                    ctx.fill();

                    ctx.fillRect((WIDTH - (WIDTH / 3)), HEIGHT / 1.625, (WIDTH / 9.84), -(HEIGHT / 4.6462766));
                    ctx.fillRect((WIDTH - (WIDTH / 3)) - (WIDTH / 8.94545455), HEIGHT / 1.625, (WIDTH / 9.84), -(HEIGHT / 6.28417266));
                    ctx.fillRect((WIDTH - (WIDTH / 3)) + (WIDTH / 8.94545455), HEIGHT / 1.625, (WIDTH / 9.84), -(HEIGHT / 9.29255319));

                    ctx.font = getFont(96);
                    ctx.fillStyle = muteColour;
                    ctx.fillText('mute', (WIDTH / 2), (HEIGHT / -11.80800) + (HEIGHT / 1.06329884))

                    ctx.fillStyle = '#000000';
                    ctx.font = getFont(128);
                    ctx.fillText('achievements', (WIDTH / 2), (HEIGHT / 1.34384615));
                };
            };

            function update() {
                if(circList.length < 11){
                    var size = randNum(HEIGHT / 16)
                    var circX = randNum(WIDTH);
                    var circY = randNum(HEIGHT);

                    circList.push(new Circle(circX, circY, size, Math.random(), Math.random()));
                }

                for(var i = 0; i < circList.length; i++){
                    circList[i].update();
                }

                if (gameState === 'help') {
                    score = 0;
                    count = 0;
                    player.isActive = true;

                    player.update();

                    for (var i = 0; i < player.bullets.length; i++) {
                        if (player.bullets[i].isActive) {
                            player.bullets[i].update();
                        } else {
                            player.bullets.splice(i, 1);
                        };

                        if (player.bullets[i].x < 0 || player.bullets[i].x > WIDTH ||
                            player.bullets[i].y < 0 || player.bullets[i].y > HEIGHT) {
                            player.bullets.splice(i, 1);
                        };
                    };

                    if (enemyList.length < 1) {
                        colour = randNum(2);
                        colourList = ['white', 'black'];

                        var x = (WIDTH / 4)
                        newEnemy = new Enemy(x, (HEIGHT / 2), (WIDTH / 15.375), (WIDTH / 15.375));
                        newEnemy.state = colourList[colour];
                        newEnemy.isActive = true;

                        enemyList.push(newEnemy);
                    };

                    for (var i = 0; i < enemyList.length; i++) {
                        if (enemyList[i].isActive) {
                            enemyList[i].update();
                        } else {
                            enemyList.splice(i, 1);
                        }
                    }

                    for (var i = 0; i < player.bullets.length; i++) {
                        for (var j = 0; j < enemyList.length; j++) {
                            if (enemyList[j].isActive) {
                                if (AABBCollision(player.bullets[i].rect, enemyList[j])) {
                                    if (player.bullets[i].isActive && enemyList[j].isActive) {
                                        if(player.bullets[i].colour != enemyList[j].colour){
                                            if(muteColour == '#000000'){
                                                loss.currentTime = 0;
                                                loss.play();
                                            }
                                            player.bullets[i].isActive = false;
                                        }

                                        else if(player.bullets[i].colour == enemyList[j].colour){
                                            if(muteColour == '#000000'){
                                                shoot.currentTime = 0;
                                                shoot.play();
                                            }
                                            player.bullets[i].isActive = false;
                                            enemyList[j].isActive = false;
                                        };
                                    };
                                };
                            }
                        };
                    };
                };

                if (gameState === 'play') {
                    player.isActive = true;
                    if (count == 5) {
                        spawnCount -= 2.5;
                        count = 0;
                    };

                    shouldSpawn = randNum(1000);

                    if(shouldSpawn >= spawnCount){
                        switch(spawnCount){
                            case 985:
                                maxNum = 11;
                                break;
                            
                            case 980:
                                maxNum = 13;
                                break;
                            
                            case 975:
                                maxNum = 15;
                                break;
                            
                            case 970:
                                maxNum = 17;
                                break;
                            
                            case 965:
                                maxNum = 20;
                                break;

                            case 960:
                                maxNum = 23;
                                break;
                            
                            case 955:
                                maxNum = 26;
                                break;
                            
                            case 950:
                                maxNum = 29;
                                break;
                            
                            case 955:
                                maxNum = 31;
                                break;
                        };
                            
                        if(spawnCount <= 800){
                            maxNum = maxNum * 2;
                        };

                        colour = randNum(2);
                        spawnPointNum = randNum(4);
                        colourList = ['white', 'black'];
                        filled = false
                        
                        if(enemyList.length < maxNum){
                            createMob();
                        }
                    }
                }

                    if(player.isActive){
                        player.update();
                    }

                    for (var i = 0; i < player.bullets.length; i++) {
                        if (player.bullets[i].isActive) {
                            player.bullets[i].update();
                        } else {
                            player.bullets.splice(i, 1);
                        };

                        if (player.bullets[i].x < 0 || player.bullets[i].x > WIDTH ||
                            player.bullets[i].y < 0 || player.bullets[i].y > HEIGHT) {
                            player.bullets.splice(i, 1);
                        };
                    };

                    for (var i = 0; i < enemyList.length; i++) {
                        if (enemyList[i].isActive) {
                            enemyList[i].update();
                        } else {
                            enemyList.splice(i, 1);
                        }
                    }

                    for (var i = 0; i < player.bullets.length; i++) {
                        for (var j = 0; j < enemyList.length; j++) {
                            if (enemyList[j].isActive) {
                                if (AABBCollision(player.bullets[i].rect, enemyList[j])) {
                                    if (player.bullets[i].isActive && enemyList[j].isActive) {
                                        if(player.bullets[i].colour != enemyList[j].colour){
                                            if(muteColour == '#000000'){
                                                loss.currentTime = 0;
                                                loss.play();
                                            }
                                            (score > 0) ? score -= 1 : score -= 0;
                                            player.bullets[i].isActive = false;
                                        }

                                        else if(player.bullets[i].colour == enemyList[j].colour){
                                                count += 1;
                                                score += 1;

                                                if(score % 20 == 0){
                                                    if(colIndex < (bgColourList.length - 1)){
                                                        colIndex++;
                                                    }
                                                    else{
                                                        colIndex = 0;
                                                    }
                                                }
                                                
                                            if(muteColour == '#000000'){
                                                shoot.currentTime = 0;
                                                shoot.play();
                                            }
                                            player.bullets[i].isActive = false;
                                            enemyList[j].isActive = false;
                                        };
                                    }      
                                };
                            }
                        };
                    };

                    if(score == 50){
                        socialService.submitAchievement('CgkImrjO8Y8JEAIQAg', function(error){
                            if (error)
                                console.error("showLeaderbord error: " + error.message);
                        });
                    }

                    if(score == 100){
                        socialService.submitAchievement('CgkImrjO8Y8JEAIQAw', function(error){
                            if (error)
                                console.error("showLeaderbord error: " + error.message);
                        });
                    }

                    if(score == 150){
                        socialService.submitAchievement('CgkImrjO8Y8JEAIQBA', function(error){
                            if (error)
                                console.error("showLeaderbord error: " + error.message);
                        });
                    }

                    if(score == 200){
                        socialService.submitAchievement('CgkImrjO8Y8JEAIQBQ', function(error){
                            if (error)
                                console.error("showLeaderbord error: " + error.message);
                        });
                    }

                    for (var i = 0; i < enemyList.length; i++) {
                        if (AABBCollision(player.rect, enemyList[i])) {
                            gameState = 'dead';
                            spawnCount = 985;
                            count = 0;

                            /*

                            interstitial.load();
                            var shouldShow = showInterstitial();
                            if(shouldShow){
                                interstitial.show();
                            }
                            */
                        };
                    };

                    if (gameState === 'dead') {
                        if (!deathPlayed && muteColour == '#000000') {
                            death.currentTime = 0;
                            death.play();
                            deathPlayed = true;
                        };

                        if(score > hardHighScore){
                            permaHardHighScore = hardHighScore;
                            hardHighScore = parseInt(score);
                            localStorage.setItem('hardHighScore', hardHighScore);
                            socialService.submitScore(hardHighScore, function(error){
                                if (error)
                                    console.error("submitScore error: " + error.message);
                            }, {leaderboardID : 'CgkImrjO8Y8JEAIQAA'});
                        }

                        player.isActive = false;
                        enemyList = [];
                        player.bullets = [];
                    };
                };

            var fps = 30;
            var now;
            var then = Date.now();
            var interval = 1000 / fps;
            var delta;

            function main() {
                window.requestAnimationFrame(main);

                now = Date.now();
                delta = now - then;

                if (delta > interval) {

                    render();

                    then = now - (delta % interval);
                };
                update();
            };

            function init(){
                adService = Cocoon.Ad.AdMob;
                adService.configure({
                    ios: {
                        banner:"ca-app-pub-4277398501935238/3803302703",
                        interstitial:"ca-app-pub-4277398501935238/6048431904"
                    },
                    android: {
                        banner:"ca-app-pub-4277398501935238/2385445105",
                        interstitial:"ca-app-pub-4277398501935238/4960148302"
                    }
                });

                banner = adService.createBanner();
                banner.setLayout('BOTTOM_CENTER');
                banner.load();
                banner.show();

                interstitial = adService.createInterstitial();

                if(/Android/i.test(navigator.userAgent)) {
                    Cocoon.Social.GooglePlayGames.init({});
                    socialService = Cocoon.Social.GooglePlayGames.getSocialInterface();
                }

                if(/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                    Cocoon.Social.GameCenter.init({});
                    socialService = Cocoon.Social.GameCenter.getSocialInterface();
                }

                socialService.login();

                socialService.submitScore(hardHighScore, function(error){
                    if (error)
                        console.error("submitScore error: " + error.message);
                }, {leaderboardID : 'CgkImrjO8Y8JEAIQAA'});

                main();
            };

            if (window.cordova) {
        document.addEventListener("deviceready", init);
            }
            else {
                window.onload = init;
            }
})();
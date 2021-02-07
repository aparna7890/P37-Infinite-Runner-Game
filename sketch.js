var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOver, gameOverImg, restart, restartImg;
var PLAY = 1;
var END = 0;
var gameState = 1;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 40)
  
  ground = createSprite(200,180,400,20);
  ground.addImage(groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gameOver = createSprite(300, 100, 20, 20)
  gameOver.addImage(gameOverImg)
  gameOver.scale = 0.5
  gameOver.visible = false
  
  restart = createSprite(300, 140, 20, 20)
  restart.addImage(restartImg);
  restart.scale = 0.5
  restart.visible = false
}

function draw() {
  background(180);
  trex.x = camera.position.x - 250
  
  text("Score: "+ score, camera.position.x + 200, camera.position.y-50);
  
  if(gameState === 1){
  score = score + Math.round(getFrameRate()/60);
  
  if(keyDown("space") && trex.y >=161) {
    trex.velocityY = -12;
  }
  trex.velocityY = trex.velocityY + 0.8
    
  ground.velocityX = -(4 + 3 * score / 100)
  
  if (ground.x < camera.position.x - 300){
    ground.x = camera.position.x;
  }

  spawnClouds();
  spawnObstacles();
    
  if(obstaclesGroup.isTouching(trex)){
    gameState = 0;
  }
}
  
  else if(gameState === 0){
    gameOver.visible = true;
    restart.visible = true;
    trex.velocityY = 0;
    trex.changeAnimation("collided",trex_collided)
    
    ground.velocityX = 0;
    obstaclesGroup.setVelocityEach (0,0)
    cloudsGroup.setVelocityEach(0,0)
    
    cloudsGroup.setLifetimeEach(-12)
    obstaclesGroup.setLifetimeEach(-12)
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
  trex.collide(invisibleGround);
  drawSprites();
}

function reset(){
  gameState = 1;
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running", trex_running)
  cloudsGroup.destroyEach()
  obstaclesGroup.destroyEach()
  score = 0
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x + 300, 120, 40, 10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.position.x + 300,165,10,40);
    obstacle.velocityX = -(4 + 3 * score / 100)
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
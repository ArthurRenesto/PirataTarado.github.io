const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg, waterSound, backgroundMusic, cannonExplosion;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];

var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;
var isGameOver = false;

//sons
var cannonExplosion;
var somFundo;

var score = 0

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png");

  //cannon_explosion.mp3
  cannonExplosion =loadSound ("./assets/cannon_explosion.mp3")
  
  somFundo = loadSound("./assets/somDK.mp3")

  
}image.png

function setup() {
  canvas = createCanvas(1200,600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 100, 50, angle);

  var boatFrames = boatSpritedata.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  //tocar sempre o som sem ficar estranho
  if(!somFundo.isPlaying())
  {
    somFundo.play();
    somFundo.setVolume(0.1);
  }

  Engine.update(engine);
  ground.display();

  showBoats();

 
  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    for (var j = 0; j < boats.length; j++) {
      if (balls[i] !== undefined && boats[j] !== undefined) {
        var collision = Matter.SAT.collides(balls[i].body, boats[j].body);
        if (collision.collided) {

          if(!boats[j].isBroken)
          {
            score += 10
         
            boats[j].remove(j);
          j--;
          }

          Matter.World.remove(world, balls[i].body);
          balls.splice(i, 1);
          i--;
          
        }
      } 
    }
  }
  cannon.display();
  tower.display();

  //pontuação
  
text ("Score "+score,   )

}


//criar a bala de canhão ao pressionar a tecla
function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

// função para mostrar a bala
function showCannonBalls(ball, index) {
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);
  }
}


//função para exibir o navio
function showBoats() 
{
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(
        width,
        height - 100,
        170,
        170,
        position,
        boatAnimation
      );


      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate();

      var collision =Matter.SAT.collides(tower.body, boats[i].body);
      if(collision.collided && !boats[i].isBroken)
      {
        isGameOver = true;
        gameOver12();
      }
     
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);
  }
}


//liberar a bala de canhão quando soltar a tecla
function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    //
    cannonExplosion.play()
    balls[balls.length - 1].shoot();
  }
}


function gameOver12()
{
  swal(
    {
      title: `você foi tapeado`,
      confirmButtonText: "clique aqui pra jogar novamente"
    },
    function(isConfirm)
    {
      if(isConfirm)
      {
        //location.reload();
        window.location = "https://i.pinimg.com/originals/88/0b/4c/880b4ce136ff7d21baaeb3b87fbe4b37.jpg"
      }
    }
  );
}
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let speed = 4;
let score = 0;
let gameOver = false;

const car = { x: canvas.width/2-25, y: canvas.height-120, w:50, h:90 };
let enemies = [];

function spawnEnemy() {
  enemies.push({ x: Math.random()*(canvas.width-50), y:-100, w:50, h:90 });
}
setInterval(spawnEnemy, 1200);

canvas.addEventListener("click", e => {
  if (gameOver) location.reload();
  if (e.clientX < canvas.width/2) car.x -= 60;
  else car.x += 60;
  car.x = Math.max(0, Math.min(canvas.width-car.w, car.x));
});

function hit(a,b){
  return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;
}

function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="red";
  ctx.fillRect(car.x,car.y,car.w,car.h);

  enemies.forEach(e=>{
    e.y+=speed;
    ctx.fillStyle="blue";
    ctx.fillRect(e.x,e.y,e.w,e.h);
    if(hit(car,e)) gameOver=true;
  });

  enemies=enemies.filter(e=>e.y<canvas.height+100);

  if(!gameOver){
    score++;
    speed+=0.0005;
    requestAnimationFrame(loop);
  } else {
    if(window.Telegram?.WebApp){
      Telegram.WebApp.sendData(JSON.stringify({score}));
    }
    ctx.fillStyle="white";
    ctx.font="36px Arial";
    ctx.fillText("GAME OVER",canvas.width/2-100,canvas.height/2);
    ctx.fillText("Очки: "+score,canvas.width/2-90,canvas.height/2+50);
  }
}
loop();

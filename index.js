const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.8
//constructor
class Sprite {
    constructor({position, velocity, color = 'red'}){
 this.position = position
 this.velocity = velocity
 this.height = 150
 this.lastKey
 this.attackBox = {
     position:this.position ,
     width: 100,
     height: 50
 }

 this.color = color

    }


    //ocrtava placeholdere na canvasu, player/enemy, attack boxeve
draw(){
 //player
    c.fillStyle = this.color

    c.fillRect(this.position.x, this.position.y, 50, this.height)
  
 //attackBox
 c.fillStyle = 'green'
    c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
}

update(){
    this.draw()
 
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
// loop koji omogucava modelu da ne propadne kroz patos

    if (this.position.y + this.height + this.velocity.y >= canvas.height){
        this.velocity.y = 0;
        } else this.velocity.y += gravity; // GRAVITACIJA
    }
}


const player = new Sprite ({
    position: {
x:0,
y:0
},
velocity: {
x:0,
y:10
},

color: 'blue'
})

const enemy = new Sprite ({
    position: {
x:400,
y:100
},
    velocity: {
x:0,
y:0
},

})

console.log(player);

const keys = {
a:{
    pressed: false
},
d:{
    pressed:false
},
w:{
    pressed:false
},
ArrowLeft:{
    pressed:false
},
ArrowRight:{
    pressed:false
},
ArrowUp:{
    pressed:false
}
}

function animate (){

    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    console.log('go')
    player.update()
    enemy.update()


    //vuce iz const keys objekte, bitno za smoother left-right akciju
    //da bi se izbegao problem kao sto je u mugen-u
    player.velocity.x = 0;//bez ovoga player bi isao zauvek u jednom smeru, ovo je default value za velocity
    enemy.velocity.x = 0; //za enemy-ja moramo imati isto kao za player-a
    if (keys.a.pressed && player.lastKey === 'a'){     //<======= PLAYER movement
        player.velocity.x = -8
    }
    else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 8}
//....................
        if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){     //<======= ENEMY movement
            enemy.velocity.x = -8
        }
        else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
            enemy.velocity.x = 8 //ne zaboraviti enemy.lastKey!!!!!
        }
        //collision detect

        if(player.attackBox.position.x + player.attackBox.width >= enemy.position.x) {
            console.log("JEEEESI JESI, VAZI STO SI ZNAO DA SAM TU!!!!!!");
        }
}

animate()
//===============KOMANDE====================================


//vrsta loopa, even listener koji detektuje key press-ove, 
//i definise sta se desava sa razlocitim key presovima,
// "d" nalaze player-u da ide desno, "a" levo, "f" je attack itd
window.addEventListener('keydown', (event)=>{
    switch (event.key){
case 'd':
    keys.d.pressed = true;
    player.lastKey = 'd';
break

case 'a':
    keys.a.pressed = true;
    player.lastKey = 'a';
break   

case 'w':
    player.velocity.y = -16 //skakanje
    player.lastKey = 'w';
break   


//enemy

case 'ArrowLeft':
    keys.ArrowLeft.pressed = true;
    enemy.lastKey = 'ArrowLeft';
break

case 'ArrowRight':
    keys.ArrowRight.pressed = true;
    enemy.lastKey = 'ArrowRight';
break   

case 'ArrowUp':
    enemy.velocity.y = -16 //skakanje
    enemy.lastKey = 'ArrowUp';
break   


}
    console.log(event);
})

//deo koji PREKIDA pomeranje playera, bez ovoga pritiskom na 
// "d" bi isao zauvek desno
window.addEventListener('keyup', (event)=>{
    switch (event.key){
    case 'd':
        keys.d.pressed = false;; //pustanjem "d" prestaje da se krece
    break

    case 'a':
        keys.a.pressed = false;
    break

    case 'w':
        keys.a.pressed = false;
    break //do I need this??????


    case 'ArrowRight':
        keys.ArrowRight.pressed = false;; //pustanjem "d" prestaje da se krece
    break

    case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
    break
    }
        console.log(event);
    })












    
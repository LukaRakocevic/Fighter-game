const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.8
//constructor

const background = new Sprite ({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './oak_woods_v1.0/background.png'
})

const shop = new Sprite ({
    position:{
        x: 600,
        y: 155
    },
    imageSrc: './oak_woods_v1.0/shop.png',
    scale: 2.55,
    framesMax: 6
})
const player = new Fighter ({
    position: {
        x:0,
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    offset: {
        x:0,
        y:0
    },
    imageSrc: './oak_woods_v1.0/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset:{x:215, y:157
    },
    sprites:{
        idle:{
            imageSrc: './oak_woods_v1.0/samuraiMack/idle.png',
            framesMax: 8
        },
        Run:{
            imageSrc: './oak_woods_v1.0/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump:{
            imageSrc: './oak_woods_v1.0/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall:{
            imageSrc: './oak_woods_v1.0/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1:{
            imageSrc: './oak_woods_v1.0/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit:{
            imageSrc: './oak_woods_v1.0/samuraiMack/Take Hit.png',
            framesMax: 4,
        },
        death:{
            imageSrc: './oak_woods_v1.0/samuraiMack/Death.png',
            framesMax: 6,
        },
    },
    attackBox: {
        offset:{
            x:100,
            y:50
        },
        width: 150,
        height: 50
    }
}
    
)

const enemy = new Fighter ({
    position: {
        x:400,
        y:100
    },
    velocity: {
        x:0,
        y:0
    },
    color: 'blue',
    offset: {
        x:-50,
        y:0
    },
    imageSrc: './oak_woods_v1.0/kenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset:{
        x:215, 
        y:169
    },
    sprites:{
        idle:{
            imageSrc: './oak_woods_v1.0/kenji/idle.png',
            framesMax: 4
        },
        Run:{
            imageSrc: './oak_woods_v1.0/kenji/Run.png',
            framesMax: 8,
        },
        jump:{
            imageSrc: './oak_woods_v1.0/kenji/Jump.png',
            framesMax: 2,
        },
        fall:{
            imageSrc: './oak_woods_v1.0/kenji/Fall.png',
            framesMax: 2,
        },
        attack1:{
            imageSrc: './oak_woods_v1.0/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './oak_woods_v1.0/kenji/Take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './oak_woods_v1.0/kenji/Death.png',
            framesMax: 7,
        },
    },
    attackBox: {
        offset:{
            x:-170,
            y:50
        },
        width: 170,
        height: 50
    }

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


decreaseTimer();


function animate (){

    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0,0,canvas.width, canvas.height)
    player.update()
    enemy.update()
    //vuce iz const keys objekte, bitno za smoother left-right akciju
    //da bi se izbegao problem kao sto je u mugen-u
    player.velocity.x = 0;//bez ovoga player bi isao zauvek u jednom smeru, ovo je default value za velocity
    enemy.velocity.x = 0;

    

    //<======= PLAYER movement
    if (keys.a.pressed && player.lastKey === 'a'){    
        player.velocity.x = -8
        player.switchSprite('run')
    }
    else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 8
        player.switchSprite('run')
    }
    else {
        player.switchSprite('idle')
    }
    //jumping
    if(player.velocity.y <0){
        player.switchSprite('jump')
    }
    //player.velocity.y >0 means falling!
    else if (player.velocity.y >0){
        player.switchSprite('fall')
    }
//....................


//<======= ENEMY movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){    
           enemy.velocity.x = -8
           enemy.switchSprite('run')
       }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
           enemy.velocity.x = 8
           enemy.switchSprite('run')
    } else {
           enemy.switchSprite('idle')
    }
    //jumping
    if(enemy.velocity.y <0){
        enemy.switchSprite('jump')
    }
    //player.velocity.y >0 means falling!
    else if (enemy.velocity.y >0){
        enemy.switchSprite('fall')
    } 

        
        //collision detect & enemy gets hit
        if(rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && 
            player.isAttacking && 
            player.framesCurrent === 4
            ){
             enemy.takeHit()
             player.isAttacking = false
             
             gsap.to('#enemyHealth', {
            width: enemy.health + '%'
             })
        }

        //if player misses
        if (player.isAttacking && player.framesCurrent ===4) {
            player.isAttacking = false
        }

        //player gets hit
        if(rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) && 
            enemy.isAttacking && 
            enemy.framesCurrent === 2
            ) {
            player.takeHit()
            enemy.isAttacking = false

            gsap.to('#playerHealth', {
                width: player.health + '%'
            })
        }

         //if player? misses
         if (enemy.isAttacking && enemy.framesCurrent ===2) {
          enemy.isAttacking = false
            }

        //end game based on health
        if (enemy.health <= 0 || player.health <=0){
            determineWinner({player, enemy, timerId})
        }
}

animate()
//===============KOMANDE====================================


//vrsta loopa, even listener koji detektuje key press-ove, 
//i definise sta se desava sa razlocitim key presovima,
// "d" nalaze player-u da ide desno, "a" levo, "f" je attack itd
window.addEventListener('keydown', (event)=>{

      if (!player.dead) {        
        
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
           
               break   
            case ' ':
            player.attack();
            break;
      }
    }
        if (!enemy.dead){
       switch(event.key){
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
        break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
        break; 
        case 'ArrowUp':
            enemy.velocity.y = -16 //skakanje
            
        break;  
        case 'Control':
            enemy.attack();
        break;
            }
        }
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

   
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;; //pustanjem "d" prestaje da se krece
        break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
        break
    }
    
})












    
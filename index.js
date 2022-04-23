const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.8
//constructor

const player = new Fighter ({
    position: {
        x:0,
        y:0
    },
    velocity: {
        x:0,
        y:10
    },
    offset: {
        x:0,
        y:0
    },


})

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
function rectangularCollision ({ rectangle1, rectangle2}){
    return(
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
};

function determineWinner ({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector("#displayText").style.display = 'flex';
    if (player.health === enemy.health) {
        document.querySelector("#displayText").innerHTML = 'Tie';
       } else if (player.health > enemy.health){
           document.querySelector("#displayText").innerHTML = 'Player 1 wins!';
            }
               else if (player.health < enemy.health){
                   document.querySelector("#displayText").innerHTML = 'Player 2 wins!';
                    }
}

let timer = 60
let timerId
function decreaseTimer(){
    if (timer >0) {
      timerId = setTimeout(decreaseTimer, 1000)
        timer --
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer ===0){

            determineWinner({player, enemy});
         }
    }

    decreaseTimer();


function animate (){

    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    //console.log("go");
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
        if(rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && 
            player.isAttacking
            ){
            player.isAttacking = false
            enemy.health -= 10
            document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        }

        if(rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) && 
            enemy.isAttacking) {
            enemy.isAttacking = false
            player.health -= 10
            document.querySelector('#playerHealth').style.width = player.health + '%'
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
        case ' ':
            player.attack();
            break;


        //enemy

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
            enemy.lastKey = 'ArrowUp';
        break;  

        case 'Control':
            enemy.attack();
        break;

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












    
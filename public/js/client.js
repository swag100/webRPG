class Entity{
    constructor(x,y){
        this.position = {x: x, y: y};
        this.velocity = {x: 0, y: 0};

        //TODO: make this an array so we can have irregular shapes
        this.rect = {x: 0, y: 0, w: 0, h: 0};

        //visual stuff
        this.image = new Image();

        //animations, animFrame
        this.animFrame = 0;
        this.animName = "";
        this.animations = {};

        //debug
        this.drawHitbox = false;
    }
    getHitbox(){
        return {
            x: Math.floor(this.position.x) + this.rect.x, 
            y: Math.floor(this.position.y) + this.rect.y, 
            w: this.rect.w,
            h: this.rect.h
        };
    }
    getCollisions() {
        let collisions = [];

        objects.forEach((obj) => {
            const objRect = obj.getHitbox();
            const myRect = this.getHitbox();

            if (
                objRect.w > 0 && 
                objRect.h > 0 &&
                myRect.x + myRect.w > objRect.x && 
                myRect.x < objRect.x + objRect.w && 
                myRect.y + myRect.h > objRect.y && 
                myRect.y < objRect.y + objRect.h &&
                obj != this
            ) 
            { 
                collisions.push(obj); 
            }
        });

        return collisions;
    }
    collide(axis){
        let size = {x: 'w', y: 'h'}[axis];
        this.getCollisions(objects).forEach((obj) => {
            if(this.velocity[axis]){
                if (this.velocity[axis] > 0) {
                    this.position[axis] = obj.position[axis] - this.rect[size] - this.rect[axis] + obj.rect[axis];
                }else{
                    this.position[axis] = obj.position[axis] + obj.rect[size] - this.rect[axis] + obj.rect[axis];
                }

                this.velocity[axis] = 0;
            }
        });
    }

    update(){}

    draw(ctx){
        let drawImageFailed = false;
        try{
            const frame = Math.floor(this.animFrame) % this.animations[this.animName].length;

            const animation = this.animations[this.animName][frame];
            const offset = {
                x: 'xOff' in animation ? animation.xOff : 0,
                y: 'yOff' in animation ? animation.yOff : 0
            };

            //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            ctx.drawImage(
                this.image, 
                animation.x, animation.y, 
                animation.w, animation.h, 
                Math.floor(this.position.x) + offset.x, 
                Math.floor(this.position.y) + offset.y, 
                animation.w, animation.h
            );
        }catch{
            //draw a rect if for some reason we can't draw our frame
            drawImageFailed = true;
        }

        if(this.drawHitbox || drawImageFailed){
            ctx.fillRect(...Object.values(this.getHitbox()));
        }
    }
}

class Speaker extends Entity{
    constructor(x,y,img){
        super(x,y);

        this.rect = {x: 8, y: 13, w: 12, h: 12};
        this.image.src = img;

        //animations, animFrame
        this.animName = "idle";
        this.animations = {
            "idle": [
                {x: 0, y: 0, w: 24, h: 25}
            ],
            "talk": [
                {x: 25, y: 0, w: 24, h: 25},
                {x: 0, y: 0, w: 24, h: 25}
            ]
        };
    }
}

class Player extends Entity{
    constructor(x,y){
        super(x,y);

        this.rect = {x: 7, y: 18, w: 6, h: 12};

        this.speed = 0.2;
        this.friction = 0.95; //slippery

        this.image = new Image();
        this.image.src = 'img/banjo.png';

        //animations, animFrame
        this.animFrame = 0;
        this.animName = "down";
        this.animations = {
            "down": [
                {x: 20, y: 0, w: 20, h: 30, yOff: -2},
                {x: 0, y: 0, w: 20, h: 30},
                {x: 40, y: 0, w: 20, h: 30, yOff: -2},
                {x: 0, y: 0, w: 20, h: 30}
            ],
            "up": [
                {x: 20, y: 30, w: 20, h: 30, yOff: -2},
                {x: 0, y: 30, w: 20, h: 30},
                {x: 40, y: 30, w: 20, h: 30, yOff: -2},
                {x: 0, y: 30, w: 20, h: 30}
            ],
            "left": [
                {x: 15, y: 60, w: 15, h: 29, xOff: 1, yOff: -1},
                {x: 0, y: 60, w: 15, h: 29, xOff: 1, yOff: 1},
                {x: 30, y: 60, w: 15, h: 29, xOff: 1, yOff: -1},
                {x: 0, y: 60, w: 15, h: 29, xOff: 1, yOff: 1}
            ],
            "right": [
                {x: 15, y: 89, w: 15, h: 29, xOff: 4, yOff: -1},
                {x: 0, y: 89, w: 15, h: 29, xOff: 4, yOff: 1},
                {x: 30, y: 89, w: 15, h: 29, xOff: 4, yOff: -1},
                {x: 0, y: 89, w: 15, h: 29, xOff: 4, yOff: 1}
            ]
        };
    }
    update(){
        const vector = normalized({
            x: keyDown('d') - keyDown('a'),
            y: keyDown('s') - keyDown('w')
        });

        //animation
        if(vector.y){
            this.animName = (vector.y > 0) ? "down" : "up";
        }else if(vector.x){
            this.animName = (vector.x > 0) ? "right" : "left";
        }

        //increase frame
        const magnitude = getMagnitude(this.velocity);
        if(magnitude > 0.2){
            this.animFrame += magnitude / 16;
        }else{
            this.animFrame = this.animations[this.animName].length - 1; // last
        }

        //move
        this.velocity.x += vector.x * this.speed;
        this.velocity.y += vector.y * this.speed;

        //apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        //apply velocity
        this.position.x += this.velocity.x;
        this.collide("x");

        this.position.y += this.velocity.y;
        this.collide("y");
    }
}

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

//make it beautiful
ctx.imageSmoothingEnabled = false;
ctx.scale(2, 2);

const keysPressed = {};
const objects = [
    new Player(0, 0),
    new Speaker(60, 60, 'img/greg.png'),
    new Speaker(72, 72, 'img/greg.png'),
];

//manage keypresses
function keyDown(key){
    return key in keysPressed && keysPressed[key];
}
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

//utility functions
function getMagnitude(vector){
    return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}
function normalized(vector) {
    const magnitude = getMagnitude(vector);
    if (magnitude === 0) {
        return {x: 0, y: 0};
    }
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude
    };
}

//GAME LOOP FUNCTIONS
function update(){
    for(const obj of objects){
        obj.update();
    }
}
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //sort then draw for zOrder based off y position
    objects.sort(
        (a, b) => 
            (a.position.y + a.rect.y + a.rect.h) - 
            (b.position.y + b.rect.y + b.rect.h)
    );
    for(const obj of objects){
        obj.draw(ctx);
    }
}
function main(){
    update();
    draw();
    requestAnimationFrame(main);
}

requestAnimationFrame(main);
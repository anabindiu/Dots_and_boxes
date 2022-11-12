const GRIDSIZE = 4;
const HEIGHT = 550;
const WIDTH = 555 * 2.4;
const CELL = (550*2.4) / (14 + 2);

const Players = [
    new Player("Player 1", "blue", 0, true),
    new Player("Player 2", "red", 0, false),
    new Player("Player 3", "green", 0, false)
];

function Player(name, color, score) {
    this.name = name;
    this.color = color;
    this.score = score;
}

// definitions
const Part = {
    BOT: 0,
    LEFT: 1,
    RIGHT: 2,
    TOP: 3
}

var canv = document.createElement("canvas");
canv.height = HEIGHT;
canv.width = WIDTH;
document.body.appendChild(canv);
var canvRect = canv.getBoundingClientRect();

var ctx = canv.getContext("2d");


// start a new game
var Totalcells = [];
var switchPlayer1 = Math.random() >= 0.5;
var switchPlayer2 = Math.random() >= 0.5;

Players[2].score = 0;
Players[1].score  = 0;
Players[0].score  = 0;
var end = 0;

// set up the game loop
setInterval(init, 1000 / 30);

var cells = [];
let i = 0;
while ( i < 4) {
    cells[i] = [];
    let j = 0;
    while (j < 4) {
        cells[i][j] = new Cell_box(((CELL * (j + 1))), ((HEIGHT - (4 + 1) * CELL) + CELL * i), CELL, CELL);
        j++;
    }
    i++;
}

function Cell_box(x, y, w, h) {
    this.low = y + h;
    this.left = x;
    this.right = x + w;
    this.top = y;
    this.owner = null;
    this.sideBot = {owner: null, selected: false};
    this.sideLeft = {owner: null, selected: false};
    this.sideRight = {owner: null, selected: false};
    this.sideTop = {owner: null, selected: false};

    this.contains = function(x, y) {
        return x >= this.left && x < this.right && y >= this.top && y < this.low;
    }

    this.draw = function() {
        if (this.sideBot.selected) {
            ctx.strokeStyle = this.sideBot.owner ? Players[0].color : Players[1].color;
            ctx.beginPath();
            ctx.moveTo(this.left, this.low);
            ctx.lineTo(this.right, this.low);
            ctx.stroke();
        }
        if (this.sideLeft.selected) {
            ctx.strokeStyle = this.sideLeft.owner ? Players[0].color : Players[1].color;
            ctx.beginPath();
            ctx.moveTo(this.left, this.top);
            ctx.lineTo(this.left, this.low);
            ctx.stroke();
        }
        if (this.sideRight.selected) {
            ctx.strokeStyle = this.sideRight.owner ? Players[0].color : Players[1].color;
            ctx.beginPath();
            ctx.moveTo(this.right, this.top);
            ctx.lineTo(this.right, this.low);
            ctx.stroke();
        }
        if (this.sideTop.selected) {
            ctx.strokeStyle = this.sideTop.owner ? Players[0].color : Players[1].color;
            ctx.beginPath();
            ctx.moveTo(this.left, this.top);
            ctx.lineTo(this.right, this.top);
            ctx.stroke();
        }
        if (this.owner == null) {
            return;
        }
        this.owner ? ctx.fillStyle = Players[0].color : ctx.fillStyle = Players[1].color;
        ctx.fillRect(this.left + CELL / 40, this.top + CELL / 40,w - CELL / 40 * 2, h - CELL / 40 * 2);

    }
}

var owner = null;
function init() {
    ctx.fillStyle = "lavender";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    for (let row of cells) {
        for (let square of row) {
            square.draw();
        }
    }
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc((CELL * (j + 1)), ((HEIGHT - (4 + 1) * CELL) + CELL * i), CELL / 25, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    //handles score displays
    ctx.fillStyle = "black";
    ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6)*2 + "30px Arial";
    ctx.fillText("Score", WIDTH * 0.50, (HEIGHT - (4 + 1) * CELL) * 0.25);
    ctx.fillStyle = Players[0].color;
    ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6) + "20px Arial";
    ctx.fillText(Players[0].name, WIDTH * 0.50, (HEIGHT - (4 + 1) * CELL) * 1.0);
    ctx.fillStyle = Players[0].color;
    ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6)*2 + "20px Arial";
    ctx.fillText(Players[0].score, WIDTH * 0.60, (HEIGHT - (4 + 1) * CELL) * 1.0);
    ctx.fillStyle = Players[1].color;
    ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6) + "20px Arial";
    ctx.fillText(Players[1].name, WIDTH * 0.50, (HEIGHT - (4 + 1) * CELL) * 1.5);
    ctx.fillStyle = Players[1].color;
    ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6)*2 + "20px Arial";
    ctx.fillText(Players[1].score, WIDTH * 0.60, (HEIGHT - (4 + 1) * CELL) * 1.5);
    
    ctx.fillStyle = Players[2].color;
    ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6) + "20px Arial";
    ctx.fillText(Players[2].name, WIDTH * 0.50, (HEIGHT - (4 + 1) * CELL) * 2.0);
    ctx.fillStyle = Players[2].color;
    ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6)*2 + "20px Arial";
    ctx.fillText(Players[2].score, WIDTH * 0.60, (HEIGHT - (4 + 1) * CELL) * 2.0);

    //calculate scores
    if (end > 0) {
        if ((Players[1].score  == Players[0].score) || (Players[1].score  == Players[2].score) || (Players[0].score  == Players[2].score)) {
            ctx.fillStyle = "black";
            ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6) + "30px Arial";
            ctx.fillText("There has been a draw", WIDTH * 0.5, (HEIGHT - (4 + 1) * CELL) * 0.6);
        } else if ((Players[0].score > Players[1].score) && (Players[0].score > Players[2].score)){
            ctx.fillStyle = Players[0].color;
            ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6) + "30px Arial";
            ctx.fillText(Players[0].name, WIDTH * 0.5, (HEIGHT - (4 + 1) * CELL) * 3.1);
            ctx.fillStyle = Players[0].color;
            ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6) + "30px Arial";
            ctx.fillText("won", WIDTH * 0.5, (HEIGHT - (4 + 1) * CELL) * 3.4);
        } else if ((Players[1].score > Players[0].score) && (Players[1].score > Players[2].score)){
            ctx.fillStyle = Players[1].color;
            ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6) + "30px Arial";
            ctx.fillText(Players[1].name, WIDTH * 0.5, (HEIGHT - (4 + 1) * CELL) * 3.1);
            ctx.fillStyle = Players[1].color;
            ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6) + "30px Arial";
            ctx.fillText("won", WIDTH * 0.5, (HEIGHT - (4 + 1) * CELL) * 3.4);
        }
        else{
            ctx.fillStyle = Players[2].color;
            ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6) + "30px Arial";
            ctx.fillText(Players[2].name, WIDTH * 0.5, (HEIGHT - (4 + 1) * CELL) * 3.1);
            ctx.fillStyle = Players[2].color;
            ctx.font = ((HEIGHT - (4 + 1) * CELL) / 6) + "30px Arial";
            ctx.fillText("won", WIDTH * 0.5, (HEIGHT - (4 + 1) * CELL) * 3.4);
        }
    }
}




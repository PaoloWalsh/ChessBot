class piece {
    constructor(type) {
        switch (type) {
            case "white_bishop":
                this.div = "<div class='piece' id='white_bishop' draggable='true'><img src='pictures/png/white-bishop.png' alt='w_bishop' id='w_bishop'></div>";
                break;
            case "white_king":
                this.div = "<div class='piece' id='white_king' draggable='true'><img src='pictures/png/white-king.png' alt='w_king' id='w_king'></div>";
                break;
            case "white_knight":
                this.div = "<div class='piece' id='white_knight' draggable='true'><img src='pictures/png/white-knight.png' alt='w_knight' id='w_knight'></div>";
                break;
            case "white_pawn":
                this.div = "<div class='piece' id='white_pawn' draggable='true'><img src='pictures/png/white-pawn.png' alt='w_pawn' id='w_pawn'></div>";
                break;
            case "white_queen":
                this.div = "<div class='piece' id='white_queen' draggable='true'><img src='pictures/png/white-queen.png' alt='w_queen' id='w_queen'></div>";
                break;
            case "white_rook":
                this.div = "<div class='piece' id='white_rook' draggable='true'><img src='pictures/png/white-rook.png' alt='w_rook' id='w_rook'></div>";
                break;
            case "black_bishop":
                this.div = "<div class='piece' id='black_bishop' draggable='true'><img src='pictures/png/black-bishop.png' alt='b_bishop' id='b_bishop'></div>";
                break;
            case "black_king":
                this.div = "<div class='piece' id='black_king' draggable='true'><img src='pictures/png/black-king.png' alt='b_king' id='b_king'></div>";
                break;
            case "black_knight":
                this.div = "<div class='piece' id='black_knight' draggable='true'><img src='pictures/png/black-knight.png' alt='b_knight' id='b_knight'></div>";
                break;
            case "black_pawn":
                this.div = "<div class='piece' id='black_pawn' draggable='true'><img src='pictures/png/black-pawn.png' alt='b_pawn' id='b_pawn'></div>";
                break;
            case "black_queen":
                this.div = "<div class='piece' id='black_queen' draggable='true'><img src='pictures/png/black-queen.png' alt='b_queen' id='b_queen'></div>";
                break;
            case "black_rook":
                this.div = "<div class='piece' id='black_rook' draggable='true'><img src='pictures/png/black-rook.png' alt='b_rook' id='b_rook'></div>";   
                break;

        }
        this.firstMove = true;
        this.captured = false;
        this.row;
        this.col;
         
    }
}

let white_bishop = new piece("white_bishop");
let white_king = new piece("white_king");
let white_knight = new piece("white_knight");
let white_pawn = new piece("white_pawn");
let white_queen = new piece("white_queen");
let white_rook = new piece("white_rook");

let black_bishop = new piece("black_bishop");
let black_king = new piece("black_king");
let black_knight = new piece("black_knight");
let black_pawn = new piece("black_pawn");
let black_queen = new piece("black_queen");
let black_rook = new piece("black_rook");

const pieces = [
    white_rook.div, white_knight.div, white_bishop.div, white_king.div, white_queen.div, white_bishop.div, white_knight.div, white_rook.div,
    white_pawn.div, white_pawn.div, white_pawn.div, white_pawn.div, white_pawn.div, white_pawn.div, white_pawn.div, white_pawn.div, 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    black_pawn.div, black_pawn.div, black_pawn.div, black_pawn.div, black_pawn.div, black_pawn.div, black_pawn.div, black_pawn.div, 
    black_rook.div, black_knight.div, black_bishop.div, black_king.div, black_queen.div, black_bishop.div, black_knight.div, black_rook.div
];

/*
const w_bishop = "<div class='piece' id='white_bishop' draggable='true'><img src='pictures/png/white-bishop.png' alt='w_bishop' id='w_bishop'></div>";
const w_king = "<div class='piece' id='white_king' draggable='true'><img src='pictures/png/white-king.png' alt='w_king' id='w_king'></div>";
const w_knight = "<div class='piece' id='white_knight' draggable='true'><img src='pictures/png/white-knight.png' alt='w_knight' id='w_knight'></div>";
const w_pawn = "<div class='piece' id='white_pawn' draggable='true'><img src='pictures/png/white-pawn.png' alt='w_pawn' id='w_pawn'></div>";
const w_queen = "<div class='piece' id='white_queen' draggable='true'><img src='pictures/png/white-queen.png' alt='w_queen' id='w_queen'></div>";
const w_rook = "<div class='piece' id='white_rook' draggable='true'><img src='pictures/png/white-rook.png' alt='w_rook' id='w_rook'></div>";

const b_bishop = "<div class='piece' id='black_bishop' draggable='true'><img src='pictures/png/black-bishop.png' alt='b_bishop' id='b_bishop'></div>";
const b_king = "<div class='piece' id='black_king' draggable='true'><img src='pictures/png/black-king.png' alt='b_king' id='b_king'></div>";
const b_knight = "<div class='piece' id='black_knight' draggable='true'><img src='pictures/png/black-knight.png' alt='b_knight' id='b_knight'></div>";
const b_pawn = "<div class='piece' id='black_pawn' draggable='true'><img src='pictures/png/black-pawn.png' alt='b_pawn' id='b_pawn'></div>";
const b_queen = "<div class='piece' id='black_queen' draggable='true'><img src='pictures/png/black-queen.png' alt='b_queen' id='b_queen'></div>";
const b_rook = "<div class='piece' id='black_rook' draggable='true'><img src='pictures/png/black-rook.png' alt='b_rook' id='b_rook'></div>";
*/

"use strict";

//global variables
const rows = 8;
const cols = 8;

let white_turn = true;
let black_turn = false;

let white_in_check = false;
let black_in_check = false;

// let whiteCanEnpassant = false;
// let blackCanEnpassant = false;
let enPassantPlayed = false;

//let castlignRook = false;

let white_pieces = [];
let black_pieces = [];

let numberWhiteQueens = 1;
let numberWhiteKnights = 2;

let numberBlackQueens = 1;
let numberBlackKnights = 2;


const capture_sound = new Audio('audio/capture.mp3');
const move_sound = new Audio('audio/move-self.mp3');

class piece {
    constructor(type, i) {
        if(isNaN(i)){
            this.id = type;
            this.numero = '';
        }
        else{
            this.id = type + i;
            this.numero = i;    //indica il numero del pezzo ad esempio se è la prima pedina etc
        }
        this.firstMove = true;  //it's only useful for kings and rooks (for castling) and pawns
        this.captured = false;  //idk if it's actually useful 
        this.row;
        this.col;
        this.old_row;
        this.old_col;
        this.color;
        this.movesMade = 0; //counts the number of moves that where made
        this.possibleMoves = new Array();
        this.value; //piece value for the score
        this.enPassantCapturable = false;
        this.type = type;
        
    }
    getDiv(){
        const div = document.createElement('div');
        const img = document.createElement('img');
        div.classList.add('piece');
        let sorgente = "img/png/";
        div.id = this.type+this.numero;
        div.draggable = true;
        img.src = sorgente+this.type+'.png';
        // console.log(img);
        div.appendChild(img);
        return div;
    }
}

//global variables

let white_pawns = [];
let white_bishops = [];
let white_knights = [];
let white_rooks = [];

let black_pawns = [];
let black_bishops = [];
let black_knights = [];
let black_rooks = [];

let white_king;
let white_queen;

let black_king;
let black_queen;




/**
 * @brief it initializes every piece
 */
function init_Pieces(){
//creating white pieces

    white_king = new piece("white_king");
    white_queen = new piece("white_queen");

    black_king = new piece("black_king");
    black_queen = new piece("black_queen");

    for(let i = 0; i < 8; i++){
        white_pawns[i] = new piece("white_pawn", i);
        white_pawns[i].row = white_pawns[i].old_row = 1;
        white_pawns[i].col = white_pawns[i].old_col = i;
        white_pawns[i].color = "white";
        white_pawns[i].value = 1;

    }

    for(let i = 0; i < 2; i++){
        white_bishops[i] = new piece("white_bishop", i);
        white_bishops[i].row = white_bishops[i].old_row = 0;
        if(i == 0)
            white_bishops[i].col = white_bishops[i].old_col = 2;
        else 
            white_bishops[i].col = white_bishops[i].old_col = 5;
        white_bishops[i].color = "white";
        white_bishops[i].value = 3;
    }  

    for(let i = 0; i < 2; i++){
        white_knights[i] = new piece("white_knight", i);
        white_knights[i].row = white_knights[i].old_row = 0;
        if(i == 0)
            white_knights[i].col = white_knights[i].old_col = 1;
        else 
            white_knights[i].col = white_knights[i].old_col = 6;
        white_knights[i].color = "white";
        white_knights[i].value = 3;
    }

    for(let i = 0; i < 2; i++){
        white_rooks[i] = new piece("white_rook", i);
        white_rooks[i].row = white_rooks[i].old_row = 0;
        if(i == 0)
            white_rooks[i].col = white_rooks[i].old_col = 0;
        else 
            white_rooks[i].col = white_rooks[i].old_col = 7;
        white_rooks[i].color = "white";
        white_rooks[i].value = 5;
    }

    white_king.row = white_king.old_row = 0;
    white_king.col = white_king.old_col = 3;
    white_king.color = "white";

    white_queen.row = white_queen.old_row = 0;
    white_queen.col = white_queen.old_col = 4;
    white_queen.color = "white";
    white_queen.value = 9;

    //creating black pieces
    for(let i = 0; i < 8; i++){
        black_pawns[i] = new piece("black_pawn", i);
        black_pawns[i].row = black_pawns[i].old_row = 6;
        black_pawns[i].col = black_pawns[i].old_col = i;
        black_pawns[i].color = "black";
        black_pawns[i].value = -1;
    }

    for(let i = 0; i < 2; i++){
        black_bishops[i] = new piece("black_bishop", i);
        black_bishops[i].row = black_bishops[i].old_row = 7;
        if(i == 0)
            black_bishops[i].col = black_bishops[i].old_col = 2;
        else 
            black_bishops[i].col = black_bishops[i].old_col = 5;
        black_bishops[i].color = "black";
        black_bishops[i].value = -3;
    }

    for(let i = 0; i < 2; i++){
        black_knights[i] = new piece("black_knight", i);
        black_knights[i].row = black_knights[i].old_row = 7;
        if(i == 0)
            black_knights[i].col = black_knights[i].old_col = 1;
        else 
            black_knights[i].col = black_knights[i].old_col = 6;
            black_knights[i].color = "black";
            black_knights[i].value = -3;
    }

    for(let i = 0; i < 2; i++){
        black_rooks[i] = new piece("black_rook", i);
        black_rooks[i].row = black_rooks[i].old_row = 7;
        if(i == 0)
            black_rooks[i].col = black_rooks[i].old_col = 0;
        else 
            black_rooks[i].col = black_rooks[i].old_col = 7;
            black_rooks[i].color = "black";
            black_rooks[i].value = -5;
    }

    black_king.row = black_king.old_row = 7;
    black_king.col = black_king.old_col = 3;
    black_king.color = "black";

    black_queen.row = black_queen.old_row = 7;
    black_queen.col = black_queen.old_col = 4;
    black_queen.color = "black";
    black_queen.value = -9;
}

let board;
// console.log('ho creato il board');

/**
 * @brief it fills the board with the starting position
 */
function fill_Board() {
    board = [
        white_rooks[0], white_knights[0], white_bishops[0], white_king, white_queen, white_bishops[1], white_knights[1], white_rooks[1],
        white_pawns[0], white_pawns[1], white_pawns[2], white_pawns[3], white_pawns[4], white_pawns[5], white_pawns[6], white_pawns[7], 
        0, 0, 0, 0, 0, 0, 0, 0, 
        0, 0, 0, 0, 0, 0, 0, 0, 
        0, 0, 0, 0, 0, 0, 0, 0, 
        0, 0, 0, 0, 0, 0, 0, 0, 
        black_pawns[0], black_pawns[1], black_pawns[2], black_pawns[3], black_pawns[4], black_pawns[5], black_pawns[6], black_pawns[7], 
        black_rooks[0], black_knights[0], black_bishops[0], black_king, black_queen, black_bishops[1], black_knights[1], black_rooks[1]
    ];
    for(let i = 0; i < 16; i++){
        white_pieces[i] = board[i];
        black_pieces[i] = board[48+i];
    }
}






// let pieces = [];

// for(let i = 0; i < 64; i++){
//     if(board[i] != 0)
//         pieces[i] = board[i].div;
//     else
//         pieces[i] = "";
// }

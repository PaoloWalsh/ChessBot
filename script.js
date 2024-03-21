"use strict";

const rows = 8;
const cols = 8;

let white_turn = true;
let balck_turn = false;

const capture_sound = new Audio('audio/capture.mp3');
const move_sound = new Audio('audio/move-self.mp3');

class piece {
    constructor(type, i) {
        switch (type) {
            case "w_bishop":
                this.div = "<div class='piece' id='white_bishop" + i + "' draggable='true'><img src='pictures/png/white-bishop.png' alt='w_bishop' id='w_bishop'></div>";
                break;
            case "w_king":
                this.div = "<div class='piece' id='white_king' draggable='true'><img src='pictures/png/white-king.png' alt='w_king' id='w_king'></div>";
                break;
            case "w_knight":
                this.div = "<div class='piece' id='white_knight" + i + "' draggable='true'><img src='pictures/png/white-knight.png' alt='w_knight' id='w_knight'></div>";
                break;
            case "w_pawn":
                this.div = "<div class='piece' id='white_pawn" + i + "' draggable='true'><img src='pictures/png/white-pawn.png' alt='w_pawn' id='w_pawn'></div>";
                break;
            case "w_queen":
                this.div = "<div class='piece' id='white_queen' draggable='true'><img src='pictures/png/white-queen.png' alt='w_queen' id='w_queen'></div>";
                break;
            case "w_rook":
                this.div = "<div class='piece' id='white_rook" + i + "' draggable='true'><img src='pictures/png/white-rook.png' alt='w_rook' id='w_rook'></div>";
                break;
            case "b_bishop":
                this.div = "<div class='piece' id='black_bishop" + i + "' draggable='true'><img src='pictures/png/black-bishop.png' alt='b_bishop' id='b_bishop'></div>";
                break;
            case "b_king":
                this.div = "<div class='piece' id='black_king' draggable='true'><img src='pictures/png/black-king.png' alt='b_king' id='b_king'></div>";
                break;
            case "b_knight":
                this.div = "<div class='piece' id='black_knight" + i + "' draggable='true'><img src='pictures/png/black-knight.png' alt='b_knight' id='b_knight'></div>";
                break;
            case "b_pawn":
                this.div = "<div class='piece' id='black_pawn" + i + "' draggable='true'><img src='pictures/png/black-pawn.png' alt='b_pawn' id='b_pawn'></div>";
                break;
            case "b_queen":
                this.div = "<div class='piece' id='black_queen' draggable='true'><img src='pictures/png/black-queen.png' alt='b_queen' id='b_queen'></div>";
                break;
            case "b_rook":
                this.div = "<div class='piece' id='black_rook" + i + "' draggable='true'><img src='pictures/png/black-rook.png' alt='b_rook' id='b_rook'></div>";   
                break;

        }
        this.id = type + i;
        this.firstMove = true;
        this.captured = false;
        this.row;
        this.col;
        this.old_row;
        this.old_col;
         
    }
}

let white_pawns = [];
let white_bishops = [];
let white_knights = [];
let white_rooks = [];

let black_pawns = [];
let black_bishops = [];
let black_knights = [];
let black_rooks = [];

let white_king = new piece("w_king");
let white_queen = new piece("w_queen");

let black_king = new piece("b_king");
let black_queen = new piece("b_queen");

// let white_bishop = new piece("w_bishop");
// let white_knight = new piece("w_knight");
// let white_pawn = new piece("w_pawn");
// let white_rook = new piece("w_rook");

// let black_bishop = new piece("b_bishop");
// let black_knight = new piece("b_knight");
// let black_pawn = new piece("b_pawn");
// let black_rook = new piece("b_rook");

//creating white pieces
for(let i = 0; i < 8; i++){
    white_pawns[i] = new piece("w_pawn", i);
    white_pawns[i].row = white_pawns[i].old_row = 1;
    white_pawns[i].col = white_pawns[i].old_col = i;
}

for(let i = 0; i < 2; i++){
    white_bishops[i] = new piece("w_bishop", i);
    white_bishops[i].row = white_bishops[i].old_row = 0;
    if(i == 0)
        white_bishops[i].col = white_bishops[i].old_col = 2;
    else 
        white_bishops[i].col = white_bishops[i].old_col = 5;
}  

for(let i = 0; i < 2; i++){
    white_knights[i] = new piece("w_knight", i);
    white_knights[i].row = white_knights[i].old_row = 0;
    if(i == 0)
        white_knights[i].col = white_knights[i].old_col = 1;
    else 
        white_knights[i].col = white_knights[i].old_col = 6;
}

for(let i = 0; i < 2; i++){
    white_rooks[i] = new piece("w_rook", i);
    white_rooks[i].row = white_rooks[i].old_row = 0;
    if(i == 0)
        white_rooks[i].col = white_rooks[i].old_col = 0;
    else 
        white_rooks[i].col = white_rooks[i].old_col = 7;
}

white_king.row = white_king.old_row = 0;
white_king.col = white_king.old_col = 3;

white_queen.row = white_queen.old_row = 0;
white_queen.col = white_queen.old_col = 4;

//creating black pieces
for(let i = 0; i < 8; i++){
    black_pawns[i] = new piece("b_pawn", i);
    black_pawns[i].row = black_pawns[i].old_row = 6;
    black_pawns[i].col = black_pawns[i].old_col = i;
}

for(let i = 0; i < 2; i++){
    black_bishops[i] = new piece("b_bishop", i);
    black_bishops[i].row = black_bishops[i].old_row = 7;
    if(i == 0)
        black_bishops[i].col = black_bishops[i].old_col = 2;
    else 
        black_bishops[i].col = black_bishops[i].old_col = 5;
}

for(let i = 0; i < 2; i++){
    black_knights[i] = new piece("b_knight", i);
    black_knights[i].row = black_knights[i].old_row = 7;
    if(i == 0)
        black_knights[i].col = black_knights[i].old_col = 1;
    else 
        black_knights[i].col = black_knights[i].old_col = 6;
}

for(let i = 0; i < 2; i++){
    black_rooks[i] = new piece("b_rook", i);
    black_rooks[i].row = black_rooks[i].old_row = 7;
    if(i == 0)
        black_rooks[i].col = black_rooks[i].old_col = 0;
    else 
        black_rooks[i].col = black_rooks[i].old_col = 7;
}

black_king.row = black_king.old_row = 7;
black_king.col = black_king.old_col = 3;

black_queen.row = black_queen.old_row = 7;
black_queen.col = black_queen.old_col = 4;


//da mettere le colonne fatte bene
let board = [
    white_rooks[0], white_knights[0], white_bishops[0], white_king, white_queen, white_bishops[1], white_knights[1], white_rooks[1],
    white_pawns[0], white_pawns[1], white_pawns[2], white_pawns[3], white_pawns[4], white_pawns[5], white_pawns[6], white_pawns[7], 
    0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 
    black_pawns[0], black_pawns[1], black_pawns[2], black_pawns[3], black_pawns[4], black_pawns[5], black_pawns[6], black_pawns[7], 
    black_rooks[0], black_knights[0], black_bishops[0], black_king, black_queen, black_bishops[1], black_knights[1], black_rooks[1]
];


let pieces = [];

for(let i = 0; i < 64; i++){
    if(board[i] != 0)
        pieces[i] = board[i].div;
    else
        pieces[i] = "";
}


function build () {
    buildBoard();
    init_drag();
}

function buildBoard() {
    const board = document.getElementById("board");
    let count = 63;
    for(let i = rows-1; i >= 0; i--) {
        for(let j = cols-1; j >= 0; j--){
            const square = document.createElement("div");
            square.innerHTML = pieces[count];
            square.setAttribute("id", count--);
            //square.setAttribute("readonly", "readonly");
            square.classList.add("square");
            if(!((i+j)%2))
                square.classList.add("light");
            else
                square.classList.add("dark");
            board.appendChild(square);
        }
    }
}

let allSquares;
document.addEventListener("DOMContentLoaded", function() {
    build();
});

function init_drag() {
    allSquares = document.querySelectorAll("#board .square");
    allSquares.forEach(square => {
        square.addEventListener('dragstart', dragStart)
        square.addEventListener('dragover', dragOver)
        square.addEventListener('drop', dragDrop)
    });
}

let startPositionId;
let draggedElement;
let draggedPiece;

function dragStart (e) {
        startPositionId = e.target.parentNode.getAttribute('id');   //square id
        draggedElement = e.target;
}

function dragOver (e) {
    e.preventDefault();
}

//makes the move
function dragDrop (e) {
    let moveMade;
    e.stopPropagation();
    if((white_turn && draggedElement.id.includes("white"))
        || (balck_turn && draggedElement.id.includes("black"))){
        // if true -> the target square is empty
        if(e.target.classList.contains("square"))
        {
            moveMade = validate_move(e.target, false);
            if(moveMade){
                e.target.append(draggedElement);
                move_sound.play();
                updateBoard();
                switchTurn();
            }
            else 
                return;
        }
        //check if the target square has a same colored piece
        else if ((white_turn && e.target.id.includes("black"))
            || (balck_turn && e.target.id.includes("white")))
        {
            //if true -> the target square has a different color piece
            moveMade = validate_move(e.target, true);
            if(validate_move(e.target.parentNode, true)) {
                e.target.parentNode.append(draggedElement);
                e.target.remove();
                capture_sound.play();
                updateBoard();
                switchTurn();
            }
        }
        else
            return;
        // if(moveMade)
        //     switchTurn();
       
    }
 
}

function switchTurn(){
    if(white_turn){
        white_turn = false;
        balck_turn = true
    }
    else{
        balck_turn = false;
        white_turn = true;
    }
}

function validate_move (dest_element, captureOpportunity) {
    let start_index = parseInt(startPositionId);
    let start_row = Math.floor(start_index/rows);   
    let start_col = start_index%rows;
    let end_index = parseInt(dest_element.getAttribute('id'));
    let end_row = Math.floor(end_index/rows);
    let end_col = end_index%rows;
    

    //white pawn
    if(draggedElement.id.includes("white_pawn")){
        let i = parseInt(draggedElement.getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
        let t = white_pawns[i].firstMove ? 1 : 0;
        let diag = captureOpportunity ? 1 : 0;
        if((end_row >= start_row) && (end_row <= start_row + 1 + t) && (end_col >= (start_col - diag)) && (end_col <= (start_col + diag)))
            {
                if(captureOpportunity && end_col === start_col)
                    return false;
                draggedPiece = white_pawns[i];
                white_pawns[i].firstMove = false;
                white_pawns[i].old_row = start_row;
                white_pawns[i].old_col = start_col;
                white_pawns[i].row = end_row;
                white_pawns[i].col = end_col;
                return true;
            }
        else return false;
    }
    
    //black pawn
    if(draggedElement.id.includes("black_pawn")){
        let i = parseInt(draggedElement.getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
        let t = black_pawns[i].firstMove ? -1 : 0;
        let diag = captureOpportunity ? 1 : 0;
        if((end_row <= start_row) && (end_row >= start_row - 1 + t) && (end_col >= (start_col - diag)) && (end_col <= (start_col + diag)))
            {
                if(captureOpportunity && end_col === start_col)
                    return false;
                draggedPiece = black_pawns[i];
                black_pawns[i].firstMove = false;
                black_pawns[i].old_row = start_row;
                black_pawns[i].old_col = start_col;
                black_pawns[i].row = end_row;
                black_pawns[i].col = end_col;
                return true;
            }
        else return false;
    }

    //knights
    if(draggedElement.id.includes("knight")){
        let i = parseInt(draggedElement.getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
        if(((end_row === start_row + 2) && ((end_col === start_col + 1) || (end_col === start_col - 1)))
            || ((end_row === start_row + 1) && ((end_col === start_col + 2) || (end_col === start_col - 2)))
            || ((end_row === start_row - 2) && ((end_col === start_col + 1) || (end_col === start_col - 1)))
            || ((end_row === start_row - 1) && ((end_col === start_col + 2) || (end_col === start_col - 2))))
            {
                if(draggedElement.id.includes("white")){
                    draggedPiece = white_knights[i];
                    
                }
                if(draggedElement.id.includes("black")){
                    draggedPiece = black_knights[i];
                }
                draggedPiece.firstMove = false;
                draggedPiece.old_row = start_row;
                draggedPiece.old_col = start_col;
                draggedPiece.row = end_row;
                draggedPiece.col = end_col;
                return true;
            }
        else return false;
    }

    //kings
    if(draggedElement.id.includes("king")){
        if((end_row >= start_row - 1) && (end_row <= start_row + 1)
            && (end_col >= start_col - 1) && (end_col <= end_col + 1)){
                if(draggedElement.id.includes("white"))
                    draggedPiece = white_king;
                else   //black king
                    draggedPiece = black_king;
                
                draggedPiece.old_row = start_row;
                draggedPiece.old_col = start_col;
                draggedPiece.row = end_row;
                draggedPiece.col = end_col;
                return true;
        }
        else return false;
    }

    console.log(maxDist(start_row, start_col, "u"));
    console.log(maxDist(start_row, start_col, "r"));
    console.log(maxDist(start_row, start_col, "d"));
    console.log(maxDist(start_row, start_col, "l"));
    console.log("-----------------------------------------------------------");
    //rooks
    if(draggedElement.id.includes("white_rook")){
       if(end_col === start_col){
            if((end_row <= (start_row + maxDist(start_row, start_col, "u"))) && (end_row >= (start_row - maxDist(start_row, start_col, "d")))){
                return true;
            }
            return false;
       }
       if(end_row === start_row){
            if((end_col <= (start_col + maxDist(start_row, start_col, "l"))) && (end_col >= (start_row + maxDist(start_row, start_col, "r")))){
                return true;
            }
            return false;
       }
    }

}

//updates the board 
function updateBoard () {
    board[draggedPiece.old_row * cols + draggedPiece.old_col] = 0;
    if(board[draggedPiece.row * cols + draggedPiece.col] != 0)
        board[draggedPiece.row * cols + draggedPiece.col].captured = true;
        board[draggedPiece.row * cols + draggedPiece.col] = draggedPiece;
}

//returns the max number of square between 
// the cordinate of the piece and any other piece
function maxDist(s_row, s_col, c){
    let k = 0;
    switch (c) {
        case "l":   //calculate the left distance on the same row
            //row remains the same
            for(let j = s_col+1; j < cols; j++){
                if(board[s_row * cols + j] == 0)
                    k++;
                else
                    break;
            }
            return k;
        case "r":   //calculate the right distance on the same row
            //row remains the same
            for(let j = s_col-1; j >= 0; j--){
                if(board[s_row * cols + j] == 0)
                    k++;
                else
                    break;
            }
            return k;

        case "u":   //calculate the u distance on the same col
            //col remains the same
            for(let i = s_row+1; i < rows; i++){
                if(board[i * cols + s_col] == 0)
                    k++;
                else
                    break;
            }
            return k;

        case "d":   //calculate the down distance on the same col
            //col remains the same
            for(let i = s_row; i >= 0; i--){ //DEBUG
                if(board[i * cols + s_col] == 0)
                    k++;
                else
                    break;
            }
            return k;
        
    }
}


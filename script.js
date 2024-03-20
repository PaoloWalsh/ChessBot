"use strict";

const rows = 8;
const cols = 8;

let white_turn = true;
let balck_turn = false;

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
}

for(let i = 0; i < 2; i++){
    white_bishops[i] = new piece("w_bishop", i);
}

for(let i = 0; i < 2; i++){
    white_knights[i] = new piece("w_knight", i);
}

for(let i = 0; i < 2; i++){
    white_rooks[i] = new piece("w_rook", i);
}
//creating black pieces
for(let i = 0; i < 8; i++){
    black_pawns[i] = new piece("b_pawn", i);
}

for(let i = 0; i < 2; i++){
    black_bishops[i] = new piece("b_bishop", i);
}

for(let i = 0; i < 2; i++){
    black_knights[i] = new piece("b_knight", i);
}

for(let i = 0; i < 2; i++){
    black_rooks[i] = new piece("b_rook", i);
}

let board = [
    white_rooks[0], white_knights[0], white_bishops[0], white_king, white_queen, white_bishops[1], white_knights[1], white_rooks[1],
    white_pawns[0], white_pawns[1], white_pawns[2], white_pawns[3], white_pawns[4], white_pawns[5], white_pawns[6], white_pawns[7], 
    0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 
    black_pawns[7], black_pawns[6], black_pawns[5], black_pawns[4], black_pawns[3], black_pawns[2], black_pawns[1], black_pawns[0], 
    black_rooks[1], black_knights[1], black_bishops[1], black_king, black_queen, black_bishops[0], black_knights[0], black_rooks[0]
];

let pieces = [];

for(let i = 0; i < 64; i++){
    if(board[i] != 0)
        pieces[i] = board[i].div;
    else
        pieces[i] = "";
}

console.log(board);

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

function dragStart (e) {
        startPositionId = e.target.parentNode.getAttribute('id');   //square id
        draggedElement = e.target;
        //console.log(draggedElement);
}

function dragOver (e) {
    e.preventDefault();
}

function dragDrop (e) {
    e.stopPropagation();
    //console.log(e.target);
    if((white_turn && draggedElement.id.includes("white"))
        || (balck_turn && draggedElement.id.includes("black"))){
        // if true -> the target square is empty
        if(e.target.classList.contains("square"))
        {
            if(validate_move(e.target, false))
                e.target.append(draggedElement);
            else 
                return;
        }
        //check if the target square has a same colored piece
        else if ((white_turn && e.target.id.includes("black"))
            || (balck_turn && e.target.id.includes("white")))
        {
            //if true -> the target square has a different color piece
            if(validate_move(e.target.parentNode, true)) {
                e.target.parentNode.append(draggedElement);
                e.target.remove();
                
            }
        }
        else
            return;
            
        if(white_turn){
            white_turn = true;  //should be false
            balck_turn = true
        }
        else{
            balck_turn = false;
            white_turn = true;
        }
    }
    //console.log(e.target);
    //console.log(e.target.parentNode);
}

function validate_move (dest_element, captureOpportunity) {
    let start_index = parseInt(startPositionId);
    let start_row = Math.floor(start_index/rows);   
    let start_col = start_index%rows;
    let end_index = parseInt(dest_element.getAttribute('id'));
    let end_row = Math.floor(end_index/rows);
    let end_col = end_index%rows;
    console.log(maxDist(end_row, end_col, "u"));
    console.log(maxDist(end_row, end_col, "r"));
    console.log(maxDist(end_row, end_col, "d"));
    console.log(maxDist(end_row, end_col, "l"));
    //white pawn
    if(draggedElement.id.includes("white_pawn")){
        let i = parseInt(draggedElement.getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
        let t = white_pawns[i].firstMove ? 1 : 0;
        let diag = captureOpportunity ? 1 : 0;
        if((end_row >= start_row) && (end_row <= start_row + 1 + t - diag) && (end_col >= (start_col - diag)) && (end_col <= (start_col + diag)))
            {
                white_pawns[i].firstMove = false;
                white_pawns[i].row = end_row;
                white_pawns[i].col = end_col;
                return true;
            }
    }
    
    //black pawn
    if(draggedElement.id.includes("black_pawn")){
        let i = parseInt(draggedElement.getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
        let t = black_pawns[i].firstMove ? -1 : 0;
        let diag = captureOpportunity ? 1 : 0;
        // console.log(diag);
        if((end_row <= start_row) && (end_row >= start_row - 1 + t + diag) && (end_col >= (start_col - diag)) && (end_col <= (start_col + diag)))
            {
                black_pawns[i].firstMove = false;
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
                if(draggedElement.id.includes("white-knight")){
                    white_knights[i].firstMove = false;
                    white_knights[i].row = end_row;
                    white_knights[i].col = end_col;
                }
                if(draggedElement.id.includes("black-knight")){
                    black_knights[i].firstMove = false;
                    black_knights[i].row = end_row;
                    black_knights[i].col = end_col;
                }
                return true;
            }
        else return false;
    }

    //kings
    if(draggedElement.id.includes("king")){
        if((end_row >= start_row - 1) && (end_row <= start_row + 1)
            && (end_col >= start_col - 1) && (end_col <= end_col + 1))
            return true;
        else return false;
    }
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

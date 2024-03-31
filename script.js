"use strict";

const rows = 8;
const cols = 8;

let white_turn = true;
let balck_turn = true;

let enPassantPlayed = false;

const capture_sound = new Audio('audio/capture.mp3');
const move_sound = new Audio('audio/move-self.mp3');

class piece {
    constructor(type, i) {
        switch (type) {
            case "white_bishop":
                this.div = "<div class='piece' id='white_bishop" + i + "' draggable='true'><img src='pictures/png/white-bishop.png' alt='w_bishop' id='w_bishop'></div>";
                break;
            case "white_king":
                this.div = "<div class='piece' id='white_king' draggable='true'><img src='pictures/png/white-king.png' alt='w_king' id='w_king'></div>";
                break;
            case "white_knight":
                this.div = "<div class='piece' id='white_knight" + i + "' draggable='true'><img src='pictures/png/white-knight.png' alt='w_knight' id='w_knight'></div>";
                break;
            case "white_pawn":
                this.div = "<div class='piece' id='white_pawn" + i + "' draggable='true'><img src='pictures/png/white-pawn.png' alt='w_pawn' id='w_pawn'></div>";
                break;
            case "white_queen":
                this.div = "<div class='piece' id='white_queen' draggable='true'><img src='pictures/png/white-queen.png' alt='w_queen' id='w_queen'></div>";
                break;
            case "white_rook":
                this.div = "<div class='piece' id='white_rook" + i + "' draggable='true'><img src='pictures/png/white-rook.png' alt='w_rook' id='w_rook'></div>";
                break;
            case "black_bishop":
                this.div = "<div class='piece' id='black_bishop" + i + "' draggable='true'><img src='pictures/png/black-bishop.png' alt='b_bishop' id='b_bishop'></div>";
                break;
            case "black_king":
                this.div = "<div class='piece' id='black_king' draggable='true'><img src='pictures/png/black-king.png' alt='b_king' id='b_king'></div>";
                break;
            case "black_knight":
                this.div = "<div class='piece' id='black_knight" + i + "' draggable='true'><img src='pictures/png/black-knight.png' alt='b_knight' id='b_knight'></div>";
                break;
            case "black_pawn":
                this.div = "<div class='piece' id='black_pawn" + i + "' draggable='true'><img src='pictures/png/black-pawn.png' alt='b_pawn' id='b_pawn'></div>";
                break;
            case "black_queen":
                this.div = "<div class='piece' id='black_queen' draggable='true'><img src='pictures/png/black-queen.png' alt='b_queen' id='b_queen'></div>";
                break;
            case "black_rook":
                this.div = "<div class='piece' id='black_rook" + i + "' draggable='true'><img src='pictures/png/black-rook.png' alt='b_rook' id='b_rook'></div>";   
                break;

        }
        if(isNaN(i))
            this.id = type;
        else
            this.id = type + i;
        this.firstMove = true;  //it's only useful for kings and rooks (for castling) and pawns
        this.captured = false;  //idk if it's actually useful 
        this.row;
        this.col;
        this.old_row;
        this.old_col;
        this.color;
        this.movesMade = 0; //counts the number of moves that where made
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

let white_king = new piece("white_king");
let white_queen = new piece("white_queen");

let black_king = new piece("black_king");
let black_queen = new piece("black_queen");

//creating white pieces
for(let i = 0; i < 8; i++){
    white_pawns[i] = new piece("white_pawn", i);
    white_pawns[i].row = white_pawns[i].old_row = 1;
    white_pawns[i].col = white_pawns[i].old_col = i;
    white_pawns[i].color = "white";

}

for(let i = 0; i < 2; i++){
    white_bishops[i] = new piece("white_bishop", i);
    white_bishops[i].row = white_bishops[i].old_row = 0;
    if(i == 0)
        white_bishops[i].col = white_bishops[i].old_col = 2;
    else 
        white_bishops[i].col = white_bishops[i].old_col = 5;
    white_bishops[i].color = "white";
}  

for(let i = 0; i < 2; i++){
    white_knights[i] = new piece("white_knight", i);
    white_knights[i].row = white_knights[i].old_row = 0;
    if(i == 0)
        white_knights[i].col = white_knights[i].old_col = 1;
    else 
        white_knights[i].col = white_knights[i].old_col = 6;
    white_knights[i].color = "white";
}

for(let i = 0; i < 2; i++){
    white_rooks[i] = new piece("white_rook", i);
    white_rooks[i].row = white_rooks[i].old_row = 0;
    if(i == 0)
        white_rooks[i].col = white_rooks[i].old_col = 0;
    else 
        white_rooks[i].col = white_rooks[i].old_col = 7;
    white_rooks[i].color = "white";
}

white_king.row = white_king.old_row = 0;
white_king.col = white_king.old_col = 3;
white_king.color = "white";

white_queen.row = white_queen.old_row = 0;
white_queen.col = white_queen.old_col = 4;
white_queen.color = "white";

//creating black pieces
for(let i = 0; i < 8; i++){
    black_pawns[i] = new piece("black_pawn", i);
    black_pawns[i].row = black_pawns[i].old_row = 6;
    black_pawns[i].col = black_pawns[i].old_col = i;
    black_pawns[i].color = "black";
}

for(let i = 0; i < 2; i++){
    black_bishops[i] = new piece("black_bishop", i);
    black_bishops[i].row = black_bishops[i].old_row = 7;
    if(i == 0)
        black_bishops[i].col = black_bishops[i].old_col = 2;
    else 
        black_bishops[i].col = black_bishops[i].old_col = 5;
        black_bishops[i].color = "black";
}

for(let i = 0; i < 2; i++){
    black_knights[i] = new piece("black_knight", i);
    black_knights[i].row = black_knights[i].old_row = 7;
    if(i == 0)
        black_knights[i].col = black_knights[i].old_col = 1;
    else 
        black_knights[i].col = black_knights[i].old_col = 6;
        black_knights[i].color = "black";
}

for(let i = 0; i < 2; i++){
    black_rooks[i] = new piece("black_rook", i);
    black_rooks[i].row = black_rooks[i].old_row = 7;
    if(i == 0)
        black_rooks[i].col = black_rooks[i].old_col = 0;
    else 
        black_rooks[i].col = black_rooks[i].old_col = 7;
        black_rooks[i].color = "black";
}

black_king.row = black_king.old_row = 7;
black_king.col = black_king.old_col = 3;
black_king.color = "black";

black_queen.row = black_queen.old_row = 7;
black_queen.col = black_queen.old_col = 4;
black_queen.color = "black";



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
    moveMade = false;
    if((white_turn && draggedElement.id.includes("white"))
        || (balck_turn && draggedElement.id.includes("black"))){
        // if true -> the target square is empty
        if(e.target.classList.contains("square"))
        {
            moveMade = validate_move(e.target, false);
            if(moveMade){
                e.target.append(draggedElement);
                if(enPassantPlayed){
                    capture_sound.play();
                    enPassantPlayed = false;
                }
                else
                    move_sound.play();
            }
            
        }
        //check if the target square has a same colored piece
        else if ((draggedElement.id.includes("white") && e.target.id.includes("black"))
            || (draggedElement.id.includes("black") && e.target.id.includes("white")))
        {
            //if true -> the target square has a different color piece
            moveMade = validate_move(e.target.parentNode, true);
            if(moveMade) {
                e.target.parentNode.append(draggedElement);
                e.target.remove();
                capture_sound.play();
                
            }
        }
        else if ((draggedElement.id.includes("white_king") && e.target.id.includes("white_rook"))
            || (draggedElement.id.includes("black_king") && e.target.id.includes("black_rook"))
        )
        {   
            let castlignRook = divToPiece(e.target);
            moveMade = validate_move(e.target.parentNode, false, castlignRook);
            if(moveMade) {
                let rookStartSquare = e.target.parentNode;
                let kingStartSquare = draggedElement.parentNode;
                let rookEndSquare;
                let kingEndSquare;
                let kingIndex = parseInt(kingStartSquare.getAttribute("id"));
                let rookIndex = parseInt(rookStartSquare.getAttribute("id"));
                draggedElement.remove();
                e.target.remove();
                if(kingIndex > rookIndex){  //I'm castling to the right
                    rookEndSquare = document.getElementById((kingIndex-1)+'');
                    kingEndSquare = document.getElementById((rookIndex+1)+'');
                }
                else{
                    rookEndSquare = document.getElementById((kingIndex+1)+'');
                    kingEndSquare = document.getElementById((rookIndex-2)+'');
                }
                rookEndSquare.append(e.target);
                kingEndSquare.append(draggedElement);
                move_sound.play();
            }
        }
    }
    if(moveMade){
        updateBoard();
        // switchTurn();
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

function validate_move (dest_element, captureOpportunity, castlignRook) {
    let start_index = parseInt(startPositionId);
    let start_row = Math.floor(start_index/rows);   
    let start_col = start_index%rows;
    let end_index = parseInt(dest_element.getAttribute('id'));
    let end_row = Math.floor(end_index/rows);
    let end_col = end_index%rows;
    let i = parseInt(draggedElement.getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
    

    //white pawn
    if(draggedElement.id.includes("white_pawn")){
        let t = white_pawns[i].firstMove ? 1 : 0;
        let diag = captureOpportunity ? 1 : 0;
        let possibleEnPassantPawn = board[(end_row-1)*cols + end_col];
        if((end_row >= start_row) && (end_row <= start_row + 1 + t) && (end_col >= (start_col - diag)) && (end_col <= (start_col + diag)))
            {
                if(captureOpportunity && end_col === start_col)
                    return false;
                draggedPiece = white_pawns[i];
                
            }
        else if(!captureOpportunity && possibleEnPassantPawn != 0 && possibleEnPassantPawn.id.includes("black_pawn") && 
            possibleEnPassantPawn.movesMade === 1 && end_row === 5 && (end_row-start_row) === 1){
            possibleEnPassantPawn.captured = true;
            board[(end_row-1)*cols + end_col] = 0;
            pieceOffSquare(end_row-1, end_col);
            draggedPiece = white_pawns[i];
            enPassantPlayed = true;
            }
        else 
            return false;
        draggedPiece.firstMove = false;
        draggedPiece.old_row = start_row;
        draggedPiece.old_col = start_col;
        draggedPiece.row = end_row;
        draggedPiece.col = end_col;
        draggedPiece.movesMade++;
        return true;
    }
    
    //black pawn
    if(draggedElement.id.includes("black_pawn")){
        let i = parseInt(draggedElement.getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
        let t = black_pawns[i].firstMove ? -1 : 0;
        let diag = captureOpportunity ? 1 : 0;
        let possibleEnPassantPawn = board[(end_row+1)*cols + end_col];
        if((end_row <= start_row) && (end_row >= start_row - 1 + t) && (end_col >= (start_col - diag)) && (end_col <= (start_col + diag)))
            {
                if(captureOpportunity && end_col === start_col)
                    return false;
                draggedPiece = black_pawns[i];
                
            }
        else if(!captureOpportunity && possibleEnPassantPawn != 0 && possibleEnPassantPawn.id.includes("white_pawn") 
            && possibleEnPassantPawn.movesMade === 1 && end_row === 2 && (end_row-start_row) === -1){
            possibleEnPassantPawn.captured = true;
            board[(end_row+1)*cols + end_col] = 0;
            pieceOffSquare(end_row+1, end_col);
            draggedPiece = black_pawns[i];
            enPassantPlayed = true;
        }
        else return false;
        draggedPiece.firstMove = false;
        draggedPiece.old_row = start_row;
        draggedPiece.old_col = start_col;
        draggedPiece.row = end_row;
        draggedPiece.col = end_col;
        draggedPiece.movesMade++;
        return true;
            
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
                draggedPiece.movesMade++;
                return true;
            }
        else return false;
    }

    //kings
    if(draggedElement.id.includes("king")){
        // let rook_index = parseInt(castle.getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
        //rook which with I want to castle
        if(draggedElement.id.includes("white")){
            draggedPiece = white_king;
        }
        else{
            draggedPiece = black_king;
        }
        if((end_row >= start_row - 1) && (end_row <= start_row + 1)
            && (end_col >= start_col - 1) && (end_col <= end_col + 1)){
                draggedPiece.old_row = start_row;
                draggedPiece.old_col = start_col;
                draggedPiece.row = end_row;
                draggedPiece.col = end_col;
                draggedPiece.firstMove = false;
                draggedPiece.movesMade++;
                return true;
        }
        else if ((draggedPiece.firstMove == true && castlignRook.firstMove == true)) {
            if(((draggedPiece.col > castlignRook.col) && ((maxDist(draggedPiece.row, draggedPiece.col, "r")+1) === Math.abs(draggedPiece.col - castlignRook.col) )) //if the king is right of the rook
                || ((draggedPiece.col < castlignRook.col) && ((maxDist(draggedPiece.row, draggedPiece.col, "l")+1) === Math.abs(castlignRook.col - draggedPiece.col))) //if the king is left of the rook
            ){
                draggedPiece.old_row = start_row;
                draggedPiece.old_col = start_col;
                draggedPiece.old_row = end_row;
                draggedPiece.old_col = end_col;
                castlignRook.old_row = castlignRook.row;
                castlignRook.old_col = castlignRook.col;
                castlignRook.row = start_row;
                castlignRook.col = start_col;
                draggedPiece.firstMove = false;
                castlignRook.firstMove = false;
                draggedPiece.movesMade++;
                return true;
            }
            else return false;
        } 
        else return false;
    }
    
    
    //rooks and queen straight movement
    if(draggedElement.id.includes("rook") || draggedElement.id.includes("queen")){
       if(end_col === start_col && end_row === start_row) return false;
        if(end_col === start_col){
            if((end_row <= (start_row + maxDist(start_row, start_col, "u"))) && (end_row >= (start_row - maxDist(start_row, start_col, "d")))){
                if(draggedElement.id.includes("white")){
                    if(draggedElement.id.includes("rook"))
                        draggedPiece = white_rooks[i];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(draggedElement.id.includes("rook"))
                        draggedPiece = black_rooks[i];
                    else
                        draggedPiece = black_queen;
                }
                draggedPiece.old_row = start_row;
                draggedPiece.old_col = start_col;
                draggedPiece.row = end_row;
                draggedPiece.col = end_col;
                draggedPiece.firstMove = false;
                draggedPiece.movesMade++;
                return true;
            }
            return false;
       }
       if(end_row === start_row){
            if((end_col <= (start_col + maxDist(start_row, start_col, "l"))) && (end_col >= (start_col - maxDist(start_row, start_col, "r")))){
                if(draggedElement.id.includes("white")){
                    if(draggedElement.id.includes("rook"))
                        draggedPiece = white_rooks[i];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(draggedElement.id.includes("rook"))
                        draggedPiece = black_rooks[i];
                    else
                        draggedPiece = black_queen;
                }
                draggedPiece.old_row = start_row;
                draggedPiece.old_col = start_col;
                draggedPiece.row = end_row;
                draggedPiece.col = end_col;
                draggedPiece.firstMove = false;
                draggedPiece.movesMade++;
                return true;
            }
            return false;
       }
    }

    if(draggedElement.id.includes("bishop") || draggedElement.id.includes("queen")){
        let index = parseInt(draggedElement.getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
        let slope = Math.abs(end_row - start_row)/Math.abs(end_col - start_col);
        let distance = 0;
        let possibleMove = false;
        

        if(end_row > start_row && end_col > start_col && slope === 1){
            let i = start_row;
            let j = start_col;
            while(end_row != i && end_col != j) {
                distance++;
                i++;
                j++;
            }
            if(distance <= maxDistDiag(start_row, start_col, "nw") ){
                possibleMove = true;
                if(draggedElement.id.includes("white")){
                    if(draggedElement.id.includes("bishop"))
                        draggedPiece = white_bishops[index];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(draggedElement.id.includes("bishop"))
                        draggedPiece = black_bishops[index];
                    else
                        draggedPiece = black_queen;
                }
            }
            else return false;
            
        }
        else if(end_row > start_row && end_col < start_col && slope === 1){
            let i = start_row;
            let j = start_col;
            while(end_row != i && end_col != j) {
                distance++;
                i++;
                j--;
            }
            if(distance <= maxDistDiag(start_row, start_col, "ne") ){
                possibleMove = true;
                if(draggedElement.id.includes("white")){
                    if(draggedElement.id.includes("bishop"))
                        draggedPiece = white_bishops[index];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(draggedElement.id.includes("bishop"))
                        draggedPiece = black_bishops[index];
                    else
                        draggedPiece = black_queen;
                }
            }
            else return false;
        }
        else if(end_row < start_row && end_col > start_col && slope === 1){
            let i = start_row;
            let j = start_col;
            while(end_row != i && end_col != j) {
                distance++;
                i--;
                j++;
            }
            if(distance <= maxDistDiag(start_row, start_col, "sw") ){
                possibleMove = true;
                if(draggedElement.id.includes("white")){
                    if(draggedElement.id.includes("bishop"))
                        draggedPiece = white_bishops[index];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(draggedElement.id.includes("bishop"))
                        draggedPiece = black_bishops[index];
                    else
                        draggedPiece = black_queen;
                }
            }
            else return false;
        }
        else if(end_row < start_row && end_col < start_col && slope === 1){
            let i = start_row;
            let j = start_col;
            while(end_row != i && end_col != j) {
                distance++;
                i--;
                j--;
            }
            if(distance <= maxDistDiag(start_row, start_col, "se") ){
                possibleMove = true;
                if(draggedElement.id.includes("white")){
                    if(draggedElement.id.includes("bishop"))
                        draggedPiece = white_bishops[index];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(draggedElement.id.includes("bishop"))
                        draggedPiece = black_bishops[index];
                    else
                        draggedPiece = black_queen;
                }
            }
            else return false;
        }
        else {
            return false;
        }
        draggedPiece.old_row = start_row;
        draggedPiece.old_col = start_col;
        draggedPiece.row = end_row;
        draggedPiece.col = end_col;
        draggedPiece.movesMade++;
        return true;
    }

}

// deletes a piece from its square html wise
function pieceOffSquare(row, col) {
    let squareNumber = row*8 + col;
    let square = document.getElementById(squareNumber+'');
    let divPiece = square.firstElementChild;
    divPiece.remove();
}

function checkCheck() {

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
                else{
                    if(board[s_row * cols + j].color != board[s_row * cols + s_col].color){
                        k++;
                    }
                    break;
                }
            }
            return k;
        case "r":   //calculate the right distance on the same row
            //row remains the same
            for(let j = s_col-1; j >= 0; j--){
                if(board[s_row * cols + j] == 0)
                    k++;
                else{
                    if(board[s_row * cols + j].color != board[s_row * cols + s_col].color)
                        k++;
                    break;
                }       
            }
            return k;

        case "u":   //calculate the up distance on the same col
            //col remains the same
            for(let i = s_row+1; i < rows; i++){
                if(board[i * cols + s_col] == 0){
                    k++;
                }
                else{
                    if(board[i * cols + s_col].color != board[s_row * cols + s_col].color){
                        k++;
                    }
                    break;
                }
            }
            return k;

        case "d":   //calculate the down distance on the same col
            //col remains the same
            for(let i = s_row-1; i >= 0; i--){ //DEBUG
                if(board[i * cols + s_col] == 0)
                    k++;
                else{
                    if(board[i * cols + s_col].color != board[s_row * cols + s_col].color)
                        k++;
                    break;
                }
            }
            return k;
        
    }
}

function maxDistDiag(s_row, s_col, c){
    let k = 0;
    let i;
    let j;
    switch (c) {
        case "nw":   //calculate the north west distance on the same diagonal
            i = s_row+1;
            j = s_col+1;
            while(i < 8 && j < 8){
                if(board[i * cols + j] == 0)
                    k++;
                else{
                    if(board[i * cols + j].color != board[s_row * cols + s_col].color){
                        k++;
                    }
                    break;
                }
                i++;
                j++;
            }
            return k;
        case "ne":   //calculate the north est distance on the same diagonal
            i = s_row+1;
            j = s_col-1;
            while(i < 8 && j >= 0){
                if(board[i * cols + j] == 0)
                    k++;
                else{
                    if(board[i * cols + j].color != board[s_row * cols + s_col].color){
                        k++;
                    }
                    break;
                }
                i++;
                j--;
            }
            return k;

        case "se":   //calculate the south est distance on the same diagonal
            i = s_row-1;
            j = s_col-1;
            while(i >= 0 && j >= 0){
                if(board[i * cols + j] == 0)
                    k++;
                else{
                    if(board[i * cols + j].color != board[s_row * cols + s_col].color){
                        k++;
                    }
                    break;
                }
                i--;
                j--;
            }
            return k;

        case "sw":   //calculate the south est distance on the same diagonal
            i = s_row-1;
            j = s_col+1;
            while(i >= 0 && j < 8){
                if(board[i * cols + j] == 0)
                    k++;
                else{
                    if(board[i * cols + j].color != board[s_row * cols + s_col].color){
                        k++;
                    }
                    break;
                }
                i--;
                j++;
            }
            return k;
    }
}


function printBoard(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            console.log(board[i*cols + j].id);
        }
        console.log("\n");
    }
}

//gets the html div element that rappresents the piece and returns the js object
function divToPiece (element) {
    let piece;
    let id = element.getAttribute('id');
    let index = parseInt(id.slice(-1)); //get the last character of the id and convert it to string; 
    console.log()
    switch (id) {
        case "white_king":
            piece = white_king;
            return piece;
        case "white_queen":
            piece = white_queen;
            return piece;
        case "black_king":
            piece = black_king;
            return piece;
        case "black_queen":
            piece = black_queen;
            return piece;
    }
    id = id.slice(0, -1); //all pieces without an array are coverd, it means the last character is the index so 
                          //i want the string without the last character
    switch (id) {
        case "white_pawn":
            piece = white_pawns[index];
            break;
    
        case "white_bishop":
            piece = white_bishops[index];
            break;
    
        case "white_knight":
            piece = white_knights[index];
            break;
    
        case "white_rook":
            piece = white_rooks[index];
            break;

        case "black_pawn":
            piece = black_pawns[index];
            break;
    
        case "black_bishop":
            piece = black_bishops[index];
            break;
    
        case "black_knight":
            piece = black_knights[index];
            break;
    
        case "black_rook":
            piece = black_rooks[index];
            break;
    
        default:
            piece = 0;
            break;
    }
    return piece;
}
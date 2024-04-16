


/**
 * @brief is called after the DOM is loaded, calls the function to get the game started
 */
function build () {
    buildBoard();
    init_drag();
    updateMessages();
}

/**
 * @brief builds the board html wise inserting all the pieces img in the starting position
 */
function buildBoard() {
    const board = document.getElementById("board");
    let count = 63;
    for(let i = rows-1; i >= 0; i--) {
        for(let j = cols-1; j >= 0; j--){
            const square = document.createElement("div");
            square.innerHTML = pieces[count];
            // let number = document.createElement('div');
            // number.innerHTML = count+'';
            // number.classList.add("number");
            // square.appendChild(number);
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

let destinationSquare;
let startPositionId;
let draggedElement;
let draggedPiece;

function dragStart (e) {
    startPositionId = e.target.parentNode.getAttribute('id');   //square id
    draggedElement = e.target;
    let piece = divToPiece(draggedElement);
    selectLandingSquares(piece);
}

function dragOver (e) {
    e.preventDefault();
}

//makes the move
/**
 * @brief if legal, makes the move html wise,  calls update board, and calls update messages and checkMate 
 * @param {*} e is the dragged element
 * @returns 
 */
function dragDrop (e) {
    removeSelectedSquares();
    let start_index = parseInt(startPositionId);
    let start_row = Math.floor(start_index/rows);   
    let start_col = start_index%rows;
    let id = draggedElement.getAttribute('id');
    let moveMade;
    let piece; // is the piece that is being moved
    let castlignRook;
    e.stopPropagation();
    moveMade = false;
    if((white_turn && draggedElement.id.includes("white"))
        || (black_turn && draggedElement.id.includes("black"))){
        // if true -> the target square is empty
        if(e.target.classList.contains("square"))
        {
            destinationSquare = e.target;
            piece = divToPiece(draggedElement);
            if(!moveWithCheck(destinationSquare, piece, false)) return;
            moveMade = validate_move(destinationSquare, start_row, start_col, id, true, false);
            // if(moveMade && ((piece.row == 7 && piece.color == "white") || (piece.row == 0 && piece.color == "black"))){
            //     promotion(piece);
            // }
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
            destinationSquare = e.target.parentNode;
            piece = divToPiece(draggedElement);
            if(!moveWithCheck(destinationSquare, piece, true)) return;
            moveMade = validate_move(destinationSquare, start_row, start_col, id, true, true);
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
            castlignRook = divToPiece(e.target);
            destinationSquare = e.target.parentNode;
            piece = divToPiece(draggedElement);
            if(!moveWithCheck(destinationSquare, piece, true)) return;
            moveMade = validate_move(destinationSquare, start_row, start_col, id, true ,false);
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
        updateBoard(castlignRook);
        checkCheck();
        switchTurn();
        updateMessages();   //qui controlliamo lo scacco matto
        boardIsConsistent();//used for debug
    }
    
}

//it simulates a move and then it tells if the move will put my self in check
/**
 * @brief it simulates a move and then it tells if the move will put my self in check 
 * @param {html element} destinationSquare rappresents the html square to which I want to move
 * @param {piece} piece object of class piece 
 * @param {*} pawnCaptureOpportunity 
 * @returns boolean indicating if the move that is being evaluated will violate Check Logic -> putting my self in check or moving a piece while in check that doesn't get me out of check
 */
function moveWithCheck (destinationSquare, piece, pawnCaptureOpportunity) {

    let end_index = parseInt(destinationSquare.getAttribute('id'));
    let end_row = Math.floor(end_index/rows);
    let end_col = end_index%rows;
    let castlingMove = false;
    let support_piece;
    let support_row;
    let support_col;
    let support_rook_col;

    if(piece.captured) return false;
    if(validate_move(destinationSquare, piece.row, piece.col, piece.id, false, false)){ //valido la mossa
        let castlingRook = false;
        if(castling(destinationSquare, piece)){
            castlingMove = true;
            let destinationPieceElement = destinationSquare.firstElementChild;
            castlingRook = divToPiece(destinationPieceElement);
            support_col = piece.old_col;
            support_rook_col = castlingRook.old_col;
            piece.old_col = piece.col;
            castlingRook.old_col = castlingRook.col;
            if(end_col > piece.col){
                piece.col = end_col-2;
                castlingRook.col = end_col-3;
            }
            else {
                piece.col = end_col+1;
                castlingRook.col = end_col+2;
            }
            board[piece.row*cols+piece.col] = piece;
            board[castlingRook.row*cols+castlingRook.col] = castlingRook;
            board[piece.old_row*cols+piece.old_col] = 0;
            board[castlingRook.old_row*cols+castlingRook.old_col] = 0;
        }
        else{
            support_piece = board[end_row*cols+end_col];

            if(support_piece != 0)
                support_piece.captured = true;
            
            //if nomaml move
            support_row = piece.row;
            support_col = piece.col;
            piece.row = end_row;
            piece.col = end_col;
            board[support_row*cols+support_col] = 0;
            board[end_row*cols+end_col] = piece;
        }
        
        //is I'm castling I have to simulate a castle move which is more complicated
        
        checkCheck();
        
        if(castlingMove){
            board[piece.row*cols+piece.col] = 0;
            board[castlingRook.row*cols+castlingRook.col] = 0;
            piece.old_col = support_col;
            castlingRook.old_col = support_rook_col;
            board[piece.old_row*cols+piece.old_col] = piece;
            board[castlingRook.old_row*cols + castlingRook.old_col] = castlingRook;
            if(end_col > piece.old_col){
                piece.col = end_col-4;
                castlingRook.col = end_col;
            }
            else {
                piece.col = end_col+3;
                castlingRook.col = end_col;
            }
        }

        else {
            if(support_piece != 0)
                support_piece.captured = false;
            board[end_row*cols+end_col] = support_piece;
            piece.row = support_row;
            piece.col = support_col;
            board[support_row*cols+support_col] = piece;
        }
        

        if((white_turn && white_in_check) || (black_turn && black_in_check)) {
            // console.log("questa mossa viola lo scacco logic");
            // console.log(piece.id + " to row: " + end_row + " col: " + end_col);
            return false;
        }
        //simulo la mossa e chiamo checkchek
        //se sono ancora in scacco return
        return true;
    }
    else {
        // console.log("questa mossa non è proprio legale");
        // console.log(piece.id + " to row: " + end_row + " col: " + end_col);
        return false;
    }
}

/**
 * 
 * @param {html element} destinationSquare the square where I'm trying to move
 * @param {piece} piece the piece I'm trying to move
 * @returns returns true if the last legal move that's been valuted is a castling move, returns false otherways
 */

function castling (destinationSquare, piece){
    if(!destinationSquare.hasChildNodes())
        return false;
    let destinationPieceElement = destinationSquare.firstElementChild;
    let destinationPiece = divToPiece(destinationPieceElement);
    if(piece.id.includes("king") && destinationPiece.id.includes("rook")){
        if(piece.color == destinationPiece.color)
            return true;
        else return false;
    }
    return false;

}

/**
 * 
 * @returns true if the player that is in check is in checkMate, false otherways
 */
function checkMate () {
    let my_pieces;
    if(white_in_check){  //is there a move that gets me out of check?
        my_pieces = white_pieces;
    }
    else if(black_in_check){    //is there a move that gets me out of check?
        my_pieces = black_pieces;
    }
    else return false;

    let temp_white_check = white_in_check;
    let temp_black_check = black_in_check;
    for(let i = 0; i < 16; i++){
        if(my_pieces[i].captured)
            i++;
        for(let j = 0; j < 64; j++){
            let square = document.getElementById(j+'');
            
            if(moveWithCheck(square, my_pieces[i], true)){
                if((white_in_check != temp_white_check) || (black_in_check != temp_black_check))
                {
                    white_in_check = temp_white_check;
                    black_in_check = temp_black_check;
                    return false;
                }
            }
            
        }
    }
    return true;

}

/**
 * @brief switchs turn between white and black, and it dissables the possibility of an EnPassant move of the player that just moved
 */
function switchTurn(){
    if(white_turn){
        updateEnPassantAttribute(0);
        white_turn = false;
        black_turn = true;
    }
    else{
        updateEnPassantAttribute(1);
        white_turn = true;
        black_turn = false;
    }
}

/**
 * @brief updates the messages to the player such as who's turn it is, if someone in in check, or if the game is over
 */
function updateMessages () {
    let turn = document.getElementById("turn");
    let check = document.getElementById("check");
    let score = document.getElementById("score");
    let checkmate = document.getElementById("checkMate");
    if(white_turn)
        turn.innerHTML = "white to play";
    else
        turn.innerHTML = "black to play";
    if(white_in_check)
        check.innerHTML = "white is in check";
    else if (black_in_check)
        check.innerHTML = "black is in check";
    else 
        check.innerHTML = "";
    let score_value = 0;
    for(let i = 0; i < 16; i++){
        if(white_pieces[i].captured)
            score_value += white_pieces[i].value;
        if(black_pieces[i].captured)
            score_value += black_pieces[i].value;
    }
    if(score_value < 0)
        score.innerHTML = "white is winning by: " + (-score_value);
    else if(score_value > 0)
        score.innerHTML = "black is winning by: " + (score_value);
    else
        score.innerHTML = "";
    let t = checkMate();
    if(t){
        if(white_in_check)
            checkmate.innerHTML = "the game is OVER BLACK WINS";
        else if(black_in_check)
            checkmate.innerHTML = "the game is OVER WHITE WINS";
    }
    else
        checkmate.innerHTML = "";

}

/**
 * @param {html element} dest_element is the html square to which I want to move my piece
 * @param {int} start_row is the start row of the piece
 * @param {int} start_col is the start col of the piece
 * @param {string} id is the id of the piece I want to move
 * @param {boolean} makingMove true if I want to actually make a move, false if I want to know if a move is legal (not considering checks)
 * @param {boolean} captureOpportunity true if I'm moving a pawn on a different color piece, false otherways
 * @param {piece} castlignRook the rook I'm trying to castle with
 * @returns It returns true if the move I'm trying to make follows the piece moving rules (it doesn't consider checks)
 */
function validate_move (dest_element, start_row, start_col, id, makingMove, captureOpportunity) {
    //making move is a boolean that if true indicates that I actually want to make the move
    //if is false it meas I'm just verifing if the move would be legal
    let end_index = parseInt(dest_element.getAttribute('id'));
    let end_row = Math.floor(end_index/rows);
    let end_col = end_index%rows;
    let i = parseInt(id.slice(-1)); //get the last character of the id and convert it to string
    
    // boardIsConsistent();
    // console.log("dentro validate_move");
    // console.log("pezzo è : " + id + "to " + end_row + " " + end_col);
    //white pawn
    if(id.includes("white_pawn")){
        let t = white_pawns[i].firstMove ? 1 : 0;
        let diag = (board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes("black")) ? 1 : 0;
        t = diag ? 0 : t;
        let possibleEnPassantPawn;
        
        // console.log("test");
        if(end_row > 0 && board[(end_row-1)*cols+end_col] != 0 && board[(end_row-1)*cols + end_col].id.includes("black_pawn") && end_row > 0)
            possibleEnPassantPawn = board[(end_row-1)*cols + end_col];
        else
            possibleEnPassantPawn = 0;

        if(board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes("white")) return false;
        if((end_row >= start_row) && (end_row <= start_row + 1 + t) && (Math.abs(end_row-start_row) <= maxDist(start_row, start_col, "u")) && (end_col >= (start_col - diag)) && (end_col <= (start_col + diag)))
            {
                if(diag && end_col === start_col)
                    return false;
                if(diag && end_row === start_row) return false;
                draggedPiece = white_pawns[i];
                
            }
        else if(!captureOpportunity && possibleEnPassantPawn != 0 && possibleEnPassantPawn.enPassantCapturable && possibleEnPassantPawn.id.includes("black_pawn") && 
            possibleEnPassantPawn.movesMade === 1 && end_row === 5 && (end_row-start_row) === 1){
            draggedPiece = white_pawns[i];
            if(makingMove){
                possibleEnPassantPawn.captured = true;
                board[(end_row-1)*cols + end_col] = 0;
                pieceOffSquare(end_row-1, end_col);
                enPassantPlayed = true;
            }
        }
        else 
            return false;
        if(makingMove){
            draggedPiece.firstMove = false;
            draggedPiece.old_row = start_row;
            draggedPiece.old_col = start_col;
            draggedPiece.row = end_row;
            draggedPiece.col = end_col;
            draggedPiece.movesMade++;
            if(Math.abs(end_row-start_row) == 2){
                draggedPiece.enPassantCapturable = true;
            }
        }
        return true;
    }
    
    //black pawn
    if(id.includes("black_pawn")){
        //let i = parseInt(getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
        let t = black_pawns[i].firstMove ? -1 : 0;
        let diag = (board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes("white")) ? 1 : 0;
        t = diag ? 0 : t;
        let possibleEnPassantPawn;
        // console.log("le cordinate sono: " + end_row + " " + end_col);
        // console.log(board[(end_row+1)*cols+end_col].id);
        if(end_row < rows-1 && board[(end_row+1)*cols+end_col] != 0 && board[(end_row+1)*cols+end_col].id.includes("white_pawn") && end_row > 0){
            // console.log(board[(end_row+1)*cols+end_col].id);
            // console.log("sono entrato");
            possibleEnPassantPawn = board[(end_row-1)*cols + end_col];
        }
        else
            possibleEnPassantPawn = 0;
        if(board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes("black")) return false;
        if((end_row <= start_row) && (end_row >= start_row - 1 + t) && (Math.abs(end_row-start_row) <= maxDist(start_row, start_col, "d")) && (end_col >= (start_col - diag)) && (end_col <= (start_col + diag)))
            {
                if(diag && end_col === start_col)
                    return false;
                if(diag && end_row === start_row) return false;
                draggedPiece = black_pawns[i];
                
            }
        else if(!captureOpportunity && possibleEnPassantPawn != 0  && possibleEnPassantPawn.enPassantCapturable && possibleEnPassantPawn.id.includes("white_pawn") 
            && possibleEnPassantPawn.movesMade === 1 && end_row === 2 && (end_row-start_row) === -1){
            draggedPiece = black_pawns[i];
            if(makingMove){
                possibleEnPassantPawn.captured = true;
                board[(end_row+1)*cols + end_col] = 0;
                pieceOffSquare(end_row+1, end_col);
                enPassantPlayed = true;
            }
        }
        else return false;
        if(makingMove){
            draggedPiece.firstMove = false;
            draggedPiece.old_row = start_row;
            draggedPiece.old_col = start_col;
            draggedPiece.row = end_row;
            draggedPiece.col = end_col;
            draggedPiece.movesMade++;
            if(Math.abs(end_row-start_row) == 2){
                draggedPiece.enPassantCapturable = true;
            }
        }
        return true;
            
    }

    //knights
    if(id.includes("knight")){
        if(((end_row === start_row + 2) && ((end_col === start_col + 1) || (end_col === start_col - 1)))
            || ((end_row === start_row + 1) && ((end_col === start_col + 2) || (end_col === start_col - 2)))
            || ((end_row === start_row - 2) && ((end_col === start_col + 1) || (end_col === start_col - 1)))
            || ((end_row === start_row - 1) && ((end_col === start_col + 2) || (end_col === start_col - 2))))
            {
                if(id.includes("white")){
                    if(board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes("white")) return false;
                    draggedPiece = white_knights[i];
                    
                }
                if(id.includes("black")){
                    if(board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes("black")) return false;
                    draggedPiece = black_knights[i];
                }
                if(makingMove){
                    draggedPiece.firstMove = false;
                    draggedPiece.old_row = start_row;
                    draggedPiece.old_col = start_col;
                    draggedPiece.row = end_row;
                    draggedPiece.col = end_col;
                    draggedPiece.movesMade++;
                }
                return true;
            }
        else return false;
    }

    //kings
    if(id.includes("king")){
        // let rook_index = parseInt(castle.getAttribute('id').slice(-1)); //get the last character of the id and convert it to string
        //rook which with I want to castle
        if(id.includes("white")){
            draggedPiece = white_king;
        }
        else{
            draggedPiece = black_king;
        }

        let castlignRook = false;
        // console.log("sulla board c'è " + board[end_row*cols + end_col].id);
        if(board[end_row*cols + end_col] != 0 && board[end_row*cols + end_col].id.includes("rook") && board[end_row*cols + end_col].color == draggedPiece.color)
            castlignRook = board[end_row*cols + end_col];
        // console.log("la castlig rook è: " + castlignRook.id);

        if(((end_row >= start_row - 1) && (end_row <= start_row + 1))
            && ((end_col >= start_col - 1) && (end_col <= start_col + 1))){
                if(draggedPiece.id === white_king.id){
                    if(board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes("white") ) return false;
                }
                else if(draggedPiece.id === black_king.id){
                    if(board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes("black") ) return false;
                }
                if(makingMove){
                    draggedPiece.old_row = start_row;
                    draggedPiece.old_col = start_col;
                    draggedPiece.row = end_row;
                    draggedPiece.col = end_col;
                    draggedPiece.firstMove = false;
                    draggedPiece.movesMade++;
                }
                return true;
        }
        
        
        else if ((castlignRook != false && draggedPiece.firstMove == true && castlignRook.firstMove == true)) {
            if(((draggedPiece.col > castlignRook.col) && ((maxDist(draggedPiece.row, draggedPiece.col, "r")+1) === Math.abs(draggedPiece.col - castlignRook.col) )) //if the king is right of the rook
                || ((draggedPiece.col < castlignRook.col) && ((maxDist(draggedPiece.row, draggedPiece.col, "l")+1) === Math.abs(castlignRook.col - draggedPiece.col))) //if the king is left of the rook
            ){
                if(makingMove){
                    if(start_col > end_col){
                        //draggedPiece.old_row = start_row;
                        draggedPiece.old_col = start_col;
                        //draggedPiece.row = end_row;
                        draggedPiece.col = start_col-2;
                        //castlignRook.old_row = end_row;
                        castlignRook.old_col = end_col;
                        castlignRook.col = end_col+2;
                    }
                    else {
                        //draggedPiece.old_row = start_row;
                        draggedPiece.old_col = start_col;
                        //draggedPiece.row = end_row;
                        draggedPiece.col = start_col+2;
                        //castlignRook.old_row = end_row;
                        castlignRook.old_col = end_col;
                        castlignRook.col = end_col-3;
                    }
                    draggedPiece.firstMove = false;
                    castlignRook.firstMove = false;
                    draggedPiece.movesMade++;
                }
                // else
                    // castlignRook = false;
                return true;
            }
            else{
                // castlignRook = false;
                return false;
            } 
        } 
        else{
            // castlignRook = false;
            return false;
        } 
    }
    
    
    //rooks and queen straight movement
    if(id.includes("rook") || id.includes("queen")){
       if(end_col === start_col && end_row === start_row) return false;
        if(end_col === start_col){
            if((end_row <= (start_row + maxDist(start_row, start_col, "u"))) && (end_row >= (start_row - maxDist(start_row, start_col, "d")))){
                if(id.includes("white")){
                    if(id.includes("rook"))
                        draggedPiece = white_rooks[i];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(id.includes("rook"))
                        draggedPiece = black_rooks[i];
                    else
                        draggedPiece = black_queen;
                }
                if(makingMove){
                    draggedPiece.old_row = start_row;
                    draggedPiece.old_col = start_col;
                    draggedPiece.row = end_row;
                    draggedPiece.col = end_col;
                    draggedPiece.firstMove = false;
                    draggedPiece.movesMade++;
                }
                return true;
            }
            return false;
       }
       if(end_row === start_row){
            if((end_col <= (start_col + maxDist(start_row, start_col, "l"))) && (end_col >= (start_col - maxDist(start_row, start_col, "r")))){
                if(id.includes("white")){
                    if(id.includes("rook"))
                        draggedPiece = white_rooks[i];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(id.includes("rook"))
                        draggedPiece = black_rooks[i];
                    else
                        draggedPiece = black_queen;
                }
                if(makingMove){
                    draggedPiece.old_row = start_row;
                    draggedPiece.old_col = start_col;
                    draggedPiece.row = end_row;
                    draggedPiece.col = end_col;
                    draggedPiece.firstMove = false;
                    draggedPiece.movesMade++;
                }
                return true;
            }
            return false;
       }
    }

    if(id.includes("bishop") || id.includes("queen")){
        let index = i; //get the last character of the id and convert it to string
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
                if(id.includes("white")){
                    if(id.includes("bishop"))
                        draggedPiece = white_bishops[index];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(id.includes("bishop"))
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
                if(id.includes("white")){
                    if(id.includes("bishop"))
                        draggedPiece = white_bishops[index];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(id.includes("bishop"))
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
                if(id.includes("white")){
                    if(id.includes("bishop"))
                        draggedPiece = white_bishops[index];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(id.includes("bishop"))
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
                if(id.includes("white")){
                    if(id.includes("bishop"))
                        draggedPiece = white_bishops[index];
                    else
                        draggedPiece = white_queen;
                }
                else{
                    if(id.includes("bishop"))
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
        if(makingMove){
            draggedPiece.old_row = start_row;
            draggedPiece.old_col = start_col;
            draggedPiece.row = end_row;
            draggedPiece.col = end_col;
            draggedPiece.movesMade++;
        }
        return true;
    }
}

//highlights all the possible squares that the piece, that's being dragged, can move to
/**
 * @brief highlights all the possible squares that the piece, that's being dragged, can move to accounting for checks
 * @param {piece} piece piece I've started moving
 * 
 */
function selectLandingSquares(piece) {
    if((white_turn && piece.color != "white") || (black_turn && piece.color != "black")) return;
    for(let i = 0; i < 64; i++){
        let square = document.getElementById(i+'');
        let end_index = parseInt(square.getAttribute('id'));
        if(!piece.captured){
            if(moveWithCheck(square, piece, false)){
                if(square.classList.contains("light"))
                    square.classList.add("selectedLight");
                else
                    square.classList.add("selectedDark");
            }
        }
    }
}


/**
 * @brief it loops over every square and removes the selectedLight or selectedDark css class
 */
function removeSelectedSquares(){
    for(let i = 0; i < 64; i++){
        let square = document.getElementById(i+'');
        if(square.classList.contains("selectedLight"))
            square.classList.remove("selectedLight");
        else if(square.classList.contains("selectedDark"))
            square.classList.remove("selectedDark");
    }
}

// 
/**
 * @brief deletes a piece from its square html wise
 * @param {int} row 
 * @param {int} col 
 */
function pieceOffSquare(row, col) {
    let squareNumber = row*8 + col;
    let square = document.getElementById(squareNumber+'');
    let divPiece = square.firstElementChild;
    divPiece.remove();
}

//
/**
 * @brief calculates every legal (not considering checks) move for every non-captured piece and stores it in an array
 */
function allPossibleMoves() {
    for(let index = 0; index < 16; index++){
        //memory leak?
        white_pieces[index].possibleMoves = [];
        black_pieces[index].possibleMoves = [];
        for(let i = 0; i < 64; i++){
            let square = document.getElementById(i+'');
            let end_index = parseInt(square.getAttribute('id'));
            let end_row = Math.floor(end_index/rows);
            let end_col = end_index%rows;
            let r = white_pieces[index].row;
            let c = white_pieces[index].col;
            const makingMove = false;
            const pawnCaptureOpportunity = false;
            if(!white_pieces[index].captured){
                if(white_pieces[index].id.includes("pawn"))
                    if(board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes("black"))
                        if(validate_move(square, r, c, white_pieces[index].id, makingMove, true))
                            white_pieces[index].possibleMoves.push(i);
                if(validate_move(square, r, c, white_pieces[index].id, makingMove, pawnCaptureOpportunity)){
                    white_pieces[index].possibleMoves.push(i);
                }
            }
            r = black_pieces[index].row;
            c = black_pieces[index].col;
            if(!black_pieces[index].captured){
                if(black_pieces[index].id.includes("pawn"))
                    if(board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes("white"))
                        if(validate_move(square, r, c, black_pieces[index].id, makingMove, true))
                            black_pieces[index].possibleMoves.push(i);
                if(validate_move(square, r, c, black_pieces[index].id, makingMove, pawnCaptureOpportunity)){
                    black_pieces[index].possibleMoves.push(i);
                }
            }   
        }
    }

}



/**
 * @brief is called before making the actual move but it verifies if that move would put someone in check
 * @returns 
 */
function checkCheck() {
    allPossibleMoves();

    let my_king_position;
    let op_king_position;
    let my_pieces;
    let op_pieces;
    let opponent_in_check = false;
    let me_in_check = false;
    if(white_turn){
        my_king_position = white_king.row * rows + white_king.col;
        op_king_position = black_king.row * rows + black_king.col;
        my_pieces = white_pieces;
        op_pieces = black_pieces;
    }
    else {
        my_king_position = black_king.row * rows + black_king.col;
        op_king_position = white_king.row * rows + white_king.col;
        my_pieces = black_pieces;
        op_pieces = white_pieces;
    }
    // if(draggedElement.id.includes("king"))
    //     king_position = parseInt(destinationSquare.getAttribute('id'));
   
    for(let i = 0; i < 16; i++){
         // I'm verifing if the move I'm goint to make is putting the opponet in check
        for(let j = 0; j < my_pieces[i].possibleMoves.length; j++){
            if (op_king_position === my_pieces[i].possibleMoves[j]){
                if(white_turn)
                    black_in_check = true;
                else   
                    white_in_check = true;
                //console.log
                opponent_in_check = true;
                break;
            }
        }
         // I'm verifing if the move I'm goint to make puts me out of check
        for(let j = 0; j < op_pieces[i].possibleMoves.length; j++){
            if (my_king_position === op_pieces[i].possibleMoves[j]){
                if(white_turn)
                    white_in_check = true;
                else   
                    black_in_check = true;
                me_in_check = true;
                break;
            }
        }
    }
    if(white_turn){
        if(!opponent_in_check)
            black_in_check = false;
        if(!me_in_check)
            white_in_check = false;
    }
    else{
        if(!opponent_in_check)
            white_in_check = false;
        if(!me_in_check)
            black_in_check = false;
    }
    return false;
    
}


/**
 * @brief updates the board considering the global variable draggedPiece as the piece that moved
 * @param castlignRook is the rook that I'm castling with, if undefined it means that the last move wasn't a castle
 */
function updateBoard (castlignRook) {

    board[draggedPiece.old_row * cols + draggedPiece.old_col] = 0;
    if(castlignRook){
        board[castlignRook.row*cols + (castlignRook.col)] = castlignRook;
        board[castlignRook.old_row*cols + (castlignRook.old_col)] = 0;
    }
    else{
        if(board[draggedPiece.row * cols + draggedPiece.col] != 0)
            board[draggedPiece.row * cols + draggedPiece.col].captured = true;
    }
    board[draggedPiece.row * cols + draggedPiece.col] = draggedPiece;
}


/**
 * 
 * @param {int} s_row starting row of the piece
 * @param {int} s_col starting col of the piece
 * @param {char} c "u" for up, "r" for right, "d" for down, "l" for left
 * @returns the max number of square between the cordinate of the piece and any other piece on a straight line in the specified direction
 */
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



/**
 * 
 * @param {int} s_row starting row of the piece
 * @param {int} s_col starting col of the piece
 * @param {char} c "nw" for north-west (top left), "ne" for north-east (top right), "se" for south-east (bottom left), "sw" for south-west (bottom right)
 * @returns the max number of square between the cordinate of the piece and any other piece, diagonally, in the specified direction
 */
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


/**
 * 
 * @param {html element} element html div element that rappresents a piece
 * @returns returns the js object of the class piece associated with that piece
 */
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


/**
 * @brief returns true if the piece board on which calculation are made is consistent with the html board if not it return false and prints the cordinates of the first square that is not consistent
 */
function boardIsConsistent () {
    for(let i = 0; i < rows; i++)
        for(let j = 0; j < cols; j++){
            const square = document.getElementById(i*cols+j+'');
            const piece = square.firstElementChild;
            if(piece == null && board[i*cols+j] == 0) continue;
            if((piece == null && board[i*cols+j] != 0) || (piece && board[i*cols+j] == 0) || (!piece.id.includes(board[i*cols+j].id)))
            {
                console.log("row " + i + '');
                console.log("col " + j + '');
                if(piece == null){
                    console.log("square html vuoto");
                    return false;
                }
                console.log("html element " + piece.getAttribute('id'));
                console.log("board element " + board[i*cols+j].id);
                return false;
            }
        }

    console.log("Board is consistent");
    return true;
}


/**
 * @brief prints the row and the col of the piece position on the board, it return true if it finds the piece, false otherways
 * @param {string} id is the Id of which I want to print the row and col
 */
function whereIsPiece(id){
    for(let i = 0; i < rows; i++)
        for(let j = 0; j < rows; j++){
            if(board[i*rows+j] != 0 && board[i*rows+j].id == id){
                console.log("the piece "+id+", is in row: "+i+" and col: "+j );
                return true;
            }
        }
    console.log("non ho trovato il pezzo");
    return false;
}
/**
 * @brief is called after a player plays a move, sets to false the opponent pawns enPassantCapturable attribute
 * @param {int} color 1 is white, 0 is black
 */
function updateEnPassantAttribute(color){
    if(color){
        for(let i = 0; i < 16; i++){
            if(white_pieces[i].captured)
                continue;
            else
                white_pieces[i].enPassantCapturable = false;
        }
    }
    else{
        for(let i = 0; i < 16; i++){
            if(black_pieces[i].captured)
                continue;
            else
                black_pieces[i].enPassantCapturable = false;
        }
    }
}


function promotion (piece) {
    let pieceString;
    while(pieceString == "queen" || pieceString == "knight"){
        pieceString = prompt("What piece do you want? [queen | knight]");
    }
    // if(pieceString == "queen"){
    //     if(piece.color == "white")
    //     {
    //         white_queen1 = piece("white_queen", 1);
    //         white_pieces.push(white_queen1);
    //     }
    

}
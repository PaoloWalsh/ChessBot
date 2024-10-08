//it simulates a move and then it tells if the move will put my self in check
/**
 * @brief it simulates a move and then it tells if the move will put my self in check 
 * @param {html element} destinationSquare rappresents the html square to which I want to move
 * @param {piece} piece object of class piece 
 * @param {*} pawnCaptureOpportunity 
 * @returns boolean indicating if the move that is being evaluated will violate Check Logic -> putting my self in check or moving a piece while in check that doesn't get me out of check
 */
function moveWithCheck (destinationSquare, piece, pawnCaptureOpportunity) {     //game-logic

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

function castling (destinationSquare, piece){   //game-logic
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
function checkMate () {     //game-logic
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
function switchTurn(){  //game-logic
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
 * @param {html element} dest_element is the html square to which I want to move my piece
 * @param {int} start_row is the start row of the piece
 * @param {int} start_col is the start col of the piece
 * @param {string} id is the id of the piece I want to move
 * @param {boolean} makingMove true if I want to actually make a move, false if I want to know if a move is legal (not considering checks)
 * @param {boolean} captureOpportunity true if I'm moving a pawn on a different color piece, false otherways
 * @param {piece} castlignRook the rook I'm trying to castle with
 * @returns It returns true if the move I'm trying to make follows the piece moving rules (it doesn't consider checks)
 */
function validate_move (dest_element, start_row, start_col, id, makingMove, captureOpportunity) {       //game-logic
    //making move is a boolean that if true indicates that I actually want to make the move
    //if is false it meas I'm just verifing if the move would be legal
    let end_index = parseInt(dest_element.getAttribute('id'));
    let end_row = Math.floor(end_index/rows);
    let end_col = end_index%rows;
    let i = parseInt(id.slice(-1)); //get the last character of the id and convert it to string
    // boardIsConsistent();

    //pawns
    if(id.includes('pawn')){
        let pawnColor = (id.includes('white')) ? 'white' : 'black';
        let opponentColor = (id.includes('white')) ? 'black' : 'white';
        let pawn = (pawnColor == 'white') ? white_pawns[i] : black_pawns[i];
        let firstMoveBoost = (pawn.firstMove) ? ((pawnColor == 'white') ? 1 : -1) : 0;
        let diag = (board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes(opponentColor)) ? 1 : 0;
        firstMoveBoost = diag ? 0 : firstMoveBoost; //se mi posso muovere in diagonale allora posso fare solo 1 casella in avanti e non due
        let enPassantPosition = (id.includes('white')) ? -1 : 1;
        let enPassantRow = (id.includes('white')) ? 5 : 2;  //riga su cui è possibile fare l'enPassant
        let possibleEnPassantPawn;

        let promotionRow = (id.includes('white')) ? 7 : 0;
        let promoting = false;

        if(Math.abs(end_col-start_col) >= 2) return false;
        
        //verifico se c'è un pedone che potrebbe essere mangiato con l'enpassant
        if(end_row > 0 && end_row < (rows-1) && board[(end_row+enPassantPosition)*cols+end_col] != 0 && board[(end_row+enPassantPosition)*cols + end_col].id.includes(opponentColor+"_pawn")){
            possibleEnPassantPawn = board[(end_row+enPassantPosition)*cols + end_col];
        }
        else
            possibleEnPassantPawn = 0;

        //verifico che non cerchi di mangiare un pezzo dello stesso colore
        if(board[end_row*cols+end_col] != 0 && board[end_row*cols+end_col].id.includes(pawnColor)){
            return false;
        } 

        let maxMovement = (pawnColor == 'white') ? (firstMoveBoost + 1) : (firstMoveBoost - 1);

        if( (((pawnColor == 'white') && (end_row >= start_row) && (end_row <= start_row + maxMovement)) 
            || ((pawnColor == 'black') && (end_row <= start_row) && (end_row >= start_row + maxMovement)))
         && (end_col >= (start_col - diag)) && (end_col <= (start_col + diag)))
        {
            let direction = (pawnColor == 'white') ? 'u': 'd';
            if((Math.abs(end_row-start_row) > maxDist(start_row, start_col, direction)) && !diag) 
                return false;
            if(diag && end_col === start_col)
                return false;
            if(diag && end_row === start_row) 
                return false;
            if(end_row === promotionRow)
                promoting = true;
            draggedPiece = pawn;
        }
        else if(!captureOpportunity && possibleEnPassantPawn != 0 && possibleEnPassantPawn.enPassantCapturable && possibleEnPassantPawn.id.includes(opponentColor+"_pawn") && 
            possibleEnPassantPawn.movesMade === 1 && end_row === enPassantRow && Math.abs(end_row-start_row) === 1){
            draggedPiece = pawn;
            if(makingMove){
                possibleEnPassantPawn.captured = true;
                board[(end_row+enPassantPosition)*cols + end_col] = 0;
                pieceOffSquare(end_row+enPassantPosition, end_col);
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
            if(promoting)
                handleDialog();
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
                        draggedPiece = white_queens[i];
                }
                else{
                    if(id.includes("rook"))
                        draggedPiece = black_rooks[i];
                    else
                        draggedPiece = black_queens[i];
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
                        draggedPiece = white_queens[i];
                }
                else{
                    if(id.includes("rook"))
                        draggedPiece = black_rooks[i];
                    else
                        draggedPiece = black_queens[i];
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
                        draggedPiece = white_queens[index];
                }
                else{
                    if(id.includes("bishop"))
                        draggedPiece = black_bishops[index];
                    else
                        draggedPiece = black_queens[index];
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
                        draggedPiece = white_queens[index];
                }
                else{
                    if(id.includes("bishop"))
                        draggedPiece = black_bishops[index];
                    else
                        draggedPiece = black_queens[index];
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
                        draggedPiece = white_queens[index];
                }
                else{
                    if(id.includes("bishop"))
                        draggedPiece = black_bishops[index];
                    else
                        draggedPiece = black_queens[index];
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
                        draggedPiece = white_queens[index];
                }
                else{
                    if(id.includes("bishop"))
                        draggedPiece = black_bishops[index];
                    else
                        draggedPiece = black_queens[index];
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

/**
 * @brief calculates every legal (not considering checks) move for every non-captured piece and stores it in an array
 */
function allPossibleMoves() {       //game-logic
    for(let index = 0; index < white_pieces.length; index++){
        white_pieces[index].possibleMoves = [];
        for(let i = 0; i < 64; i++){
            let square = document.getElementById(i+'');
            let r = white_pieces[index].row;
            let c = white_pieces[index].col;
            const makingMove = false;
            if(!white_pieces[index].captured){
                if(validate_move(square, r, c, white_pieces[index].id, makingMove)){
                    white_pieces[index].possibleMoves.push(i);
                }
            }
        }
    }

    for(let index = 0; index < black_pieces.length; index++){
        black_pieces[index].possibleMoves = [];
        for(let i = 0; i < 64; i++){
            let square = document.getElementById(i+'');
            const makingMove = false;
            r = black_pieces[index].row;
            c = black_pieces[index].col;
            if(!black_pieces[index].captured){
                if(validate_move(square, r, c, black_pieces[index].id, makingMove)){
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
function checkCheck() {     //game-logic
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
    // if(element.id.includes("king"))
    //     king_position = parseInt(destinationSquare.getAttribute('id'));
   
    for(let i = 0; i < my_pieces.length; i++){
         // I'm verifing if the move I'm goint to make is putting the opponet in check
        for(let j = 0; j < my_pieces[i].possibleMoves.length; j++){
            if (op_king_position === my_pieces[i].possibleMoves[j]){
                if(white_turn)
                    black_in_check = true;
                else   
                    white_in_check = true;
                // console.log()
                opponent_in_check = true;
                break;
            }
        }
    }

    // I'm verifing if the move I'm going to make puts me out of check
    for(let i = 0; i < op_pieces.length; i++){
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
function updateBoard (castlignRook) {       //game-logic

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
function maxDist(s_row, s_col, c){      //game-logic-util
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
            for(let i = s_row-1; i >= 0; i--){
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
function maxDistDiag(s_row, s_col, c){      //game-logic-util
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

/**
 * @brief is called after a player plays a move, sets to false the opponent pawns enPassantCapturable attribute
 * @param {int} color 1 is white, 0 is black
 */
function updateEnPassantAttribute(color){       //game-logic
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
/**
 * @brief simula una mossa e poi dice se la mossa mi autometterà in scacco. Chiama la funzione simulateMove 
 * e checkCheck per verificare lo stato degli scacchi
 * @param {html element} destinationSquare rappresenta lo square html a cui voglio spostare il pezzo
 * @param {piece} piece istanza della classe piece 
 * @returns un valore booleano che indica se la mossa che sta venendo valutata viola la logica dello scacco
 * ovvero se la mossa mi auto mette in scacco oppure se la mossa non mi toglie da un sacco in caso io sia già in scacco
 */
function moveWithCheck(destinationSquare, piece) {     //game-logic    //da sistemare

    let end_index = parseInt(destinationSquare.getAttribute('id'));
    let end_row = Math.floor(end_index / rows);
    let end_col = end_index % rows;
    let castlingMove = false;
    let support_piece;
    let support_row;
    let support_col;
    let support_rook_col;

    if (piece.captured) return false;
    if (validate_move(destinationSquare, piece, false)) { //valido la mossa
        let castlingRook = false;
        if (castling(destinationSquare, piece)) {
            castlingMove = true;
            let destinationPieceElement = destinationSquare.firstElementChild;
            castlingRook = getPiece(destinationPieceElement.id);
            support_col = piece.old_col;
            support_rook_col = castlingRook.old_col;
            piece.old_col = piece.col;
            castlingRook.old_col = castlingRook.col;
            if (end_col > piece.col) {
                piece.col = end_col - 2;
                castlingRook.col = end_col - 3;
            }
            else {
                piece.col = end_col + 1;
                castlingRook.col = end_col + 2;
            }
            board[piece.row * cols + piece.col] = piece;
            board[castlingRook.row * cols + castlingRook.col] = castlingRook;
            board[piece.old_row * cols + piece.old_col] = 0;
            board[castlingRook.old_row * cols + castlingRook.old_col] = 0;
        }
        else {
            support_piece = board[end_row * cols + end_col];

            if (support_piece != 0)
                support_piece.captured = true;

            //if nomaml move
            support_row = piece.row;
            support_col = piece.col;
            piece.row = end_row;
            piece.col = end_col;
            board[support_row * cols + support_col] = 0;
            board[end_row * cols + end_col] = piece;
        }

        checkCheck();

        if (castlingMove) {
            board[piece.row * cols + piece.col] = 0;
            board[castlingRook.row * cols + castlingRook.col] = 0;
            piece.old_col = support_col;
            castlingRook.old_col = support_rook_col;
            board[piece.old_row * cols + piece.old_col] = piece;
            board[castlingRook.old_row * cols + castlingRook.old_col] = castlingRook;
            if (end_col > piece.old_col) {
                piece.col = end_col - 4;
                castlingRook.col = end_col;
            }
            else {
                piece.col = end_col + 3;
                castlingRook.col = end_col;
            }
        }

        else {
            if (support_piece != 0)
                support_piece.captured = false;
            board[end_row * cols + end_col] = support_piece;
            piece.row = support_row;
            piece.col = support_col;
            board[support_row * cols + support_col] = piece;
        }

        if ((white_turn && white_in_check) || (black_turn && black_in_check)) {
            // questa mossa sarebbe legale ma viola la scacco logic
            // ovvero che o mi sto automettendo in scacco, oppure sono in scacco e non mi ci tolgo
            return false;
        }
        return true;
    }
    else {
        //in questo caso la mossa non è proprio legale in quanto la validate move ha restituito false
        return false;
    }
}

/**
 * 
 * @param {html element} destinationSquare lo square di destinazione della mossa
 * @param {piece} piece il pezzo che sto cercando di muovere, istanza della classe js
 * @returns valore booleano, true se si sta cercando di fare una mossa di castling (arrocco), false altrimenti
 */

function castling(destinationSquare, piece) {   //game-logic
    if (!destinationSquare.hasChildNodes())
        return false;
    let destinationPieceElement = destinationSquare.firstElementChild;
    let destinationPiece = getPiece(destinationPieceElement.id);
    if (piece.id.includes("king") && destinationPiece.id.includes("rook")) {
        if (piece.color == destinationPiece.color)
            return true;
        else return false;
    }
    return false;

}

/**
 * @brief chiamata da updateMessage controlla se c'è una mossa che toglie dallo stato di scacco
 * il giocatore che si trova in scacco. Se questa mossa non esiste allora il giocatore in scacco 
 * è anche in scacco matto
 * @returns true se il giocatore che è in scacco è in scacco matto, false altrimenti
 */
function checkMate() {     //game-logic
    let my_pieces;
    if (white_in_check) {
        my_pieces = white_pieces;
    }
    else if (black_in_check) {
        my_pieces = black_pieces;
    }
    else return false;

    let temp_white_check = white_in_check;
    let temp_black_check = black_in_check;
    for (let i = 0; i < my_pieces.length; i++) {
        if (my_pieces[i].captured)
            continue;
        for (let j = 0; j < 64; j++) {
            let square = document.getElementById(j + '');

            if (moveWithCheck(square, my_pieces[i])) {
                if ((white_in_check != temp_white_check) || (black_in_check != temp_black_check)) {
                    white_in_check = temp_white_check;
                    black_in_check = temp_black_check;
                    return false;
                }
            }

        }
    }
    isCheckMate = true;
    return isCheckMate;
}

/**
 * @brief cambia turno tra bianco e nero e disabilità la possibilità di una mossa EnPassant del giocatore che ha appena mosso
 */
function switchTurn() {  //game-logic
    if (white_turn) {
        updateEnPassantAttribute(0);
        white_turn = false;
        black_turn = true;
    }
    else {
        updateEnPassantAttribute(1);
        white_turn = true;
        black_turn = false;
    }
}

/**
 * @param {html element} dest_element lo square di destinazione della mossa
 * @param {piece} piece il pezzo che sto cercando di muovere, istanza della classe js
 * @param {boolean} makingMove valore booleano, true se si vuole effettivamente fare una mossa, false se si vuole sapere se la mossa è legale
 * @returns true, se la mossa che sto valudato è legale (senza considerare la scacco logic), false altrimenti
 */
function validate_move(dest_element, piece, makingMove) {       //game-logic   
    let start_row = piece.row;
    let start_col = piece.col;
    let id = piece.id;
    let end_index = parseInt(dest_element.getAttribute('id'));
    let end_row = Math.floor(end_index / rows);
    let end_col = end_index % rows;
    let i = parseInt(id.slice(-1)); //get the last character of the id and convert it to string

    //pawns
    if (id.includes('pawn')) {
        let pawnColor = (id.includes('white')) ? 'white' : 'black';
        let opponentColor = (id.includes('white')) ? 'black' : 'white';
        let pawn = (pawnColor == 'white') ? white_pawns[i] : black_pawns[i];
        let firstMoveBoost = (pawn.firstMove) ? ((pawnColor == 'white') ? 1 : -1) : 0;
        let diag = (board[end_row * cols + end_col] != 0 && board[end_row * cols + end_col].id.includes(opponentColor)) ? 1 : 0;
        firstMoveBoost = diag ? 0 : firstMoveBoost; //se mi posso muovere in diagonale allora posso fare solo 1 casella in avanti e non due
        let captureOpportunity = diag;
        let enPassantPosition = (id.includes('white')) ? -1 : 1;
        let enPassantRow = (id.includes('white')) ? 5 : 2;  //riga su cui è possibile fare l'enPassant
        let possibleEnPassantPawn;

        let promotionRow = (id.includes('white')) ? 7 : 0;
        let promoting = false;

        if (Math.abs(end_col - start_col) >= 2) return false;

        if (end_row > 0 && end_row < (rows - 1) && board[(end_row + enPassantPosition) * cols + end_col] != 0 && board[(end_row + enPassantPosition) * cols + end_col].id.includes(opponentColor + "_pawn")) {
            possibleEnPassantPawn = board[(end_row + enPassantPosition) * cols + end_col];
        }
        else
            possibleEnPassantPawn = 0;

        if (board[end_row * cols + end_col] != 0 && board[end_row * cols + end_col].id.includes(pawnColor)) {
            return false;
        }

        let maxMovement = (pawnColor == 'white') ? (firstMoveBoost + 1) : (firstMoveBoost - 1);

        if ((((pawnColor == 'white') && (end_row >= start_row) && (end_row <= start_row + maxMovement))
            || ((pawnColor == 'black') && (end_row <= start_row) && (end_row >= start_row + maxMovement)))
            && (end_col >= (start_col - diag)) && (end_col <= (start_col + diag))) {
            let direction = (pawnColor == 'white') ? 'u' : 'd';
            if ((Math.abs(end_row - start_row) > maxDist(start_row, start_col, direction)) && !diag)
                return false;
            if (diag && end_col === start_col)
                return false;
            if (diag && end_row === start_row)
                return false;
            if (end_row === promotionRow)
                promoting = true;
        }
        else if (!captureOpportunity && possibleEnPassantPawn != 0 && possibleEnPassantPawn.enPassantCapturable && possibleEnPassantPawn.id.includes(opponentColor + "_pawn") &&
            possibleEnPassantPawn.movesMade === 1 && end_row === enPassantRow && Math.abs(end_row - start_row) === 1) {
            if (makingMove) {
                possibleEnPassantPawn.captured = true;
                board[(end_row + enPassantPosition) * cols + end_col] = 0;
                pieceOffSquare(end_row + enPassantPosition, end_col);
                enPassantPlayed = true;
            }
        }
        else
            return false;

        if (makingMove) {
            updateDraggedPieceInfo(piece, start_row, start_col, end_row, end_col);
            if (Math.abs(end_row - start_row) == 2) {
                piece.enPassantCapturable = true;
            }
            if (promoting) {
                promotingMove = true;
                enPassantPlayed = false;
            }
        }
        return true;
    }

    //knights
    if (id.includes("knight")) {
        if (((end_row === start_row + 2) && ((end_col === start_col + 1) || (end_col === start_col - 1)))
            || ((end_row === start_row + 1) && ((end_col === start_col + 2) || (end_col === start_col - 2)))
            || ((end_row === start_row - 2) && ((end_col === start_col + 1) || (end_col === start_col - 1)))
            || ((end_row === start_row - 1) && ((end_col === start_col + 2) || (end_col === start_col - 2)))) {
            if (id.includes("white")) {
                if (board[end_row * cols + end_col] != 0 && board[end_row * cols + end_col].id.includes("white")) return false;

            }
            if (id.includes("black")) {
                if (board[end_row * cols + end_col] != 0 && board[end_row * cols + end_col].id.includes("black")) return false;
            }
            if (makingMove) {
                updateDraggedPieceInfo(piece, start_row, start_col, end_row, end_col);
            }
            return true;
        }
        else return false;
    }

    //kings
    if (id.includes("king")) {
        let castlignRook = false;
        if (board[end_row * cols + end_col] != 0 && board[end_row * cols + end_col].id.includes("rook") && board[end_row * cols + end_col].color == piece.color)
            castlignRook = board[end_row * cols + end_col];

        if (((end_row >= start_row - 1) && (end_row <= start_row + 1))
            && ((end_col >= start_col - 1) && (end_col <= start_col + 1))) {
            if (piece.id === white_king.id) {
                if (board[end_row * cols + end_col] != 0 && board[end_row * cols + end_col].id.includes("white")) return false;
            }
            else if (piece.id === black_king.id) {
                if (board[end_row * cols + end_col] != 0 && board[end_row * cols + end_col].id.includes("black")) return false;
            }
            if (makingMove) {
                updateDraggedPieceInfo(piece, start_row, start_col, end_row, end_col);
            }
            return true;
        }
        else if ((castlignRook != false && piece.firstMove == true && castlignRook.firstMove == true)) {
            if (((piece.col > castlignRook.col) && ((maxDist(piece.row, piece.col, "r") + 1) === Math.abs(piece.col - castlignRook.col))) //if the king is right of the rook
                || ((piece.col < castlignRook.col) && ((maxDist(piece.row, piece.col, "l") + 1) === Math.abs(castlignRook.col - piece.col))) //if the king is left of the rook
            ) {
                if (makingMove) {
                    if (start_col > end_col) {
                        piece.old_col = start_col;
                        piece.col = start_col - 2;
                        castlignRook.old_col = end_col;
                        castlignRook.col = end_col + 2;
                    }
                    else {
                        piece.old_col = start_col;
                        piece.col = start_col + 2;
                        castlignRook.old_col = end_col;
                        castlignRook.col = end_col - 3;
                    }
                    piece.firstMove = false;
                    castlignRook.firstMove = false;
                    piece.movesMade++;
                }
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    //rooks and queen straight movement
    if (id.includes("rook") || id.includes("queen")) {
        if (end_col === start_col && end_row === start_row) return false;
        let validMove = false;
        if (end_col === start_col) {
            if ((end_row <= (start_row + maxDist(start_row, start_col, "u"))) && (end_row >= (start_row - maxDist(start_row, start_col, "d")))) {
                validMove = true;
            } else {
                return false;
            }
        }
        if (end_row === start_row) {
            if ((end_col <= (start_col + maxDist(start_row, start_col, "l"))) && (end_col >= (start_col - maxDist(start_row, start_col, "r")))) {
                validMove = true;
            } else {
                return false;
            }
        }
        if (validMove && makingMove) {
            updateDraggedPieceInfo(piece, start_row, start_col, end_row, end_col);
            return true;
        }
        if (piece.type.includes('rook')) return validMove;
        if (validMove) return validMove;

    }

    if (id.includes("bishop") || id.includes("queen")) {
        let slope = Math.abs(end_row - start_row) / Math.abs(end_col - start_col);
        let distance = 0;
        let validMove = false;

        if (end_row > start_row && end_col > start_col && slope === 1) {
            let i = start_row;
            let j = start_col;
            while (end_row != i && end_col != j) {
                distance++;
                i++;
                j++;
            }
            if (distance <= maxDistDiag(start_row, start_col, "nw")) {
                validMove = true;
            }
            else return false;

        }
        else if (end_row > start_row && end_col < start_col && slope === 1) {
            let i = start_row;
            let j = start_col;
            while (end_row != i && end_col != j) {
                distance++;
                i++;
                j--;
            }
            if (distance <= maxDistDiag(start_row, start_col, "ne")) {
                validMove = true;
            }
            else return false;
        }
        else if (end_row < start_row && end_col > start_col && slope === 1) {
            let i = start_row;
            let j = start_col;
            while (end_row != i && end_col != j) {
                distance++;
                i--;
                j++;
            }
            if (distance <= maxDistDiag(start_row, start_col, "sw")) {
                validMove = true;
            }
            else return false;
        }
        else if (end_row < start_row && end_col < start_col && slope === 1) {
            let i = start_row;
            let j = start_col;
            while (end_row != i && end_col != j) {
                distance++;
                i--;
                j--;
            }
            if (distance <= maxDistDiag(start_row, start_col, "se")) {
                validMove = true;
            }
            else return false;
        }
        else {
            return false;
        }
        if (validMove && makingMove) {
            updateDraggedPieceInfo(piece, start_row, start_col, end_row, end_col);
        }
        return true;
    }
}

/**
 * 
 * @brief aggiorna le informazioni del dragged piece dopo aver verificato che la mossa sia valida,
 *  chiamata da validate_move una volta verificato che la mossa è valida 
 */
function updateDraggedPieceInfo(piece, start_row, start_col, end_row, end_col) {
    piece.firstMove = false;
    piece.old_row = start_row;
    piece.old_col = start_col;
    piece.row = end_row;
    piece.col = end_col;
    piece.movesMade++;
    return;
}

/**
 * @brief calcola ogni mossa legale (senza considerare lo scacco logic) per ogni pezzo che non è stato catturato e le memorizza in un array
 */
function allPossibleMoves() {       //game-logic
    for (let index = 0; index < white_pieces.length; index++) {
        white_pieces[index].possibleMoves.length = 0;
        if (white_pieces[index].captured) {
            continue;
        }
        for (let i = 0; i < 64; i++) {
            let square = document.getElementById(i + '');
            const makingMove = false;
            if (validate_move(square, white_pieces[index], makingMove)) {
                white_pieces[index].possibleMoves.push(i);
            }
        }
    }

    for (let index = 0; index < black_pieces.length; index++) {
        black_pieces[index].possibleMoves.length = 0;
        if (black_pieces[index].captured) {
            continue;
        }
        for (let i = 0; i < 64; i++) {
            let square = document.getElementById(i + '');
            const makingMove = false;
            if (validate_move(square, black_pieces[index], makingMove)) {
                black_pieces[index].possibleMoves.push(i);
            }
        }
    }
}


/**
 * @brief chiamata prima di fare la mossa effettiva e verifica se la mossa metterebbe qualcuno in scacco, chiamata da moveWithCheck
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
    if (white_turn) {
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

    // verifico se il mio avversario è in scacco
    for (let i = 0; i < my_pieces.length; i++) {
        for (let j = 0; j < my_pieces[i].possibleMoves.length; j++) {
            if (op_king_position === my_pieces[i].possibleMoves[j]) {
                opponent_in_check = true;
                break;
            }
        }
    }

    // verifico se sono in scacco
    for (let i = 0; i < op_pieces.length; i++) {
        for (let j = 0; j < op_pieces[i].possibleMoves.length; j++) {
            if (my_king_position === op_pieces[i].possibleMoves[j]) {
                me_in_check = true;
                break;
            }
        }
    }

    white_in_check = white_turn ? me_in_check : opponent_in_check;
    black_in_check = white_turn ? opponent_in_check : me_in_check;

    return false;
}

/**
 * @brief aggiorna il board 
 * @param piece è il pezzo che è stato mosso
 * @param castlignRook indica la torre con cui si fa il castling, se undefined significa che l'ultima mossa non era di castling
 */
function updateBoard(piece, castlignRook) {       //game-logic
    board[piece.old_row * cols + piece.old_col] = 0;
    if (castlignRook) {
        board[castlignRook.row * cols + (castlignRook.col)] = castlignRook;
        board[castlignRook.old_row * cols + (castlignRook.old_col)] = 0;
    }
    else {
        if (board[piece.row * cols + piece.col] != 0)
            board[piece.row * cols + piece.col].captured = true;
    }
    board[piece.row * cols + piece.col] = piece;
}



/**
 * @brief chiamata dopo che un giocatore fa una mossa, setta a false l'attributo enPassantCapturable delle pawn
 * @param {int} color 1 è white, 0 è black
 */
function updateEnPassantAttribute(color) {       //game-logic
    if (color) {
        for (let i = 0; i < 16; i++) {
            if (white_pieces[i].captured)
                continue;
            else
                white_pieces[i].enPassantCapturable = false;
        }
    }
    else {
        for (let i = 0; i < 16; i++) {
            if (black_pieces[i].captured)
                continue;
            else
                black_pieces[i].enPassantCapturable = false;
        }
    }
}

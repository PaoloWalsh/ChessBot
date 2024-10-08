
let hostColor;
let hostNumberMoves;

/**
 * @brief is called after the DOM is loaded, calls the function to get the game started
 */
function build () {
    hostColor = localStorage.getItem('colore');
    hostNumberMoves = 0;
    init_Pieces();
    fill_Board();
    buildBoard();
    init_drag();
    resetGlobalVariables();
    updateMessages();
}

/**
 * @brief builds the board html wise inserting all the pieces img in the starting position
 */
function buildBoard() {
    const scacchiera = document.getElementById("board");
    let count = 63;
    for(let i = rows-1; i >= 0; i--) {
        for(let j = cols-1; j >= 0; j--){
            const square = document.createElement("div");
            if(board[count])
                square.appendChild(board[count].getDiv());
            square.setAttribute("id", count--);
            square.classList.add("square");
            if(!((i+j)%2))
                square.classList.add("light");
            else
                square.classList.add("dark");
            scacchiera.appendChild(square);
        }
    }
}

function removeAllChildren(elem){
    while(elem.firstChild){
        elem.removeChild(elem.firstChild);
    }
}

/**
 * @brief updates the disable attribute of the reset button
 */
function updateResetButton() {
    const button = document.getElementById('restart');
    button.disabled = !button.disabled;
}

/**
 * @brief reset the value of all global variable to prepare for a new game
 */
function resetGlobalVariables() {
    white_turn = true;
    black_turn = false;

    white_in_check = false;
    black_in_check = false;

    enPassantPlayed = false;

    firstClick = true;
}

function reset(){
    /*
    const scacchiera = document.getElementById("board");
    removeAllChildren(scacchiera);
    build();
    */
    window.location.href = "scegliColore.php";
}


//global variable
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
        square.addEventListener('click', click);
    });
}

/**
 * @param element html element
 * @returns true if html of a piece, false if html of a square
 */
function isPieceElement(element){
    let rv = false;
    if(element.id.includes("white") || element.id.includes("black")){
        rv = true;
    }
    return rv;
}

//global variables
let firstClick = true;
let firstPieceClicked; 
let destinationSquare;
let startPositionId;
let draggedElement;
let draggedPiece;

function click (e) {
    removeSelectedSquares();
    // console.log(e.target.id);
    // console.log(e.target.color);
    // console.log(firstPieceClicked);

    // 1. clicco su elemento
    // 2. controllo l'ultimo elemente cliccato è un pezzo
    // 3. se è un pezzo dello stesso colore (e controllo arrocco) -> resetto il click
    // 4. altrimenti faccio la mossa

    //supponiamo sia il primo click
    
    let currentElement = e.target;
    let pieceElement;
    let pieceClicked = false;
    let squareCliecked = false;
    if(isPieceElement(currentElement)){
        pieceElement = divToPiece(currentElement);
        pieceClicked = true;
    } else 
        squareCliecked = true;
    
    if(firstClick){
        if(squareCliecked) return;
        if((pieceElement.color == "white" && black_turn) || (pieceElement.color == "black" && white_turn)) return;
        firstPieceClicked = pieceElement;
        selectLandingSquares(firstPieceClicked);
        firstClick = false;
        return;
    }

    if(pieceClicked){
        if(firstPieceClicked.color == pieceElement.color){
            if(!((firstPieceClicked.id.includes("king") && pieceElement.id.includes("rook")) || (firstPieceClicked.id.includes("rook") && pieceElement.id.includes("king")))){
                // firstClick = true
                // return;
                if((pieceElement.color == "white" && black_turn) || (pieceElement.color == "black" && white_turn)) return;
                firstPieceClicked = pieceElement;
                selectLandingSquares(firstPieceClicked);
                firstClick = false;
                return;
            }
            // return;
        }
    }

    if(makeMove(firstPieceClicked, currentElement))
        firstClick = true;
    
}

function dragStart (e) {
    startPositionId = e.target.parentNode.getAttribute('id');   //square id
    draggedElement = e.target;
    let piece = divToPiece(draggedElement);
    // console.log(piece);     //debug
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
    let piece; // is the piece that is being moved
    piece = divToPiece(draggedElement);
    // makeMove(piece, e.target);
    let square = e.target;
    // if(e.target.classList.contains("square")){
    //     square = e.target;
    // }
    // else {
    //     square = e.target.parentNode;
    // }

    let start_index = parseInt(startPositionId);
    let start_row = Math.floor(start_index/rows);   
    let start_col = start_index%rows;
    let id = draggedElement.getAttribute('id');
    let moveMade;
    let castlignRook;
    e.stopPropagation();
    makeMove(piece, square);
    // moveMade = false;
}

//function that makes the move
/**
 * @brief function that makes the move
 * @param {js piece} piece the javascript class object piece I want to move
 * @param {*} square the html destination element, could be a square or a piece
 * @returns returns true if the move was made, false otherways
 */
function makeMove(piece, square) {
    removeSelectedSquares();
    let start_row = piece.row;   
    let start_col = piece.col;
    let id = piece.id;
    let moveMade = false;
    let castlignRook;
    let element = pieceToDiv(piece);
    // console.log("primo");
    // console.log(piece);
    if((white_turn && element.id.includes("white"))
        || (black_turn && element.id.includes("black"))){
        // if true -> the target square is empty
        if(!square.hasChildNodes())
        {
            if(!moveWithCheck(square, piece, false)) return;
            moveMade = validate_move(square, start_row, start_col, id, true, false);
            // if(moveMade && ((piece.row == 7 && piece.color == "white") || (piece.row == 0 && piece.color == "black"))){
            //     promotion(piece);
            // }
            if(moveMade){
                square.append(element);
                if(enPassantPlayed){
                    capture_sound.play();
                    enPassantPlayed = false;
                }
                else
                    move_sound.play();
            }
            
        }
        //check if the target square has a same colored piece
        else if ((piece.id.includes("white") && square.id.includes("black"))
            || (piece.id.includes("black") && square.id.includes("white")))
        {
            //if true -> the target square has a different color piece
            // console.log("sono giusto");
            // console.log(square.firstElementChild.id);
            destinationSquare = square.parentNode;
            if(!moveWithCheck(destinationSquare, piece, true)) return;
            moveMade = validate_move(destinationSquare, start_row, start_col, id, true, true);
            if(moveMade) {
                square.parentNode.append(element);
                square.remove();
                capture_sound.play();
                
            }
        }
        else if ((element.id.includes("white_king") && square.id.includes("white_rook"))
            || (element.id.includes("black_king") && square.id.includes("black_rook"))
        )
        {   
            castlignRook = divToPiece(square);
            destinationSquare = square.parentNode;
            if(!moveWithCheck(destinationSquare, piece, true)) return;
            moveMade = validate_move(destinationSquare, start_row, start_col, id, true ,false);
            if(moveMade) {
                let rookStartSquare = square.parentNode;
                let kingStartSquare = element.parentNode;
                let rookEndSquare;
                let kingEndSquare;
                let kingIndex = parseInt(kingStartSquare.getAttribute("id"));
                let rookIndex = parseInt(rookStartSquare.getAttribute("id"));
                element.remove();
                square.remove();
                if(kingIndex > rookIndex){  //I'm castling to the right
                    rookEndSquare = document.getElementById((kingIndex-1)+'');
                    kingEndSquare = document.getElementById((rookIndex+1)+'');
                }
                else{
                    rookEndSquare = document.getElementById((kingIndex+1)+'');
                    kingEndSquare = document.getElementById((rookIndex-2)+'');
                }
                rookEndSquare.append(square);
                kingEndSquare.append(element);
                move_sound.play();
            }
        }
    }
    if(moveMade){
        // handleDialog();
        if(((hostColor == 'bianco') && white_turn ) || ((hostColor == 'nero') && black_turn ))
            hostNumberMoves++;
        updateBoard(castlignRook);
        checkCheck();    
        switchTurn();
        updateMessages();   //qui controlliamo lo scacco matto
        boardIsConsistent();//used for debug
        return true;
    }
    return false;
    
}

function handleDialog() {
    const dialog = document.getElementById('promotion-dialog');
    dialog.show();
    const overContainer = document.getElementById('over-container-flex');
    // console.log(overContainer);
    const head = (white_turn) ? "../img/png/white_" : "../img/png/black_";
    const tail = ".png";
    let promotionOptions = ['queen', 'rook', 'bishop', 'knight'];
    for(let i = 0; i < 4; i++){
        const container = document.createElement('div');
        container.classList.add('sub-container');
        overContainer.appendChild(container);
        const img = document.createElement('img');
        img.src = head+promotionOptions[i]+tail;
        img.alt = promotionOptions[i];
        img.id = head.split('/')[3]+promotionOptions[i];
        img.addEventListener('click', promotionClick);
        container.appendChild(img);
    }
}

function promotionClick (event) {
    const img = event.target;
    const dialog = document.getElementById('promotion-dialog');
    dialog.close();
    const overContainer = document.getElementById('over-container-flex');
    removeAllChildren(overContainer);
    let newPieceColor = img.id.split('_')[0];
    let newPieceType = img.id.split('_')[1];
    let oldPieceColor = newPieceColor;
    let oldPieceType = (draggedElement.id.split('_')[1]).slice(0, -1);
    let oldPieceIndex = draggedElement.id.slice(-1);
    let oldPiece = (oldPieceColor == 'white') ? white_pawns[oldPieceIndex] : black_pawns[oldPieceIndex];
    let oldPieceDiv = pieceToDiv(oldPiece);
    let childImg = oldPieceDiv.firstElementChild;
    console.log(newPieceColor);
    console.log(newPieceType);
    console.log(oldPieceColor);
    console.log(oldPieceType);
    console.log(oldPiece);
    console.log(oldPieceDiv);
    console.log(childImg);

    let newPiece;
    let numberPiece;
    let colorHead = oldPieceColor+'_';
    switch (newPieceType) {
        case 'knight':
            numberPiece = (newPieceColor == 'white') ? numberWhiteKnights : numberBlackKnights;
            newPiece = new piece(colorHead+'knight', numberPiece);
            if(newPieceColor == 'white'){
                white_knights.push(newPiece);
                numberWhiteKnights++;
            } else {
                black_knights.push(newPiece);
                numberBlackKnights++;
            }
            break;
        case 'bishop':
            numberPiece = (newPieceColor == 'white') ? numberWhiteBishops : numberBlackBishops;
            newPiece = new piece(colorHead+'bishop', numberPiece);
            if(newPieceColor == 'white'){
                white_bishops.push(newPiece);
                numberWhiteBishops++;
            } else {
                black_bishops.push(newPiece);
                numberBlackBishops++;
            }
            break;
        case 'rook':
            numberPiece = (newPieceColor == 'white') ? numberWhiteRooks : numberBlackRooks;
            newPiece = new piece(colorHead+'rook', numberPiece);
            if(newPieceColor == 'white'){
                white_rooks.push(newPiece);
                numberWhiteRooks++;
            } else {
                black_rooks.push(newPiece);
                numberBlackRooks++;
            }
            break;
            case 'queen':
            numberPiece = (newPieceColor == 'white') ? numberWhiteQueens : numberBlackQueens;
            newPiece = new piece(colorHead+'queen', numberPiece);
            if(newPieceColor == 'white'){
                white_queens.push(newPiece);
                numberWhiteQueens++;
            } else {
                black_queens.push(newPiece);
                numberBlackQueens++;
            }
            break;
        default:
            break;
    }

    newPiece.color = newPieceColor;
    newPiece.row = oldPiece.row;
    newPiece.col = oldPiece.col;
    oldPiece.captured = true;
    board[oldPiece.row*cols + oldPiece.col] = newPiece;
    oldPieceDiv.id = newPiece.id;
    const head = "../img/png/";
    const tail = ".png";
    childImg.src = head+(newPiece.id).slice(0, -1)+tail;

    if(oldPieceColor == 'white'){
        white_pieces.push(newPiece);
    }
    else{
        black_pieces.push(newPiece);
    }
    console.log(white_pawns);
    console.log(black_pawns);
    console.log(white_pieces);
    console.log(black_pieces);
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

const tuoTurno = "È il tuo turno!";
const punteggioBene = "Sei in vantaggio di: ";
const punteggioMale = "Sei in svantaggio di: ";
const scaccoBene = "Hai messo il tuo avversario in scacco!";
const scaccoMale = "Sei in scacco!";
const scaccoMattoBene = "Scacco matto, hai vinto! :)";
const scaccoMattoMale = "Scacco matto, hai perso! :(";

/**
 * @brief updates the messages to the player such as who's turn it is, if someone in in check, or if the game is over
 */
function updateMessages () {
    // let turn = document.getElementById("turn");
    // let check = document.getElementById("check");
    // let score = document.getElementById("score");
    // let checkmate = document.getElementById("checkMate");
    let bpTurno = document.getElementById('bp-turno');
    let bpPunteggio = document.getElementById('bp-punteggio');
    let bpScacco = document.getElementById('bp-scacco');
    let bpVittoria = document.getElementById('bp-vittoria');
    let wpTurno = document.getElementById('wp-turno');
    let wpPunteggio = document.getElementById('wp-punteggio');
    let wpScacco = document.getElementById('wp-scacco');
    let wpVittoria = document.getElementById('wp-vittoria');

    if(white_turn){
        wpTurno.innerText = tuoTurno;
        bpTurno.innerText = "";
    }
    else{
        bpTurno.innerText = tuoTurno;
        wpTurno.innerText = "";
    }
    if(white_in_check){
        wpScacco.innerText = scaccoMale;
        bpScacco.innerText = scaccoBene;
    }
    else if (black_in_check){
        bpScacco.innerText = scaccoMale;
        wpScacco.innerText = scaccoBene;
    }
    else {
        bpScacco.innerText = "";
        wpScacco.innerText = "";
    }
    let score_value = 0;
    for(let i = 0; i < 16; i++){
        if(white_pieces[i].captured)
            score_value += white_pieces[i].value;
        if(black_pieces[i].captured)
            score_value += black_pieces[i].value;
    }
    if(score_value < 0){
        wpPunteggio.innerText = punteggioBene + (-score_value) + " punti!";
        bpPunteggio.innerText = punteggioMale + (-score_value) + " punti!";
    }
    else if(score_value > 0){
        bpPunteggio.innerText = punteggioBene + (score_value) + " punti!";
        wpPunteggio.innerText = punteggioMale + (score_value) + " punti!";
    }
    else{
        bpPunteggio.innerText = "";
        wpPunteggio.innerText = "";
    }
    let t = checkMate();
    if(t){
        let vittoria;
        let colore = localStorage.getItem('colore');
        bpTurno.innerText = "";
        wpTurno.innerText = "";
        bpScacco.innerText = "";
        wpScacco.innerText = "";
        bpPunteggio.innerText = "";
        wpPunteggio.innerText = "";
        //black wins
        if(white_in_check){
            bpVittoria.innerText = scaccoMattoBene;
            wpVittoria.innerText = scaccoMattoMale;
            if(colore == "nero")
                vittoria = true;
            else 
                vittoria = false;
        }
        //white wins
        else if(black_in_check){
            wpVittoria.innerText = scaccoMattoBene;
            bpVittoria.innerText = scaccoMattoMale;
            if(colore == "bianco")
                vittoria = true;
            else 
                vittoria = false;
        }
        insertMatchDB(vittoria);
    }
    else{
        wpVittoria.innerText = "";
        bpVittoria.innerText = "";
    }
}

/**
 * @brief inserts the match into the database
 */
function insertMatchDB(vittoria){
    //inserimento partita nel database
    let http = new XMLHttpRequest();
    let url = 'inserisciPartita.php';
    // da aggiungere mosse per la classifica
    let params =  "vittoria=" + vittoria;
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
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
    switch (id) {
        case "white_king":
            piece = white_king;
            return piece;
        case "black_king":
            piece = black_king;
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

        case "white_queen":
            piece = white_queens[index];
            return piece;

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

        case "black_queen":
            piece = black_queens[index];
            return piece;
    
        default:
            piece = 0;
            break;
    }
    return piece;
}

/**
 * 
 * @param {piece} piece piece of which I want the html element
 * @returns the html element of the piece
 */

function pieceToDiv (piece) {
    let element = document.getElementById(piece.id);
    return element;
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

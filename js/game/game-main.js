
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
function makeMove(piece, square) {  //game logic
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


/**
 * @brief handles the graphics of the promotion, is called when a pawn moves on the last rank
 */
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
    // const containers = overContainer.querySelectorAll('div');
    // for(let container of containers){
    //    const img = container.querySelector('img');
    //     console.log(img);
    // }
}
/**
 * @brief handles the logic of the promotion, 
 * is called when the user clicks on the img of the piece it wants to promote to
 */
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
    console.log(draggedElement);
    console.log(oldPiece.id);
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

        const checkDialog = document.getElementById('checkmate-dialog');
        const whitePlayerName = document.getElementById('wp-nome').innerText;
        const blackPlayerName = document.getElementById('bp-nome').innerText;
        let winnerPlayer = (white_in_check) ? blackPlayerName : whitePlayerName;
        const p = checkDialog.querySelector('h2');
        p.innerText = `Complimenti ${winnerPlayer} hai vinto!`;
        checkDialog.show();
        // let vittoria;
        // let colore = localStorage.getItem('colore');
        // bpTurno.innerText = "";
        // wpTurno.innerText = "";
        // bpScacco.innerText = "";
        // wpScacco.innerText = "";
        // bpPunteggio.innerText = "";
        // wpPunteggio.innerText = "";
        // //black wins
        // if(white_in_check){
        //     bpVittoria.innerText = scaccoMattoBene;
        //     wpVittoria.innerText = scaccoMattoMale;
        //     if(colore == "nero")
        //         vittoria = true;
        //     else 
        //         vittoria = false;
        // }
        // //white wins
        // else if(black_in_check){
        //     wpVittoria.innerText = scaccoMattoBene;
        //     bpVittoria.innerText = scaccoMattoMale;
        //     if(colore == "bianco")
        //         vittoria = true;
        //     else 
        //         vittoria = false;
        // }
        insertMatchDB(vittoria);
    }
    else{
        wpVittoria.innerText = "";
        bpVittoria.innerText = "";
    }
}
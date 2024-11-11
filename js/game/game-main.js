
let hostColor;
let hostNumberMoves;

/**
 * @brief viene chiamata dopo che il DOM è stato caricato e avvia la funzione per far partire il gioco
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
 * @brief costruisce la scacchiera in HTML inserendo tutte le immagini dei pezzi nella posizione iniziale
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
 * @brief reimposta il valore di tutte le variabili globali per prepararsi a una nuova partita
 * reset the value of all global variable to prepare for a new game
 */
function resetGlobalVariables() {   // da aggiustare
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

function click (e) {    //da aggiustare
    removeSelectedSquares();
    let currentElement = e.target;
    let pieceElement;
    let pieceClicked = false;
    let squareCliecked = false;
    if(isPieceElement(currentElement)){
        pieceElement = getPiece(currentElement.id);
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
                if((pieceElement.color == "white" && black_turn) || (pieceElement.color == "black" && white_turn)) return;
                firstPieceClicked = pieceElement;
                selectLandingSquares(firstPieceClicked);
                firstClick = false;
                return;
            }
        }
    }

    if(makeMove(firstPieceClicked, currentElement))
        firstClick = true;
    
}

function dragStart (e) {
    startPositionId = e.target.parentNode.getAttribute('id');   //square id
    draggedElement = e.target;
    let piece = getPiece(draggedElement.id);
    selectLandingSquares(piece);     
}

function dragOver (e) {
    e.preventDefault();
}



/**
 * @param {*} e target dell'evento 
 * @returns 
 */
function dragDrop (e) {
    let piece; // is the piece that is being moved
    piece = getPiece(draggedElement.id);
    let square = e.target;
    e.stopPropagation();
    makeMove(piece, square);
}

/**
 * @brief se la mossa è legale, la esegue in HTML, chiama updateBoard, chiama le funzioni per aggiornare i messaggi e verificare lo scacco matto
 * @param {js piece} piece l'istanza della classe piece, è il pezzo che voglio muovere
 * @param {*} square l'elemento di destinazione HTML può essere una casella o un pezzo
 * @returns restituisce true se la mossa è stata effettuata, false altrimenti.
 */
 async function makeMove(piece, square) {  //game logic    //da aggiustare
    removeSelectedSquares();     
    let moveMade = false;
    let castlignRook;
    let element = pieceToDiv(piece);
    if((white_turn && element.id.includes("white"))
        || (black_turn && element.id.includes("black"))){
        // if true -> the target square is empty
        if(!square.hasChildNodes())
        {
            if(!moveWithCheck(square, piece)) return;
            moveMade = validate_move(square, piece, true);
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
            destinationSquare = square.parentNode;
            if(!moveWithCheck(destinationSquare, piece)) return;    
            moveMade = validate_move(destinationSquare, piece, true);
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
            castlignRook = getPiece(square.id);
            destinationSquare = square.parentNode;
            if(!moveWithCheck(destinationSquare, piece)) return;
            moveMade = validate_move(destinationSquare, piece, true);
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
        if(promotingMove){
            await handleDialog(piece);
        }
        promotingMove = false;
        if(((hostColor === 'bianco') && white_turn ) || ((hostColor === 'nero') && black_turn ))
            hostNumberMoves++;
        updateBoard(castlignRook);
        checkCheck();    
        switchTurn();
        updateMessages();       //qui controlliamo lo scacco matto
        boardIsConsistent();    //used for debug
        return true;
    }
    return false;
    
}


/**
 * @brief handles the graphics of the promotion, is called when a pawn moves on the last rank
 */
async function handleDialog(oldPiece) {
    const dialog = document.getElementById('promotion-dialog');
    dialog.show();
    const overContainer = document.getElementById('over-container-flex');
    const head = (white_turn) ? "../img/png/white_" : "../img/png/black_";
    const tail = ".png";
    let promotionOptions = ['queen', 'rook', 'bishop', 'knight'];
    let imgs = [];
    for(let i = 0; i < 4; i++){
        const container = document.createElement('div');
        container.classList.add('sub-container');
        overContainer.appendChild(container);
        const img = document.createElement('img');
        img.src = head+promotionOptions[i]+tail;
        img.alt = promotionOptions[i];
        img.id = head.split('/')[3]+promotionOptions[i];
        imgs.push(img);
        container.appendChild(img);
    }
    let idImg = await setImgEvent(imgs);
    console.log(idImg);
    createPromotionPiece(idImg, oldPiece);
}

function setImgEvent (imgs) {       //get data
    return new Promise((resolve) => {
        imgs.forEach(img => {
            img.addEventListener("click", (event) => {
                const dialog = document.getElementById('promotion-dialog');
                dialog.close();
                const overContainer = document.getElementById('over-container-flex');
                removeAllChildren(overContainer);
                resolve(event.target.id); // Risolve con il bottone che è stato cliccato
            }); 
        });
    });
}

/*
 * @brief handles the logic of the promotion, 
 * is called when the user clicks on the img of the piece it wants to promote to
 */
function promotionClick (event) {
    const img = event.target;
    return img.id;
}

function createPromotionPiece(idImg, oldPiece){
    let newPieceColor = idImg.split('_')[0];
    let newPieceType = idImg.split('_')[1];
    let oldPieceColor = newPieceColor;
    let oldPieceIndex = oldPiece.id.slice(-1);
    // console.log(draggedPiece);
    // console.log(oldPiece.id);
    let oldPieceDiv = pieceToDiv(oldPiece);
    let childImg = oldPieceDiv.firstElementChild;

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
    newPiece.old_row = oldPiece.old_row;
    newPiece.old_col = oldPiece.old_col;
    newPiece.row = oldPiece.row;
    newPiece.col = oldPiece.col;
    oldPiece.captured = true;
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
    draggedPiece = newPiece;
    console.log(newPiece);
    console.log(draggedElement);
    console.log(draggedPiece);
}

    

const tuoTurno = "È il tuo turno!";
const punteggioBene = "Sei in vantaggio di: ";
const punteggioMale = "Sei in svantaggio di: ";
const scaccoBene = "Hai messo il tuo avversario in scacco!";
const scaccoMale = "Sei in scacco!";
const scaccoMattoBene = "Scacco matto, hai vinto! :)";
const scaccoMattoMale = "Scacco matto, hai perso! :(";

/**
 * @brief aggiorna i messaggi per il giocatore, come chi è di turno, se qualcuno è sotto scacco o se la partita è terminata, controlla anche lo scacco matto chiamando checkMate
 */
function updateMessages () {
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
        let vittoria;
        let colore = localStorage.getItem('colore');
        if(colore == "nero"){
            if(white_in_check)
                vittoria = true;
            else
                vittoria = false;
        }
        else{
            if(black_in_check)
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

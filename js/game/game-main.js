
let hostColor;
let hostNumberMoves;

/**
 * @brief viene chiamata dopo che il DOM è stato caricato e avvia la funzione per far partire il gioco
 */
function build() {
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
    for (let i = rows - 1; i >= 0; i--) {
        for (let j = cols - 1; j >= 0; j--) {
            const square = document.createElement("div");
            if (board[count])
                square.appendChild(board[count].getDiv());
            square.setAttribute("id", count--);
            square.classList.add("square");
            if (!((i + j) % 2))
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
let startPositionId;
let draggedElement;

function click(e) {
    removeSelectedSquares();
    let currentElement = e.target;
    let pieceElement;                   // prende instanza classe pezzo 
    let pieceClicked = false;
    let squareCliecked = false;
    if (isPieceElement(currentElement)) {
        pieceElement = getPiece(currentElement.id);
        pieceClicked = true;
    } else
        squareCliecked = true;

    if (firstClick) {
        // se il primo click è su uno square return
        if (squareCliecked) return;
        // se il primo click è su un pezzo del colore opposto return
        if ((pieceElement.color == "white" && black_turn) || (pieceElement.color == "black" && white_turn)) return;
        firstPieceClicked = pieceElement;
        selectLandingSquares(firstPieceClicked);
        firstClick = false;
        return;
    }

    // sicuramente ho già fatto un first click
    if (pieceClicked) {
        // se il secondo click è fatto su un pezzo di colore diverso semplicemente faccio la mossa
        if (firstPieceClicked.color == pieceElement.color) {
            // devo fare la mossa anche se faccio un arroco, altrimenti devo resettare le informazioni sul primo click
            // perché significa che l'utente a cambiato idea sul pezzo che vuole muovere
            if (!((firstPieceClicked.id.includes("king") && pieceElement.id.includes("rook")) || (firstPieceClicked.id.includes("rook") && pieceElement.id.includes("king")))) {
                if ((pieceElement.color == "white" && black_turn) || (pieceElement.color == "black" && white_turn)) return;
                firstPieceClicked = pieceElement;
                selectLandingSquares(firstPieceClicked);
                firstClick = false;
                return;
            }
        }
    }

    if (makeMove(firstPieceClicked, currentElement)) {
        //fatta la mossa resetto il first click
        firstClick = true;
    }
}

function dragStart(e) {
    removeSelectedSquares();
    startPositionId = e.target.parentNode.getAttribute('id');   //square id
    draggedElement = e.target;
    let piece = getPiece(draggedElement.id);
    selectLandingSquares(piece);
}

function dragOver(e) {
    e.preventDefault();
}



/**
 * @param {*} e target dell'evento 
 * @returns 
 */
function dragDrop(e) {
    let piece; // is the piece that is being moved
    piece = getPiece(draggedElement.id);
    let square = e.target;
    e.stopPropagation();
    makeMove(piece, square);
}

/**
 * @brief se la mossa è legale, la esegue in HTML, chiama updateBoard, chiama le funzioni per aggiornare i messaggi e verificare lo scacco matto
 * @param {js piece} piece l'istanza della classe piece, è il pezzo che voglio muovere
 * @param {*} destination l'elemento di destinazione HTML può essere una casella o un pezzo
 * @returns restituisce true se la mossa è stata effettuata, false altrimenti.
 */
async function makeMove(piece, destination) {
    removeSelectedSquares();
    let moveMade = false;
    let castlingRook;
    let element = pieceToDiv(piece);
    let captureMove = isPieceElement(destination);   // vale true se il destination element è un pezzo e non uno square
    let destinationSquare = (captureMove) ? destination.parentNode : destination;
    let sameColorCapture = false;           // vale true se provo a catturare un pezzo del mio stesso colore
    let castlingMove = false;

    if ((white_turn && element.id.includes("white"))
        || (black_turn && element.id.includes("black"))) {

        if (captureMove && ((piece.id.includes("white") && destination.id.includes("white"))
            || (piece.id.includes("black") && destination.id.includes("black"))))
            sameColorCapture = true;

        if ((element.id.includes("white_king") && destination.id.includes("white_rook"))
            || (element.id.includes("black_king") && destination.id.includes("black_rook"))) {
            sameColorCapture = false;
            castlingMove = true;
        }

        if (!sameColorCapture) {
            if (!moveWithCheck(destinationSquare, piece)) return;
            moveMade = validate_move(destinationSquare, piece, true);
            if (moveMade) {
                if (castlingMove) {
                    castlingRook = getPiece(destination.id);
                    let rookStartSquare = destination.parentNode;
                    let kingStartSquare = element.parentNode;
                    let rookEndSquare;
                    let kingEndSquare;
                    let kingIndex = parseInt(kingStartSquare.getAttribute("id"));
                    let rookIndex = parseInt(rookStartSquare.getAttribute("id"));
                    element.remove();
                    destination.remove();
                    if (kingIndex > rookIndex) {  // Arrocco a destra 
                        rookEndSquare = document.getElementById((kingIndex - 1) + '');
                        kingEndSquare = document.getElementById((rookIndex + 1) + '');
                    }
                    else {  // Arrocco a sinistra
                        rookEndSquare = document.getElementById((kingIndex + 1) + '');
                        kingEndSquare = document.getElementById((rookIndex - 2) + '');
                    }
                    rookEndSquare.append(destination);
                    kingEndSquare.append(element);
                    move_sound.play();
                } else {
                    destinationSquare.append(element);
                    if (captureMove) {
                        destination.remove();
                        capture_sound.play();
                    } else if (enPassantPlayed) {
                        capture_sound.play();
                        enPassantPlayed = false;
                    }
                    else {
                        move_sound.play();
                    }
                }
            }
        }
    }
    if (moveMade) {
        if (promotingMove) {
            await handlePromotionDialog(piece);
            piece = promotionCreated;
        }
        promotingMove = false;
        if (((hostColor === 'bianco') && white_turn) || ((hostColor === 'nero') && black_turn))
            hostNumberMoves++;
        updateBoard(piece, castlingRook);
        checkCheck();
        checkMate();
        switchTurn();
        updateMessages();
        boardIsConsistent();    //debug info 
        return true;
    }
    return false;
}


/**
 * @brief gestisce il dialog per la promozione 
 */
async function handlePromotionDialog(oldPiece) {
    const dialog = document.getElementById('promotion-dialog');
    openDialog(dialog.id);
    const overContainer = document.getElementById('over-container-flex');
    const head = (white_turn) ? "../img/png/white_" : "../img/png/black_";
    const tail = ".png";
    let promotionOptions = ['queen', 'rook', 'bishop', 'knight'];
    let imgs = [];
    for (let i = 0; i < 4; i++) {
        const container = document.createElement('div');
        container.classList.add('sub-container');
        overContainer.appendChild(container);
        const img = document.createElement('img');
        img.src = head + promotionOptions[i] + tail;
        img.alt = promotionOptions[i];
        img.id = head.split('/')[3] + promotionOptions[i];
        imgs.push(img);
        container.appendChild(img);
    }
    let idImg = await setClickHandlerPromotion(imgs);
    createPromotionPiece(idImg, oldPiece);
}
/**
 * @param imgs sono le immagini html che compaiono nel dialog della promozione
 */
function setClickHandlerPromotion(imgs) {
    return new Promise((resolve) => {
        imgs.forEach(img => {
            img.addEventListener("click", (event) => {
                const dialog = document.getElementById('promotion-dialog');
                closeDialog(dialog.id)
                const overContainer = document.getElementById('over-container-flex');
                removeAllChildren(overContainer);
                resolve(event.target.id); // Risolve con il bottone che è stato cliccato
            });
        });
    });
}

/**
 * @param idImg id dell'immagine su cui l'utente ha cliccato nel dialog
 * @param oldPiece la pedina che è arrivata sulla prima o ultima riga e che deve essere promossa
 * @brief crea il nuovo pezzo in baso al pezzo scelto dall'utente
 */
function createPromotionPiece(idImg, oldPiece) {
    let newPieceColor = idImg.split('_')[0];
    let newPieceType = idImg.split('_')[1];
    let oldPieceColor = newPieceColor;
    let oldPieceDiv = pieceToDiv(oldPiece);
    let childImg = oldPieceDiv.firstElementChild;

    let newPiece;
    let numberPiece;
    let colorHead = oldPieceColor + '_';
    switch (newPieceType) {
        case 'knight':
            numberPiece = (newPieceColor == 'white') ? numberWhiteKnights : numberBlackKnights;
            newPiece = new piece(colorHead + 'knight', numberPiece);
            if (newPieceColor == 'white') {
                white_knights.push(newPiece);
                numberWhiteKnights++;
            } else {
                black_knights.push(newPiece);
                numberBlackKnights++;
            }
            break;
        case 'bishop':
            numberPiece = (newPieceColor == 'white') ? numberWhiteBishops : numberBlackBishops;
            newPiece = new piece(colorHead + 'bishop', numberPiece);
            if (newPieceColor == 'white') {
                white_bishops.push(newPiece);
                numberWhiteBishops++;
            } else {
                black_bishops.push(newPiece);
                numberBlackBishops++;
            }
            break;
        case 'rook':
            numberPiece = (newPieceColor == 'white') ? numberWhiteRooks : numberBlackRooks;
            newPiece = new piece(colorHead + 'rook', numberPiece);
            if (newPieceColor == 'white') {
                white_rooks.push(newPiece);
                numberWhiteRooks++;
            } else {
                black_rooks.push(newPiece);
                numberBlackRooks++;
            }
            break;
        case 'queen':
            numberPiece = (newPieceColor == 'white') ? numberWhiteQueens : numberBlackQueens;
            newPiece = new piece(colorHead + 'queen', numberPiece);
            if (newPieceColor == 'white') {
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
    childImg.src = head + (newPiece.id).slice(0, -1) + tail;

    if (oldPieceColor == 'white') {
        white_pieces.push(newPiece);
    }
    else {
        black_pieces.push(newPiece);
    }
    promotionCreated = newPiece;
}


/* Messaggi mostrati all'utente */
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
function updateMessages() {
    let bpTurno = document.getElementById('bp-turno');
    let bpPunteggio = document.getElementById('bp-punteggio');
    let bpScacco = document.getElementById('bp-scacco');
    let bpVittoria = document.getElementById('bp-vittoria');
    let wpTurno = document.getElementById('wp-turno');
    let wpPunteggio = document.getElementById('wp-punteggio');
    let wpScacco = document.getElementById('wp-scacco');
    let wpVittoria = document.getElementById('wp-vittoria');

    if (white_turn) {
        wpTurno.innerText = tuoTurno;
        bpTurno.innerText = "";
    }
    else {
        bpTurno.innerText = tuoTurno;
        wpTurno.innerText = "";
    }
    if (white_in_check) {
        wpScacco.innerText = scaccoMale;
        bpScacco.innerText = scaccoBene;
    }
    else if (black_in_check) {
        bpScacco.innerText = scaccoMale;
        wpScacco.innerText = scaccoBene;
    }
    else {
        bpScacco.innerText = "";
        wpScacco.innerText = "";
    }
    let score_value = 0;
    for (let i = 0; i < 16; i++) {
        if (white_pieces[i].captured)
            score_value += white_pieces[i].value;
        if (black_pieces[i].captured)
            score_value += black_pieces[i].value;
    }
    if (score_value < 0) {
        wpPunteggio.innerText = punteggioBene + (-score_value) + " punti!";
        bpPunteggio.innerText = punteggioMale + (-score_value) + " punti!";
    }
    else if (score_value > 0) {
        bpPunteggio.innerText = punteggioBene + (score_value) + " punti!";
        wpPunteggio.innerText = punteggioMale + (score_value) + " punti!";
    }
    else {
        bpPunteggio.innerText = "";
        wpPunteggio.innerText = "";
    }

    if (isCheckMate) {
        const checkDialog = document.getElementById('checkmate-dialog');
        const whitePlayerName = document.getElementById('wp-nome').innerText;
        const blackPlayerName = document.getElementById('bp-nome').innerText;
        let winnerPlayer = (white_in_check) ? blackPlayerName : whitePlayerName;
        const p = checkDialog.querySelector('h2');
        p.innerText = `Complimenti ${winnerPlayer} hai vinto!`;
        openDialog(checkDialog.id);
        let vittoria;
        let colore = localStorage.getItem('colore');
        if (colore == "nero") {
            if (white_in_check)
                vittoria = true;
            else
                vittoria = false;
        }
        else {
            if (black_in_check)
                vittoria = true;
            else
                vittoria = false;
        }

        insertMatchDB(vittoria);
    }
    else {
        wpVittoria.innerText = "";
        bpVittoria.innerText = "";
    }
}

function printBoard(){      //util
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            let pezzo = board[i*cols + j] ? board[i*cols + j].id : 'casella vuota';
            console.log(`Riga: ${i+1}, Col: ${j+1}, Pezzo: ${pezzo}`);
        }
        console.log("\n");
    }
}


/**
 * 
 * @param {html element} id id del pezzo html
 * @returns l'istanza della classe piece associato con quel pezzo
 */
function getPiece (id) {
    let piece;
    // let id = element.getAttribute('id');
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
 * @param {piece} piece istanza della classe piece
 * @returns il pezzo html associato con il piece
 */

function pieceToDiv (piece) {
    let element = document.getElementById(piece.id);
    return element;
}


/**
 * @returns true se il board si cui vengono calcolate le mosse è consistente con il board html che vede l'utente,
 *  in caso contrario ritorna false e stempa informazioni sui pezzi discordanti
 */
function boardIsConsistent () {     //util
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
                    console.log("board element " + board[i*cols+j].id); 
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
 * @brief stampa riga e colonna della posizione di un pezzo sul board
 * @param {string} id id del pezzo che voglio trovare
 * @returns true se trova il pezzo, false altrimenti
 */
function whereIsPiece(id){      //debug
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
 * @brief inserisce la partita nel database
 */
function insertMatchDB(vittoria){
    //inserimento partita nel database
    let http = new XMLHttpRequest();
    let url = 'inserisciPartita.php';
    // da aggiungere mosse per la classifica
    let params =  "vittoria=" + vittoria + "&mosse=" + hostNumberMoves;
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
}



/**
 * @brief colora di verde tutti i possibili verso cui un pezzo può muoversi legamente
 * la funzione è chiamata da dragStart e click
 * @param {piece} piece pezzo che inizio a muovere
 * 
 */
function selectLandingSquares(piece) {
    if((white_turn && piece.color != "white") || (black_turn && piece.color != "black")) return;
    for(let i = 0; i < 64; i++){
        let square = document.getElementById(i+'');
        let end_index = parseInt(square.getAttribute('id'));
        if(!piece.captured){
            if(moveWithCheck(square, piece)){
                if(square.classList.contains("light"))
                    square.classList.add("selectedLight");
                else
                    square.classList.add("selectedDark");
            }
        }
    }
}


/**
 * @brief rimuove le classi selectedLight o selectedDark sugli square evidenziati dalla selectLandingSquare
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
 * @brief rimuove un pezzo dal suo square a livello html
 * @param {int} row 
 * @param {int} col 
 */
function pieceOffSquare(row, col) {
    let squareNumber = row*8 + col;
    let square = document.getElementById(squareNumber+'');
    let divPiece = square.firstElementChild;
    divPiece.remove();
}

/**
 * @param element html element
 * @returns true se il l'elemento è un pezzo, false se è uno square
 */
function isPieceElement(element){
    let rv = false;
    if(element.id.includes("white") || element.id.includes("black")){
        rv = true;
    }
    return rv;
}

/**
 * 
 * @param {int} s_row starting row of the piece
 * @param {int} s_col starting col of the piece
 * @param {char} c "u" for up, "r" for right, "d" for down, "l" for left
 * @returns il massimo numero di square tra le cordinate iniziali del pezzo e qualsiasi altro pezzo su una linea dritta nella direzione specificata
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
 * @returns il massimo numero di square tra le cordinate iniziali del pezzo e qualsiasi altro pezzo su una linea obliqua con pendenza 1 nella direzione specificata
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
 * @brief ridireziona il giocatore alla pagina in cui deve scegliere il colore per una nuova partita.
 * È chiamata quando un utente clicca su nuova partita
 */
function reset() {
    window.location.href = "scegliColore.php";
}

/**
 * @brief rimuove tutti i figli di un elemento html
 */
function removeAllChildren(elem){
    while(elem.firstChild){
        elem.removeChild(elem.firstChild);
    }
}


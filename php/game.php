<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gioco</title>
    <link rel="icon" type="image/png" href="../img/png/white_knight.png">
    <link rel="stylesheet" href="../css/game.css">
    <link rel="stylesheet" href="../css/header.css">
    <!-- <link rel="stylesheet" href="../css/main.css"> -->
    <link rel="stylesheet" href="../css/promotion.css">
    <link rel="stylesheet" href="../css/card.css">
    <script src="../js/game/game-setup.js"></script>
    <script src="../js/game/game-main.js"></script>
    <script src="../js/game/game-logic.js"></script>
    <script src="../js/game/game-util.js"></script>
</head>
<body>
    <header>
        <div>
            <a href="index.php">
                <img src="../img/png/white_knight.png" alt="logo">
            </a>
        </div>
        <nav class="header-nav">
            <ul class="primary-navigation">
                <li><a href="index.php">Home</a></li>
                <li><a href="scegliColore.php">Gioco</a></li>
                <li><a href="classifiche.php">Classifiche</a></li>
                <?php
                    session_start();
                    if(isset($_SESSION['logged']) && $_SESSION['logged'] == true){
                        echo'<li><a href="logout.php">Log Out</a></li>';  
                    } else {
                        echo '<li><a href="login.php">Login</a></li>';
                        echo '<li><a href="signUp.php">Sign in</a></li>';
                    }
                ?>
            </ul>
        </nav>
    </header>
    <main>
        
        <div class="container relative max-width-board">
            <div id="promotion-dialog" class="dialog-style closed">
                <h2 class="special-h2">Promozione</h2>
                <div id="over-container-flex">
                </div>
            </div>

            <div id="checkmate-dialog" class="dialog-style closed">
                <h2 class="special-h2"></h2>
                <div class="buttons">
                    <button class="btn" onclick="reset()">Rigioca</button>
                    <button onclick="closeCheckmateDialog()" id="close-checkmate-dialog" class="btn">Chiudi</button>
                </div>
            </div>
            
            <div class="title-container">
                <h1 class="big-title">Gioco</h1>
            </div>
            <div class="main-flex">
                <div class="grid-layout">
                    <div class="sub-container-player left-card">
                        <h3 id="bp-nome"></h3>
                        <p id="bp-turno">
                        </p>
                        <p id="bp-punteggio">
                        </p>
                        <p id="bp-scacco">
                        </p>
                        <p id="bp-vittoria" class="vittoria">
                        </p>
                    </div>
                    <div id="boardWrapper">
                        <div id="board"></div>
                    </div>
                    
                    <div class="sub-container-player right-card">
                        <h3 id="wp-nome"></h3>
                        <p id="wp-turno">
                        </p>
                        <p id="wp-punteggio"> 
                        </p>
                        <p id="wp-scacco">
                        </p>
                        <p id="wp-vittoria" class="vittoria">
                        </p>
                    </div>
                </div>
                <div class="buttons">
                    <button class="btn" onclick="reset()">Nuova Partita</button>
                </div>
            </div>
        </div>
    </main>
    <?php
        $_username = "";
        if(isset($_SESSION['logged']) && $_SESSION['logged'] == true){
            $_username = $_SESSION['username'];
        }
    ?>
    <script>
        // imposta il nome delle game card all'username se il giocatore è loggato
        // altrimenti indichera giocatore host in base al colore scelto nella pagina precedente
        const userName = <?php echo json_encode($_username); ?>;
        let giocatoreHost;
        let giocatoreGuest;
        if(userName != ""){
            giocatoreHost = userName;
            giocatoreGuest = "Ospite di " + userName;
        } else {
            giocatoreHost = "Giocatore Host";
            giocatoreGuest = "Giocatore Guest";
        }
        const colore = localStorage.getItem('colore');
        const mioTitolo = (colore === "bianco") ? document.getElementById('wp-nome') : document.getElementById('bp-nome'); 
        const avvTitolo = (colore === "nero") ? document.getElementById('wp-nome') : document.getElementById('bp-nome'); 
        mioTitolo.innerText = giocatoreHost;
        avvTitolo.innerText = giocatoreGuest;
    </script>
</body>
</html>


<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="img/png/white_knight.png">
  <title>Mondo degli Scacchi</title>
  <link rel="stylesheet" href="css/header.css">
  <link rel="stylesheet" href="css/main.css">
  <script src="js/front/chessBoard.js"></script>
</head>
<body>
  <header>
    <div>
        <a href="index.php">
            <img src="img/png/white_knight.png" alt="logo">
        </a>
    </div>
    <nav class="header-nav">
        <ul class="primary-navigation">
            <li><a href="index.php">Home</a></li>
            <li><a href="php/scegliColore.php">Gioco</a></li>
            <li><a href="#">Classifiche</a></li>
            <?php
              session_start();
              if(isset($_SESSION['logged']) && $_SESSION['logged'] == true){
                echo'<li><a href="php/logout.php">Log Out</a></li>';  
              } else {
                echo '<li><a href="php/login.php">Login</a></li>';
                echo '<li><a href="php/signUp.php">Sign in</a></li>';
              }
              ?>
        </ul>
    </nav>
  </header>
  <div class="container">
    <h1>Benvenuto nel Mondo degli Scacchi</h1>
    <div class="chess-info">
      <h2>Introduzione agli Scacchi</h2>
      <p>Gli scacchi sono un gioco di strategia giocato su una scacchiera con 64 caselle, alternando colori chiari e scuri. Ogni giocatore ha 16 pezzi: un re, una regina, due torri, due cavalli, due alfieri e otto pedoni.</p>
      <p>Obiettivo del gioco: mettere sotto scacco il re avversario in modo che non possa più sfuggire, ovvero il famoso "scacco matto".</p>
      <p>Per vincere, devi pianificare le tue mosse con attenzione, proteggere i tuoi pezzi e cercare di sfruttare gli errori del tuo avversario.</p>
      <?php
        if(isset($_SESSION['logged']) && $_SESSION['logged'] == true){
          $username = $_SESSION['username'];
          echo "<p class='bold'>Bentornato $username!</p>";  
        } else {
          echo "<p class='bold'>Registrati e inizia a giocare!</p>";
        }
      ?>        
    </div>
    <button class="login-btn">
    <?php
        if(isset($_SESSION['logged']) && $_SESSION['logged'] == true){
          echo "<a class='no-margin' href='php/scegliColore.php'>Gioca</a>";  
        } else {
          echo "<a class='no-margin' href='php/signUp.php'>Registrati</a>";
        }
      ?>
      
    </button>
    <div class="chessboard">
    </div>
  </div>
</body>
</html>

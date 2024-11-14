<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="../img/png/white_knight.png">
  <title>Home</title>
  <link rel="stylesheet" href="../css/header.css">
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/card.css">
  <script src="../js/front/chessBoard.js"></script>
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
  <div class="container max-width-main">
    <h1>Benvenuto nel Mondo degli Scacchi</h1>
    <div class="chess-info">
      <h2>Introduzione agli Scacchi</h2>
      <p>Gli scacchi sono un gioco di strategia che si svolge su una tavola quadrata detta scacchiera,
          formata da 64 caselle (o "case") di due colori alternati, sulla quale ogni giocatore dispone di 16 pezzi
          (bianchi o neri; per traslato, "il Bianco" e "il Nero" designano i due sfidanti): un re, una donna (o "regina"),
          due alfieri, due cavalli, due torri e otto pedoni. </p>
      <p>Ogni casella può essere occupata da un solo pezzo, che può 
          catturare o "mangiare" il pezzo avversario andando a occuparne la casella.</p>
      <p>Obiettivo del gioco è dare scacco matto,
          ovvero minacciare la cattura del re avversario in modo tale che l'altro giocatore non possa eseguire mosse legali.</p>
      <h2>Funzionamento dell'applicazione</h2>
      
      
      
      <p>È possibile creare un account per avere salvate tutte le partite giocate all'interno del sito. Per farlo è necessario andare sulla pagina <a class="chess-info-link" href="signUp.php">Sign in</a> e creare un nuovo account, 
        a questo punto si sarà ridirezionati sulla pagina di <a class="chess-info-link" href="login.php">Login</a> e si dovrà inserire la credenziali dell'account appena creato. </p>
      <p>Per giocare è necessario andare sulla pagina <a class="chess-info-link" href="scegliColore.php">Gioco</a>, a questo punto si dovrà scegliere il colore che si vorrà utilizzare, l'altro colore verrà automaticamente assegnato al nostro ospite.
        È possibile giocare anche senza aver creato un account o aver fatto il login, anche se le partite effettuate non verranno registrate e non verranno quindi
      prese in considrezione per le varie classifiche consultabili dalla pagina <a class="chess-info-link" href="classifiche.php">Classifiche</a>. </p>
      <?php
        if(isset($_SESSION['logged']) && $_SESSION['logged'] == true){
          $username = $_SESSION['username'];
          echo "<p class='bold'>Bentornato $username!</p>";  
        } else {
          echo "<p class='bold'>Registrati e inizia a giocare!</p>";
        }
      ?>        
    </div>
    <?php
      if(isset($_SESSION['logged']) && $_SESSION['logged'] == true){
        echo "<a class='centered login-btn width-5' href='scegliColore.php'>Gioca</a>";  
      } else {
        echo "<a class='centered login-btn width-5' href='signUp.php'>Registrati</a>";
      }
    ?>
    <div class="chessboard">
    </div>
  </div>
</body>
</html>

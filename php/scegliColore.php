<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="../img/png/white_knight.png">
  <title>Gioco</title>
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/header.css">
  <link rel="stylesheet" href="../css/card.css">
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
    <div class="fake-body">
        <div class="container max-width-main">
            <h1>Scegli un colore</h1>
            <p>Sarai il bianco o il nero?</p>
            <div class="over-container-flex">
                <div class="sub-container">
                    <img id="scelto-bianco" src="../img/png/white_rook.png" alt="torre-bianca">
                </div>
                <div class="sub-container">
                    <img id="scelto-nero" src="../img/png/black_rook.png" alt="torre-nera">
                </div>
            </div>
        </div>
    </div>
    <script>
        const imgs = document.querySelectorAll('img');
        imgs.forEach(element => {
            element.addEventListener('click', () => {
                let idColore = element.id.split('-')[1];
                let colore = (idColore === "bianco") ? idColore : "nero";
                localStorage.setItem('colore', colore);
                window.location.href = "game.php";
            });
        });
    </script>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="../img/png/white_knight.png">
  <title>Sign In</title>
  <link rel="stylesheet" href="../css/login.css">
  <link rel="stylesheet" href="../css/header.css">
  <script src="../js/front/chessBoard.js"></script>
</head>
<body>
  <header>
    <div>
        <a href="../index.html">
            <img src="../img/png/white_knight.png" alt="logo">
        </a>
    </div>
    <nav class="header-nav">
        <ul class="primary-navigation">
          <li><a href="../index.html">Home</a></li>
          <li><a href="scegliColore.html">Gioco</a></li>
          <li><a href="#">Classifiche</a></li>
          <li><a href="login.html">Login</a></li>
          <li><a href="signUp.html">Sign in</a></li>
        </ul>
    </nav>
  </header>
    <div class="container">
      <h1>Sign in</h1>
      <p>Crea un account e inizia ad esplorare il magico mondo degli scacchi!</p>
      
      <form class="login-form" action="signUp.php" method="post">
        <input type="text" id="username" placeholder="Username" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit" class="login-btn">Sign in</button>
      </form>

      <a href="login.html">Hai già un account?</a>
  
      <div class="chessboard">
      </div>
    </div>
</body>
</html>

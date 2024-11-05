<?php

  $erroreNonEsiste = false;
  $passwordErr = false;

  if(isset($_POST['login'])&&isset($_POST['username'])&&isset($_POST['password'])){    
    $username = $_POST["username"];
    $password = $_POST["password"];

    require "dbaccess.php";
    $connection = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);

    if(mysqli_connect_errno())
      die(mysqli_connect_error());

    // Prepared Statement
    $query = "select * from utente where Username=?;";
    if($statement = mysqli_prepare($connection, $query)){
      mysqli_stmt_bind_param($statement, 's', $username);
      mysqli_stmt_execute($statement);
      $result = mysqli_stmt_get_result($statement);
      if(mysqli_num_rows($result)==0){
        $erroreNonEsiste = true;
      }
      else {
        $row = mysqli_fetch_assoc($result); 
        $hashedPassword = $row["Password"];
        if (password_verify($password, $hashedPassword)) {
          // se la pass è corretta, redirect alla home page
          session_start();
          $_SESSION["logged"] = true;
          $_SESSION["username"] = $username;
          header("Location: index.php");
        } else {
          // se la pass è sbagliata, error message
          $passwordErr = true;
        }
      }
    }
    else{
      // Close the database connection
      die(mysqli_connect_error());
    }
  }
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="../img/png/white_knight.png">
  <title>Login</title>
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/header.css">
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
      <h1>Login</h1>
      <p>Esegui il login ed Inizia a giocare!</p>
      
      <form class="login-form" action="login.php" method="post">
        <input type="text" id="username" name="username" placeholder="Username" required>
        
        <input type="password" id="password" name="password" placeholder="Password" required>  
        <button type="submit" name="login" class="login-btn">Login</button>
        <?php
          if($erroreNonEsiste){
            echo"<span class = \"errore\">Utente non esistente</span>";
          } 

          if($passwordErr){
            echo "<span class = \"errore\">Password Sbagliata</span>";
          }
        ?>
      </form>

      <a href="signUp.php">Non hai ancora un account?</a>
  
      <div class="chessboard">
      </div>
    </div>
</body>
</html>

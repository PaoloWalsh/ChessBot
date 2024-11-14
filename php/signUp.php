
<?php
    //l'username deve avere tra 4 e 10 caratteri, e contenere solo caratteri alfanumerici
    $regexusr = "/^[A-Za-z0-9_]{4,10}$/";
    //la password deve avere tra 4 e 16 caratteri, e permette alcuni caratteri speciali 
    $regexppw = "/^[A-Za-z0-9'$'+'@]{4,16}$/";

    $erroreName = false;
    $erroreEsistente = false;
    $errorePass = false;
    $erroreRPass = false;
    //verifico che sia stata sottomessa una richiesta di registrazione
    if(isset($_POST['register'])&&isset($_POST['username'])&&isset($_POST['password']) && isset($_POST['rpassword'])){
        //verifico i dati lato server
        $username = $_POST['username'];
        $password = $_POST['password'];
        $rpassword = $_POST['rpassword'];
      
        if(preg_match($regexusr, $username)&&preg_match($regexppw, $password)&&($rpassword == $password)){
            
            // mi connetto al db
            require_once "dbaccess.php";
            $connection = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
            if(mysqli_connect_errno())
                die(mysqli_connect_error());
 
            //preparo lo statement e accedo al db
            $query = "select * from utente where Username=?;";
            if($statement = mysqli_prepare($connection, $query)){
                mysqli_stmt_bind_param($statement, 's', $username);
                mysqli_stmt_execute($statement);
                $result = mysqli_stmt_get_result($statement);
                if(mysqli_num_rows($result)!==0){
                    $erroreEsistente = true;
                    //se esiste già un utente con quel nome, si verifica un errore
                }
                else{
                    //creo l'utente e reindirizzo al login
                    $query = "insert into utente (Username, Password) values (?, ?)";
                    if($statement = mysqli_prepare($connection, $query)){
                        $password = password_hash($password, PASSWORD_BCRYPT);
                        mysqli_stmt_bind_param($statement, 'ss', $username, $password);    
                        mysqli_stmt_execute($statement);
                        header("location: login.php");
                    }    
                }
            }
            else {    
                die(mysqli_connect_error());
            }
        }
        else{
            if(!preg_match($regexusr, $username)){
                $erroreName = true;
            }
            if(!preg_match($regexppw, $password)){
                $errorePass = true;
            }
            if($password != $rpassword){
                $erroreRPass = true;
            }
            //echo "<script>window.alert('La richiesta è in un formato non corretto')</script>";
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="../img/png/white_knight.png">
  <title>Sign In</title>
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
      <h1>Sign in</h1>
      <p>Crea un account e inizia ad esplorare il magico mondo degli scacchi!</p>
      
      <form class="login-form" action="signUp.php" method="post">
        <input type="text" id="username" name="username" placeholder="Username" required>
        <span>L'<b>username</b> deve avere tra 4 e 10 caratteri, e contenere solo caratteri alfanumerici</span>
        <input type="password" id="password" name="password" placeholder="Password" required>
        <span>La <b>password</b> deve avere tra 4 e 16 caratteri, e permette alcuni caratteri speciali come '$', '+', '@' </span>
        <input type="password" id="rpassword" name="rpassword" placeholder="Conferma Password" required>
        <button type="submit" name="register" class="login-btn">Sign in</button>
        <?php
        if($erroreName){
            echo "<span>Lo username non rispetta il formato richiesto</span>";
        }
        if($errorePass){
            echo "<span>La password non rispetta il formato richiesto</span>";
        }
        if($erroreRPass){
            echo "<span>Le due password fornite non coincidono</span>";
        }
        if($erroreEsistente){
            echo "<span> Esiste già un utente con questo username</span>";
        }
        ?>
      </form>

      <a href="login.php">Hai già un account?</a>
      <div class="chessboard">
      </div>
    </div>
</body>
</html>

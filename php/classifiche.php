<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="../img/png/white_knight.png">
  <title>Classifiche</title>
  <link rel="stylesheet" href="../css/header.css">
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/table.css">
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
            <li><a href="../index.php">Home</a></li>
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
  <div class="container">
    <h1>Classifiche</h1>
    <div class="chess-info">
        <h2>Migliori Giocatori</h2>
        <p>Qui puoi vedere i migliori giocatori della piattaforma.</p>       
        <p>Abbiamo riportanto in questa classifica i giocatori con più vittorie!</p>
    </div>
    <table>
        <thead>
            <th>Utente</th><th>Vittorie</th>
        </thead>
        <?php 
            $utenti_classificati = [];
            function riga($user, $count){
                echo "<tr> <td>$user</td><td>$count</td></tr>";
            }
            function query($query){
                $connection = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
                $result = mysqli_query($connection, $query);
                return $result;
            }
            require_once "dbaccess.php";
            $query = "SELECT Username, count(*) as partite
                        from partita
                        where vittoria = 1
                        group by Username
                        order by partite desc
                        LIMIT 5";
            $result = query($query);
            while($row = mysqli_fetch_assoc($result)){
                $user = $row["Username"];
                $count = $row["partite"];
                array_push($utenti_classificati, $user);
                riga($user, $count);
            }   
        ?>
    </table>
    <?php
        if(isset($_SESSION['logged']) && $_SESSION['logged'] == true){
            $username = $_SESSION['username'];
            if(in_array($username, $utenti_classificati))
                echo "<p class='bold'>Complimenti $username sei già in classifica!</p>";
            else
                echo "<p class='bold'>Dai $username inizia anche tu a giocare e scala le classifica!</p>";
        } else {
            echo "<p class='bold'>Registrati e inizia a giocare!</p>";
        }
    ?>
    <button class="login-btn">
    <?php
        if(isset($_SESSION['logged']) && $_SESSION['logged'] == true){
            echo "<a class='no-margin' href='scegliColore.php'>Gioca</a>";  
        } else {
            
            echo "<a class='no-margin' href='signUp.php'>Registrati</a>";
        }
      ?>
      
    </button>

    

    <div class="chessboard">
    </div>
  </div>
</body>
</html>

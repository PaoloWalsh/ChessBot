<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="../img/png/white_knight.png">
  <title>Classifiche</title>
  <link rel="stylesheet" href="../css/header.css">
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/classifiche.css">
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
                    echo '<li><a href="logout.php">Log Out</a></li>';  
                } else {
                    echo '<li><a href="login.php">Login</a></li>';
                    echo '<li><a href="signUp.php">Sign in</a></li>';
                }
            ?>
        </ul>
    </nav>
  </header>
  <div class="container max-width-main">
    <h1>Classifiche</h1>
    <div class="chess-info">
        <p>Qui puoi vedere i migliori giocatori della piattaforma.</p>       
        <p>Nella prima classifica sono elencati i giocatori con più vittorie della piattaforma, <br> nella seconda sono elencati i giocatori che hanno vinto una partita nel minor numero di mosse</p>
    </div>
    <div class="tables">
        <div class="most-wins">
        <h2>Migliori Giocatori</h2>
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
        </div>
        <div class="most-wins">
            <h2>Giocatori Più Veloci</h2>
            <table>
                <thead>
                    <th>Utente</th><th>Mosse</th>
                </thead>
                <?php 
                    $query = "SELECT Username, mosse
                                from partita
                                where vittoria = 1
                                order by mosse asc 
                                LIMIT 5";
                    $result = query($query);
                    while($row = mysqli_fetch_assoc($result)){
                        $user = $row["Username"];
                        $count = $row["mosse"];
                        array_push($utenti_classificati, $user);
                        riga($user, $count);
                    }   
                ?>
            </table>
        </div>
    </div>
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

<?php
    session_start();

    if(isset($_SESSION['logged']) && $_SESSION['logged'] == true){
        require_once "dbaccess.php"; 
        $username = $_SESSION["username"];
        $vittoria = $_POST["vittoria"];
        $mosse = $_POST["mosse"];
        if($vittoria == "true"){
            $vittoria = 1;
        }
        else{
            $vittoria = 0;
        }
        $connection = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
        // Create a connection
        if(mysqli_connect_errno())
            die(mysqli_connect_error());
        // Check connection
        $query = "insert into partita (Username, Vittoria, Mosse) values (?, ?, ?)";
        if($statement = mysqli_prepare($connection, $query)){
            mysqli_stmt_bind_param($statement, 'sii', $username, $vittoria, $mosse);
            mysqli_stmt_execute($statement);
        }
        else{
            die(mysqli_connect_error());
        }
    }
    else {
        echo "<script>console.log('Utente non loggato');</script>";
    }
?>
# Chess Website

This project is a chess website developed using HTML, CSS, JavaScript, and PHP. It was created for the Web Programming course of the Computer Engineering Bachelor's degree at the University of Pisa.

## Project Description

This website provides a platform to play chess. It includes features such as:

* A dynamic chessboard interface.
* User interaction for making moves.
* A database to store user information or game history.
* Server-side logic (using PHP) to handle game logic, user authentication and data management.

## File Structure

The repository contains the following files and directories:

* `audio/`: Contains audio files, for sound effects within the game.
* `chess_db.sql`: A SQL dump file, containing the database schema and potentially some initial data for the chess website.
* `css/`: Contains CSS files for styling the website.
* `img/`: Contains image files used on the website (e.g., chess piece images, background images).
* `index.php`: The main entry point of the website.  This file contains the core HTML structure and integrates the PHP logic.
* `js/`: Contains JavaScript files for client-side interactivity, including the chessboard UI and game logic.
* `php/`: Contains PHP files for server-side logic, such as handling user authentication, managing game state, and interacting with the database.

## Technologies Used

* **HTML:** For the structure of the web pages.
* **CSS:** For styling the web pages.
* **JavaScript:** For client-side interactivity and dynamic game functionality.
* **PHP:** For server-side logic and database interaction.
* **SQL:** For database management (using `chess_db.sql`).

## How to Set Up (Installation)

1.  **Database Setup:**
    * Import the `chess_db.sql` file into a MySQL (or MariaDB) database.  You'll need a database server (like MySQL, MariaDB, or XAMPP/WAMP/MAMP).
    * Create a database (e.g., `chess_db`).
    * Use a tool like phpMyAdmin, Dbeaver, or the MySQL command-line client to import the SQL file.
    * Ensure that the database user and password in your PHP configuration files (within the `php/` directory) match the credentials you've set up in your database.

2.  **Web Server Setup:**
    * You'll need a web server (like Apache, Nginx, or the built-in PHP development server) to serve the website.
    * If using Apache/Nginx, configure the document root to point to the directory containing `index.php`.
    * If using the PHP development server, you can start it from the command line in the project's root directory:  `php -S localhost:8000` (and then access the site at `http://localhost:8000`).

3.  **File Placement:**
    * Place all the files and directories ( `audio/`, `chess_db.sql`, `css/`, `img/`, `index.php`, `js/`, and `php/`) in the document root of your web server.

4.  **Configuration:**
     * Check the files in the `php/` directory for any configuration settings, especially database connection details (host, username, password, database name).  Make sure these match your database setup.

## How to Use

1.  **Access the Website:** Open a web browser and navigate to the URL where the website is hosted (e.g., `http://localhost:8000` if you're using the PHP development server).
2.  **Play Chess:** You should be able to interact with the chessboard and play a game of chess.  The specific features and gameplay will depend on the implementation details in the code.

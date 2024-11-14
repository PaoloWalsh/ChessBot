-- Progettazione Web
DROP DATABASE if exists walsh_655371;
CREATE DATABASE  walsh_655371;
USE  walsh_655371;


-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 14, 2024 at 03:48 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `walsh_655371`
--

-- --------------------------------------------------------

--
-- Table structure for table `partita`
--

CREATE TABLE `partita` (
  `ID` int(11) NOT NULL,
  `Vittoria` tinyint(1) NOT NULL,
  `Username` varchar(128) NOT NULL,
  `Mosse` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `partita`
--

INSERT INTO `partita` (`ID`, `Vittoria`, `Username`, `Mosse`) VALUES
(3, 1, 'Paolo', 4),
(4, 1, 'Giovanni', 6),
(5, 1, 'Paolo', 29),
(6, 1, 'Marco', 4),
(7, 1, 'Paolo', 2),
(8, 1, 'Paolo', 4),
(9, 1, 'Ilaria', 2),
(10, 1, 'Ilaria', 4),
(11, 1, 'Mario', 4);

-- --------------------------------------------------------

--
-- Table structure for table `utente`
--

CREATE TABLE `utente` (
  `Username` varchar(128) NOT NULL,
  `Password` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `utente`
--

INSERT INTO `utente` (`Username`, `Password`) VALUES
('Paolo', '$2y$10$ydvJ0V/2GuNwPF.RcTRH7OU90Tzw7wHxpGoTYzsXeGjae/C2vprCq'),
('Giuliana', '$2y$10$PUbcbDBzL7CQP0KzhCTMhON/N6riXg4i4jSnh8rmCPZ.I9UFRKYhG'),
('John', '$2y$10$QOt3LyaChMpNPxeOHKCROO1P0Uc06iWlInglB8rAeo.96C/E4Frru'),
('test', '$2y$10$aYcADJUprlHqTn5ZLv9YAu4qZntne.ticqgDEkaW/UH7FJ3.yBHym'),
('Giovanni', '$2y$10$QUTyY/.kznYc2tdt2UKpaOCSDShQGgHOSphq8ZbtmW283LdomXJPq'),
('Anna', '$2y$10$EXXxELV0qXVxrYtnRfRqXuaBFXpo2s./UR/acYW3PHwfnCPIAJUK6'),
('Giuseppe', '$2y$10$y.HPvEk244rT/1ORmxmrfuTPhUiRsSoC/GTqscZqWxtjSYWwwy0r.'),
('Ilaria', '$2y$10$YtdPRL79MhuG0l9zOYmxLesMq1.vGHKFce3ii80NTtcR58BjHewv.'),
('Caiusnovi', '$2y$10$L53sZ8OvkbgjoEM/fNfaYeqiP9bqT2/4SiFhze0IDSqrZaYSn489W'),
('Marco', '$2y$10$zw2zAit7kvpfx17m/527s.fDZujKGsa1sikD9ORnDf3fHIlxWmj2a'),
('Mario', '$2y$10$egOa//LpiYhHs1Dm53fkGOFdH.BiRaindagXpSaKsn1gGquzD.kLW');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `partita`
--
ALTER TABLE `partita`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `partita`
--
ALTER TABLE `partita`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

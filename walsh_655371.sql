-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Ott 05, 2024 alle 15:38
-- Versione del server: 5.7.28
-- Versione PHP: 8.0.10

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
-- Struttura della tabella `partita`
--

CREATE TABLE `partita` (
  `ID` int(11) NOT NULL,
  `Vittoria` tinyint(1) NOT NULL,
  `Username` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `partita`
--

INSERT INTO `partita` (`ID`, `Vittoria`, `Username`) VALUES
(49, 1, 'test'),
(50, 1, 'test'),
(51, 1, 'Paolo'),
(52, 1, 'Giovanni'),
(53, 1, 'Giovanni'),
(54, 1, 'Anna'),
(55, 1, 'Paolo'),
(56, 0, 'Paolo'),
(57, 1, 'Ilaria'),
(58, 1, 'Ilaria');

-- --------------------------------------------------------

--
-- Struttura della tabella `utente`
--

CREATE TABLE `utente` (
  `Username` varchar(128) NOT NULL,
  `Password` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `utente`
--

INSERT INTO `utente` (`Username`, `Password`) VALUES
('Paolo', '$2y$10$ydvJ0V/2GuNwPF.RcTRH7OU90Tzw7wHxpGoTYzsXeGjae/C2vprCq'),
('Giuliana', '$2y$10$PUbcbDBzL7CQP0KzhCTMhON/N6riXg4i4jSnh8rmCPZ.I9UFRKYhG'),
('John', '$2y$10$QOt3LyaChMpNPxeOHKCROO1P0Uc06iWlInglB8rAeo.96C/E4Frru'),
('test', '$2y$10$aYcADJUprlHqTn5ZLv9YAu4qZntne.ticqgDEkaW/UH7FJ3.yBHym'),
('Giovanni', '$2y$10$QUTyY/.kznYc2tdt2UKpaOCSDShQGgHOSphq8ZbtmW283LdomXJPq'),
('Anna', '$2y$10$EXXxELV0qXVxrYtnRfRqXuaBFXpo2s./UR/acYW3PHwfnCPIAJUK6'),
('Giuseppe', '$2y$10$y.HPvEk244rT/1ORmxmrfuTPhUiRsSoC/GTqscZqWxtjSYWwwy0r.'),
('Ilaria', '$2y$10$YtdPRL79MhuG0l9zOYmxLesMq1.vGHKFce3ii80NTtcR58BjHewv.');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `partita`
--
ALTER TABLE `partita`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `partita`
--
ALTER TABLE `partita`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

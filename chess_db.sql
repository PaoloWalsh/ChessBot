-- Progettazione Web 
DROP DATABASE if exists chess_db; 
CREATE DATABASE chess_db; 
USE chess_db; 
-- MySQL dump 10.13  Distrib 5.7.28, for Win64 (x86_64)
--
-- Host: localhost    Database: chess_db
-- ------------------------------------------------------
-- Server version	5.7.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `partita`
--

DROP TABLE IF EXISTS `partita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partita` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Vittoria` tinyint(1) NOT NULL,
  `Username` varchar(128) NOT NULL,
  `Mosse` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partita`
--

LOCK TABLES `partita` WRITE;
/*!40000 ALTER TABLE `partita` DISABLE KEYS */;
INSERT INTO `partita` VALUES (3,1,'Paolo',4),(4,1,'Giovanni',6),(5,1,'Paolo',29),(6,1,'Marco',4),(7,1,'Paolo',2),(8,1,'Paolo',4),(9,1,'Ilaria',2),(10,1,'Ilaria',4),(11,1,'Mario',4);
/*!40000 ALTER TABLE `partita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utente`
--

DROP TABLE IF EXISTS `utente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utente` (
  `Username` varchar(128) NOT NULL,
  `Password` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utente`
--

LOCK TABLES `utente` WRITE;
/*!40000 ALTER TABLE `utente` DISABLE KEYS */;
INSERT INTO `utente` VALUES ('Paolo','$2y$10$ydvJ0V/2GuNwPF.RcTRH7OU90Tzw7wHxpGoTYzsXeGjae/C2vprCq'),('Giuliana','$2y$10$PUbcbDBzL7CQP0KzhCTMhON/N6riXg4i4jSnh8rmCPZ.I9UFRKYhG'),('John','$2y$10$QOt3LyaChMpNPxeOHKCROO1P0Uc06iWlInglB8rAeo.96C/E4Frru'),('test','$2y$10$aYcADJUprlHqTn5ZLv9YAu4qZntne.ticqgDEkaW/UH7FJ3.yBHym'),('Giovanni','$2y$10$QUTyY/.kznYc2tdt2UKpaOCSDShQGgHOSphq8ZbtmW283LdomXJPq'),('Anna','$2y$10$EXXxELV0qXVxrYtnRfRqXuaBFXpo2s./UR/acYW3PHwfnCPIAJUK6'),('Giuseppe','$2y$10$y.HPvEk244rT/1ORmxmrfuTPhUiRsSoC/GTqscZqWxtjSYWwwy0r.'),('Ilaria','$2y$10$YtdPRL79MhuG0l9zOYmxLesMq1.vGHKFce3ii80NTtcR58BjHewv.'),('Caiusnovi','$2y$10$L53sZ8OvkbgjoEM/fNfaYeqiP9bqT2/4SiFhze0IDSqrZaYSn489W'),('Marco','$2y$10$zw2zAit7kvpfx17m/527s.fDZujKGsa1sikD9ORnDf3fHIlxWmj2a'),('Mario','$2y$10$egOa//LpiYhHs1Dm53fkGOFdH.BiRaindagXpSaKsn1gGquzD.kLW');
/*!40000 ALTER TABLE `utente` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-14 15:56:42

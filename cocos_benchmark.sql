-- MySQL dump 10.13  Distrib 5.5.15, for osx10.6 (i386)
--
-- Host: localhost    Database: cocos_benchmark
-- ------------------------------------------------------
-- Server version	5.5.15

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
-- Current Database: `cocos_benchmark`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cocos_benchmark` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `cocos_benchmark`;

--
-- Table structure for table `result`
--

DROP TABLE IF EXISTS `result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `result` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `benchmarkVersion` varchar(45) NOT NULL,
  `engineVersion` varchar(45) NOT NULL,
  `language` varchar(45) NOT NULL,
  `platform` varchar(45) NOT NULL,
  `userAgent` varchar(255) NOT NULL,
  `vendor` varchar(45) NOT NULL,
  `fpsList` varchar(1023) NOT NULL,
  `scores` varchar(1023) NOT NULL,
  `finalScore` float NOT NULL,
  `timeUsed` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `userAgent_browser_name` varchar(255) NOT NULL,
  `userAgent_browser_name_regex` varchar(255) NOT NULL,
  `userAgent_browser_name_pattern` varchar(255) NOT NULL,
  `userAgent_Parent` varchar(127) NOT NULL,
  `userAgent_Comment` varchar(127) NOT NULL,
  `userAgent_Browser` varchar(127) NOT NULL,
  `userAgent_Version` varchar(127) NOT NULL,
  `userAgent_MajorVer` varchar(31) NOT NULL,
  `userAgent_MinorVer` varchar(31) NOT NULL,
  `userAgent_Platform` varchar(127) NOT NULL,
  `userAgent_Platform_Version` varchar(127) NOT NULL,
  `userAgent_Platform_Description` varchar(127) NOT NULL,
  `userAgent_Alpha` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_Beta` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_Win16` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_Win32` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_Win64` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_Frames` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_IFrames` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_Tables` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_Cookies` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_BackgroundSounds` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_Javascript` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_VBScript` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_JavaApplets` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_ActiveXControls` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_isMobileDevice` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_isSyndicationReader` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_Crawler` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent_CssVersion` varchar(15) NOT NULL,
  `userAgent_AolVersion` varchar(15) NOT NULL,
  `userAgent_Device_Name` varchar(255) NOT NULL,
  `userAgent_Device_Maker` varchar(31) NOT NULL,
  `userAgent_RenderingEngine_Name` varchar(31) NOT NULL,
  `userAgent_RenderingEngine_Version` varchar(31) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `result`
--

LOCK TABLES `result` WRITE;
/*!40000 ALTER TABLE `result` DISABLE KEYS */;
/*!40000 ALTER TABLE `result` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-09-02 18:06:42

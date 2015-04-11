-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.41-0ubuntu0.14.04.1


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema cashflow
--

CREATE DATABASE IF NOT EXISTS cashflow;
USE cashflow;

--
-- Definition of table `account`
--

DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account`
--

/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` (`id`,`name`) VALUES 
 (1,'Default');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;


--
-- Definition of table `expense`
--

DROP TABLE IF EXISTS `expense`;
CREATE TABLE `expense` (
  `type` varchar(64) DEFAULT NULL,
  `expense_date` date DEFAULT NULL,
  `transactionId` varchar(32) NOT NULL,
  `expense_value` double DEFAULT NULL,
  `location` varchar(64) DEFAULT NULL,
  `comment` varchar(128) DEFAULT NULL,
  `expense_currency` varchar(4) NOT NULL,
  `insert_date` date DEFAULT NULL,
  `user_comment` text,
  `account_id` int(11) DEFAULT NULL,
  `modified_date` date DEFAULT NULL,
  PRIMARY KEY (`transactionId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Definition of table `expense_tag`
--

DROP TABLE IF EXISTS `expense_tag`;
CREATE TABLE `expense_tag` (
  `transactionId` varchar(32) DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL,
  KEY `tag_id` (`tag_id`),
  KEY `FK_expense_tag_2` (`transactionId`),
  CONSTRAINT `expense_tag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`),
  CONSTRAINT `FK_expense_tag_2` FOREIGN KEY (`transactionId`) REFERENCES `expense` (`transactionId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Definition of table `tag`
--

DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tag`
--

/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` (`id`,`label`) VALUES 
 (7,'Shopping'),
 (8,'Fun'),
 (9,'Car'),
 (10,'House'),
 (11,'Dress'),
 (12,'Income'),
 (13,'ATM - ad-hoc'),
 (14,'Bank account fee'),
 (15,'Traveling'),
 (16,'Unexpected expenses'),
 (17,'Holiday'),
 (18,'Mobile phone'),
 (19,'ATM - monthly'),
 (20,'Savings (Long term)'),
 (21,'Savings (Short term)'),
 (22,'Transaction fee'),
 (23,'Gifts');


--
-- Definition of table `tag_rule`
--

DROP TABLE IF EXISTS `tag_rule`;
CREATE TABLE `tag_rule` (
  `rule_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `pattern` varchar(128) DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`rule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

--
-- Definition of function `count_expenses`
--

DROP FUNCTION IF EXISTS `count_expenses`;

DELIMITER $$

/*!50003 SET @TEMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ $$
CREATE DEFINER=`root`@`localhost` FUNCTION `count_expenses`() RETURNS int(11)
BEGIN
  DECLARE COUNT_OF_EXPENSES INTEGER;

  SELECT COUNT(*) INTO COUNT_OF_EXPENSES
  FROM expense;

  IF (COUNT_OF_EXPENSES IS NULL)
  THEN
    SET COUNT_OF_EXPENSES = 0;
  END IF;

  RETURN COUNT_OF_EXPENSES;
END $$
/*!50003 SET SESSION SQL_MODE=@TEMP_SQL_MODE */  $$

DELIMITER ;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

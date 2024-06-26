-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema financemanager
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `financemanager` ;
CREATE SCHEMA IF NOT EXISTS `financemanager` DEFAULT CHARACTER SET utf8 ;
USE `financemanager` ;

-- -----------------------------------------------------
-- Table `Person`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Person` ;

CREATE TABLE IF NOT EXISTS `Person` (
  `idPerson` INT NOT NULL auto_increment,
  `Name` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  PRIMARY KEY (`idPerson`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Category` ;

CREATE TABLE IF NOT EXISTS `Category` (
  `idCategory` INT NOT NULL auto_increment,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idCategory`))
ENGINE = InnoDB;

INSERT INTO category (name) 
VALUES ('Lohn'),
('Geschenk (Einnahme)'),
('Verkauf'),
('Rückzahlung'),
('Sonsitges (Einnahme)'),
('Wohnen'),
('Gesundheit'),
('Hobbys/Freizeit/Sport'),
('Bildung'),
('Tierhaltung'),
('Kleidung'),
('Nahrung'),
('Geschenk (Ausgabe)'),
('Versicherung/Steuern'),
('Elektronik'),
('Transport'),
('Sonsiges (Ausgabe)');

-- -----------------------------------------------------
-- Table `Transaction`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Transaction` ;

CREATE TABLE IF NOT EXISTS `Transaction` (
  `idTransaction` INT NOT NULL auto_increment,
  `transactionType` varchar(10),
  `title` VARCHAR(45) ,
  `amount` DECIMAL(8,2),
  `date` DATE ,
  `description` TEXT,
  `Person_idPerson` INT,
  `Category_idCategory` INT,
  PRIMARY KEY (`idTransaction`),
  INDEX `fk_Transaction_Person_idx` (`Person_idPerson` ASC) VISIBLE,
  INDEX `fk_Transaction_Category1_idx` (`Category_idCategory` ASC) VISIBLE,
  CONSTRAINT `fk_Transaction_Person`
    FOREIGN KEY (`Person_idPerson`)
    REFERENCES `Person` (`idPerson`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Transaction_Category1`
    FOREIGN KEY (`Category_idCategory`)
    REFERENCES `Category` (`idCategory`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
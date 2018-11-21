-- phpMyAdmin SQL Dump
-- version 4.5.4.1
-- http://www.phpmyadmin.net
--
-- Počítač: db.iim.cz:3306
-- Vytvořeno: Pon 30. dub 2018, 11:20
-- Verze serveru: 10.1.26-MariaDB
-- Verze PHP: 5.6.31-pl0-gentoo

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `naki`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `tContainer`
--

CREATE TABLE `tContainer` (
  `sID_Container` varchar(64) NOT NULL,
  `sID_View` varchar(64) NOT NULL,
  `sType` varchar(64) NOT NULL,
  `sDescription` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tContainerItem`
--

CREATE TABLE `tContainerItem` (
  `sID_Container` varchar(64) NOT NULL,
  `sID_Item` varchar(64) NOT NULL,
  `sData` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tData`
--

CREATE TABLE `tData` (
  `sID_Data` varchar(64) NOT NULL,
  `bBlob` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tDigitalItem`
--

CREATE TABLE `tDigitalItem` (
  `sID_Item` varchar(64) NOT NULL,
  `sMime` varchar(64) NOT NULL,
  `dCreated` datetime NOT NULL,
  `sDescription` text NOT NULL,
  `sAuthor` varchar(64) NOT NULL,
  `sRights` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tDigitalSet`
--

CREATE TABLE `tDigitalSet` (
  `sID_Set` varchar(64) NOT NULL,
  `sDescription` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tDIGroup`
--

CREATE TABLE `tDIGroup` (
  `sID_Group` varchar(64) NOT NULL,
  `dCreated` datetime NOT NULL,
  `sDescription` text NOT NULL,
  `sAuthor` text NOT NULL,
  `sType` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tGroupItem`
--

CREATE TABLE `tGroupItem` (
  `sID_Group` varchar(64) NOT NULL,
  `sID_Item` varchar(64) NOT NULL,
  `fStartOffset` double NOT NULL,
  `fEndOffset` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tGroupSet`
--

CREATE TABLE `tGroupSet` (
  `sID_Set` varchar(64) NOT NULL,
  `sID_Group` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tLink`
--

CREATE TABLE `tLink` (
  `sID_Item` varchar(64) NOT NULL,
  `sType` varchar(32) NOT NULL,
  `sDescription` text NOT NULL,
  `sURI` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tMetadata`
--

CREATE TABLE `tMetadata` (
  `sID` varchar(64) NOT NULL,
  `sTarget` varchar(32) NOT NULL,
  `sKey` varchar(64) NOT NULL,
  `sValue` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tMetaKey`
--

CREATE TABLE `tMetaKey` (
  `sKey` varchar(64) NOT NULL,
  `sType` varchar(32) NOT NULL,
  `sDescription` text NOT NULL,
  `sMandatory` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tView`
--

CREATE TABLE `tView` (
  `sID_View` varchar(64) NOT NULL,
  `dCreated` datetime NOT NULL,
  `sDescription` text NOT NULL,
  `sAuthor` text NOT NULL,
  `bPublic` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `tViewItem`
--

CREATE TABLE `tViewItem` (
  `sID_View` varchar(64) NOT NULL,
  `sURI` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Klíče pro exportované tabulky
--

--
-- Klíče pro tabulku `tContainer`
--
ALTER TABLE `tContainer`
  ADD PRIMARY KEY (`sID_Container`);

--
-- Klíče pro tabulku `tContainerItem`
--
ALTER TABLE `tContainerItem`
  ADD PRIMARY KEY (`sID_Container`,`sID_Item`);

--
-- Klíče pro tabulku `tDigitalItem`
--
ALTER TABLE `tDigitalItem`
  ADD PRIMARY KEY (`sID_Item`);

--
-- Klíče pro tabulku `tDigitalSet`
--
ALTER TABLE `tDigitalSet`
  ADD PRIMARY KEY (`sID_Set`);

--
-- Klíče pro tabulku `tDIGroup`
--
ALTER TABLE `tDIGroup`
  ADD PRIMARY KEY (`sID_Group`);

--
-- Klíče pro tabulku `tGroupItem`
--
ALTER TABLE `tGroupItem`
  ADD PRIMARY KEY (`sID_Group`,`sID_Item`);

--
-- Klíče pro tabulku `tGroupSet`
--
ALTER TABLE `tGroupSet`
  ADD PRIMARY KEY (`sID_Set`,`sID_Group`) USING BTREE;

--
-- Klíče pro tabulku `tMetadata`
--
ALTER TABLE `tMetadata`
  ADD PRIMARY KEY (`sID`,`sKey`);

--
-- Klíče pro tabulku `tMetaKey`
--
ALTER TABLE `tMetaKey`
  ADD PRIMARY KEY (`sKey`),
  ADD UNIQUE KEY `sKey` (`sKey`);

--
-- Klíče pro tabulku `tView`
--
ALTER TABLE `tView`
  ADD PRIMARY KEY (`sID_View`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

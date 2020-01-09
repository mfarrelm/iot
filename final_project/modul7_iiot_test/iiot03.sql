-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2019 at 08:37 AM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iiot03`
--

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `ID` int(11) NOT NULL,
  `TAG_ID` int(11) NOT NULL,
  `DTIME` datetime NOT NULL,
  `VALUE` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `node`
--

CREATE TABLE `node` (
  `ID` int(11) NOT NULL,
  `NODE` varchar(10) NOT NULL,
  `PX` int(11) DEFAULT NULL,
  `PY` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `node`
--

INSERT INTO `node` (`ID`, `NODE`, `PX`, `PY`) VALUES
(1, 'NODE01', 1, 1),
(2, 'NODE02', 1, 2),
(3, 'NODE03', 1, 3),
(4, 'NODE04', 1, 4),
(5, 'NODE05', 2, 1),
(6, 'NODE06', 2, 2),
(7, 'NODE07', 2, 3),
(8, 'NODE08', 2, 4),
(9, 'NODE09', 3, 1),
(10, 'NODE10', 3, 2),
(11, 'NODE11', 3, 3),
(12, 'NODE12', 3, 4),
(13, 'NODE13', 4, 1),
(14, 'NODE14', 4, 2),
(15, 'NODE15', 4, 3),
(16, 'NODE16', 4, 4);

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `ID` int(11) NOT NULL,
  `NODE_ID` int(11) NOT NULL,
  `TAG` varchar(10) NOT NULL,
  `TYPE` varchar(2) NOT NULL,
  `UNIT` varchar(10) NOT NULL,
  `OFFSET` float NOT NULL,
  `SPAN` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`ID`, `NODE_ID`, `TAG`, `TYPE`, `UNIT`, `OFFSET`, `SPAN`) VALUES
(1, 1, 'CT011', 'AI', 'Candela', 0, 3000),
(2, 1, 'CC011', 'AO', 'Candela', 0, 3000),
(3, 1, 'DIR011', 'AI', 'i8', 0, 255),
(4, 1, 'DIG011', 'AI', 'i8', 0, 255),
(5, 1, 'DIB011', 'AI', 'i8', 0, 255),
(6, 1, 'DVR011', 'AO', 'i8', 0, 255),
(7, 1, 'DVG011', 'AO', 'i8', 0, 255),
(8, 1, 'DVB011', 'AO', 'i8', 0, 255),
(9, 1, 'YI011', 'DI', 'Binary', 0, 1),
(10, 1, 'YS011', 'DO', 'Binary', 0, 1),
(11, 2, 'CT021', 'AI', 'Candela', 0, 3000),
(12, 2, 'CC021', 'AO', 'Candela', 0, 3000),
(13, 2, 'DIR021', 'AI', 'i8', 0, 255),
(14, 2, 'DIG021', 'AI', 'i8', 0, 255),
(15, 2, 'DIB021', 'AI', 'i8', 0, 255),
(16, 2, 'DVR021', 'AO', 'i8', 0, 255),
(17, 2, 'DVG021', 'AO', 'i8', 0, 255),
(18, 2, 'DVB021', 'AO', 'i8', 0, 255),
(19, 2, 'YI021', 'DI', 'Binary', 0, 1),
(20, 2, 'YS021', 'DO', 'Binary', 0, 1),
(31, 3, 'CT031', 'AI', 'Candela', 0, 3000),
(32, 3, 'CC031', 'AO', 'Candela', 0, 3000),
(33, 3, 'DIR031', 'AI', 'i8', 0, 255),
(34, 3, 'DIG031', 'AI', 'i8', 0, 255),
(35, 3, 'DIB031', 'AI', 'i8', 0, 255),
(36, 3, 'DVR031', 'AO', 'i8', 0, 255),
(37, 3, 'DVG031', 'AO', 'i8', 0, 255),
(38, 3, 'DVB031', 'AO', 'i8', 0, 255),
(39, 3, 'YI031', 'DI', 'Binary', 0, 1),
(40, 3, 'YS031', 'DO', 'Binary', 0, 1),
(41, 4, 'CT041', 'AI', 'Candela', 0, 3000),
(42, 4, 'CC041', 'AO', 'Candela', 0, 3000),
(43, 4, 'DIR041', 'AI', 'i8', 0, 255),
(44, 4, 'DIG041', 'AI', 'i8', 0, 255),
(45, 4, 'DIB041', 'AI', 'i8', 0, 255),
(46, 4, 'DVR041', 'AO', 'i8', 0, 255),
(47, 4, 'DVG041', 'AO', 'i8', 0, 255),
(48, 4, 'DVB041', 'AO', 'i8', 0, 255),
(49, 4, 'YI041', 'DI', 'Binary', 0, 1),
(50, 4, 'YS041', 'DO', 'Binary', 0, 1),
(51, 5, 'CT051', 'AI', 'Candela', 0, 3000),
(52, 5, 'CC051', 'AO', 'Candela', 0, 3000),
(53, 5, 'DIR051', 'AI', 'i8', 0, 255),
(54, 5, 'DIG051', 'AI', 'i8', 0, 255),
(55, 5, 'DIB051', 'AI', 'i8', 0, 255),
(56, 5, 'DVR051', 'AO', 'i8', 0, 255),
(57, 5, 'DVG051', 'AO', 'i8', 0, 255),
(58, 5, 'DVB051', 'AO', 'i8', 0, 255),
(59, 5, 'YI051', 'DI', 'Binary', 0, 1),
(60, 5, 'YS051', 'DO', 'Binary', 0, 1),
(61, 6, 'CT061', 'AI', 'Candela', 0, 3000),
(62, 6, 'CC061', 'AO', 'Candela', 0, 3000),
(63, 6, 'DIR061', 'AI', 'i8', 0, 255),
(64, 6, 'DIG061', 'AI', 'i8', 0, 255),
(65, 6, 'DIB061', 'AI', 'i8', 0, 255),
(66, 6, 'DVR061', 'AO', 'i8', 0, 255),
(67, 6, 'DVG061', 'AO', 'i8', 0, 255),
(68, 6, 'DVB061', 'AO', 'i8', 0, 255),
(69, 6, 'YI061', 'DI', 'Binary', 0, 1),
(70, 6, 'YS061', 'DO', 'Binary', 0, 1),
(71, 7, 'CT071', 'AI', 'Candela', 0, 3000),
(72, 7, 'CC071', 'AO', 'Candela', 0, 3000),
(73, 7, 'DIR071', 'AI', 'i8', 0, 255),
(74, 7, 'DIG071', 'AI', 'i8', 0, 255),
(75, 7, 'DIB071', 'AI', 'i8', 0, 255),
(76, 7, 'DVR071', 'AO', 'i8', 0, 255),
(77, 7, 'DVG071', 'AO', 'i8', 0, 255),
(78, 7, 'DVB071', 'AO', 'i8', 0, 255),
(79, 7, 'YI071', 'DI', 'Binary', 0, 1),
(80, 7, 'YS071', 'DO', 'Binary', 0, 1),
(81, 8, 'CT081', 'AI', 'Candela', 0, 3000),
(82, 8, 'CC081', 'AO', 'Candela', 0, 3000),
(83, 8, 'DIR081', 'AI', 'i8', 0, 255),
(84, 8, 'DIG081', 'AI', 'i8', 0, 255),
(85, 8, 'DIB081', 'AI', 'i8', 0, 255),
(86, 8, 'DVR081', 'AO', 'i8', 0, 255),
(87, 8, 'DVG081', 'AO', 'i8', 0, 255),
(88, 8, 'DVB081', 'AO', 'i8', 0, 255),
(89, 8, 'YI081', 'DI', 'Binary', 0, 1),
(90, 8, 'YS081', 'DO', 'Binary', 0, 1),
(91, 9, 'CT091', 'AI', 'Candela', 0, 3000),
(92, 9, 'CC091', 'AO', 'Candela', 0, 3000),
(93, 9, 'DIR091', 'AI', 'i8', 0, 255),
(94, 9, 'DIG091', 'AI', 'i8', 0, 255),
(95, 9, 'DIB091', 'AI', 'i8', 0, 255),
(96, 9, 'DVR091', 'AO', 'i8', 0, 255),
(97, 9, 'DVG091', 'AO', 'i8', 0, 255),
(98, 9, 'DVB091', 'AO', 'i8', 0, 255),
(99, 9, 'YI091', 'DI', 'Binary', 0, 1),
(100, 9, 'YS091', 'DO', 'Binary', 0, 1),
(101, 10, 'CT101', 'AI', 'Candela', 0, 3000),
(102, 10, 'CC101', 'AO', 'Candela', 0, 3000),
(103, 10, 'DIR101', 'AI', 'i8', 0, 255),
(104, 10, 'DIG101', 'AI', 'i8', 0, 255),
(105, 10, 'DIB101', 'AI', 'i8', 0, 255),
(106, 10, 'DVR101', 'AO', 'i8', 0, 255),
(107, 10, 'DVG101', 'AO', 'i8', 0, 255),
(108, 10, 'DVB101', 'AO', 'i8', 0, 255),
(109, 10, 'YI101', 'DI', 'Binary', 0, 1),
(110, 10, 'YS101', 'DO', 'Binary', 0, 1),
(111, 11, 'CT111', 'AI', 'Candela', 0, 3000),
(112, 11, 'CC111', 'AO', 'Candela', 0, 3000),
(113, 11, 'DIR111', 'AI', 'i8', 0, 255),
(114, 11, 'DIG111', 'AI', 'i8', 0, 255),
(115, 11, 'DIB111', 'AI', 'i8', 0, 255),
(116, 11, 'DVR111', 'AO', 'i8', 0, 255),
(117, 11, 'DVG111', 'AO', 'i8', 0, 255),
(118, 11, 'DVB111', 'AO', 'i8', 0, 255),
(119, 11, 'YI111', 'DI', 'Binary', 0, 1),
(120, 11, 'YS111', 'DO', 'Binary', 0, 1),
(121, 12, 'CT121', 'AI', 'Candela', 0, 3000),
(122, 12, 'CC121', 'AO', 'Candela', 0, 3000),
(123, 12, 'DIR121', 'AI', 'i8', 0, 255),
(124, 12, 'DIG121', 'AI', 'i8', 0, 255),
(125, 12, 'DIB121', 'AI', 'i8', 0, 255),
(126, 12, 'DVR121', 'AO', 'i8', 0, 255),
(127, 12, 'DVG121', 'AO', 'i8', 0, 255),
(128, 12, 'DVB121', 'AO', 'i8', 0, 255),
(129, 12, 'YI121', 'DI', 'Binary', 0, 1),
(130, 12, 'YS121', 'DO', 'Binary', 0, 1),
(131, 13, 'CT131', 'AI', 'Candela', 0, 3000),
(132, 13, 'CC131', 'AO', 'Candela', 0, 3000),
(133, 13, 'DIR131', 'AI', 'i8', 0, 255),
(134, 13, 'DIG131', 'AI', 'i8', 0, 255),
(135, 13, 'DIB131', 'AI', 'i8', 0, 255),
(136, 13, 'DVR131', 'AO', 'i8', 0, 255),
(137, 13, 'DVG131', 'AO', 'i8', 0, 255),
(138, 13, 'DVB131', 'AO', 'i8', 0, 255),
(139, 13, 'YI131', 'DI', 'Binary', 0, 1),
(140, 13, 'YS131', 'DO', 'Binary', 0, 1),
(141, 14, 'CT141', 'AI', 'Candela', 0, 3000),
(142, 14, 'CC141', 'AO', 'Candela', 0, 3000),
(143, 14, 'DIR141', 'AI', 'i8', 0, 255),
(144, 14, 'DIG141', 'AI', 'i8', 0, 255),
(145, 14, 'DIB141', 'AI', 'i8', 0, 255),
(146, 14, 'DVR141', 'AO', 'i8', 0, 255),
(147, 14, 'DVG141', 'AO', 'i8', 0, 255),
(148, 14, 'DVB141', 'AO', 'i8', 0, 255),
(149, 14, 'YI141', 'DI', 'Binary', 0, 1),
(150, 14, 'YS141', 'DO', 'Binary', 0, 1),
(151, 15, 'CT151', 'AI', 'Candela', 0, 3000),
(152, 15, 'CC151', 'AO', 'Candela', 0, 3000),
(153, 15, 'DIR151', 'AI', 'i8', 0, 255),
(154, 15, 'DIG151', 'AI', 'i8', 0, 255),
(155, 15, 'DIB151', 'AI', 'i8', 0, 255),
(156, 15, 'DVR151', 'AO', 'i8', 0, 255),
(157, 15, 'DVG151', 'AO', 'i8', 0, 255),
(158, 15, 'DVB151', 'AO', 'i8', 0, 255),
(159, 15, 'YI151', 'DI', 'Binary', 0, 1),
(160, 15, 'YS151', 'DO', 'Binary', 0, 1),
(161, 16, 'CT161', 'AI', 'Candela', 0, 3000),
(162, 16, 'CC161', 'AO', 'Candela', 0, 3000),
(163, 16, 'DIR161', 'AI', 'i8', 0, 255),
(164, 16, 'DIG161', 'AI', 'i8', 0, 255),
(165, 16, 'DIB161', 'AI', 'i8', 0, 255),
(166, 16, 'DVR161', 'AO', 'i8', 0, 255),
(167, 16, 'DVG161', 'AO', 'i8', 0, 255),
(168, 16, 'DVB161', 'AO', 'i8', 0, 255),
(169, 16, 'YI161', 'DI', 'Binary', 0, 1),
(170, 16, 'YS161', 'DO', 'Binary', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `username` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `monitor` tinyint(1) NOT NULL,
  `supervise` tinyint(1) NOT NULL,
  `configure` tinyint(1) NOT NULL,
  `analyzing` tinyint(1) NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `name`, `username`, `password`, `monitor`, `supervise`, `configure`, `analyzing`, `admin`) VALUES
(1, 'admin', 'admin', 'admin', 1, 1, 1, 1, 1),
(2, 'user', 'user', 'user', 1, 1, 0, 0, 0),
(3, 'supervisor', 'supervisor', 'supervisor', 1, 1, 0, 0, 1),
(4, 'engineer', 'engineer', 'engineer', 1, 1, 1, 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_DATA_TAG` (`TAG_ID`),
  ADD KEY `DTIME` (`DTIME`);

--
-- Indexes for table `node`
--
ALTER TABLE `node`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `NODE_2` (`NODE`),
  ADD KEY `NODE` (`NODE`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_TAG_NODE` (`NODE_ID`),
  ADD UNIQUE KEY `TAG_2` (`TAG`),
  ADD KEY `TAG` (`TAG`),
  ADD KEY `TYPE` (`TYPE`),
  ADD KEY `UNIT` (`UNIT`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `USERNAME_2` (`USERNAME`),
  ADD KEY `USERNAME` (`USERNAME`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

--
-- AUTO_INCREMENT for table `node`
--
ALTER TABLE `node`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=171;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `data`
--
ALTER TABLE `data`
  ADD CONSTRAINT `FK_DATA_TAG` FOREIGN KEY (`TAG_ID`) REFERENCES `tag` (`ID`);

--
-- Constraints for table `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `FK_TAG_NODE` FOREIGN KEY (`NODE_ID`) REFERENCES `node` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

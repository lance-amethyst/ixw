
create database IF NOT EXISTS {PRJ};
use {PRJ};
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` char(255) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `desc` text COLLATE utf8_unicode_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_users_on_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1, 'admin', SHA1('admin'), 0, '{}', now(), now());
UNLOCK TABLES;

DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules` (
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `desc` text COLLATE utf8_unicode_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  UNIQUE KEY `index_modules_on_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `modules` WRITE;
INSERT INTO `modules` VALUES ("moduleA", 'this is module A', now(), now()),
("moduleB", 'this is module B', now(), now());
UNLOCK TABLES;
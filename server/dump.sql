/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: access_rights
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `access_rights` (
  `access_rights_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`access_rights_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 18 DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: accessrightsec
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `accessrightsec` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `educationalCenterEducationalCenterId` int(11) NOT NULL,
  `accessRightAccessRightsId` int(11) NOT NULL,
  PRIMARY KEY (
  `educationalCenterEducationalCenterId`,
  `accessRightAccessRightsId`
  ),
  KEY `accessRightAccessRightsId` (`accessRightAccessRightsId`),
  CONSTRAINT `accessrightsec_ibfk_1` FOREIGN KEY (`educationalCenterEducationalCenterId`) REFERENCES `educational_centers` (`educational_center_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `accessrightsec_ibfk_2` FOREIGN KEY (`accessRightAccessRightsId`) REFERENCES `access_rights` (`access_rights_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: articles
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `articles` (
  `articles_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`articles_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: articlesec
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `articlesec` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `educationalCenterEducationalCenterId` int(11) NOT NULL,
  `articleArticlesId` int(11) NOT NULL,
  PRIMARY KEY (
  `educationalCenterEducationalCenterId`,
  `articleArticlesId`
  ),
  KEY `articleArticlesId` (`articleArticlesId`),
  CONSTRAINT `articlesec_ibfk_1` FOREIGN KEY (`educationalCenterEducationalCenterId`) REFERENCES `educational_centers` (`educational_center_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `articlesec_ibfk_2` FOREIGN KEY (`articleArticlesId`) REFERENCES `articles` (`articles_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: articlesrubrics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `articlesrubrics` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `articleArticlesId` int(11) NOT NULL,
  `rubricRubricsId` int(11) NOT NULL,
  PRIMARY KEY (`articleArticlesId`, `rubricRubricsId`),
  KEY `rubricRubricsId` (`rubricRubricsId`),
  CONSTRAINT `articlesrubrics_ibfk_1` FOREIGN KEY (`articleArticlesId`) REFERENCES `articles` (`articles_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `articlesrubrics_ibfk_2` FOREIGN KEY (`rubricRubricsId`) REFERENCES `rubrics` (`rubrics_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: categories
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: curse_statuses
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `curse_statuses` (
  `curse_status_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`curse_status_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: cursecategory
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cursecategory` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `curseCurseId` int(11) NOT NULL,
  `categoryCategoryId` int(11) NOT NULL,
  PRIMARY KEY (`curseCurseId`, `categoryCategoryId`),
  KEY `categoryCategoryId` (`categoryCategoryId`),
  CONSTRAINT `cursecategory_ibfk_1` FOREIGN KEY (`curseCurseId`) REFERENCES `curses` (`curse_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cursecategory_ibfk_2` FOREIGN KEY (`categoryCategoryId`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: cursecursestatus
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cursecursestatus` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `curseCurseId` int(11) NOT NULL,
  `statusCurseStatusId` int(11) NOT NULL,
  PRIMARY KEY (`curseCurseId`, `statusCurseStatusId`),
  KEY `statusCurseStatusId` (`statusCurseStatusId`),
  CONSTRAINT `cursecursestatus_ibfk_1` FOREIGN KEY (`curseCurseId`) REFERENCES `curses` (`curse_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cursecursestatus_ibfk_2` FOREIGN KEY (`statusCurseStatusId`) REFERENCES `statuses` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: curses
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `curses` (
  `curse_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `program` text,
  `town` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `lector` text NOT NULL,
  `date_start` varchar(255) NOT NULL,
  `date_end` varchar(255) NOT NULL,
  `price` varchar(255) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `image` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`curse_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: cursestatus
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cursestatus` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `curseCurseId` int(11) NOT NULL,
  `statusStatusId` int(11) NOT NULL,
  PRIMARY KEY (`curseCurseId`, `statusStatusId`),
  KEY `statusStatusId` (`statusStatusId`),
  CONSTRAINT `cursestatus_ibfk_1` FOREIGN KEY (`curseCurseId`) REFERENCES `curses` (`curse_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cursestatus_ibfk_2` FOREIGN KEY (`statusStatusId`) REFERENCES `statuses` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: docstatus
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `docstatus` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `doctorDoctorId` int(11) NOT NULL,
  `statusStatusId` int(11) NOT NULL,
  PRIMARY KEY (`doctorDoctorId`, `statusStatusId`),
  KEY `statusStatusId` (`statusStatusId`),
  CONSTRAINT `docstatus_ibfk_1` FOREIGN KEY (`doctorDoctorId`) REFERENCES `doctors` (`doctor_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `docstatus_ibfk_2` FOREIGN KEY (`statusStatusId`) REFERENCES `statuses` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: doctorar
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `doctorar` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `doctorDoctorId` int(11) NOT NULL,
  `accessRightAccessRightsId` int(11) NOT NULL,
  PRIMARY KEY (`doctorDoctorId`, `accessRightAccessRightsId`),
  KEY `accessRightAccessRightsId` (`accessRightAccessRightsId`),
  CONSTRAINT `doctorar_ibfk_1` FOREIGN KEY (`doctorDoctorId`) REFERENCES `doctors` (`doctor_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doctorar_ibfk_2` FOREIGN KEY (`accessRightAccessRightsId`) REFERENCES `access_rights` (`access_rights_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: doctorcurse
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `doctorcurse` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `doctorDoctorId` int(11) NOT NULL,
  `curseCurseId` int(11) NOT NULL,
  PRIMARY KEY (`doctorDoctorId`, `curseCurseId`),
  KEY `curseCurseId` (`curseCurseId`),
  CONSTRAINT `doctorcurse_ibfk_1` FOREIGN KEY (`doctorDoctorId`) REFERENCES `doctors` (`doctor_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doctorcurse_ibfk_2` FOREIGN KEY (`curseCurseId`) REFERENCES `curses` (`curse_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: doctormoder
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `doctormoder` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `doctorDoctorId` int(11) NOT NULL,
  `moderationModerationId` int(11) NOT NULL,
  PRIMARY KEY (`doctorDoctorId`, `moderationModerationId`),
  KEY `moderationModerationId` (`moderationModerationId`),
  CONSTRAINT `doctormoder_ibfk_1` FOREIGN KEY (`doctorDoctorId`) REFERENCES `doctors` (`doctor_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `doctormoder_ibfk_2` FOREIGN KEY (`moderationModerationId`) REFERENCES `moderations` (`moderation_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: doctors
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `doctors` (
  `doctor_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`doctor_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: eccategory
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `eccategory` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `educationalCenterEducationalCenterId` int(11) NOT NULL,
  `categoryCategoryId` int(11) NOT NULL,
  PRIMARY KEY (
  `educationalCenterEducationalCenterId`,
  `categoryCategoryId`
  ),
  KEY `categoryCategoryId` (`categoryCategoryId`),
  CONSTRAINT `eccategory_ibfk_1` FOREIGN KEY (`educationalCenterEducationalCenterId`) REFERENCES `educational_centers` (`educational_center_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `eccategory_ibfk_2` FOREIGN KEY (`categoryCategoryId`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: eccurse
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `eccurse` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `educationalCenterEducationalCenterId` int(11) NOT NULL,
  `curseCurseId` int(11) NOT NULL,
  PRIMARY KEY (
  `educationalCenterEducationalCenterId`,
  `curseCurseId`
  ),
  KEY `curseCurseId` (`curseCurseId`),
  CONSTRAINT `eccurse_ibfk_1` FOREIGN KEY (`educationalCenterEducationalCenterId`) REFERENCES `educational_centers` (`educational_center_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `eccurse_ibfk_2` FOREIGN KEY (`curseCurseId`) REFERENCES `curses` (`curse_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ecrubrics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ecrubrics` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `educationalCenterEducationalCenterId` int(11) NOT NULL,
  `rubricRubricsId` int(11) NOT NULL,
  PRIMARY KEY (
  `educationalCenterEducationalCenterId`,
  `rubricRubricsId`
  ),
  KEY `rubricRubricsId` (`rubricRubricsId`),
  CONSTRAINT `ecrubrics_ibfk_1` FOREIGN KEY (`educationalCenterEducationalCenterId`) REFERENCES `educational_centers` (`educational_center_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ecrubrics_ibfk_2` FOREIGN KEY (`rubricRubricsId`) REFERENCES `rubrics` (`rubrics_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ecstatus
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ecstatus` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `educationalCenterEducationalCenterId` int(11) NOT NULL,
  `statusStatusId` int(11) NOT NULL,
  PRIMARY KEY (
  `educationalCenterEducationalCenterId`,
  `statusStatusId`
  ),
  KEY `statusStatusId` (`statusStatusId`),
  CONSTRAINT `ecstatus_ibfk_1` FOREIGN KEY (`educationalCenterEducationalCenterId`) REFERENCES `educational_centers` (`educational_center_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ecstatus_ibfk_2` FOREIGN KEY (`statusStatusId`) REFERENCES `statuses` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: educational_centers
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `educational_centers` (
  `educational_center_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `contact_person` text NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `site_url` varchar(255) DEFAULT NULL,
  `requisites` text NOT NULL,
  `add_notes` text,
  `refresh_token` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`educational_center_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: moderations
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `moderations` (
  `moderation_id` int(11) NOT NULL AUTO_INCREMENT,
  `new_information` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`moderation_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 73 DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: moderec
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `moderec` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `moderationModerationId` int(11) NOT NULL,
  `educationalCenterEducationalCenterId` int(11) NOT NULL,
  PRIMARY KEY (
  `moderationModerationId`,
  `educationalCenterEducationalCenterId`
  ),
  KEY `educationalCenterEducationalCenterId` (`educationalCenterEducationalCenterId`),
  CONSTRAINT `moderec_ibfk_1` FOREIGN KEY (`moderationModerationId`) REFERENCES `moderations` (`moderation_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `moderec_ibfk_2` FOREIGN KEY (`educationalCenterEducationalCenterId`) REFERENCES `educational_centers` (`educational_center_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: rubrics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `rubrics` (
  `rubrics_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`rubrics_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 11 DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: statuses
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `statuses` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: access_rights
# ------------------------------------------------------------

INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (1, 'ec_access_curse');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (2, 'ec_access_category');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (3, 'ec_access_reports');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (4, 'ec_access_blog');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (5, 'ec_access_trash');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (6, 'doc_access_subscribe');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (7, 'admin_add_center');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (8, 'admin_edit_center');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (9, 'admin_remove_center');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (10, 'admin_moderate_center');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (11, 'admin_add_doctor');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (12, 'admin_edit_doctor');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (13, 'admin_remove_doctor');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (14, 'admin_moderate_doctor');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (15, 'admin_add_curse');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (16, 'admin_edit_curse');
INSERT INTO
  `access_rights` (`access_rights_id`, `type`)
VALUES
  (17, 'admin_remove_curse');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: accessrightsec
# ------------------------------------------------------------

INSERT INTO
  `accessrightsec` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `accessRightAccessRightsId`
  )
VALUES
  ('2022-07-18 21:31:04', '2022-07-18 21:31:04', 1, 1);
INSERT INTO
  `accessrightsec` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `accessRightAccessRightsId`
  )
VALUES
  ('2022-09-01 00:50:28', '2022-09-01 00:50:28', 1, 2);
INSERT INTO
  `accessrightsec` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `accessRightAccessRightsId`
  )
VALUES
  ('2022-09-01 00:50:28', '2022-09-01 00:50:28', 1, 3);
INSERT INTO
  `accessrightsec` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `accessRightAccessRightsId`
  )
VALUES
  ('2022-09-01 00:51:12', '2022-09-01 00:51:12', 1, 4);
INSERT INTO
  `accessrightsec` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `accessRightAccessRightsId`
  )
VALUES
  ('2022-09-14 21:28:15', '2022-09-14 21:28:15', 2, 1);
INSERT INTO
  `accessrightsec` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `accessRightAccessRightsId`
  )
VALUES
  ('2022-09-14 21:28:15', '2022-09-14 21:28:15', 2, 2);
INSERT INTO
  `accessrightsec` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `accessRightAccessRightsId`
  )
VALUES
  ('2022-09-14 21:28:44', '2022-09-14 21:28:44', 2, 3);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: articles
# ------------------------------------------------------------

INSERT INTO
  `articles` (
    `articles_id`,
    `title`,
    `description`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'title1',
    'asdasdasd',
    '2022-07-17 20:22:52',
    '2022-07-17 21:20:03'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: articlesec
# ------------------------------------------------------------

INSERT INTO
  `articlesec` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `articleArticlesId`
  )
VALUES
  ('2022-07-17 20:22:52', '2022-07-17 20:22:52', 1, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: articlesrubrics
# ------------------------------------------------------------

INSERT INTO
  `articlesrubrics` (
    `createdAt`,
    `updatedAt`,
    `articleArticlesId`,
    `rubricRubricsId`
  )
VALUES
  ('2022-07-17 21:20:03', '2022-07-17 21:20:03', 1, 10);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: categories
# ------------------------------------------------------------

INSERT INTO
  `categories` (
    `category_id`,
    `title`,
    `image`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    'categ123vvwww',
    '/uploads/5c8b583e-5a01-41d0-848d-b94ce4886116.png',
    '2022-07-17 21:10:27',
    '2022-08-31 22:21:46'
  );
INSERT INTO
  `categories` (
    `category_id`,
    `title`,
    `image`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    'category1',
    '/uploads/ad5bec98-131c-473b-86f9-cb3c9042cc54.jpg',
    '2022-08-31 22:02:29',
    '2022-09-03 10:18:58'
  );
INSERT INTO
  `categories` (
    `category_id`,
    `title`,
    `image`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    4,
    'test',
    '/uploads/048a9b77-7386-46a6-9973-9a3c94344f20.jpg',
    '2022-09-14 18:29:25',
    '2022-09-14 18:29:25'
  );
INSERT INTO
  `categories` (
    `category_id`,
    `title`,
    `image`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    'adsfasdfsdf',
    '',
    '2022-09-28 20:24:19',
    '2022-09-28 20:24:19'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: curse_statuses
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: cursecategory
# ------------------------------------------------------------

INSERT INTO
  `cursecategory` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `categoryCategoryId`
  )
VALUES
  ('2022-09-29 20:48:25', '2022-09-29 20:48:25', 6, 2);
INSERT INTO
  `cursecategory` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `categoryCategoryId`
  )
VALUES
  ('2022-09-29 20:48:25', '2022-09-29 20:48:25', 6, 3);
INSERT INTO
  `cursecategory` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `categoryCategoryId`
  )
VALUES
  ('2022-09-29 20:48:25', '2022-09-29 20:48:25', 6, 5);
INSERT INTO
  `cursecategory` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `categoryCategoryId`
  )
VALUES
  ('2022-08-31 22:37:08', '2022-08-31 22:37:08', 7, 2);
INSERT INTO
  `cursecategory` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `categoryCategoryId`
  )
VALUES
  ('2022-08-31 22:37:08', '2022-08-31 22:37:08', 7, 3);
INSERT INTO
  `cursecategory` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `categoryCategoryId`
  )
VALUES
  ('2022-09-29 20:49:34', '2022-09-29 20:49:34', 8, 4);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: cursecursestatus
# ------------------------------------------------------------

INSERT INTO
  `cursecursestatus` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `statusCurseStatusId`
  )
VALUES
  ('2022-09-03 10:20:38', '2022-09-03 10:20:38', 6, 1);
INSERT INTO
  `cursecursestatus` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `statusCurseStatusId`
  )
VALUES
  ('2022-07-18 14:17:12', '2022-07-18 14:17:12', 7, 1);
INSERT INTO
  `cursecursestatus` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `statusCurseStatusId`
  )
VALUES
  ('2022-09-14 18:30:02', '2022-09-14 18:30:02', 8, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: curses
# ------------------------------------------------------------

INSERT INTO
  `curses` (
    `curse_id`,
    `title`,
    `program`,
    `town`,
    `address`,
    `lector`,
    `date_start`,
    `date_end`,
    `price`,
    `score`,
    `image`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    6,
    'testetsetset',
    'asdasdasdasd\r\nasdasd\r\nasdasdasd',
    '123123123123',
    'asd',
    'asd',
    '2022-07-21',
    '2022-11-30',
    '123',
    122,
    '/uploads/f7445a24-d32c-453c-ace0-bec5ee098a76.png',
    '2022-07-17 21:34:11',
    '2022-09-29 20:48:25'
  );
INSERT INTO
  `curses` (
    `curse_id`,
    `title`,
    `program`,
    `town`,
    `address`,
    `lector`,
    `date_start`,
    `date_end`,
    `price`,
    `score`,
    `image`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    7,
    'asfsdfhgsdf',
    'ASDASDASDASD',
    'asdasd',
    'asdasd',
    'asdasd',
    '2022-07-18',
    '2022-07-31',
    '123123123',
    123123123,
    '/uploads/2ff6c1f1-fdca-4f37-a3c2-db16a1e9039f.jpg',
    '2022-07-18 14:17:12',
    '2022-08-31 22:37:08'
  );
INSERT INTO
  `curses` (
    `curse_id`,
    `title`,
    `program`,
    `town`,
    `address`,
    `lector`,
    `date_start`,
    `date_end`,
    `price`,
    `score`,
    `image`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    8,
    'asdasdasdasd afsdfasdfasdf',
    'asdasdasdasd afsdfasdfasdf\r\nasdasdasdasd afsdfasdfasdf\r\nasdasdasdasd afsdfasdfasdf\r\nasdasdasdasd afsdfasdfasdf',
    'Краснодар',
    'Центральная',
    'Лектор1',
    '2022-09-14',
    '2022-09-30',
    '3425234',
    0,
    '/uploads/114f1096-2bff-4263-be5d-d41d531f6904.png',
    '2022-09-14 18:30:02',
    '2022-09-29 20:49:34'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: cursestatus
# ------------------------------------------------------------

INSERT INTO
  `cursestatus` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `statusStatusId`
  )
VALUES
  ('2022-09-28 23:19:21', '2022-09-28 23:19:21', 6, 1);
INSERT INTO
  `cursestatus` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `statusStatusId`
  )
VALUES
  ('2022-09-28 23:19:21', '2022-09-28 23:19:21', 7, 1);
INSERT INTO
  `cursestatus` (
    `createdAt`,
    `updatedAt`,
    `curseCurseId`,
    `statusStatusId`
  )
VALUES
  ('2022-09-28 23:19:21', '2022-09-28 23:19:21', 8, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: docstatus
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: doctorar
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: doctorcurse
# ------------------------------------------------------------

INSERT INTO
  `doctorcurse` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `curseCurseId`
  )
VALUES
  ('2022-09-15 09:53:50', '2022-09-15 09:53:50', 1, 6);
INSERT INTO
  `doctorcurse` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `curseCurseId`
  )
VALUES
  ('2022-09-15 09:53:50', '2022-09-15 09:53:50', 1, 8);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: doctormoder
# ------------------------------------------------------------

INSERT INTO
  `doctormoder` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `moderationModerationId`
  )
VALUES
  ('2022-09-15 09:16:49', '2022-09-15 09:16:49', 1, 52);
INSERT INTO
  `doctormoder` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `moderationModerationId`
  )
VALUES
  ('2022-09-15 09:37:33', '2022-09-15 09:37:33', 1, 56);
INSERT INTO
  `doctormoder` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `moderationModerationId`
  )
VALUES
  ('2022-09-15 09:38:17', '2022-09-15 09:38:17', 1, 57);
INSERT INTO
  `doctormoder` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `moderationModerationId`
  )
VALUES
  ('2022-09-15 09:45:53', '2022-09-15 09:45:53', 1, 58);
INSERT INTO
  `doctormoder` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `moderationModerationId`
  )
VALUES
  ('2022-09-15 13:45:25', '2022-09-15 13:45:25', 1, 59);
INSERT INTO
  `doctormoder` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `moderationModerationId`
  )
VALUES
  ('2022-09-15 13:52:24', '2022-09-15 13:52:24', 1, 60);
INSERT INTO
  `doctormoder` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `moderationModerationId`
  )
VALUES
  ('2022-09-15 13:52:46', '2022-09-15 13:52:46', 1, 61);
INSERT INTO
  `doctormoder` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `moderationModerationId`
  )
VALUES
  ('2022-09-15 13:54:07', '2022-09-15 13:54:07', 1, 62);
INSERT INTO
  `doctormoder` (
    `createdAt`,
    `updatedAt`,
    `doctorDoctorId`,
    `moderationModerationId`
  )
VALUES
  ('2022-09-15 13:54:26', '2022-09-15 13:54:26', 1, 63);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: doctors
# ------------------------------------------------------------

INSERT INTO
  `doctors` (
    `doctor_id`,
    `name`,
    `phone`,
    `email`,
    `password`,
    `region`,
    `refresh_token`,
    `specialization`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'test',
    '234512341234234',
    'ivan.spiridonov.0100@mail.ru',
    '202cb962ac59075b964b07152d234b70',
    'Moscow',
    '236502f8-c018-4439-95b6-732e33963512',
    'Ортопедия',
    '2022-09-13 11:40:30',
    '2022-09-22 22:01:53'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: eccategory
# ------------------------------------------------------------

INSERT INTO
  `eccategory` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `categoryCategoryId`
  )
VALUES
  ('2022-07-17 21:10:27', '2022-07-17 21:10:27', 1, 2);
INSERT INTO
  `eccategory` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `categoryCategoryId`
  )
VALUES
  ('2022-08-31 22:02:29', '2022-08-31 22:02:29', 1, 3);
INSERT INTO
  `eccategory` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `categoryCategoryId`
  )
VALUES
  ('2022-09-28 20:24:20', '2022-09-28 20:24:20', 1, 5);
INSERT INTO
  `eccategory` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `categoryCategoryId`
  )
VALUES
  ('2022-09-14 18:29:25', '2022-09-14 18:29:25', 2, 4);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: eccurse
# ------------------------------------------------------------

INSERT INTO
  `eccurse` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `curseCurseId`
  )
VALUES
  ('2022-07-17 21:34:11', '2022-07-17 21:34:11', 1, 6);
INSERT INTO
  `eccurse` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `curseCurseId`
  )
VALUES
  ('2022-07-18 14:17:12', '2022-07-18 14:17:12', 1, 7);
INSERT INTO
  `eccurse` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `curseCurseId`
  )
VALUES
  ('2022-09-14 18:30:02', '2022-09-14 18:30:02', 2, 8);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ecrubrics
# ------------------------------------------------------------

INSERT INTO
  `ecrubrics` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `rubricRubricsId`
  )
VALUES
  ('2022-07-17 20:25:34', '2022-07-17 20:25:34', 1, 10);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ecstatus
# ------------------------------------------------------------

INSERT INTO
  `ecstatus` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `statusStatusId`
  )
VALUES
  ('2022-09-28 20:03:39', '2022-09-28 20:03:39', 1, 1);
INSERT INTO
  `ecstatus` (
    `createdAt`,
    `updatedAt`,
    `educationalCenterEducationalCenterId`,
    `statusStatusId`
  )
VALUES
  ('2022-09-28 20:03:17', '2022-09-28 20:03:17', 2, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: educational_centers
# ------------------------------------------------------------

INSERT INTO
  `educational_centers` (
    `educational_center_id`,
    `title`,
    `contact_person`,
    `phone`,
    `email`,
    `password`,
    `site_url`,
    `requisites`,
    `add_notes`,
    `refresh_token`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'title1',
    'person',
    '289347982374',
    'ivan.spiridonov.0100@mail.ru',
    '202cb962ac59075b964b07152d234b70',
    'url',
    'requisites',
    'requisites\r\nrequisites',
    'c421357a-cb66-4e98-9904-02634ec28c4b',
    '2022-07-17 23:11:06',
    '2022-09-28 20:21:07'
  );
INSERT INTO
  `educational_centers` (
    `educational_center_id`,
    `title`,
    `contact_person`,
    `phone`,
    `email`,
    `password`,
    `site_url`,
    `requisites`,
    `add_notes`,
    `refresh_token`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    'text12',
    'IVAN',
    '23894890234902394',
    'ex2@mail.ru',
    '202cb962ac59075b964b07152d234b70',
    '///',
    'requisites\r\nrequisites',
    'requisites',
    'c94f8624-7498-416e-a065-5538bb4e5fdb',
    '2022-09-14 21:27:17',
    '2022-09-28 20:13:33'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: moderations
# ------------------------------------------------------------

INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    52,
    '{\"type\":\"doctor\",\"id\":1,\"newInfo\":{\"name\":\"test\",\"email\":\"ex1@mail.ru\",\"phone\":\"234512341234234\",\"region\":\"Moscow\",\"specialization\":\"Ортопедия, Стамотолог\"}}',
    '2022-09-15 09:16:49',
    '2022-09-15 09:16:49'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    53,
    '{\"type\":\"eduCenter\",\"id\":1,\"newInfo\":{\"id\":1,\"title\":\"title1\",\"contact_person\":\"person\",\"phone\":\"289347982374\",\"email\":\"ex12@mail.ru\",\"site_url\":\"url\",\"requisites\":\"requisites\",\"add_notes\":\"requisites\\r\\nrequisites\"}}',
    '2022-09-15 09:17:41',
    '2022-09-15 09:17:41'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    54,
    '{\"type\":\"eduCenter\",\"id\":1,\"newInfo\":{\"id\":1,\"title\":\"title1\",\"contact_person\":\"person123\",\"phone\":\"289347982374\",\"email\":\"ex@mail.ru\",\"site_url\":\"url\",\"requisites\":\"requisites\",\"add_notes\":\"requisites\\r\\nrequisites\"}}',
    '2022-09-15 09:19:28',
    '2022-09-15 09:19:28'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    55,
    '{\"type\":\"eduCenter\",\"id\":1,\"newInfo\":{\"id\":1,\"title\":\"title123\",\"contact_person\":\"person\",\"phone\":\"289347982374\",\"email\":\"ex@mail.ru\",\"site_url\":\"url\",\"requisites\":\"requisites\",\"add_notes\":\"requisites\\r\\nrequisites\"}}',
    '2022-09-15 09:19:59',
    '2022-09-15 09:19:59'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    56,
    '{\"type\":\"doctor\",\"id\":1,\"newInfo\":{\"name\":\"test\",\"email\":\"ivan.spiridonov.0100@mail.ru\",\"phone\":\"234512341234234sad\",\"region\":\"Moscow\",\"specialization\":\"Ортопедия\"}}',
    '2022-09-15 09:37:33',
    '2022-09-15 09:37:33'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    57,
    '{\"type\":\"doctor\",\"id\":1,\"newInfo\":{\"name\":\"test\",\"email\":\"ivan.spiridonov.0100@mail.ru\",\"phone\":\"234512341234234sad\",\"region\":\"Moscow\",\"specialization\":\"Ортопедия\"}}',
    '2022-09-15 09:38:17',
    '2022-09-15 09:38:17'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    58,
    '{\"type\":\"doctor\",\"id\":1,\"newInfo\":{\"name\":\"test\",\"email\":\"ivan.spiridonov.0100@mail.ru\",\"phone\":\"234512341234234333\",\"region\":\"Moscow\",\"specialization\":\"Ортопедия\"}}',
    '2022-09-15 09:45:53',
    '2022-09-15 09:45:53'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    59,
    '{\"type\":\"doctor-change-accesses\",\"id\":1,\"newInfo\":{\"text\":\"Запрос смены доступов\"}}',
    '2022-09-15 13:45:25',
    '2022-09-15 13:45:25'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    60,
    '{\"type\":\"doctor\",\"id\":1,\"newInfo\":{\"name\":\"test\",\"email\":\"ivan.spiridonov.0100@mail.ru\",\"phone\":\"234512341234234\",\"region\":\"Moscow\",\"specialization\":\"Ортопедия\"}}',
    '2022-09-15 13:52:24',
    '2022-09-15 13:52:24'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    61,
    '{\"type\":\"doctor-change-accesses\",\"id\":1,\"newInfo\":{\"text\":\"Запрос смены доступов\"}}',
    '2022-09-15 13:52:46',
    '2022-09-15 13:52:46'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    62,
    '{\"type\":\"doctor-change-accesses\",\"id\":1,\"newInfo\":{\"text\":\"Запрос смены доступов\"}}',
    '2022-09-15 13:54:07',
    '2022-09-15 13:54:07'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    63,
    '{\"type\":\"doctor-change-accesses\",\"id\":1,\"newInfo\":{\"text\":\"Запрос смены доступов\"}}',
    '2022-09-15 13:54:26',
    '2022-09-15 13:54:26'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    64,
    '{\"type\":\"eduCenter\",\"id\":1,\"newInfo\":{\"id\":1,\"title\":\"title1\",\"contact_person\":\"person\",\"phone\":\"289347982374\",\"email\":\"ex@mail.ru\",\"site_url\":\"url\",\"requisites\":\"requisites\",\"add_notes\":\"requisites\\r\\nrequisites\"}}',
    '2022-09-15 13:57:48',
    '2022-09-15 13:57:48'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    65,
    '{\"type\":\"eduCenter\",\"id\":1,\"newInfo\":{\"id\":1,\"title\":\"title1\",\"contact_person\":\"person\",\"phone\":\"289347982374\",\"email\":\"ex@mail.ru\",\"site_url\":\"url\",\"requisites\":\"requisites\",\"add_notes\":\"requisites\\r\\nrequisites\"}}',
    '2022-09-15 14:04:34',
    '2022-09-15 14:04:34'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    66,
    '{\"type\":\"eduCenter\",\"id\":1,\"newInfo\":{\"id\":1,\"title\":\"title1\",\"contact_person\":\"person\",\"phone\":\"289347982374\",\"email\":\"ex@mail.ru\",\"site_url\":\"url\",\"requisites\":\"requisites\",\"add_notes\":\"requisites\\r\\nrequisites\"}}',
    '2022-09-15 14:05:45',
    '2022-09-15 14:05:45'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    67,
    '{\"type\":\"eduCenter\",\"id\":1,\"newInfo\":{\"id\":1,\"title\":\"title1\",\"contact_person\":\"person\",\"phone\":\"289347982374\",\"email\":\"ex@mail.ru\",\"site_url\":\"url\",\"requisites\":\"requisites\",\"add_notes\":\"requisites\\r\\nrequisites\"}}',
    '2022-09-15 14:06:10',
    '2022-09-15 14:06:10'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    68,
    '{\"type\":\"eduCenter\",\"id\":1,\"newInfo\":{\"id\":1,\"title\":\"title1\",\"contact_person\":\"person\",\"phone\":\"289347982374\",\"email\":\"ex@mail.ru\",\"site_url\":\"url\",\"requisites\":\"requisites\",\"add_notes\":\"requisites\\r\\nrequisites\"}}',
    '2022-09-15 14:07:35',
    '2022-09-15 14:07:35'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    69,
    '{\"type\":\"eduCenter\",\"id\":1,\"newInfo\":{\"id\":1,\"title\":\"title1\",\"contact_person\":\"person\",\"phone\":\"289347982374\",\"email\":\"ex@mail.ru\",\"site_url\":\"url\",\"requisites\":\"requisites\",\"add_notes\":\"requisites\\r\\nrequisites\"}}',
    '2022-09-15 14:08:14',
    '2022-09-15 14:08:14'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    70,
    '{\"type\":\"edu-center-change-accesses\",\"id\":1,\"newInfo\":{\"text\":\"Запрос смены доступов\"}}',
    '2022-09-15 14:10:22',
    '2022-09-15 14:10:22'
  );
INSERT INTO
  `moderations` (
    `moderation_id`,
    `new_information`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    72,
    '{\"type\":\"register-new-doctor\",\"id\":-1,\"newInfo\":{\"name\":\"test\",\"phone\":\"2345234\",\"email\":\"ivan.spiridonov.0100@mail.ru\",\"password\":\"123\",\"region\":\"KRD\",\"specialization\":\"Студент\",\"refresh_token\":null}}',
    '2022-09-15 14:40:09',
    '2022-09-15 14:40:09'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: moderec
# ------------------------------------------------------------

INSERT INTO
  `moderec` (
    `createdAt`,
    `updatedAt`,
    `moderationModerationId`,
    `educationalCenterEducationalCenterId`
  )
VALUES
  ('2022-09-15 09:17:41', '2022-09-15 09:17:41', 53, 1);
INSERT INTO
  `moderec` (
    `createdAt`,
    `updatedAt`,
    `moderationModerationId`,
    `educationalCenterEducationalCenterId`
  )
VALUES
  ('2022-09-15 09:19:28', '2022-09-15 09:19:28', 54, 1);
INSERT INTO
  `moderec` (
    `createdAt`,
    `updatedAt`,
    `moderationModerationId`,
    `educationalCenterEducationalCenterId`
  )
VALUES
  ('2022-09-15 09:20:00', '2022-09-15 09:20:00', 55, 1);
INSERT INTO
  `moderec` (
    `createdAt`,
    `updatedAt`,
    `moderationModerationId`,
    `educationalCenterEducationalCenterId`
  )
VALUES
  ('2022-09-15 13:57:48', '2022-09-15 13:57:48', 64, 1);
INSERT INTO
  `moderec` (
    `createdAt`,
    `updatedAt`,
    `moderationModerationId`,
    `educationalCenterEducationalCenterId`
  )
VALUES
  ('2022-09-15 14:04:34', '2022-09-15 14:04:34', 65, 1);
INSERT INTO
  `moderec` (
    `createdAt`,
    `updatedAt`,
    `moderationModerationId`,
    `educationalCenterEducationalCenterId`
  )
VALUES
  ('2022-09-15 14:05:46', '2022-09-15 14:05:46', 66, 1);
INSERT INTO
  `moderec` (
    `createdAt`,
    `updatedAt`,
    `moderationModerationId`,
    `educationalCenterEducationalCenterId`
  )
VALUES
  ('2022-09-15 14:06:10', '2022-09-15 14:06:10', 67, 1);
INSERT INTO
  `moderec` (
    `createdAt`,
    `updatedAt`,
    `moderationModerationId`,
    `educationalCenterEducationalCenterId`
  )
VALUES
  ('2022-09-15 14:07:35', '2022-09-15 14:07:35', 68, 1);
INSERT INTO
  `moderec` (
    `createdAt`,
    `updatedAt`,
    `moderationModerationId`,
    `educationalCenterEducationalCenterId`
  )
VALUES
  ('2022-09-15 14:08:14', '2022-09-15 14:08:14', 69, 1);
INSERT INTO
  `moderec` (
    `createdAt`,
    `updatedAt`,
    `moderationModerationId`,
    `educationalCenterEducationalCenterId`
  )
VALUES
  ('2022-09-15 14:10:22', '2022-09-15 14:10:22', 70, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: rubrics
# ------------------------------------------------------------

INSERT INTO
  `rubrics` (`rubrics_id`, `title`)
VALUES
  (10, 'rub2');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: statuses
# ------------------------------------------------------------

INSERT INTO
  `statuses` (`status_id`, `title`)
VALUES
  (1, 'public');
INSERT INTO
  `statuses` (`status_id`, `title`)
VALUES
  (2, 'trashed');
INSERT INTO
  `statuses` (`status_id`, `title`)
VALUES
  (3, 'blocked');

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

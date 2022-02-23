-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

-- https://app.quickdatabasediagrams.com/#/

CREATE TABLE `users` (
    `id` int  NOT NULL ,
    `username` varchar(50)  NOT NULL ,
    `password` varchar(255)  NOT NULL ,
    `email` varchar(255)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `posts` (
    `id` int  NOT NULL ,
    `title` varchar(255)  NOT NULL ,
    `content` TEXT  NOT NULL ,
    `user_id` int  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

ALTER TABLE `posts` ADD CONSTRAINT `fk_posts_user_id` FOREIGN KEY(`user_id`)
REFERENCES `users` (`id`);

INSERT INTO users
VALUES (
    1,
    'admin',
    'test',
    'admin@example.com'
);

INSERT INTO posts
VALUES (
    1,
    'Bonjour',
    'Je suis le contenu',
    1
);

DROP TABLE IF EXISTS users;

-- Je modifie legerement ma table user pour recup le role de celui ci (on peut travailler avec un bool isAdmin)
CREATE TABLE `users` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) NOT NULL
);

INSERT INTO users
VALUES (
    1,
    'admin@mail.com',
    'superpromo',
    'admin'
);
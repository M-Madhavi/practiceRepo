create table user(
    id int primary key AUTO_InCREMENT,
    name varchar(50),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(20),
    status varchar(20),
    role varchar(20),
    UNIQUE(email),
);

insert into user(name,contactNumber,email,password,status,role) values ('Admin','1234567891','admin@gmail.com','admin','true','admin');
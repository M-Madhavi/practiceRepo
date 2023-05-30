create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(50),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(20),
    status varchar(20),
    role varchar(20),
    UNIQUE(email),
);

insert into user(name,contactNumber,email,password,status,role) values ('Admin','1234567891','admin@gmail.com','admin','true','admin');

create table category(
    id int not null AUTO_INCREMENT,
    name varchar(50) not null,
    primary key(id)
)

create table product(
    id int not null AUTO_INCREMENT,
    name varchar(250),
    categoryId int not null,
    description varchar(255),
    price int not null,
    status varchar(20),
    primary key(id)
)
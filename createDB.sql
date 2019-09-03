drop database if exists editor;

create database editor;

use editor;

create table userInformation(
    email varchar(200) primary key,
    password varchar(100) not null,
    userName varchar(60) not null
);
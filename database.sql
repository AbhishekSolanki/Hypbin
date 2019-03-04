CREATE DATABASE 'hypbin';

CREATE TABLE hypbin.urls(
urls_id int,
url varchar2(30),
ip varchar(20),
revision_id int,
created_by_anonymous varchar2(30),
created_by_user int,
created_date date,
modified_date date
);

CREATE TABLE hypbin.notes(
notes_id int,
urls_id int,
datafile varchar(30),
pin_protect varchar(6),
aes_key varchar(255),
share_to varchar(255)
)



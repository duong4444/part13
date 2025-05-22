-- create table blog
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

-- insert data
insert into blogs (author,url,title) values ('John Doe','https://www.somthing.com/','mock url for testing');
insert into blogs (author,url,title,likes) values ('Adam Smith','https://www.foobar.com/','foo bar',7);

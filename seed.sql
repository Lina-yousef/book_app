DROP TABLE IF EXISTS books ;

CREATE TABLE IF NOT EXISTS books(

  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  img VARCHAR(255),
  description TEXT
);

DROP TABLE IF EXISTS books ;

CREATE TABLE IF NOT EXISTS books(

  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  img VARCHAR(255),
  description TEXT,
  shelf VARCHAR(255)
);

-- INSERT INTO books (title, author, isbn, img, description) VALUES (
--   'What Alice Forgot',
--   'Liane Moriarty',
--   'ISBN_13 1101515376',
--   'http://books.google.com/books/content?id=8iBGzeqj45YC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
--   'Alice Love is twenty-nine, crazy about her husband, and pregnant with her first child. So imagine Alice''s surprise when she comes to on the floor of a gym (a gym! She HATES the gym) and is whisked off to the hospital where she discovers the honeymoon is truly over—she''s getting divorced, she has three kids, and she''s actually 39 years old. Alice must reconstruct the events of a lost decade, and find out whether it''s possible to reconstruct her life at the same time. She has to figure out why her sister hardly talks to her, and how is it that she''s become one of those super skinny moms with really expensive clothes. Ultimately, Alice must discover whether forgetting is a blessing or a curse, and whether it''s possible to start over...'
-- );
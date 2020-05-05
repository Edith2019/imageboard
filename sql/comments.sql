DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    usercomments VARCHAR NOT NULL,
    textcomments VARCHAR NOT NULL,
    card_id INT REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


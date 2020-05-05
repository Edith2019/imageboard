const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/images"
);


module.exports.getCards = () => {
    const q = `SELECT *
    FROM images 
    ORDER BY id DESC
    LIMIT 10  
    `;
    return db.query(q);
};

module.exports.addCards = (titleAdd, descriptionAdd, userNameAdd, urlAdd) => {
    const q = `INSERT INTO images (title, description,username, url)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    ` ;
    const params = [titleAdd, descriptionAdd, userNameAdd, urlAdd];
    return db.query(q, params);
};

module.exports.getComments = (id) => {
    const q = `SELECT images.url, images.username, images.title, images.description, images.created_at, images.id, comments.usercomments, comments.textcomments
    FROM images
    LEFT JOIN comments ON images.id = comments.card_id
    WHERE images.id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.getPrevNextCard = (result) => {
    const q = `SELECT *,
    (SELECT id FROM images
    WHERE id<$1
    ORDER by id DESC LIMIT 1) AS next_card,
    (SELECT id FROM images
    WHERE id>$1
    ORDER by id ASC LIMIT 1) AS previous_card
    FROM images 
    WHERE id=$1        
    `;
    const params = [result];
    return db.query(q, params);
};

module.exports.getCardPrev = (prevId) => {
    const q = `SELECT images.url, images.username, images.title, images.description, images.created_at, images.id, comments.usercomments, comments.textcomments
    FROM images
    LEFT JOIN comments ON images.id = comments.card_id
    WHERE images.id = $1
    `;
    const params = [prevId];
    return db.query(q, params);
};

module.exports.getCardPrev = (nextId) => {
    const q = `SELECT images.url, images.username, images.title, images.description, images.created_at, images.id, comments.usercomments, comments.textcomments
    FROM images
    LEFT JOIN comments ON images.id = comments.card_id
    WHERE images.id = $1
    `;
    const params = [nextId];
    return db.query(q, params);
};

module.exports.addComments = (usercommentsAdd, textcommentsAdd, cardIdAdd) => {
    const q = `INSERT INTO comments (usercomments, textcomments, card_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const params = [usercommentsAdd, textcommentsAdd, cardIdAdd];
    return db.query(q, params);
};


exports.getMoreImages = (lowestId) => {
    const q = `SELECT url, title, id, (
    SELECT id FROM images
    ORDER BY id ASC
    LIMIT 1 )
    AS "lowestId" FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 10
    `;
    const params = [lowestId];
    return db.query(q, params);
};

exports.deleteCardComments = (idDelete) => {
    const q = ` DELETE 
    FROM comments
    WHERE card_id=$1`;
    const params = [idDelete];
    return db.query(q, params);

};

exports.deleteCard = (idDelete) => {
    const q = ` DELETE 
    FROM images
    WHERE id=$1`;
    const params = [idDelete];
    return db.query(q, params);

};
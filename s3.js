const aws = require('aws-sdk');
const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./utils/secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.upload = function (req, res, next) {

    if (!req.file) {
        console.log("multer did not work");
        req.sendStatus(500);
        return;

    }

    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: 'vegetaimagebucket',
        ACL: 'public-read',
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    }).promise().then(() => {
        // it worked!!!
        next();
        fs.unlink(path, () => { });
    }
    ).catch(
        err => {
            // uh oh
            console.log("error in s3", err);
            res.sendStatus(500);
        }
    );
};
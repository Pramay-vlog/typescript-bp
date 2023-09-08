import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import config from "../config";

const { s3_bucket } = config;

const s3Config = new S3Client( {

    region: s3_bucket.region,
    credentials: {
        accessKeyId: s3_bucket.accessKeyId,
        secretAccessKey: s3_bucket.secretKey,
    },

} );

const upload = multer( {

    storage: multerS3( {

        s3: s3Config,
        bucket: s3_bucket.bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function ( req: any, file: any, cb: any ) {
            cb( null, { fieldName: file.fieldname } );
        },
        key: function ( req: any, file: any, cb: any ) {
            cb(
                null,
                "XXXXX_BLOB/" +
                "xxxxx" +
                Date.now().toString() +
                Date.now().toString() +
                "." +
                file.mimetype.split( "/" )[ 1 ]
            );
        },

    } ),

} );

export { upload };

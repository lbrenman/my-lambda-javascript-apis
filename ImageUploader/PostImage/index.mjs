import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({region: process.env.REGION});

export const handler = async (event) => {
    
    //console.log(event.body);
    const body = JSON.parse(event.body);
    
    const bucketName = process.env.BUCKETNAME;
    const fileName = `${body.filename}-${Date.now()}.jpg`;
    const base64String = body.image;

    //console.log(fileName);
    //console.log(base64String);

    // Decode the base64 string
    const buffer = Buffer.from(base64String, 'base64');

    try {
        // Upload the image to S3
        const putObjectCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        });
        await s3Client.send(putObjectCommand);
        
        // Create the command
        const getObjectCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileName
        });
        
        // Generate a pre-signed URL - NOT WORKING - GENERATING ERROR: A region must be set when sending requests to S3
        //const signedUrl = await getSignedUrl(s3Client, GetObjectCommand, { expiresIn: 3600 }); // URL expires in 1 hour

        // Construct the URL of the uploaded file
        const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Successfully uploaded image',
                fileName: fileName,
                url: fileUrl
            })
        };
    } catch (err) {
        console.error('Error uploading image:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to upload image',
                error: err.message
            })
        };
    }
    
};

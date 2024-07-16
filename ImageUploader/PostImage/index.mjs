import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({region: process.env.REGION});

export const handler = async (event) => {
    
    const body = JSON.parse(event.body);
    
    const bucketName = process.env.BUCKETNAME;
    const fileName = `${body.filename}-${Date.now()}.jpg`;
    const base64String = body.image;

    // Decode the base64 string
    const buffer = Buffer.from(base64String, 'base64');
    
    let uploadSuccess = false;

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
        
        uploadSuccess = true;
        
    } catch (err) {
        console.error('Error uploading image:', err);
        
    } finally {
        
        try {
            // Generate a pre-signed URL for the uploaded file
            const getObjectCommand = new GetObjectCommand({
                Bucket: bucketName,
                Key: fileName
            });
            const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: process.env.SIGNEDURLTIME });

            if (uploadSuccess) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Successfully uploaded image and generated URL',
                        fileName: fileName,
                        url: signedUrl
                    })
                };
            } else {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        message: 'Failed to upload image, but generated URL',
                        fileName: fileName,
                        url: signedUrl
                    })
                };
            }
        } catch (err) {
            console.error('Error generating signed URL:', err);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to upload image and generate URL',
                    error: err.message
                })
            };
        }
        
    }
    
};

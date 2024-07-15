import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

export const handler = async (event) => {
    
    console.log(event.body);
    const body = JSON.parse(event.body);
    
    const bucketName = process.env.BUCKETNAME;
    const fileName = body.filename; // You can generate a unique name if needed
    const base64String = body.image; // Assume the event contains the base64 data under this key

    console.log(fileName);
    console.log(base64String);

    // Decode the base64 string
    const buffer = Buffer.from(base64String, 'base64');

    try {
        // Upload the image to S3
        const putObjectCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            ContentEncoding: 'base64', // required if you are handling base64 encoding/decoding
            ContentType: 'image/jpeg' // adjust accordingly if it's a different image type
        });
        await s3Client.send(putObjectCommand);
        
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

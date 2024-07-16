import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client({region: process.env.REGION});

export const handler = async (event) => {
    
    console.log(event);
    
    const bucketName = process.env.BUCKETNAME;
    const fileName = event.queryStringParameters.filename; 

    try {
        // Delete the object from S3
        const deleteObjectCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileName
        });
        await s3Client.send(deleteObjectCommand);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Successfully deleted file',
                fileName: fileName
            })
        };
    } catch (err) {
        console.error('Error deleting file:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to delete file',
                error: err.message
            })
        };
    }
};

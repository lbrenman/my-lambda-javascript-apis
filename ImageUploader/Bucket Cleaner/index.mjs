import { S3Client, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client({region: process.env.REGION});

export const handler = async (event) => {
    const bucketName = process.env.BUCKETNAME;

    try {
        // List objects in the S3 bucket
        const listObjectsCommand = new ListObjectsCommand({ Bucket: bucketName });
        const response = await s3Client.send(listObjectsCommand);

        const objects = response.Contents;

        if (!objects || objects.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'No objects found in the bucket' })
            };
        }

        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        // Filter objects older than one hour and delete them
        const objectsToDelete = objects.filter(object => new Date(object.LastModified) < oneHourAgo);

        for (const object of objectsToDelete) {
            const deleteObjectCommand = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: object.Key
            });
            await s3Client.send(deleteObjectCommand);
            console.log(`Deleted object: ${object.Key}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Successfully deleted old objects', deletedObjects: objectsToDelete })
        };
    } catch (err) {
        console.error('Error listing or deleting objects:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to list or delete objects', error: err.message })
        };
    }
};

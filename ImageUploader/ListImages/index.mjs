import { S3Client, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client({region: 'us-east-1'});

export const handler = async (event) => {
    const bucketName = process.env.BUCKETNAME;

    try {
        // List objects in the bucket
        const listCommand = new ListObjectsCommand({ Bucket: bucketName });
        const listData = await s3Client.send(listCommand);
        
        console.log(listData);
        
        var objectKeys;
        
        if (listData.hasOwnProperty('Contents')) {
            objectKeys = listData.Contents.map(item => item.Key);
        } else {
            objectKeys = [];
        }
        
        console.log('Objects in bucket:', objectKeys);  
        
        let fileNameArray = [];
        objectKeys.forEach(item => {
            fileNameArray.push({
                fileName: item
            })
        });
        

        return {
            statusCode: 200,
            //body: JSON.stringify(objectKeys)
            body: JSON.stringify(fileNameArray)
        };
    } catch (err) {
        console.error('Error retrieving bucket contents:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to retrieve list of images',
                error: err.message
            })
        };
    }
};

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client({region: process.env.REGION});

// Returns Base64 encoded image
// Put the following in your Postman script to visualize the response
//
//if(pm.response.code == 200) {
//const base64Image = pm.response.json().image; // Adjust this according to your JSON structure
//const imageHtml = `<img src="data:image/jpeg;base64,${base64Image}" />`;
//pm.visualizer.set(imageHtml);
//}


export const handler = async (event) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucketName = process.env.BUCKETNAME;
    const objectKey = event.queryStringParameters.filename;
    
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: objectKey
        });
        
        const data = await s3Client.send(command);

        const streamToString = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('error', reject);
                stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
            });

        const body = await streamToString(data.Body);
        
        const fileUrl = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;

        return {
            statusCode: 200,
            headers: {
                //'Content-Type': 'image/jpeg'
            },
            body: JSON.stringify({
                filename: event.queryStringParameters.filename,
                image:body,
                url: fileUrl
            }),
            isBase64Encoded: true
        };
    } catch (err) {
        console.log('Error');
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to retrieve image',
                error: err.message
            })
        };
    }
};

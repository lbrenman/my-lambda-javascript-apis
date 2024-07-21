import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');
var amplify_access_token;
const amplify_central_base_url='https://apicentral.axway.com/apis';


export const handler = async (event) => {
    
    await getAmplifyToken();
    //console.log(amplify_access_token);
    const state=event.queryStringParameters.state.toUpperCase();
    
    const getProductSubscriptionsByStatusResponse = await getProductSubscriptionsByStatus(state);
    
    return {
        statusCode: 200,
        body: JSON.stringify(getProductSubscriptionsByStatusResponse)
    };
    
};

async function getAmplifyToken() {
    
    const basic_auth_value = Buffer.from(`${process.env.SA_CLIENT_ID}:${process.env.SA_CLIENT_SECRET}`).toString('base64');
    
    try {
        const response = await axios.post('https://login.axway.com/auth/realms/Broker/protocol/openid-connect/token', {
              grant_type: 'client_credentials'
            }, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basic_auth_value}`
              }
            });
        
        //console.log('Response:', response.data);
        amplify_access_token = response.data.access_token;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

async function getProductSubscriptionsByStatus(state) {
    
    try {
        const apiUrl = `${amplify_central_base_url}/catalog/v1alpha1/subscriptions?query=approval.state==${state}`;
        
        const response = await axios.get(apiUrl,{headers: {
                "Content-Type":'application/json',
                "Authorization": `Bearer ${amplify_access_token}`
            }});

        // Process response
        const data = response.data;
        console.log(data);
        
        return {success: true, data: data};
        

    } catch (error) {
        //console.error('Error:', error);
        return {success: true, data: error};
    }

}
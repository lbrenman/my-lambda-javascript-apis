import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');
const finnhubToken = process.env.FINNHUBTOKEN;

export const handler = async (event) => {
    const symbols=event.queryStringParameters.symbols;
    const data = [];
    const symbolsArray = symbols.split(',');
    
    try {
         // Array to store all API requests and responses
        const quoteApiRequests = [];
        const profileApiRequests = [];
        const quoteApiResponsesData = [];
        const profileApiResponsesData = [];

        // Create two arrays of API endpoints
        symbolsArray.forEach(element => {
            quoteApiRequests.push(axios.get(`https://finnhub.io/api/v1/quote?symbol=${element}`, {headers: {"X-Finnhub-Token":finnhubToken}}));
            profileApiRequests.push(axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${element}`, {headers: {"X-Finnhub-Token":finnhubToken}}));
        });

        //console.log(quoteApiEndpoints);
        //console.log(profileApiEndpoints);
        //console.log(quoteApiRequests);
        //console.log(profileApiRequests);

        // Wait for all quote and profile requests to complete using Promise.all()
        const quoteResponses = await Promise.all(quoteApiRequests);
        const profileResponses = await Promise.all(profileApiRequests);
        
        // Process quote responses
        quoteResponses.forEach(response => {
            quoteApiResponsesData.push(response.data)
        });

        // Process profile responses
        profileResponses.forEach(response => {
            profileApiResponsesData.push(response.data)
        });


        //console.log(quoteApiResponsesData);
        //console.log(profileApiResponsesData);

        for (let i = 0; i < quoteApiResponsesData.length; i++) {
            if(profileApiResponsesData[i].name) {
                data.push({
                    Price: quoteApiResponsesData[i].c,
                    Change: quoteApiResponsesData[i].d,
                    ChangePercent: quoteApiResponsesData[i].dp,
                    Symbol: profileApiResponsesData[i].ticker,
                    Name: profileApiResponsesData[i].name
                });   
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            //body: JSON.stringify({ message: 'Error occurred' })
            body: JSON.stringify({ error: error })
        };
    }
};

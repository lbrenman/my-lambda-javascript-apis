import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');
const finnhubToken = process.env.FINNHUBTOKEN;
const isEmpty = obj => JSON.stringify(obj) === '{}';

export const handler = async (event) => {
    const queryParams = event.queryStringParameters;

    if (!(queryParams && queryParams.hasOwnProperty('symbols'))) {
        // console.log('Query parameter, symbols, is missing');
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Missing symbols'}),
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
        };
    }
    
    const symbols=queryParams.symbols;
    const symbolsArray = symbols.split(',');
    const data = [];
    
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

        for (let i = 0; i < quoteApiResponsesData.length; i++) {
            if(!isEmpty(profileApiResponsesData[i])) {
                data.push({
                    Price: quoteApiResponsesData[i].c,
                    Change: quoteApiResponsesData[i].d,
                    ChangePercent: quoteApiResponsesData[i].dp,
                    Symbol: profileApiResponsesData[i].ticker,
                    Name: profileApiResponsesData[i].name
                });   
            }
        }

        if(data.length === 0) {
            return {
                statusCode: 204,
                body: JSON.stringify({ message: 'Symbols not found' }),
                headers: {
                  "Access-Control-Allow-Origin": "*"
                }
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    Watchlist: data
                }),
                headers: {
                  "Access-Control-Allow-Origin": "*"
                }
            };            
        }

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error' }),
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
        };
    }
};

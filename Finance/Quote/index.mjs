import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');
const finnhubToken = process.env.FINNHUBTOKEN;
const isEmpty = obj => JSON.stringify(obj) === '{}';

export const handler = async (event) => {
    
    const queryParams = event.queryStringParameters;

    if (!(queryParams && queryParams.hasOwnProperty('symbol'))) {
        // console.log('Query parameter, symbol, is missing');
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Missing symbol'}),
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
        };
    }
    
    const symbol=queryParams.symbol;
    
    try {
        const apiUrl1 = `https://finnhub.io/api/v1/quote?symbol=${symbol}`;
        const apiUrl2 = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}`;
        
        // Call Finnhub quotw and profile API's
        const [response1, response2] = await Promise.all([
            axios.get(apiUrl1, {headers: {"X-Finnhub-Token":finnhubToken}}),
            axios.get(apiUrl2, {headers: {"X-Finnhub-Token":finnhubToken}})
        ]);

        const data = {
            Quote: {
                Price: response1.data.c,
                Change: response1.data.d,
                ChangePercent: response1.data.dp,
                DayHigh: response1.data.h,
                DayLow: response1.data.l,
                OpenPrice: response1.data.o,
                PreviousClose: response1.data.pc,
                Symbol: response2.data.ticker,
                Name: response2.data.name
            }
        }
        
        if(isEmpty(response2.data)) {
            return {
                statusCode: 204,
                body: JSON.stringify({message: 'Bad symbol'}),
                headers: {
                  "Access-Control-Allow-Origin": "*"
                }
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify(data),
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

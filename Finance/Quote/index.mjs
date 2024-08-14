import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');
const finnhubToken = process.env.FINNHUBTOKEN;
const isEmpty = obj => JSON.stringify(obj) === '{}';

export const handler = async (event) => {
    const symbol=event.queryStringParameters.symbol;
    
    try {
        const apiUrl1 = `https://finnhub.io/api/v1/quote?symbol=${symbol}`;
        const apiUrl2 = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}`;
        
        // Call Finnhub quotw and profile API's
        const [response1, response2] = await Promise.all([
            axios.get(apiUrl1, {headers: {"X-Finnhub-Token":finnhubToken}}),
            axios.get(apiUrl2, {headers: {"X-Finnhub-Token":finnhubToken}})
        ]);

        const data = {
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
        
        if(isEmpty(response2.data)) {
            return {
                statusCode: 204,
                body: JSON.stringify({message: 'Bad symbol'}),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            };    
        }
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server error' }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

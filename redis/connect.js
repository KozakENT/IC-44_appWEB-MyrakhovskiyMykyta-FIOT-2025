import { createClient } from 'redis';

export const client = createClient({
    username: 'default',
    password: 'l9qR7PdbL9jNct6yVHssDiNbMSMWCOEk',
    socket: {
        host: 'redis-19891.c275.us-east-1-4.ec2.cloud.redislabs.com',
        port: 19891
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();
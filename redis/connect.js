import { createClient } from 'redis';

export const client = createClient({
    username: 'default',
    password: 'APKrMXVisR37FYRPjgCa8MqFkVMyflTF',
    socket: {
        host: 'redis-10959.c12.us-east-1-4.ec2.cloud.redislabs.com',
        port: 10959
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();


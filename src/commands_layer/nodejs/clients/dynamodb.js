const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb')

const getClient = () => new DynamoDBClient({});

const getDocClient = () => DynamoDBDocumentClient.from(getClient());

module.exports = {
    getClient,
    getDocClient,
}
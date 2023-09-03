const { SlashCommand } = require("slash-create");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

module.exports = class DailyCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "daily",
      description: "Use this command to claim your daily rewards.",
      guildIDs: ["1143840924472979559"],
    });
    this.filePath = __filename;
  }

  async run(ctx) {
    console.log('context', ctx)
    const { id: userId } = ctx.user;

    // Fetch user from players table
    const input = {
      TableName: "dcb-players",
      Key: {
        id: userId,
      },
    };
    const command = new GetCommand({
        TableName: 'dcb-players',
        Key: {
            id: userId,
        }
    });

    try {
        const response = await docClient.send(command);
        console.log(response);
    } catch (error) {
        console.log('Failed to fetch from table', error);
    }

    return `Claiming reward for ${userId}...`;
  }
};

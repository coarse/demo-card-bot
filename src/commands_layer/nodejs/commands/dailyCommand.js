const { SlashCommand } = require("slash-create");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");

const { getDocClient } = require("../clients/dynamodb");

module.exports = class DailyCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "daily",
      description: "Use this command to claim your daily reward.",
      guildIDs: ["1143840924472979559"],
    });
    this.filePath = __filename;
  }

  async run(ctx) {
    const { id: userId } = ctx.user;

    // Fetch user from players table
    const docClient = getDocClient();
    const input = {
      TableName: "dcb-players",
      Key: {
        id: userId,
      },
    };
    const command = new GetCommand(input);
    const response = await docClient.send(command);
    console.log(response);

    return `Claiming reward for ${userId}...`;
  }
};

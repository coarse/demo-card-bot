const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  GetCommand,
  PutCommand,
  DynamoDBDocumentClient,
} = require("@aws-sdk/lib-dynamodb");
const { BASIC_STARTING, UPGRADE_STARTING, TABLE_NAME } = require("./constants");

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const emptyPlayer = (userId) => ({
  id: userId,
  currency: {
    fish: BASIC_STARTING,
    shells: UPGRADE_STARTING,
  },
  last: {
    command: 0,
    daily: 0,
  },
});

class Player {
  constructor(data) {
    this.data = data;
  }

  static async initializeFromId(userId) {
    const data = emptyPlayer(userId);

    const input = {
      TableName: TABLE_NAME,
      Item: data,
    };
    const command = new PutCommand(input);

    try {
      await docClient.send(command);
    } catch (error) {
      console.log("Failed to initialize player data", error);
    }

    return new Player(data);
  }

  static async fromId(userId) {
    const input = {
      TableName: TABLE_NAME,
      Key: {
        id: userId,
      },
    };
    const command = new GetCommand(input);

    let data = null;
    try {
      const response = await docClient.send(command);
      data = response.Item;
    } catch (error) {
      console.log("Failed to fetch player data", error);
    }

    const player = data
      ? new Player(data)
      : await Player.initializeFromId(userId);

    return player;
  }

  async upload() {
    const input = {
      TableName: TABLE_NAME,
      Item: this.data,
    };
    const command = new PutCommand(input);

    try {
      await docClient.send(command);
    } catch (error) {
      console.log("Failed to save player data", error);
    }
  }

  callCommand(name) {
    const nowInSecs = Math.floor(Date.now() / 1000);
    this.data.last.command = nowInSecs;
    if (Object.keys(this.data.last).includes(name)) {
      this.data.last[name] = nowInSecs;
    }

    return this;
  }

  getFish() {
    return this.data.currency.fish;
  }

  increaseFish(amount) {
    const prevAmount = this.data.currency.fish;
    this.data.currency.fish = prevAmount + amount;

    return this;
  }

  decreaseFish(amount) {
    const prevAmount = this.data.currency.fish;
    this.data.currency.fish = prevAmount - amount;

    return this;
  }

  getShells() {
    return this.data.currency.shells;
  }

  increaseShells(amount) {
    const prevAmount = this.data.currency.shells;
    this.data.currency.shells = prevAmount + amount;

    return this;
  }

  decreaseShells(amount) {
    const prevAmount = this.data.currency.shells;
    this.data.currency.shells = prevAmount - amount;

    return this;
  }
}

module.exports = {
  Player,
};

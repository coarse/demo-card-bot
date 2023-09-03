const { SlashCommand } = require("slash-create");
const { Player } = require("../players/model");

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
    const { id: userId } = ctx.user;

    const player = await Player.fromId(userId);

    const fishAmount = 150 + Math.floor(Math.random() * (100 + 1));
    const shellsAmount = 3 + Math.floor(Math.random() * (7 + 1));

    player
      .callCommand("daily")
      .increaseFish(fishAmount)
      .increaseShells(shellsAmount);

    await player.upload();

    return `Claimed ${fishAmount} :fish: and ${shellsAmount} :shell:. New Balance: ${player.getFish()} :fish:, ${player.getShells()} :shell:`;
  }
};

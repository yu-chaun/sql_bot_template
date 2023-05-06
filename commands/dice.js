const { SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const fs = require("fs");
const { AddPlayer, UpdatePlayer, SearchPlayer } = require("./../Modules/Database");
// [讀檔] -> [解析] -> [做事] -> [存檔] -> [回應]

module.exports = {
    data: new SlashCommandBuilder().setName("dice").setDescription("Earn money with dice!"),
    async execute(client, interaction) {
        const final = Math.floor(Math.random() * 6) + 1;
        let earnings = 0;
        if (final < 4) {
            earnings = final - 4;
        } else {
            earnings = final - 3;
        }

        const data = fs.readFileSync("players.json");
        let players = JSON.parse(data);
        
        //我們可以用剛剛完成的  AddPlayer, UpdatePlayer 和 SearchPlayer  來取代這段code嗎？

        let found = false;
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == interaction.user.id) {
                found = true;
                players[i].money += earnings;
                const diceEmbed = new EmbedBuilder()
                    .setColor("#5865F2")
                    .setTitle(`🎲你得到了 ${final}`)
                    .setDescription(`結果：${earnings}元\n你現在有 ${players[i].money} 元!`);
                interaction.reply({ embeds: [diceEmbed] });
                break;
            }
        }

        if (found == false) {
            const newPlayer = { id: interaction.user.id, money: 500 };
            players.push(newPlayer);
            const diceEmbed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle(`🎲你得到了 ${final}`)
                .setDescription(`結果：${earnings}元\n你現在有 ${500 + earnings} 元!`);
            interaction.reply({ embeds: [diceEmbed] });
        }

        const json = JSON.stringify(players);
        fs.writeFileSync("players.json", json);
    },
};

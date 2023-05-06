const { SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js');
const fs = require('fs');
const { SaveData } = require("./../Modules/Database");
// [讀檔] -> [解析] -> [做事] -> [存檔] -> [回應]

module.exports = {
    data: new SlashCommandBuilder().setName('dice').setDescription('Earn money with dice!'),
    async execute(client, interaction) {

        //隨機取得結果（1~6)
        const final = Math.floor(Math.random() * 6) + 1;

        //從結果計算獲得/失去的 money
        let earnings = 0;
        if (final < 4) {
            earnings = final - 4;
        } else {
            earnings = final - 3;
        }

        //讀取 players.json 並 parse 成 players
        const data = fs.readFileSync('players.json');
        let players = JSON.parse(data);

        //在所有資料中尋找呼叫此指令玩家的資料
        let found = false;
        for (let i = 0; i < players.length; i++) {

            //如果有就修改該玩家的 money 並回覆結果
            if (players[i].id == interaction.user.id) {
                found = true;
                players[i].money += earnings;
                const diceEmbed = new EmbedBuilder()
                    .setColor('#5865F2')
                    .setTitle(`🎲你得到了 ${final}`)
                    .setDescription(`結果：${earnings}元\n你現在有 ${players[i].money} 元!`);
                interaction.reply({ embeds: [diceEmbed] });
                break;
            }
        }

        //如果沒有資料就創建一個新的並回覆結果
        if (found == false) {
            const newPlayer = { "id": interaction.user.id, "money": 500 };
            players.push(newPlayer);
            const diceEmbed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle(`🎲你得到了 ${final}`)
                .setDescription(`結果：${earnings}元\n你現在有 ${500 + earnings} 元!`);
            interaction.reply({ embeds: [diceEmbed] });
        }

        //stringify players 並存回 players.json
        const json = JSON.stringify(players);
        fs.writeFileSync('players.json', json);

        // 回應: 
    }
};
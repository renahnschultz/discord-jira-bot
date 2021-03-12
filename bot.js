import Discord from "discord.js"
import { qtdbugs } from './comandos.js'
import dotenv from 'dotenv'
dotenv.config()
const client = new Discord.Client();

client.on("ready", () => {
    console.log(`O bot foi iniciado, com ${client.users.cache.size} usuários e em ${client.guilds.cache.size} servidores.`);
    client.user.setActivity('(EM TESTES)', { type: 'Codando' }); (`Eu estou em ${client.guilds.cache.size} servidores`);
});

client.on("message", async message => {

    if (message.author.bot) return; //Não aceita comandos de outro Bot
    if (message.channel.type === "dm") return; //Não aceita comandos por DM

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const comand = args.shift().toLowerCase();

    if (comand === 'qtdbugs') {
        qtdbugs(message)
    }

});
client.login(process.env.TOKEN);
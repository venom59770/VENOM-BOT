const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");



client.on("ready", () => {
  console.log(`Je suis start, avec ${client.users.size} utilisateurs, avec ${client.channels.size} channels, et je suis dans ${client.guilds.size} guilds.`); 
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  var argresult = args.join(' ');

  
  if(command === "ping") {
    message.channel.send(`${message.author.username}` + ' Voici les resultats !!').then((msg) => {
      msg.edit()
      var help_embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .addField(":globe_with_meridians:->[ PING ]<-:globe_with_meridians: ",':hourglass: Le **BOT** a mis: ' + `[ **${msg.createdTimestamp - message.createdTimestamp}**`+ ' **Ms** ] pour repondre.\n:stopwatch: Et l\'**API** a mis: ' + `[ **${Math.round(client.ping)}**`+ ' **Ms** ] pour repondre')
      message.channel.sendEmbed(help_embed);
               
               })
              }

  if(command === "sanbot") {
    var embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .addField('Veux-tu de moi dans ton Serveur ?', 'Lien: https://discordapp.com/oauth2/authorize?client_id=406495740815212555&scope=bot&permissions=2146958591')
    message.channel.sendEmbed(embed);
  }

  if(command === "botname") {
    message.delete().catch(O_o=>{});
    if(message.author.id !== "342363201188659202") return message.channel.sendMessage("Vous n'avez pas la permission **RENAME_BOT** !!");
    client.user.setUsername(message.content.substr(9)); return message.reply('Mon **nom** a était **changer** avec **succés** !!')
    
    
    
  }

  if(command === "setgame") {
    if(message.author.id !== "342363201188659202") return;
      client.user.setGame(argresult); return message.reply('Mon **jeu** a était **modifié** avec **succés** !!')
  } 
  
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    if(!message.member.roles.some(r=>["Administrateur", "Modérateur"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    if(!message.member.roles.some(r=>["Administrateur"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "supr") {
    
    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

  if(command === "warn") {
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Vous n'avez pas la permission **WARN** !!");
    let reason = args.slice(1).join(' ');
    let user = message.mentions.users.first(); 
    if (reason.length < 1) return message.reply('Vous devez fournir une raison pour l\'avertissement');
    if (message.mentions.users.size < 1) return message.reply('Vous devez mentionner un utilisateur').catch(console.error);
    var embed = new Discord.RichEmbed()
    .setColor('#CDFF03')
    .setTimestamp()
    .addField('Action:', 'Warning')
    .addField('Utilisateur:', `${user.username}`)
    .addField('Raison:', `${reason}`)
    .addField('-------------------------', `WARN effectué par :`)
    .setThumbnail(`${message.guild.iconURL}`)
    .addField('Administrateur:', `${message.author.username}`);

    message.channel.sendEmbed(embed);

  }
  
});


client.login(config.token);                  
  


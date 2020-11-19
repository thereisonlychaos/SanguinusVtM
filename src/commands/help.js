module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: [],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push("Use '" + process.env.PREFIX + "help [command name]' to get info on a specific command.\nDM means that you have to send the command to me via direct message.");
			data.push(commands.map(command =>
				"\n> **" + process.env.PREFIX + command.name + "** " +
				(command.aliases && command.aliases.length > 0 ? "(" + command.aliases.join(', ') + ") " : "") +
				(command.usage ? command.usage : "") + 
				(command.description ? "\n> " + command.description : "")
			).join(""));

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push("**Usage:** " + process.env.PREFIX + command.name + " " + command.usage);
		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
		if (command.wiki) data.push(`**Wiki:** ${command.wiki}`);

		message.channel.send(data, { split: true });
	},
};
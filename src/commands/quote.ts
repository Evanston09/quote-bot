import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as quotesManager from "../quotesManager";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Responds with a random qoute.'),
	async execute(interaction: CommandInteraction) {
        const quote: quotesManager.Quote = quotesManager.getRandomQuote();

        if (!quote) {
            await interaction.reply('No quotes found. Submit your first with /submit!');
            return
        }

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('A spicy quote for you:fire:')
            .setDescription(quote.body)
            .addFields(
                { name: 'Submitted by', value: `${quote.author_name} (<@${quote.author_id}>)`, inline: true },
                { name: 'Want to submit your own', value: 'Use /submit to send in some spicy quotes for the wall!', inline: true }
            )
            .setFooter({ text: 'ZTL ARTCC', iconURL: 'https://www.ztlartcc.org/photos/logos/ztl_logo_black.png' })
            .setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};


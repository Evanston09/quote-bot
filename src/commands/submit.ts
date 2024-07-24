import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalSubmitInteraction, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import * as quotesManager from '../quotesManager';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submit')
		.setDescription('Submits a quote.'),
	async execute(interaction: CommandInteraction) {
        const modal = new ModalBuilder()
			.setCustomId('quoteModal')
			.setTitle('Submit Quote');

		// Add components to modal
		const quoteInput = new TextInputBuilder()
			.setCustomId('quoteInput')
			.setLabel("What is the quote?")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(quoteInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);

        // Make sure modal to look for is the right one
        const filter = (interaction: ModalSubmitInteraction) => interaction.customId === 'quoteModal';

        // Get response
        interaction
            .awaitModalSubmit({ filter, time: 30000 })
            .then((modelInteraction) => {
                const quote_body = modelInteraction.fields.getTextInputValue('quoteInput');
                const author_name = modelInteraction.user.displayName;
                const author_id = modelInteraction.user.id;
                const quote = { body: quote_body, author_name: author_name, author_id: author_id }

                if (quotesManager.quoteExists(quote)) {
                    modelInteraction.reply('This quote already exists... Please use /submit again.')
                    return;
                }

                quotesManager.submitQuote(quote);
                modelInteraction.reply(`**Quote submitted successfully :thumbs_up:**\n${quote.body}`)
            })
	},
};

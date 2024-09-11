import { Client, Events, Message, Collection, GatewayIntentBits, TextChannel } from 'discord.js';

import * as quoteManger from './quotes-manager';

import { config } from 'dotenv';

config()

// Get some key stuff
const token = process.env.DISCORD_TOKEN;
const channel_id = process.env.CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });

client.once(Events.ClientReady, async (readyClient: Client<true>)=> {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    const messages = await fetchAllMessages()
    parseMessage(messages);
    console.log('All Done!')
    client.destroy();
});

// Discord only lets you get 100 messages per call. Hence this stuff
async function fetchAllMessages() {
  console.log('Fetching messages...');
  const channel = client.channels.cache.get(channel_id!) as TextChannel;
  let messages: Message[] = [];

  // Create message pointer
  let message = await channel.messages
    .fetch({ limit: 1 })
    .then((messagePage: Collection<string, Message>) => (messagePage.size === 1 ? messagePage.at(0) : null));

  while (message) {
    await channel.messages
      .fetch({ limit: 100, before: message.id })
      .then((messagePage: Collection<string, Message>) => {
        messagePage.forEach(msg => messages.push(msg));

        // Update our message pointer to be the last message on the page of messages
        message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
      });
  }
  console.log('Done fetching messages.');
  return messages
}

function parseMessage(messages: Message[]) {
    console.log('Parsing messages...');
    for (const message of messages) {
        if (message.content.startsWith('.submit')) {
            const quote = message.content.slice(8);
            if (quote.length === 0) {
                continue;
            }
            quoteManger.submitQuote({ body: quote, author_name: message.author.globalName!, author_id: message.author.id });
        }
    }
    console.log('Done parsing messages.');
}

client.login(token);

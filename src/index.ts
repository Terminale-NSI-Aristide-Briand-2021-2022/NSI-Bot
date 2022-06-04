import { config } from 'dotenv';

import { Button } from './bases';
import { Bot } from './client';

config();

const client = new Bot({
  token: process.env.TOKEN ?? '',
  tokenType: 'Bot',
  version: '9',
  intents: ['GUILD_MESSAGES']
});

client.on('READY', async () => {
  client.init();

  const user = await client.user.getCurrentUser();
  console.log(`Logged in as ${user.username}!`);

  client.syncCommands();
});

client.on('INTERACTION_CREATE', (interaction) => {
  if (interaction.type === 2) {
    const command = client.commands.get(interaction.data?.name ?? '');
    if (!command) return;

    command.run(client, interaction);
  } else if (interaction.type === 3) {
    if (interaction.data?.component_type === 2) {
      const buttons = client.buttons.keys();
      let buttonCommand: Button | undefined;
      for (const button of buttons) {
        if (interaction.data?.custom_id?.startsWith(button)) {
          buttonCommand = client.buttons.get(button);
          break;
        }
      }
      if (!buttonCommand) return;

      buttonCommand.run(client, interaction);
    }
  }
});

client.on('MESSAGE_CREATE', (message) => {
  if (message.content.includes('```')) {
    const raw_codes = message.content.split('```');
    if (raw_codes.length === 2) return;
    client.channel
      .createMessage(message.channel_id, {
        message_reference: {
          message_id: message.id
        },
        content: "Voulez vous que j'execute le(s) code(s) de ce message ?",
        components: [
          {
            type: 1,
            components: [
              {
                type: 1,
                style: 3,
                custom_id: 'yes',
                emoji: {
                  id: '888076372981993512'
                }
              },
              {
                type: 1,
                style: 4,
                custom_id: 'no',
                emoji: {
                  id: '888076372981993512'
                }
              }
            ]
          }
        ]
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
      });
  }
});

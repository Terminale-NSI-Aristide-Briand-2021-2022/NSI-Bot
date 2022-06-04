import { Command } from '../bases';

export default new Command(
  {
    name: 'test',
    description: 'test'
  },
  (client, interaction) => {
    client.interaction.createInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: 4,
        data: {
          content: 'Test passed'
        }
      }
    );
  }
);

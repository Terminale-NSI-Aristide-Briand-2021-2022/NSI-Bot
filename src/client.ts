import { Client, ClientOptions } from 'higa';
import { Button, Command } from './bases';
import { readdirSync } from 'fs';

export class Bot extends Client {
  cache = new Map<string, string>();

  commands = new Map<string, Command>();
  buttons = new Map<string, Button>();

  appId = '';

  constructor(options: ClientOptions) {
    super(options);
  }

  init = async () => {
    const rootDir = process.argv[3] === 'true' ? './src' : './build';

    const pathCommands = `${rootDir}/commands`;

    readdirSync(pathCommands).forEach(async (file) => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const { default: command } = await import(`./commands/${file}`);
        this.commands.set(command.data?.name ?? '', command);
      }
    });

    const pathButtons = `${rootDir}/buttons`;
    readdirSync(pathButtons).forEach(async (file) => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const { default: button } = await import(`./buttons/${file}`);
        this.buttons.set(button.custom_id_start ?? '', button);
      }
    });
  };

  syncCommands = async () => {
    this.appId = (await this.user.getCurrentUser()).id;
    for (const c of this.commands.values()) {
      this.applicationCommand.createGlobalApplicationCommand(
        this.appId,
        c.data
      );
    }

    const currentCommands =
      await this.applicationCommand.getGlobalApplicationCommands(this.appId);

    for (const c of currentCommands) {
      if (!this.commands.has(c.name)) {
        this.applicationCommand.deleteGlobalApplicationCommand(
          this.appId,
          c.id
        );
      }
    }
  };
}

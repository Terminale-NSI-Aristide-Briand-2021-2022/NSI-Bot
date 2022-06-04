import { ApplicationCommandOptions, Interaction } from 'higa/types';
import { Bot } from './client';

export class Command {
  data: ApplicationCommandOptions;
  run: (client: Bot, interaction: Interaction) => void;
  constructor(
    data: ApplicationCommandOptions,
    run: (client: Bot, interaction: Interaction) => void
  ) {
    this.data = data;
    this.run = run;
  }
}

export class Button {
  custom_id_start: string;
  run: (client: Bot, interaction: Interaction) => void;
  constructor(
    custom_id_start: string,
    run: (client: Bot, interaction: Interaction) => void
  ) {
    this.custom_id_start = custom_id_start;
    this.run = run;
  }
}

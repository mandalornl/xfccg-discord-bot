import 'dotenv/config';
import {
  REST,
  Routes,
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
  ApplicationCommandOptionChoiceData,
  InteractionContextType,
} from 'discord.js';

import { api } from './api';

const rest = new REST({
  version: '10',
});
rest.setToken(process.env.DISCORD_TOKEN);

const sets: string[] = await api.get('cards/sets.json');
const types: string[] = await api.get('cards/types.json');

const getApplicationCommandOptionChoiceData = (values: string[]): ApplicationCommandOptionChoiceData[] => (
  values.map((value) => ({
    value,
    name: value,
  }))
);

await rest.put(Routes.applicationCommands(process.env.APP_ID), {
  body: [
    {
      name: 'cards',
      description: 'Embed a XFCCG card',
      type: ApplicationCommandOptionType.Subcommand,
      integration_types: [ ApplicationIntegrationType.GuildInstall ],
      contexts: [ InteractionContextType.Guild ],
      options: [
        {
          name: 'set',
          description: 'The card set',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: getApplicationCommandOptionChoiceData(sets),
        },
        {
          name: 'type',
          description: 'The card type',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: getApplicationCommandOptionChoiceData(types),
        },
        {
          name: 'search',
          description: 'The search query',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    },
  ],
});

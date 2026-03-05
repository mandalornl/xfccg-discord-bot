import 'dotenv/config';
import {
  REST,
  Routes,
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
  ApplicationCommandOptionChoiceData,
  InteractionContextType,
} from 'discord.js';

import { api } from '#src/util/api';

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
      name: 'card',
      description: 'Embed a XFCCG card by Set, Type and Title',
      type: ApplicationCommandOptionType.Subcommand,
      integration_types: [ ApplicationIntegrationType.GuildInstall ],
      contexts: [ InteractionContextType.Guild ],
      options: [
        {
          name: 'set',
          description: 'Select the card Set',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: getApplicationCommandOptionChoiceData(sets),
        },
        {
          name: 'type',
          description: 'Select the card Type',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: getApplicationCommandOptionChoiceData(types),
        },
        {
          name: 'title',
          description: 'Query cards by their Title, only max 25 results are shown for each query',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    },
    {
      name: 'card-bfn',
      description: 'Embed a XFCCG card by Bureau File Number',
      type: ApplicationCommandOptionType.Subcommand,
      integration_types: [ ApplicationIntegrationType.GuildInstall ],
      contexts: [ InteractionContextType.Guild ],
      options: [
        {
          name: 'bfn',
          description: 'The card Bureau File Number',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
});

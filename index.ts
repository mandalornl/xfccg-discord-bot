import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  Events,
  MessageFlags,
} from 'discord.js';

import { api } from './api';

const normalize = (value: string): string => (
  String(value)
    .normalize()
    .toLowerCase()
);

const slugify = (value: string): string => (
  normalize(value).replace(/[^0-9a-z-]+/g, '-')
);

const fetchSets = async (set?: string): Promise<string[]> => {
  if (set) {
    return [ slugify(set) ];
  }

  const sets: string[] = await api.get('cards/sets.json');

  return sets.map(slugify);
};

const fetchPool = async (set?: string) => {
  const sets = await fetchSets(set);
  const cards = await Promise.all(sets.map((set) => api.get(`cards/${set}.json`)));

  return cards.flat();
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) {
    return;
  }

  if (interaction.commandName !== 'cards') {
    return;
  }

  const set = interaction.options.getString('set');
  const type = interaction.options.getString('type');

  if (interaction.isAutocomplete()) {
    const search = normalize(interaction.options.getFocused());

    if (!search) {
      return interaction.respond([]);
    }

    const pool = await fetchPool(set);

    const cards = pool.filter((card) => {
      if (type && card.type !== type) {
        return false;
      }

      return normalize(card.id).indexOf(search) !== -1
        || normalize(card.title).indexOf(search) !== -1;
    });

    await interaction.respond(
      cards
        .slice(0, 25)
        .map((card) => ({
          value: card.id,
          name: card.title,
        }))
    );
  }

  if (interaction.isChatInputCommand()) {
    const pool = await fetchPool(set);

    const id = interaction.options.getString('search');
    const card = pool.find((card) => card.id === id);

    if (!card) {
      return interaction.reply({
        content: 'Card not found!',
        flags: MessageFlags.Ephemeral,
      });
    }

    // TODO: Use env var.
    const baseUrl = 'https://mandalornl.github.io/xfccg/cards';

    await interaction.reply({
      embeds: [
        {
          title: card.title,
          description: card.gameEffect,
          color: 0x76FF03,
          author: {
            name: card.createdBy,
          },
          image: {
            url: `${baseUrl}/${slugify(card.set)}/${slugify(card.id)}.jpg`,
          },
          url: `${baseUrl}?id=${encodeURIComponent(id)}`,
          fields: [
            {
              name: 'ID',
              value: card.id,
            },
            {
              name: 'Set',
              value: card.set,
            },
            {
              name: 'Type',
              value: card.type,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
});

await client.login(process.env.DISCORD_TOKEN);

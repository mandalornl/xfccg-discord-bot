import { APIEmbed } from 'discord.js';

import type { Card } from '#src/types/card';
import { slugify } from '#src/util/slugify';

export const createCardEmbed = (card: Card): APIEmbed => ({
  title: card.title,
  description: card.gameEffect,
  color: 0x76FF03,
  author: {
    name: card.createdBy,
  },
  image: {
    url: `${process.env.BASE_URL}/images/cards/${slugify(card.set)}/${slugify(card.id)}.jpg`,
  },
  url: `${process.env.BASE_URL}/cards?id=${encodeURIComponent(card.id)}`,
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
});

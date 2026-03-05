import { Card } from '#src/types/card';
import { api } from '#src/util/api';
import { slugify } from '#src/util/slugify';

export const pool: Card[] = [];

export const loadPool = async () => {
  console.log('Loading pool...');

  const sets: string[] = await api.get('cards/sets.json');

  for (const set of sets) {
    const cards = await api.get(`cards/${slugify(set)}.json`);

    pool.push(...cards);

    console.log(`\x1b[35m${set}\x1b[0m loaded!`);
  }

  console.log('Done!')
};

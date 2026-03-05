import 'dotenv/config';
import {
  Client,
  Events,
  GatewayIntentBits,
} from 'discord.js';

import { loadPool } from '#src/util/pool';
import { commandCard } from '#src/commands/card';
import { commandCardBfn } from '#src/commands/card-bfn';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once(Events.ClientReady, async (readyClient) => {
  await loadPool();

  console.log(`Logged in as \x1b[36m${readyClient.user.tag}\x1b[0m!`);
});

client.on(Events.InteractionCreate, commandCard);
client.on(Events.InteractionCreate, commandCardBfn);

await client.login(process.env.DISCORD_TOKEN);

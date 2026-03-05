import {
  Interaction,
  MessageFlags,
} from 'discord.js';

import { pool } from '#src/util/pool';
import { normalize } from '#src/util/normalize';
import { createCardEmbed } from '#src/util/embed';

export const commandCardBfn = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.commandName !== 'card-bfn') {
    return;
  }

  const id = normalize(interaction.options.getString('bfn'));
  const card = pool.find((card) => normalize(card.id) === id);

  if (!card) {
    return interaction.reply({
      content: 'Card not found!',
      flags: MessageFlags.Ephemeral,
    });
  }

  const embed = createCardEmbed(card);

  await interaction.reply({
    embeds: [ embed ],
  });
}

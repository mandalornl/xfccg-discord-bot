import {
  Interaction,
  MessageFlags,
} from 'discord.js';

import { pool } from '#src/util/pool';
import { normalize } from '#src/util/normalize';
import { createCardEmbed } from '#src/util/embed';

export const commandCard = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) {
    return;
  }

  if (interaction.commandName !== 'card') {
    return;
  }

  const set = interaction.options.getString('set');
  const type = interaction.options.getString('type');

  if (interaction.isAutocomplete()) {
    const title = normalize(interaction.options.getFocused());

    if (!title) {
      return interaction.respond([]);
    }

    const cards = pool.filter((card) => (
      card.set === set
      && card.type === type
      && normalize(card.title).indexOf(title) !== -1
    ));

    await interaction.respond(
      cards
        .slice(0, 25)
        .map((card) => ({
          value: card.id,
          name: `${card.id} — ${card.title}`,
        }))
    );
  }

  if (interaction.isChatInputCommand()) {
    const id = interaction.options.getString('title');
    const card = pool.find((card) => card.id === id);

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
}

// /components/BotSelector.tsx
import React, { ChangeEvent } from 'react';
import type { AvailableBots, InitialisedBot } from '../utils/bots';

type SelectedBot = {
  name: string;
  move: InitialisedBot;
} | null;

const BotSelector: React.FC<{
  playerName: string;
  availableBots: AvailableBots;
  selectedBot: SelectedBot;
  setSelectedBot: (bot: SelectedBot) => void;
  disabled: boolean;
}> = ({ playerName, availableBots, selectedBot, setSelectedBot, disabled }) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const name = e.target.value;
    setSelectedBot(name ? { name, move: availableBots[name]() } : null);
  };

  return (
    <div className='mb-2.5 inline-block'>
      <label className='mr-2.5'>{playerName}</label>
      <select value={selectedBot?.name} onChange={handleChange} disabled={disabled}>
        <option value="" key="User">
          User
        </option>
        {Object.keys(availableBots).map(name => (
          <option key={name}>{name}</option>
        ))}
      </select>
    </div>
  );
};

export default BotSelector;

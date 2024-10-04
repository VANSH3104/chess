// /components/BotSelector.tsx
import React, { ChangeEvent } from "react";
import type { AvailableBots, InitialisedBot } from "../utils/bots";

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
    <div className=" inline-block max-w-sm">
      <label className="md:mr-2.5 font-bold mr-1">{playerName}</label>
      <select
        value={selectedBot?.name}
        onChange={handleChange}
        disabled={disabled}
        className={`bg-white border border-gray-300 rounded-lg w- p-1 md:p-2 transition-all duration-200 
        ${disabled ? "bg-gray-200 cursor-not-allowed" : "hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"}`}
      >
        <option value="" key="User">
          User
        </option>
        {Object.keys(availableBots).map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
    </div>
  );
};

export default BotSelector;

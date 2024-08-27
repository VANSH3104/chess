import { Move } from 'chess.js';
import History from '../board/component/history';

interface SectionProps {
  history: Move[];
}

export const Section: React.FC<SectionProps> = ({ history }) => {
  return (
    <div className="rounded-xl bg-neutral-700 w-full h-full items-center">
      <div className="rounded-xl bg-customColor w-full h-full overflow-auto text-white items-center flex justify-center">
        <div className='h-full font-bold text-lg'>
        <History history={history} />
        </div>
      </div>
    </div>
  );
};

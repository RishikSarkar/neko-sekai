import { MdOutlineAttachMoney } from 'react-icons/md';

interface PetHeaderProps {
  onReset: () => void;
  notification: string;
  timeLeft: string;
  currCoins: number;
  coinCurrentlyIncreasing: boolean;
  coinIncrease: number;
  currUser: string;
  isCheatActive: boolean;
  onCheatClick?: () => void;
  t: (key: string) => string;
}

export function PetHeader({
  onReset,
  notification,
  timeLeft,
  currCoins,
  coinCurrentlyIncreasing,
  coinIncrease,
  currUser,
  isCheatActive,
  onCheatClick,
  t,
}: PetHeaderProps) {
  return (
    <div className="fixed top-0 left-0 h-[15vh] w-full grid grid-cols-7 gap-4 border-8 border-black z-50">
      <div onClick={onReset} className="col-span-1 lg:px-8 flex justify-center items-center text-white lg:text-xl cursor-pointer px-0 text-sm">
        {t('reset')}
      </div>
      <div className="col-span-2" />
      <div className="col-span-1 bg-black flex justify-center items-center text-white/80 text-sm px-4">
        <span className="animate-pulse">{notification}</span>
      </div>
      <div className="col-span-1 lg:px-8 flex flex-col justify-center items-center text-white lg:text-xl px-0 text-sm">
        <span className="lg:text-lg text-xs">{t('timeLeft')}</span>
        <span>{timeLeft}</span>
      </div>
      <div className="col-span-1 lg:px-8 px-2 flex grid grid-cols-5 justify-center bg-white/10 items-center text-white lg:text-xl text-sm border-l-8 border-r-8 border-white/10">
        <div className="col-span-1 hidden lg:block">
          <MdOutlineAttachMoney size={30} />
        </div>
        <div className="col-span-1 lg:hidden block">
          <MdOutlineAttachMoney size={20} />
        </div>
        <div className="col-span-3">{currCoins}</div>
        <div className="col-span-1">
          <span className={`${coinCurrentlyIncreasing ? 'block' : 'hidden'} lg:text-sm text-xs text-white/50`}>
            +{coinIncrease}
          </span>
        </div>
      </div>
      <div
        onClick={isCheatActive && onCheatClick ? onCheatClick : undefined}
        className={`col-span-1 lg:px-8 px-0 flex justify-center items-center text-white lg:text-xl text-sm ${isCheatActive && onCheatClick ? 'cursor-pointer hover:bg-white/10' : ''}`}
      >
        {currUser}
      </div>
    </div>
  );
}

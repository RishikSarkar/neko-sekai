import Image from 'next/image';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

interface PetFooterProps {
  onShopClick: () => void;
  onFeedClick: () => void;
  isFeeding: boolean;
  showLevelUpArrow: boolean;
  foodInventory: Record<string, number>;
  currFood: string;
  foodOptions: string[];
  foodIndex: number;
  onChangeFood: (direction: number) => void;
  t: (key: string) => string;
}

export function PetFooter({
  onShopClick,
  onFeedClick,
  isFeeding,
  showLevelUpArrow,
  foodInventory,
  currFood,
  foodOptions,
  foodIndex,
  onChangeFood,
  t,
}: PetFooterProps) {
  const foodName = foodOptions[foodIndex] ?? currFood ?? 'onigiri';
  const canFeed = !isFeeding && !showLevelUpArrow && (foodInventory[foodName] ?? 0) > 0;

  return (
    <div className="fixed bottom-0 h-[15vh] w-full grid grid-cols-7 gap-4 border-8 border-black z-50">
      <div className="col-span-2" />
      <div
        onClick={onShopClick}
        className="col-span-1 bg-black hover:bg-white/10 cursor-pointer flex justify-center items-center text-white lg:text-3xl text-xl rounded-xl ease-in duration-100"
      >
        {t('shop')}
      </div>
      <div
        onClick={onFeedClick}
        className={`${canFeed ? 'bg-white hover:bg-white/80 cursor-pointer' : 'bg-white/80 cursor-not-allowed'} col-span-1 flex justify-center items-center text-black lg:text-3xl text-xl rounded-xl ease-in duration-100`}
      >
        {t('feed')}
      </div>
      <div className="col-span-1 flex justify-between items-center bg-black relative">
        <div
          onClick={() => { if (!isFeeding) onChangeFood(-1); }}
          className={`${isFeeding ? 'cursor-not-allowed' : 'cursor-pointer'} flex justify-start lg:pl-4 w-full`}
        >
          <FaCaretLeft className="text-white" size={20} />
        </div>
        <div className="text-center ease-in">
          {foodName && (
            <>
              <Image
                src={`/assets/food/icons/${foodName}.png`}
                alt={foodName}
                width={400}
                height={400}
                style={{ opacity: (foodInventory[foodName] ?? 0) === 0 ? 0.6 : 1 }}
              />
              <div className="absolute lg:text-sm text-xs bottom-1 lg:left-1/2 transform lg:-translate-x-1/2 translate-x-4 lg:translate-y-0 translate-y-1/2 text-white bg-white/10 lg:px-2 px-1 items-center justify-center text-center">
                {foodInventory[foodName] ?? 0}
              </div>
            </>
          )}
        </div>
        <div
          onClick={() => { if (!isFeeding) onChangeFood(1); }}
          className={`${isFeeding ? 'cursor-not-allowed' : 'cursor-pointer'} flex justify-end pr-4 w-full`}
        >
          <FaCaretRight className="text-white" size={20} />
        </div>
      </div>
      <div className="col-span-2" />
    </div>
  );
}

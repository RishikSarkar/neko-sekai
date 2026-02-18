import { MdEdit } from 'react-icons/md';

interface PetInfoPanelProps {
  petName: string;
  petNameEditing: boolean;
  tempPetName: string;
  onPetNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPetBlur: () => void;
  onToggleEdit: () => void;
  currLevel: number;
  levelProgress: number;
  levelXPNeeded: number;
  levelStatus: string;
  favoriteFood: string;
  onCustomizeClick: () => void;
  t: (key: string) => string;
}

export function PetInfoPanel({
  petName,
  petNameEditing,
  tempPetName,
  onPetNameChange,
  onPetBlur,
  onToggleEdit,
  currLevel,
  levelProgress,
  levelXPNeeded,
  levelStatus,
  favoriteFood,
  onCustomizeClick,
  t,
}: PetInfoPanelProps) {
  return (
    <div className="h-full max-h-[60vh] col-span-1 bg-black/90 border-8 border-black ml-8 items-center justify-center text-black rounded-xl">
      <div className="h-full lg:px-4 mx-1 lg:mx-0">
        <div className="lg:text-2xl text-md text-black bg-white lg:py-4 py-1 lg:my-4 my-1 rounded-xl flex items-center justify-between">
          {petNameEditing ? (
            <input
              type="text"
              value={tempPetName}
              onChange={onPetNameChange}
              onBlur={onPetBlur}
              autoFocus
              className="lg:text-2xl text-sm text-center lg:mx-4 w-full animate-pulse font-bold selection:text-white selection:bg-black focus:outline-none"
              onKeyDown={(e) => { if (e.key === 'Enter') onPetBlur(); }}
            />
          ) : (
            <>
              <span className="flex-1 text-center lg:ml-16 ml-2 lg:mr-8 mr-1 truncate font-bold">{petName}</span>
              <MdEdit onClick={onToggleEdit} className="lg:mr-4 mr-1 cursor-pointer" size={16} />
            </>
          )}
        </div>
        <div className="lg:text-lg text-sm bg-white lg:py-4 py-1 lg:px-4 px-1 lg:my-4 my-2 rounded-xl">
          {t('level')} {currLevel}
          <div className="w-full lg:border-4 border-2 border-black bg-black/10 lg:mt-2 mt-1">
            <div
              className="bg-black/50 text-[10px] py-1 leading-none text-center text-white ease-in duration-200"
              style={{ width: `${(levelProgress / levelXPNeeded) * 100}%` }}
            />
          </div>
          <div className="lg:text-xs text-[10px] lg:py-1">{levelStatus || `${levelProgress}/${levelXPNeeded} XP`}</div>
        </div>
        <div className="lg:text-lg text-sm bg-white lg:py-4 py-1 lg:my-4 rounded-xl bg-white">
          {t('favoriteFood')}: <span className="font-bold text-black/80 animate-pulse">{favoriteFood}</span>
        </div>
        <div
          onClick={onCustomizeClick}
          className="lg:text-lg text-sm bg-white lg:py-8 py-4 lg:my-4 my-2 rounded-xl cursor-pointer hover:bg-white/80 ease-in duration-100"
        >
          {t('customize')}
        </div>
      </div>
    </div>
  );
}

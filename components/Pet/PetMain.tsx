import Image from 'next/image';
import type { Cosmetics } from '@/types';

interface PetMainProps {
  currBg: string;
  bgTime: string;
  currLevel: number;
  frameIndex: number;
  currentAnimation: string;
  cosmetics: Cosmetics;
  animations: {
    base: Record<string, { sequence: string[] }>;
    cosmetics: Record<string, Record<string, { sequence: string[] }>>;
  };
  showFood: boolean;
  currFood: string;
  showLevelUpArrow: boolean;
  onPetHead: () => void;
}

export function PetMain({
  currBg,
  bgTime,
  currLevel,
  frameIndex,
  currentAnimation,
  cosmetics,
  animations,
  showFood,
  currFood,
  showLevelUpArrow,
  onPetHead,
}: PetMainProps) {
  const seq = animations.base[currentAnimation as keyof typeof animations.base]?.sequence ?? animations.base.idle?.sequence ?? [];
  const foodSeq = animations.base.food?.sequence ?? [];
  const levelUpArrowSeq = (animations.base.level_up_arrow as { sequence: string[] } | undefined)?.sequence ?? [];

  return (
    <div className="h-full border-[20px] col-span-2 border-black rounded-xl">
      <div className="h-[90%] flex bg-white items-end justify-center">
        <div className="z-10 relative w-full h-full bg-black/20">
          <Image src={`/assets/backgrounds/${currBg}-${bgTime}.gif`} alt="" fill />
          <div
            className={`z-20 absolute bottom-1 left-1/2 transform -translate-x-1/2 ${currLevel >= 5 ? 'w-[120px] h-[120px] lg:w-[200px] lg:h-[200px]' : 'w-[100px] h-[100px] lg:w-[180px] lg:h-[180px]'}`}
          >
            <Image
              src={seq[frameIndex] ?? '/assets/sprites/cat/01/cat-01-idle/cat-01-idle1.png'}
              alt="Pet"
              fill
              unoptimized
              onClick={onPetHead}
              className="cursor-pointer absolute"
            />
            {(Object.keys(cosmetics.equipped) as Array<'head' | 'face' | 'body'>).map((type) => {
              const item = cosmetics.equipped[type];
              const anim = animations.cosmetics[type]?.[currentAnimation];
              const ok = currentAnimation === 'brush' ? type !== 'head' : true;
              if (item && anim?.sequence && ok) {
                return (
                  <Image
                    key={type}
                    src={anim.sequence[frameIndex]}
                    alt={type}
                    fill
                    unoptimized
                    onClick={onPetHead}
                    className="cursor-pointer absolute"
                  />
                );
              }
              return null;
            })}
          </div>
          {showFood && (
            <div className="z-40 absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50 text-black w-[120px] h-[120px] lg:w-[200px] lg:h-[200px]">
              <Image
                src={foodSeq[frameIndex] ?? `/assets/food/${currFood}/${currFood}1.png`}
                alt="Food"
                fill
                unoptimized
              />
            </div>
          )}
          {showLevelUpArrow && (
            <div className="z-40 absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50 text-black w-[240px] h-[240px] lg:w-[400px] lg:h-[400px]">
              <Image src={levelUpArrowSeq[frameIndex]} alt="^" fill unoptimized />
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-[10%] bg-black" />
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

export default function Pet() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [idleCount, setIdleCount] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [showFood, setShowFood] = useState(false);

  const [showMessage, setShowMessage] = useState(false); // Yasmina
  const [msgDisabled, setMsgDisabled] = useState(false); // Yasmina

  const [isFeeding, setIsFeeding] = useState(false);

  const [currBg, setCurrBg] = useState("livingroom/01/livingroom-01.gif");
  const [currFood, setCurrFood] = useState("onigiri");
  const [foodOptions, setFoodOptions] = useState(["onigiri", "maki", "nigiri"]);
  const [foodIndex, setFoodIndex] = useState(0);

  function generateSequence(basePath, count) {
    return Array.from({ length: count }, (_, i) => `${basePath}${i + 1}.png`);
  }

  const animations = {
    idle: {
      sequence: generateSequence("/assets/sprites/cat/01/cat-01-idle/cat-01-idle", 10),
      loopCount: 10,
    },
    yawn: {
      sequence: generateSequence("/assets/sprites/cat/01/cat-01-yawn/cat-01-yawn", 14),
      loopCount: 1,
    },
    eat: {
      sequence: generateSequence("/assets/sprites/cat/01/cat-01-eat/cat-01-eat", 35),
    },
    food: {
      sequence: generateSequence("/assets/food/" + currFood + "/" + currFood, 35),
    }
  };

  useEffect(() => {
    const currentSequence = animations[currentAnimation].sequence;
    const intervalId = setInterval(() => {
      setFrameIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % currentSequence.length;
        return nextIndex;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [currentAnimation]);

  useEffect(() => {
    if (frameIndex === animations[currentAnimation].sequence.length - 1) {
      if (currentAnimation === 'idle') {
        if (idleCount + 1 < animations.idle.loopCount) {
          setIdleCount(count => count + 1);
        } else {
          setCurrentAnimation('yawn');
          setIdleCount(0);
        }
      } else if (currentAnimation === 'yawn') {
        setCurrentAnimation('idle');
      } else if (currentAnimation === 'eat') {
        setShowFood(false);
        setIsFeeding(false);
      }
      setFrameIndex(0); // Reset frame index for the new animation
    }
  }, [frameIndex, currentAnimation, idleCount]);

  useEffect(() => {
    setCurrFood(foodOptions[foodIndex]);
  }, [foodIndex, foodOptions]);

  const feedPet = () => {
    if (!isFeeding) {
      setIsFeeding(true);
      setCurrentAnimation('eat');
      setFrameIndex(0); // Start the eat animation from the first frame
      setShowFood(true);

      setTimeout(() => {
        setCurrentAnimation('idle');
        setFrameIndex(0); // Return to the idle animation at the first frame
        setShowFood(false);
        setIsFeeding(false);
      }, animations.eat.sequence.length * 100);
    }
  };

  const toggleMessageVisibility = () => {
    if (!msgDisabled) {
      setShowMessage(true);
      setMsgDisabled(true);

      setTimeout(() => {
        setShowMessage(false);
        setMsgDisabled(false);
      }, 5000);
    }
  };

  const changeFood = (direction) => {
    setFoodIndex(prevIndex => {
      const newIndex = (prevIndex + direction + foodOptions.length) % foodOptions.length;
      return newIndex;
    });
  };

  return (
    <div id='pet' className='bg-white w-full h-screen font-mono select-none'>
      <div className="w-full h-full flex flex-col items-center justify-center text-center">
        <div className='border-8 border-black'>
          <div className="w-[50vw] h-[50vh] flex bg-white items-end justify-center">

            <div className='z-10 relative w-full h-full'>
              <Image src={"/assets/backgrounds/" + currBg} layout="fill" />
              <div className='z-20 absolute bottom-1 left-1/2 transform -translate-x-1/2'>
                <Image src={animations[currentAnimation].sequence[frameIndex]} alt="Pet" width={200} height={200} unoptimized={true} />

                {/* Yasmina */}
                {showMessage && (
                  <div className='absolute bottom-0 -right-10 transform translate-x-1/2 -translate-y-1/2'>
                    <Image src="/assets/miscellaneous/valentine.png" alt="Happy Valentine's Day!" width={400} height={400} />
                  </div>
                )}

              </div>
              {showFood && (
                <div className='z-40 absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50 text-black'>
                  <Image src={animations.food.sequence[frameIndex]} alt="Food" width={200} height={200} unoptimized={true} />
                </div>
              )}
            </div>

          </div>
          <div className='w-[50vw] h-[5vh] bg-black' />
        </div>

        <div className='fixed bottom-0 h-[15vh] w-[40vw] grid grid-cols-3 gap-2 border-8 border-black z-50'>

          {/* Yasmina */}
          <div onClick={toggleMessageVisibility} className={`${isFeeding ? 'bg-white/80 cursor-not-allowed' : 'bg-white hover:bg-white/80 cursor-pointer'} col-span-1 flex justify-center items-center text-black font-bold text-2xl`}>
            click me!
          </div>

          <div onClick={feedPet} className={`${isFeeding ? 'bg-white/80 cursor-not-allowed' : 'bg-white hover:bg-white/80 cursor-pointer'} col-span-1 flex justify-center items-center text-black font-bold text-3xl`}>
            feed
          </div>

          <div className='col-span-1 flex justify-between items-center bg-black'>
            <div onClick={() => { if (!isFeeding) { changeFood(-1); } }} className={`${isFeeding ? 'cursor-not-allowed' : 'cursor-pointer'} flex justify-start pl-4 w-full`}>
              <FaCaretLeft className='text-white' size={20} />
            </div>
            <div className='text-center'>
              <Image
                src={`/assets/food/icons/${foodOptions[foodIndex]}.png`}
                alt={foodOptions[foodIndex]}
                width={400}
                height={400}
                unoptimized={true}
              />
            </div>
            <div onClick={() => { if (!isFeeding) { changeFood(1); } }} className={`${isFeeding ? 'cursor-not-allowed' : 'cursor-pointer'} flex justify-end pr-4 w-full`}>
              <FaCaretRight className='text-white' size={20} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
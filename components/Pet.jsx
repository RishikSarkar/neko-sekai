"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { MdEdit } from "react-icons/md";

export default function Pet() {
  const [petName, setPetName] = useState('Poofy');
  const [editing, setEditing] = useState(false);
  const [tempPetName, setTempPetName] = useState(petName);

  const handleNameChange = (event) => {
    setTempPetName(event.target.value);
  };

  const handleBlur = () => {
    setPetName(tempPetName);
    setEditing(false);
  };

  const toggleEditMode = () => {
    setEditing(true);
  };

  const [currLevel, setCurrLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);

  const [frameIndex, setFrameIndex] = useState(0);
  const [idleCount, setIdleCount] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [showFood, setShowFood] = useState(false);

  const [isFeeding, setIsFeeding] = useState(false);

  const [currBg, setCurrBg] = useState("livingroom/01/livingroom-01.gif");
  const [currFood, setCurrFood] = useState("onigiri");
  const [foodOptions, setFoodOptions] = useState(["onigiri", "maki", "nigiri"]);
  const [foodIndex, setFoodIndex] = useState(0);

  const [favoriteFood, setFavoriteFood] = useState("nigiri");

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

      increaseLevel(currFood);

      setTimeout(() => {
        setCurrentAnimation('idle');
        setFrameIndex(0); // Return to the idle animation at the first frame
        setShowFood(false);
        setIsFeeding(false);
      }, animations.eat.sequence.length * 100);
    }
  };

  const changeFood = (direction) => {
    setFoodIndex(prevIndex => {
      const newIndex = (prevIndex + direction + foodOptions.length) % foodOptions.length;
      return newIndex;
    });
  };

  const increaseLevel = (food) => {
    if (food === favoriteFood) {
      setLevelProgress(levelProgress + 20);
    }
    else {
      setLevelProgress(levelProgress + 10);
    }

    if (food === favoriteFood && levelProgress >= 80) {
      setLevelProgress(levelProgress - 80);
      setCurrLevel(currLevel + 1);
    }
    else if (levelProgress >= 90) {
      setLevelProgress(levelProgress - 90);
      setCurrLevel(currLevel + 1);
    }
  };

  return (
    <div id='pet' className='bg-white w-full h-screen font-mono select-none'>
      <div className="w-full h-full flex flex-col items-center justify-center text-center">
        <div className='w-full h-[60vh] items-center justify-center text-center grid grid-cols-4 gap-8'>

          <div className='h-full col-span-1 bg-black/90 border-8 border-black ml-8 items-center justify-center text-black rounded-xl'>
            <div className='h-full px-4'>
              <div className='text-2xl font-bold text-black bg-white py-4 my-4 rounded-xl flex items-center justify-between'>
                {editing ? (
                  <input type="text" value={tempPetName} onChange={handleNameChange} onBlur={handleBlur} autoFocus className="text-2xl text-center mx-4 w-full animate-pulse" onKeyDown={(event) => { if (event.key === 'Enter') { handleBlur(); } }} />
                ) : (
                  <>
                    <span className="flex-1 text-center ml-16 mr-8 truncate">{petName}</span>
                    <MdEdit onClick={toggleEditMode} className="mr-4 cursor-pointer" size={16} />
                  </>
                )}
              </div>
              <div className='text-lg bg-white py-4 px-4 my-4 rounded-xl'>
                level {currLevel}
                <div className='w-full bg-white border-4 border-black mt-2'>
                  <div className='bg-black/50 text-[10px] leading-none py-1 text-center text-white ease-in duration-200' style={{ width: `${levelProgress}%` }}>
                    {/* {`${levelProgress}%`} */}
                  </div>
                </div>
              </div>
              <div className='text-lg bg-white py-4 my-4 rounded-xl'>
                favorite food: <span className='font-bold text-black/50'>{favoriteFood}</span>
              </div>
              <div className='text-lg bg-white py-10 my-4 rounded-xl cursor-not-allowed hover:bg-white/80 ease-in duration-100'>
                customize
              </div>
            </div>
          </div>

          <div className='h-full border-8 col-span-2 border-black rounded-xl'>

            <div className='h-[90%] flex bg-white items-end justify-center'>

              <div className='z-10 relative w-full h-full'>
                <Image src={"/assets/backgrounds/" + currBg} layout="fill" />
                <div className='z-20 absolute bottom-1 left-1/2 transform -translate-x-1/2'>
                  <Image src={animations[currentAnimation].sequence[frameIndex]} alt="Pet" width={200} height={200} unoptimized={true} />
                </div>
                {showFood && (
                  <div className='z-40 absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50 text-black'>
                    <Image src={animations.food.sequence[frameIndex]} alt="Food" width={200} height={200} unoptimized={true} />
                  </div>
                )}
              </div>

            </div>
            <div className='w-full h-[10%] bg-black' />
          </div>

          <div className='h-full col-span-1 bg-black/90 border-8 border-black mr-8 items-center justify-center text-black rounded-xl'>
            <div className='h-full px-4'>
              <div className='text-2xl bg-white py-2 my-4 rounded-xl font-bold'>
                Tasks
              </div>

              <div className='grid grid-cols-5 gap-2'>
                <div className='col-span-4 text-lg text-left bg-white/90 py-2 px-4 my-2 rounded-xl rounded-r-none flex items-center'>
                  task 1
                </div>
                <div className='col-span-1 text-sm text-center bg-white py-2 px-4 my-2 rounded-xl rounded-l-none flex items-center justify-center cursor-pointer hover:bg-white/80 ease-in duration-100'>
                  +10
                </div>
              </div>

              <div className='grid grid-cols-5 gap-2'>
                <div className='col-span-4 text-lg text-left bg-white/90 py-2 px-4 my-2 rounded-xl rounded-r-none flex items-center'>
                  task 2
                </div>
                <div className='col-span-1 text-sm text-center bg-white py-2 px-4 my-2 rounded-xl rounded-l-none flex items-center justify-center cursor-pointer hover:bg-white/80 ease-in duration-100'>
                  +10
                </div>
              </div>

              <div className='grid grid-cols-5 gap-2'>
                <div className='col-span-4 text-lg text-left bg-white/90 py-2 px-4 my-2 rounded-xl rounded-r-none flex items-center'>
                  task 3
                </div>
                <div className='col-span-1 text-sm text-center bg-white py-2 px-4 my-2 rounded-xl rounded-l-none flex items-center justify-center cursor-pointer hover:bg-white/80 ease-in duration-100'>
                  +10
                </div>
              </div>

              <div className='grid grid-cols-5 gap-2'>
                <div className='col-span-4 text-lg text-left bg-white/90 py-2 px-4 my-2 rounded-xl rounded-r-none flex items-center'>
                  task 4
                </div>
                <div className='col-span-1 text-sm text-center bg-white py-2 px-4 my-2 rounded-xl rounded-l-none flex items-center justify-center cursor-pointer hover:bg-white/80 ease-in duration-100'>
                  +10
                </div>
              </div>

              <div className='grid grid-cols-5 gap-2'>
                <div className='col-span-4 text-lg text-left bg-white/90 py-2 px-4 my-2 rounded-xl rounded-r-none flex items-center'>
                  task 5
                </div>
                <div className='col-span-1 text-sm text-center bg-white py-2 px-4 my-2 rounded-xl rounded-l-none flex items-center justify-center cursor-pointer hover:bg-white/80 ease-in duration-100'>
                  +10
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className='fixed bottom-0 h-[15vh] w-[40vw] grid grid-cols-3 gap-2 border-8 border-black z-50'>

          <div className='col-span-1 text-black'>

          </div>

          <div onClick={feedPet} className={`${isFeeding ? 'bg-white/80 cursor-not-allowed' : 'bg-white hover:bg-white/80 cursor-pointer'} col-span-1 flex justify-center items-center text-black font-bold text-3xl rounded-xl ease-in duration-100`}>
            feed
          </div>

          <div className='col-span-1 flex justify-between items-center bg-black'>
            <div onClick={() => { if (!isFeeding) { changeFood(-1); } }} className={`${isFeeding ? 'cursor-not-allowed' : 'cursor-pointer'} flex justify-start pl-4 w-full`}>
              <FaCaretLeft className='text-white' size={20} />
            </div>
            <div className='text-center ease-in'>
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
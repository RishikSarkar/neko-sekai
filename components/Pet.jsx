"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { FaCheck } from "react-icons/fa6";
import { RiMoneyDollarCircleFill, RiMoneyDollarBoxFill } from "react-icons/ri";
import { MdEdit, MdOutlineAttachMoney } from "react-icons/md";

export default function Pet() {
  const [currUser, setCurrUser] = useState('friendlyBOT');

  const [currCoins, setCurrCoins] = useState(0);
  const [targetCoins, setTargetCoins] = useState(0);
  const [coinIncrease, setCoinIncrease] = useState(0);
  const [coinCurrentlyIncreasing, setCoinCurrentlyIncreasing] = useState(false);

  const [petName, setPetName] = useState('Poofy');
  const [petNameEditing, setPetNameEditing] = useState(false);
  const [tempPetName, setTempPetName] = useState(petName);

  const handlePetNameChange = (event) => {
    setTempPetName(event.target.value);
  };

  const handlePetBlur = () => {
    setPetName(tempPetName);
    setPetNameEditing(false);
  };

  const togglePetEditMode = () => {
    setPetNameEditing(true);
  };

  const [currLevel, setCurrLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);

  const [tasks, setTasks] = useState([
    { id: 1, name: 'task 1', completed: false, editing: false, tempName: 'task 1' },
    { id: 2, name: 'task 2', completed: false, editing: false, tempName: 'task 2' },
    { id: 3, name: 'task 3', completed: false, editing: false, tempName: 'task 3' },
    { id: 4, name: 'task 4', completed: false, editing: false, tempName: 'task 4' },
    { id: 5, name: 'task 5', completed: false, editing: false, tempName: 'task 5' },
  ]);

  const handleTaskNameChange = (event, taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, tempName: event.target.value };
      }
      return task;
    }));
  };

  const handleTaskBlur = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.tempName !== '') {
        return { ...task, name: task.tempName, editing: false };
      }
      return task;
    }));
  };

  const toggleTaskEditMode = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, editing: true };
      }
      return task;
    }));
  };

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
      setFrameIndex(0);
    }
  }, [frameIndex, currentAnimation, idleCount]);

  useEffect(() => {
    setCurrFood(foodOptions[foodIndex]);
  }, [foodIndex, foodOptions]);

  useEffect(() => {
    if (currCoins < targetCoins) {
      const timer = setTimeout(() => {
        setCurrCoins(currCoins + 1);
      }, 50);

      return () => clearTimeout(timer);
    }

    setCoinCurrentlyIncreasing(false);
  }, [currCoins, targetCoins]);

  const feedPet = () => {
    if (!isFeeding) {
      setIsFeeding(true);
      setCurrentAnimation('eat');
      setFrameIndex(0);
      setShowFood(true);

      increaseLevel(currFood);

      setTimeout(() => {
        setCurrentAnimation('idle');
        setFrameIndex(0);
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

  const increaseCoins = (coins) => {
    setCoinIncrease(coins);
    setCoinCurrentlyIncreasing(true);
    setTargetCoins(currCoins + coins);
  };

  const completeTask = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        increaseCoins(10);
        return { ...task, completed: true };
      }
      return task;
    }));
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

  const [timeLeft, setTimeLeft] = useState('');
  const [currentDay, setCurrentDay] = useState(new Date().toLocaleDateString());

  const calculateTimeLeft = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const difference = tomorrow - now;

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
    const minutes = Math.floor((difference / (1000 * 60)) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((difference / 1000) % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      const newCurrentDay = new Date().toLocaleDateString();
      if (currentDay !== newCurrentDay) {
        resetTasksForNewDay();
        setCurrentDay(newCurrentDay);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentDay]);

  const resetTasksForNewDay = () => {
    setTasks(tasks.map(task => ({
      ...task,
      name: `task ${task.id}`,
      completed: false,
      editing: false,
      tempName: `task ${task.id}`
    })));
  };

  return (
    <div id='pet' className='bg-white w-full h-screen font-square select-none'>
      <div className="w-full h-full flex flex-col items-center justify-center text-center">


        <div className='fixed top-0 right-0 h-[15vh] w-[40vw] grid grid-cols-3 gap-2 border-8 border-black z-50'>

          <div onClick={resetTasksForNewDay} className='col-span-1 px-8 flex justify-center items-center text-white text-xl'>
            {timeLeft}
          </div>

          <div className='col-span-1 px-8 flex justify-center bg-white/10 items-center text-white text-xl border-l-8 border-r-8 border-white/10 grid grid-cols-5'>
            <div className='col-span-1'>
              <MdOutlineAttachMoney size={30} />
            </div>
            <div className='col-span-3'>
              {`${currCoins}`}
            </div>
            <div className='col-span-1'>
              <span className={`${coinCurrentlyIncreasing ? 'block' : 'hidden'} text-sm text-white/50`}>
                +{`${coinIncrease}`}
              </span>
            </div>
          </div>

          <div className='col-span-1 px-8 flex justify-center items-center text-white text-xl'>
            {`${currUser}`}
          </div>
        </div>


        <div className='w-full h-[60vh] items-center justify-center text-center grid grid-cols-4 gap-8'>

          <div className='h-full col-span-1 bg-black/90 border-8 border-black ml-8 items-center justify-center text-black rounded-xl'>
            <div className='h-full px-4'>
              <div className='text-2xl text-black bg-white py-4 my-4 rounded-xl flex items-center justify-between'>
                {petNameEditing ? (
                  <input type="text" value={tempPetName} onChange={handlePetNameChange} onBlur={handlePetBlur} autoFocus className="text-2xl text-center mx-4 w-full animate-pulse font-bold" onKeyDown={(event) => { if (event.key === 'Enter') { handlePetBlur(); } }} />
                ) : (
                  <>
                    <span className="flex-1 text-center ml-16 mr-8 truncate font-bold">{petName}</span>
                    <MdEdit onClick={togglePetEditMode} className="mr-4 cursor-pointer" size={16} />
                  </>
                )}
              </div>
              <div className='text-lg bg-white py-4 px-4 my-4 rounded-xl'>
                level {currLevel}
                <div className='w-full bg-white border-4 border-black bg-black/10 mt-2'>
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

          <div className='h-full border-[20px] col-span-2 border-black rounded-xl'>

            <div className='h-[90%] flex bg-white items-end justify-center'>

              <div className='z-10 relative w-full h-full bg-black/20'>
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
              <div className='text-2xl bg-white py-2 my-4 rounded-xl'>
                Tasks
              </div>

              {tasks.map((task) => (
                <div key={task.id} className='grid grid-cols-5 gap-2'>
                  <div className={`${task.completed ? 'line-through bg-white/20 text-white' : 'bg-white/90'} col-span-4 text-lg text-left py-2 px-2 my-2 rounded-xl rounded-r-none flex items-center ease-in duration-100`}>
                    {task.editing ? (
                      <input type="text" className="w-full bg-transparent px-2" value={task.tempName} onChange={(e) => handleTaskNameChange(e, task.id)} onBlur={() => handleTaskBlur(task.id)} onKeyDown={(e) => { if (e.key === 'Enter') { handleTaskBlur(task.id); } }} autoFocus />
                    ) : (
                      <span className='px-2'>{task.name}</span>
                    )}
                  </div>
                  <div onClick={() => { if (task.name === `task ${task.id}`) { toggleTaskEditMode(task.id); } else if (!task.completed && !coinCurrentlyIncreasing) { completeTask(task.id); } }} className={`${task.completed ? 'bg-white/20 text-white' : 'bg-white hover:bg-white/80 cursor-pointer'} col-span-1 text-sm text-center py-2 px-4 my-2 rounded-xl rounded-l-none flex items-center justify-center ease-in duration-100`}>
                    {task.name === `task ${task.id}` && !task.completed ? (
                      <MdEdit size={15} />
                    ) : task.completed ? (
                      <FaCheck size={15} />
                    ) : (
                      '+10'
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>


        <div className='fixed bottom-0 h-[15vh] w-[40vw] grid grid-cols-3 gap-2 border-8 border-black z-50'>

          <div className='col-span-1 text-black'>

          </div>

          <div onClick={feedPet} className={`${isFeeding ? 'bg-white/80 cursor-not-allowed' : 'bg-white hover:bg-white/80 cursor-pointer'} col-span-1 flex justify-center items-center text-black text-3xl rounded-xl ease-in duration-100`}>
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
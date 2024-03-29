'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
import { MdEdit, MdOutlineAttachMoney } from 'react-icons/md';
import { Shop } from './Shop';
import { Customize } from './Customize';

export default function Pet() {
  const firebaseConfig = {
    apiKey: 'AIzaSyCKGgP2Uth6c2lSOkxI1CAe-nriLAD-wtQ',
    authDomain: 'neko-sekai.firebaseapp.com',
    projectId: 'neko-sekai',
    storageBucket: 'neko-sekai.appspot.com',
    messagingSenderId: '769025457059',
    appId: '1:769025457059:web:b4d8ca47a7e1305f53f816',
    measurementId: 'G-6XFVS2RNQN'
  };

  const [currUser, setCurrUser] = useState('friendlyBOT');
  const [notification, setNotification] = useState('');

  /* Currency */

  const [currCoins, setCurrCoins] = useState(0);
  const [targetCoins, setTargetCoins] = useState(0);
  const [coinIncrease, setCoinIncrease] = useState(0);
  const [coinCurrentlyIncreasing, setCoinCurrentlyIncreasing] = useState(false);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);

  // Animation for currency increase
  useEffect(() => {
    if (currCoins < targetCoins) {
      const timer = setTimeout(() => {
        setCurrCoins(currCoins + 1);
        setTotalCoinsEarned(totalCoinsEarned + 1);
        obtainEarnRewards(totalCoinsEarned);
      }, 500 / coinIncrease);

      return () => clearTimeout(timer);
    }

    setCoinCurrentlyIncreasing(false);
  }, [currCoins, targetCoins]);

  // Enables currency increase
  const increaseCoins = (coins) => {
    setCoinIncrease(coins);
    setCoinCurrentlyIncreasing(true);
    setTargetCoins(currCoins + coins);
  };

  const earnRewards = {
    1000: {
      food: 'caviar',
      location: null,
      fashion: null,
    },
  };

  const obtainEarnRewards = () => {
    const rewards = earnRewards[totalCoinsEarned + 1];

    let status = 'unlocked ';

    if (rewards) {
      if (rewards.food) {
        setFoodItems(prevItems => ({
          ...prevItems,
          [rewards.food]: {
            ...prevItems[rewards.food],
            owned: true,
          },
        }));

        status += 'new food';
      }

      if (rewards.location) {
        setLocations(prevLocations => ({
          ...prevLocations,
          [rewards.location]: {
            ...prevLocations[rewards.location],
            owned: true,
          },
        }));

        status += 'new location';
      }

      status += '!'
      setNotification(status);

      setTimeout(() => {
        setNotification('');
      }, 2000);
    }
  };


  /* Pet Name Change */

  const [petName, setPetName] = useState('Poofy');
  const [petNameEditing, setPetNameEditing] = useState(false);
  const [tempPetName, setTempPetName] = useState(petName);

  // Allow pet name to be changed
  const handlePetNameChange = useCallback((event) => {
    setTempPetName(event.target.value);
  }, []);

  const handlePetBlur = useCallback(() => {
    setPetName(tempPetName);
    setPetNameEditing(false);
  }, [tempPetName]);

  // Enables edit mode for pet name
  const togglePetEditMode = useCallback(() => {
    setPetNameEditing(true);
  }, []);


  /* Cheats */

  // Remove later
  const cheatCode = () => {
    setCurrCoins(999999);
    setFoodItems(prevItems => {
      const updatedItems = Object.fromEntries(
        Object.entries(prevItems).map(([key, value]) => [
          key,
          { ...value, quantity: 999999 },
        ])
      );
      return updatedItems;
    });
  };


  /* Leveling Up */

  const [currLevel, setCurrLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [levelXPNeeded, setLevelXPNeeded] = useState(100);
  const [levelStatus, setLevelStatus] = useState('');
  const [levelUpOccurred, setLevelUpOccurred] = useState(false);
  const [showLevelUpArrow, setShowLevelUpArrow] = useState(false);

  const levelRewards = {
    5: {
      food: 'saba',
      location: null,
      fashion: null,
    },
  };

  const obtainLevelRewards = (level) => {
    const coinsEarned = (level - 1) * 5 + 20;

    const rewards = levelRewards[level];

    let status = 'unlocked ';

    if (rewards) {
      if (rewards.food) {
        setFoodItems(prevItems => ({
          ...prevItems,
          [rewards.food]: {
            ...prevItems[rewards.food],
            owned: true,
          },
        }));

        status += 'new food';
      }

      if (rewards.location) {
        setLocations(prevLocations => ({
          ...prevLocations,
          [rewards.location]: {
            ...prevLocations[rewards.location],
            owned: true,
          },
        }));

        status += 'new location';
      }

      status += '!'
      setLevelStatus(status);

      setTimeout(() => {
        setLevelStatus('');
      }, 2000);
    }

    return coinsEarned;
  };

  const levelUpAnimation = () => {
    setCurrentAnimation('level_up');
    setShowLevelUpArrow(true);
    setFrameIndex(0);

    setTimeout(() => {
      setCurrentAnimation('idle');
      setFrameIndex(0);
      setShowLevelUpArrow(false);
    }, animations.base.level_up.sequence.length * 100);
  };

  // Enables level increase based on gained XP
  const increaseLevel = (food) => {
    const foodXP = foodItems[food].xp;
    let newProgress = levelProgress + foodXP;

    if (food === favoriteFood) {
      newProgress += foodXP;
    }

    let tempCurrLevel = currLevel;
    let tempLevelXPNeeded = levelXPNeeded;
    let totalCoinsEarned = 0;

    while (newProgress >= tempLevelXPNeeded) {
      const nextLevel = tempCurrLevel + 1;
      newProgress -= tempLevelXPNeeded;
      tempLevelXPNeeded += 10;
      totalCoinsEarned += obtainLevelRewards(nextLevel);
      addNewTask(nextLevel);
      tempCurrLevel = nextLevel;
    }

    if (tempCurrLevel > currLevel) {
      setLevelUpOccurred(true);
      increaseCoins(totalCoinsEarned);
    }

    setCurrLevel(tempCurrLevel);
    setLevelXPNeeded(tempLevelXPNeeded);
    setLevelProgress(newProgress);
  };


  /* Tasks */

  // List of tasks
  const [tasks, setTasks] = useState([
    { id: 1, name: 'task 1', completed: false, editing: false, tempName: 'task 1', coins: 10 },
    { id: 2, name: 'task 2', completed: false, editing: false, tempName: 'task 2', coins: 10 },
    { id: 3, name: 'task 3', completed: false, editing: false, tempName: 'task 3', coins: 10 },
    { id: 4, name: 'task 4', completed: false, editing: false, tempName: 'task 4', coins: 10 },
    { id: 5, name: 'task 5', completed: false, editing: false, tempName: 'task 5', coins: 10 },
  ]);

  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0);

  const taskRewards = {
    10: {
      food: 'ika',
      location: null,
      fashion: null,
    },
  };

  const obtainTaskRewards = () => {
    const rewards = taskRewards[totalTasksCompleted + 1];

    let status = 'unlocked ';

    if (rewards) {
      if (rewards.food) {
        setFoodItems(prevItems => ({
          ...prevItems,
          [rewards.food]: {
            ...prevItems[rewards.food],
            owned: true,
          },
        }));

        status += 'new food';
      }

      if (rewards.location) {
        setLocations(prevLocations => ({
          ...prevLocations,
          [rewards.location]: {
            ...prevLocations[rewards.location],
            owned: true,
          },
        }));

        status += 'new location';
      }

      status += '!'
      setNotification(status);

      setTimeout(() => {
        setNotification('');
      }, 2000);
    }
  };

  // Marks respective task as complete and initiates currency increase
  const completeTask = useCallback((taskId) => {
    setTasks(tasks => tasks.map(task => {
      if (task.id === taskId) {
        increaseCoins(task.coins);
        return { ...task, completed: true };
      }
      return task;
    }));

    setTotalTasksCompleted(totalTasksCompleted + 1);
    obtainTaskRewards();
  }, [increaseCoins]);

  // Allow task text to be changed
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
      if (task.id === taskId) {
        const newName = task.tempName.trim() === '' ? `task ${task.id}` : task.tempName.trim();
        return { ...task, name: newName, editing: false, tempName: newName };
      }
      return task;
    }));
  };

  // Enables edit mode for task
  const toggleTaskEditMode = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (task.name.startsWith('task ')) {
          return { ...task, editing: true, tempName: '' };
        }
        return { ...task, editing: true };
      }
      return task;
    }));
  };

  const addNewTask = (level) => {
    if ((level - 1) % 2 === 0) {
      setTasks(prevTasks => {
        const newTaskId = prevTasks.length + 1;
        const newTask = {
          id: newTaskId,
          name: `task ${newTaskId}`,
          completed: false,
          editing: false,
          tempName: `task ${newTaskId}`,
          coins: 10
        };
        return [...prevTasks, newTask];
      });
    }
  };


  /* Locations */

  const [currBg, setCurrBg] = useState('livingroom/01/livingroom-01');

  // List of locations
  const [locations, setLocations] = useState({
    livingroom: { name: 'living room', price: 0, owned: true, bg: 'livingroom/01/livingroom-01' },
    city: { name: 'city', price: 100, owned: false, bg: 'city/01/city-01' },
  })


  /* Food */

  const [showFood, setShowFood] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);

  // List of food items
  const [foodItems, setFoodItems] = useState({
    onigiri: { price: 5, quantity: 2, xp: 10, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
    ika: { price: 10, quantity: 2, xp: 25, owned: false, location: 'all', level: 0, task: 10, earn: 0, show: true },
    saba: { price: 20, quantity: 2, xp: 40, owned: false, location: 'all', level: 5, task: 0, earn: 0, show: true },
    caviar: { price: 100, quantity: 2, xp: 150, owned: false, location: 'all', level: 0, task: 0, earn: 1000, show: true },

    maki: { price: 5, quantity: 2, xp: 10, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
    tori: { price: 7, quantity: 2, xp: 15, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
    tataki: { price: 7, quantity: 2, xp: 15, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
    akami: { price: 10, quantity: 2, xp: 20, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },

    tamago: { price: 10, quantity: 2, xp: 20, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
    taco: { price: 12, quantity: 2, xp: 25, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
    cheesecake: { price: 15, quantity: 2, xp: 30, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
    uni: { price: 20, quantity: 2, xp: 35, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
  });

  const [currFood, setCurrFood] = useState('onigiri');
  const [foodOptions, setFoodOptions] = useState([]);
  const [foodInventory, setFoodInventory] = useState({});

  const [foodIndex, setFoodIndex] = useState(0);
  const [favoriteFood, setFavoriteFood] = useState('akami');

  // Update food lists for display. Ensures that only owned and showed items are displayed
  useEffect(() => {
    const filteredFoodOptions = Object.entries(foodItems)
      .filter(([_, itemDetails]) => itemDetails.owned && itemDetails.show)
      .map(([itemName, _]) => itemName);

    const newFoodIndex = filteredFoodOptions.findIndex(item => item === currFood);

    setFoodOptions(filteredFoodOptions);

    const filteredFoodInventory = filteredFoodOptions.reduce((acc, itemName) => {
      acc[itemName] = foodItems[itemName].quantity;
      return acc;
    }, {});

    setFoodInventory(filteredFoodInventory);

    if (newFoodIndex !== -1) {
      setFoodIndex(newFoodIndex);
    }
  }, [foodItems, currFood]);

  // Updates current food to selected item in carousel
  useEffect(() => {
    setCurrFood(foodOptions[foodIndex]);
  }, [foodIndex, foodOptions]);

  // Feed pet with currently selected food
  const feedPet = () => {
    if (!isFeeding && foodInventory[currFood] > 0 && !showLevelUpArrow) {
      setIsFeeding(true);
      setCurrentAnimation('eat');
      setFrameIndex(0);
      setShowFood(true);

      setFoodItems(prevItems => ({
        ...prevItems,
        [currFood]: {
          ...prevItems[currFood],
          quantity: prevItems[currFood].quantity - 1,
        },
      }));

      increaseLevel(currFood);

      setTimeout(() => {
        setCurrentAnimation('idle');
        setFrameIndex(0);
        setShowFood(false);
        setIsFeeding(false);
      }, animations.base.eat.sequence.length * 100);
    }
  };

  useEffect(() => {
    if (!isFeeding && levelUpOccurred) {
      levelUpAnimation();
      setLevelUpOccurred(false);
    }
  }, [isFeeding, levelUpOccurred]);

  // Switches carousel display
  const changeFood = (direction) => {
    setFoodIndex(prevIndex => {
      const newIndex = (prevIndex + direction + foodOptions.length) % foodOptions.length;
      return newIndex;
    });
  };


  /* Cosmetics */

  const [cosmetics, setCosmetics] = useState({
    head: {
      'pointed-hat': { price: 0, unlocked: true, owned: true, name: 'pointy hat', location: 'living room', level: 0, task: 0, earn: 0 },
      'cap-01': { price: 50, unlocked: true, owned: false, name: 'cap 1', location: 'living room', level: 0, task: 0, earn: 0 },
    },
    face: {
      'glasses-01': { price: 0, unlocked: true, owned: true, name: 'glasses 1', location: 'living room', level: 0, task: 0, earn: 0 },
      'shades-01': { price: 50, unlocked: true, owned: false, name: 'shades 1', location: 'living room', level: 0, task: 0, earn: 0 },
    },
    body: {
      'shirt-01': { price: 0, unlocked: true, owned: true, name: 'shirt 1', location: 'living room', level: 0, task: 0, earn: 0 },
      'futuristic-01': { price: 100, unlocked: false, owned: false, name: 'hi-tech 1', location: 'city', level: 0, task: 0, earn: 0 },
    },
    equipped: {
      head: 'pointed-hat',
      face: 'glasses-01',
      body: 'shirt-01',
    },
  });

  const equipCosmetic = (type, itemName) => {
    setCosmetics(prev => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [type]: prev.equipped[type] === itemName ? null : itemName,
      }
    }));
  };


  /* Animations */

  const [frameIndex, setFrameIndex] = useState(0);
  const [idleCount, setIdleCount] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [isPetting, setIsPetting] = useState(false);

  // Functions for animating sequences
  function generateSequence(basePath, count) {
    return Array.from({ length: count }, (_, i) => `${basePath}${i + 1}.png`);
  }

  // List of animations
  const animations = useMemo(() => {
    const baseAnimations = {
      idle: {
        sequence: generateSequence('/assets/sprites/cat/01/cat-01-idle/cat-01-idle', 20),
        loopCount: 5,
      },
      yawn: {
        sequence: generateSequence('/assets/sprites/cat/01/cat-01-yawn/cat-01-yawn', 14),
        loopCount: 1,
      },
      brush: {
        sequence: generateSequence('/assets/sprites/cat/01/cat-01-brush/cat-01-brush', 50),
        loopCount: 1,
      },
      eat: {
        sequence: generateSequence('/assets/sprites/cat/01/cat-01-eat/cat-01-eat', 35),
      },
      food: {
        sequence: generateSequence('/assets/food/' + currFood + '/' + currFood, 35),
      },
      level_up: {
        sequence: generateSequence('/assets/sprites/cat/01/cat-01-level-up/cat-01-level-up', 22),
      },
      level_up_arrow: {
        sequence: generateSequence('/assets/miscellaneous/level-up-arrow/level-up-arrow', 22),
      },
    };

    let cosmeticAnimations = {};

    Object.keys(cosmetics.equipped).forEach(type => {
      const itemName = cosmetics.equipped[type];
      if (itemName) {
        cosmeticAnimations[type] = {
          idle: {
            sequence: generateSequence(`/assets/cosmetics/${type}/${itemName}/${itemName}-idle/${itemName}-idle`, 20),
            loopCount: 5,
          },
          yawn: {
            sequence: generateSequence(`/assets/cosmetics/${type}/${itemName}/${itemName}-yawn/${itemName}-yawn`, 14),
            loopCount: 1,
          },
          brush: type !== 'head' ? {
            sequence: generateSequence(`/assets/cosmetics/${type}/${itemName}/${itemName}-brush/${itemName}-brush`, 50),
            loopCount: 1,
          } : undefined,
          eat: {
            sequence: generateSequence(`/assets/cosmetics/${type}/${itemName}/${itemName}-eat/${itemName}-eat`, 35)
          },
          level_up: {
            sequence: generateSequence(`/assets/cosmetics/${type}/${itemName}/${itemName}-level-up/${itemName}-level-up`, 22)
          },
        };
      }
    });

    return { base: baseAnimations, cosmetics: cosmeticAnimations };
  }, [cosmetics, currFood]);

  // Constant looping of current animation
  useEffect(() => {
    const currentSequence = animations.base[currentAnimation].sequence;
    const intervalId = setInterval(() => {
      setFrameIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % currentSequence.length;
        return nextIndex;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [currentAnimation]);

  // Enables animation switching
  useEffect(() => {
    if (frameIndex === animations.base[currentAnimation].sequence.length - 1) {
      if (currentAnimation === 'idle') {
        if (idleCount + 1 < animations.base.idle.loopCount) {
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
      } else if (currentAnimation === 'level_up') {
        setShowLevelUpArrow(false);
      }
      setFrameIndex(0);
    }
  }, [frameIndex, currentAnimation, idleCount]);

  const petHead = () => {
    if (!isFeeding && !isPetting) {
      setIsPetting(true);
      setCurrentAnimation('brush');
      setFrameIndex(0);

      setTimeout(() => {
        setCurrentAnimation('idle');
        setFrameIndex(0);
        setIsPetting(false);
      }, animations.base.brush.sequence.length * 100);
    }
  };


  /* Countdown Timer */

  const [timeLeft, setTimeLeft] = useState('');
  const [currentDay, setCurrentDay] = useState(new Date().toLocaleDateString());
  const [bgTime, setBgTime] = useState('morning');

  const morningTime = 6;
  const sunsetTime = 12;
  const nightTime = 18;

  // Update the background time of day based on user time
  useEffect(() => {
    const updateBackgroundTime = () => {
      const hour = new Date().getHours();
      let newBgTime;

      if (hour >= morningTime && hour < sunsetTime) {
        newBgTime = 'morning';
      } else if (hour >= sunsetTime && hour < nightTime) {
        newBgTime = 'sunset';
      } else {
        newBgTime = 'night';
      }

      setBgTime(newBgTime);
    };

    const calculateNextUpdateDelay = () => {
      const now = new Date();

      const nextUpdate = new Date(now);
      if (now.getHours() < morningTime) {
        nextUpdate.setHours(morningTime, 0, 0, 0);
      } else if (now.getHours() < sunsetTime) {
        nextUpdate.setHours(sunsetTime, 0, 0, 0);
      } else if (now.getHours() < nightTime) {
        nextUpdate.setHours(nightTime, 0, 0, 0);
      } else {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
        nextUpdate.setHours(morningTime, 0, 0, 0);
      }
      return nextUpdate.getTime() - now.getTime();
    };

    updateBackgroundTime();

    const delayUntilNextPeriod = calculateNextUpdateDelay();
    const timeoutId = setTimeout(() => {
      updateBackgroundTime();
      setInterval(updateBackgroundTime, 60 * 60 * 1000);
    }, delayUntilNextPeriod);

    return () => clearTimeout(timeoutId);
  }, []);

  // Display time left until 12 AM (user time zone)
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

  // Initiates task reset and favorite food randomization on new day
  useEffect(() => {
    const timerId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      const newCurrentDay = new Date().toLocaleDateString();
      if (currentDay !== newCurrentDay) {
        resetTasksForNewDay();
        setCurrentDay(newCurrentDay);

        const newFavoriteFood = foodOptions[Math.floor(Math.random() * foodOptions.length)];
        setFavoriteFood(newFavoriteFood);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentDay, foodOptions]);

  // Reset tasks and mark as incomplete
  const resetTasksForNewDay = () => {
    setTasks(tasks.map(task => ({
      ...task,
      name: `task ${task.id}`,
      completed: false,
      editing: false,
      tempName: `task ${task.id}`
    })));
  };


  /* Other Components */

  const [showShop, setShowShop] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);


  /* Local Storage */

  function saveGame(state) {
    const { petName, currCoins, locations, foodItems, favoriteFood, currLevel, levelProgress, totalCoinsEarned, totalTasksCompleted, cosmetics } = state;

    localStorage.setItem('gameState', JSON.stringify({
      currUser: currUser,
      currCoins: currCoins,
      petName: petName,
      totalCoinsEarned: totalCoinsEarned,
      currLevel: currLevel,
      levelProgress: levelProgress,
      levelXPNeeded: levelXPNeeded,
      tasks: tasks,
      totalTasksCompleted: totalTasksCompleted,
      currBg: currBg,
      locations: locations,
      foodItems: foodItems,
      currFood: currFood,
      foodIndex: foodIndex,
      favoriteFood: favoriteFood,
      cosmetics: cosmetics,
      lastPlayed: new Date().toLocaleDateString(),
    }));
  }

  function loadGame() {
    const gameStateString = localStorage.getItem('gameState');
    return gameStateString ? JSON.parse(gameStateString) : null;
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const gameState = {
          currUser,
          currCoins,
          petName,
          totalCoinsEarned,
          currLevel,
          levelProgress,
          levelXPNeeded,
          tasks,
          totalTasksCompleted,
          currBg,
          locations,
          foodItems,
          currFood,
          foodIndex,
          favoriteFood,
          cosmetics
        };
        saveGame(gameState);
        console.log('Game progress saved.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currUser, currCoins, petName, totalCoinsEarned, currLevel, levelProgress, levelXPNeeded, tasks, totalTasksCompleted, currBg, locations, foodItems, currFood, foodIndex, favoriteFood, cosmetics]);

  useEffect(() => {
    const loadedGameState = loadGame();

    if (loadedGameState) {
      const currentDate = new Date().toLocaleDateString();
      const lastPlayed = loadedGameState.lastPlayed;

      const {
        currUser,
        currCoins,
        petName,
        totalCoinsEarned,
        currLevel,
        levelProgress,
        levelXPNeeded,
        tasks,
        totalTasksCompleted,
        currBg,
        locations,
        foodItems,
        currFood,
        foodIndex,
        favoriteFood,
        cosmetics
      } = loadedGameState;

      setCurrUser(currUser || 'friendlyBOT');
      setCurrCoins(currCoins || 0);
      setPetName(petName || 'Poofy');
      setTotalCoinsEarned(totalCoinsEarned || 0);
      setCurrLevel(currLevel || 1);
      setLevelProgress(levelProgress || 0);
      setLevelXPNeeded(levelXPNeeded || 100);

      let initialTasks = [
        { id: 1, name: 'task 1', completed: false, editing: false, tempName: 'task 1', coins: 10 },
        { id: 2, name: 'task 2', completed: false, editing: false, tempName: 'task 2', coins: 10 },
        { id: 3, name: 'task 3', completed: false, editing: false, tempName: 'task 3', coins: 10 },
        { id: 4, name: 'task 4', completed: false, editing: false, tempName: 'task 4', coins: 10 },
        { id: 5, name: 'task 5', completed: false, editing: false, tempName: 'task 5', coins: 10 },
      ];

      if (lastPlayed !== currentDate) {
        if (tasks && tasks.length > initialTasks.length) {
          initialTasks = tasks.map(task => ({
            ...task,
            name: `task ${task.id}`,
            completed: false,
            editing: false,
            tempName: `task ${task.id}`
          }));
        }
      }
      else {
        initialTasks = tasks || initialTasks;
      }

      setTasks(initialTasks);

      setTotalTasksCompleted(totalTasksCompleted || 0);
      setCurrBg(currBg || 'livingroom/01/livingroom-01');

      setLocations(locations || {
        livingroom: { name: 'living room', price: 0, owned: true, bg: 'livingroom/01/livingroom-01' },
        city: { name: 'city', price: 100, owned: false, bg: 'city/01/city-01' },
      });

      setFoodItems(foodItems || {
        onigiri: { price: 5, quantity: 2, xp: 10, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
        ika: { price: 10, quantity: 2, xp: 25, owned: false, location: 'all', level: 0, task: 10, earn: 0, show: true },
        saba: { price: 20, quantity: 2, xp: 40, owned: false, location: 'all', level: 5, task: 0, earn: 0, show: true },
        caviar: { price: 100, quantity: 2, xp: 150, owned: false, location: 'all', level: 0, task: 0, earn: 1000, show: true },

        maki: { price: 5, quantity: 2, xp: 10, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
        tori: { price: 7, quantity: 2, xp: 15, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
        tataki: { price: 7, quantity: 2, xp: 15, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
        akami: { price: 10, quantity: 2, xp: 20, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },

        tamago: { price: 10, quantity: 2, xp: 20, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
        taco: { price: 12, quantity: 2, xp: 25, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
        cheesecake: { price: 15, quantity: 2, xp: 30, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
        uni: { price: 20, quantity: 2, xp: 35, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
      });

      setCurrFood(currFood || 'onigiri');
      setFoodIndex(foodIndex || 0);

      if (lastPlayed !== currentDate) {
        const ownedFoods = Object.entries(foodItems)
          .filter(([_, itemDetails]) => itemDetails.owned)
          .map(([itemName, _]) => itemName);

        const newFavoriteFood = ownedFoods[Math.floor(Math.random() * ownedFoods.length)];
        setFavoriteFood(newFavoriteFood);
      } else {
        setFavoriteFood(favoriteFood || 'akami');
      }

      setCosmetics(cosmetics || {
        head: {
          'pointed-hat': { price: 0, unlocked: true, owned: true, name: 'pointy hat', location: 'living room', level: 0, task: 0, earn: 0 },
          'cap-01': { price: 50, unlocked: true, owned: false, name: 'cap 1', location: 'living room', level: 0, task: 0, earn: 0 },
        },
        face: {
          'glasses-01': { price: 0, unlocked: true, owned: true, name: 'glasses 1', location: 'living room', level: 0, task: 0, earn: 0 },
          'shades-01': { price: 50, unlocked: true, owned: false, name: 'shades 1', location: 'living room', level: 0, task: 0, earn: 0 },
        },
        body: {
          'shirt-01': { price: 0, unlocked: true, owned: true, name: 'shirt 1', location: 'living room', level: 0, task: 0, earn: 0 },
          'futuristic-01': { price: 100, unlocked: false, owned: false, name: 'hi-tech 1', location: 'city', level: 0, task: 0, earn: 0 },
        },
        equipped: {
          head: 'pointed-hat',
          face: 'glasses-01',
          body: 'shirt-01',
        },
      });
    }
  }, []);

  function clearGameCookies() {
    localStorage.removeItem('gameState');
    console.log('Game progress cleared from local storage.');
  }

  function handleResetClick() {
    const confirmed = window.confirm('Reset Progress?');
    if (confirmed) {
      clearGameCookies();

      setCurrUser('friendlyBOT');
      setCurrCoins(0);
      setTargetCoins(0);
      setPetName('Poofy');
      setTotalCoinsEarned(0);
      setCurrLevel(1);
      setLevelProgress(0);
      setLevelXPNeeded(100);

      setTasks([
        { id: 1, name: 'task 1', completed: false, editing: false, tempName: 'task 1', coins: 10 },
        { id: 2, name: 'task 2', completed: false, editing: false, tempName: 'task 2', coins: 10 },
        { id: 3, name: 'task 3', completed: false, editing: false, tempName: 'task 3', coins: 10 },
        { id: 4, name: 'task 4', completed: false, editing: false, tempName: 'task 4', coins: 10 },
        { id: 5, name: 'task 5', completed: false, editing: false, tempName: 'task 5', coins: 10 },
      ]);

      setTotalTasksCompleted(0);
      setCurrBg('livingroom/01/livingroom-01');

      setLocations({
        livingroom: { name: 'living room', price: 0, owned: true, bg: 'livingroom/01/livingroom-01' },
        city: { name: 'city', price: 100, owned: false, bg: 'city/01/city-01' },
      });

      setFoodItems({
        onigiri: { price: 5, quantity: 2, xp: 10, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
        ika: { price: 10, quantity: 2, xp: 25, owned: false, location: 'all', level: 0, task: 10, earn: 0, show: true },
        saba: { price: 20, quantity: 2, xp: 40, owned: false, location: 'all', level: 5, task: 0, earn: 0, show: true },
        caviar: { price: 100, quantity: 2, xp: 150, owned: false, location: 'all', level: 0, task: 0, earn: 1000, show: true },

        maki: { price: 5, quantity: 2, xp: 10, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
        tori: { price: 7, quantity: 2, xp: 15, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
        tataki: { price: 7, quantity: 2, xp: 15, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },
        akami: { price: 10, quantity: 2, xp: 20, owned: true, location: 'living room', level: 0, task: 0, earn: 0, show: true },

        tamago: { price: 10, quantity: 2, xp: 20, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
        taco: { price: 12, quantity: 2, xp: 25, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
        cheesecake: { price: 15, quantity: 2, xp: 30, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
        uni: { price: 20, quantity: 2, xp: 35, owned: false, location: 'city', level: 0, task: 0, earn: 0, show: true },
      });

      setCurrFood('onigiri');
      setFoodIndex(0);
      setFavoriteFood('akami');

      setCosmetics({
        head: {
          'pointed-hat': { price: 0, unlocked: true, owned: true, name: 'pointy hat', location: 'living room', level: 0, task: 0, earn: 0 },
          'cap-01': { price: 50, unlocked: true, owned: false, name: 'cap 1', location: 'living room', level: 0, task: 0, earn: 0 },
        },
        face: {
          'glasses-01': { price: 0, unlocked: true, owned: true, name: 'glasses 1', location: 'living room', level: 0, task: 0, earn: 0 },
          'shades-01': { price: 50, unlocked: true, owned: false, name: 'shades 1', location: 'living room', level: 0, task: 0, earn: 0 },
        },
        body: {
          'shirt-01': { price: 0, unlocked: true, owned: true, name: 'shirt 1', location: 'living room', level: 0, task: 0, earn: 0 },
          'futuristic-01': { price: 100, unlocked: false, owned: false, name: 'hi-tech 1', location: 'city', level: 0, task: 0, earn: 0 },
        },
        equipped: {
          head: 'pointed-hat',
          face: 'glasses-01',
          body: 'shirt-01',
        },
      });
    }
  }


  return (
    <div id='pet' className='bg-white w-full h-screen font-square select-none'>
      <div className='w-full h-full flex flex-col items-center justify-center text-center'>

        <div className='fixed top-0 left-0 h-[15vh] w-full grid grid-cols-7 gap-4 border-8 border-black z-50'>

          <div onClick={handleResetClick} className='col-span-1 px-8 flex justify-center items-center text-white text-xl cursor-pointer'>
            Reset
          </div>

          <div className='col-span-2' />

          <div className='col-span-1 bg-black flex justify-center items-center text-white/80 text-sm px-4'>
            <span className='animate-pulse'>{notification}</span>
          </div>

          <div className='col-span-1 px-8 flex flex-col justify-center items-center text-white text-xl'>
            <span className='text-lg'>time left</span>
            <span>{timeLeft}</span>
          </div>

          <div className='col-span-1 px-8 flex grid grid-cols-5 justify-center bg-white/10 items-center text-white text-xl border-l-8 border-r-8 border-white/10'>
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

          <div onClick={cheatCode} className='col-span-1 px-8 flex justify-center items-center text-white text-xl'>
            {`${currUser}`}
          </div>

        </div>


        <div className='w-full h-[60vh] items-center justify-center text-center grid grid-cols-4 gap-8'>

          <div className='h-full max-h-[60vh] col-span-1 bg-black/90 border-8 border-black ml-8 items-center justify-center text-black rounded-xl'>
            <div className='h-full px-4'>
              <div className='text-2xl text-black bg-white py-4 my-4 rounded-xl flex items-center justify-between'>
                {petNameEditing ? (
                  <input type='text' value={tempPetName} onChange={handlePetNameChange} onBlur={handlePetBlur} autoFocus className='text-2xl text-center mx-4 w-full animate-pulse font-bold selection:text-white selection:bg-black focus:outline-none' onKeyDown={(event) => { if (event.key === 'Enter') { handlePetBlur(); } }} />
                ) : (
                  <>
                    <span className='flex-1 text-center ml-16 mr-8 truncate font-bold'>{petName}</span>
                    <MdEdit onClick={togglePetEditMode} className='mr-4 cursor-pointer' size={16} />
                  </>
                )}
              </div>
              <div className='text-lg bg-white py-4 px-4 my-4 rounded-xl'>
                level {currLevel}
                <div className='w-full border-4 border-black bg-black/10 mt-2'>
                  <div className='bg-black/50 text-[10px] py-1 leading-none text-center text-white ease-in duration-200' style={{ width: `${(levelProgress / levelXPNeeded) * 100}%` }} />
                </div>
                <div className='text-xs py-1'>
                  {levelStatus || `${levelProgress}/${levelXPNeeded} XP`}
                </div>
              </div>
              <div className='text-lg bg-white py-4 my-4 rounded-xl bg-white'>
                favorite food: <span className='font-bold text-black/80 animate-pulse'>{favoriteFood}</span>
              </div>
              <div onClick={() => setShowCustomize(true)} className='text-lg bg-white py-8 my-4 rounded-xl cursor-pointer hover:bg-white/80 ease-in duration-100'>
                customize
              </div>
            </div>
          </div>

          <div className='h-full border-[20px] col-span-2 border-black rounded-xl'>
            <div className='h-[90%] flex bg-white items-end justify-center'>
              <div className='z-10 relative w-full h-full bg-black/20'>

                <Image
                  src={`/assets/backgrounds/${currBg}-${bgTime}.gif`}
                  fill
                />

                <div
                  className='z-20 absolute bottom-1 left-1/2 transform -translate-x-1/2'
                  style={{
                    width: `${currLevel >= 5 ? 200 : 180}px`,
                    height: `${currLevel >= 5 ? 200 : 180}px`
                  }}>

                  <Image
                    src={animations.base[currentAnimation].sequence[frameIndex]}
                    alt='Pet'
                    fill
                    unoptimized={true}
                    onClick={petHead}
                    className='cursor-pointer absolute'
                  />

                  {Object.keys(cosmetics.equipped).map(type => {
                    const itemName = cosmetics.equipped[type];
                    const shouldRenderAnimation = currentAnimation === 'brush' ? type !== 'head' : true;
                    if (itemName && animations.cosmetics[type] && animations.cosmetics[type][currentAnimation] && animations.cosmetics[type][currentAnimation].sequence && shouldRenderAnimation) {
                      return (
                        <Image
                          key={type}
                          src={animations.cosmetics[type][currentAnimation].sequence[frameIndex]}
                          alt={`${type}`}
                          fill
                          unoptimized={true}
                          onClick={petHead}
                          className='cursor-pointer absolute'
                        />
                      );
                    }
                    return null;
                  })}

                </div>

                {showFood && (
                  <div className='z-40 absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50 text-black'>
                    <Image
                      src={animations.base.food.sequence[frameIndex]}
                      alt='Food'
                      width={200}
                      height={200}
                      unoptimized={true}
                    />
                  </div>
                )}

                {showLevelUpArrow && (
                  <div className='z-40 absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50 text-black'>
                    <Image
                      src={animations.base.level_up_arrow.sequence[frameIndex]}
                      alt='^'
                      width={400}
                      height={400}
                      unoptimized={true}
                    />
                  </div>
                )}

              </div>
            </div>

            <div className='w-full h-[10%] bg-black' />

          </div>

          <div className='h-full max-h-[60vh] overflow-y-scroll col-span-1 bg-black/90 border-8 border-black mr-8 items-center justify-center text-black rounded-xl'>
            <div className='h-full px-4'>
              <div className='text-2xl bg-white py-2 my-4 rounded-xl'>
                Tasks
              </div>

              {tasks.map((task) => (
                <div key={task.id} className='grid grid-cols-5 gap-2'>
                  <div className={`${task.completed ? 'line-through bg-white/20 text-white' : 'bg-white/90'} col-span-4 text-lg text-left py-2 px-2 my-2 rounded-xl rounded-r-none flex ease-in duration-100  max-h-[10vh] overflow-auto`}>
                    {task.editing ? (
                      <input type='text' className='w-full bg-transparent px-2 selection:text-white selection:bg-black focus:outline-none' value={task.tempName} onChange={(e) => handleTaskNameChange(e, task.id)} onBlur={() => handleTaskBlur(task.id)} onKeyDown={(e) => { if (e.key === 'Enter') { handleTaskBlur(task.id); } }} autoFocus />
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
                      `$${task.coins}`
                    )}
                  </div>
                </div>
              ))}

              <div className='text-white text-sm py-1'>
                new task at level {currLevel + (currLevel % 2 + 1)}!
              </div>

            </div>
          </div>

        </div>


        <div className='fixed bottom-0 h-[15vh] w-full grid grid-cols-7 gap-4 border-8 border-black z-50'>

          <div className='col-span-2' />

          <div onClick={() => setShowShop(true)} className='col-span-1 bg-black hover:bg-white/10 cursor-pointer flex justify-center items-center text-white text-3xl rounded-xl ease-in duration-100'>
            shop
          </div>

          <div onClick={feedPet} className={`${(isFeeding || foodInventory[currFood] === 0) ? 'bg-white/80 cursor-not-allowed' : 'bg-white hover:bg-white/80 cursor-pointer'} col-span-1 flex justify-center items-center text-black text-3xl rounded-xl ease-in duration-100`}>
            feed
          </div>

          <div className='col-span-1 flex justify-between items-center bg-black relative'>
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
                style={{
                  opacity: foodInventory[foodOptions[foodIndex]] === 0 ? 0.6 : 1,
                }}
              />
              <div className='absolute text-sm bottom-1 left-1/2 transform -translate-x-1/2 text-white bg-white/10 px-2 items-center justify-center text-center'>
                {`${foodInventory[foodOptions[foodIndex]]}`}
              </div>
            </div>
            <div onClick={() => { if (!isFeeding) { changeFood(1); } }} className={`${isFeeding ? 'cursor-not-allowed' : 'cursor-pointer'} flex justify-end pr-4 w-full`}>
              <FaCaretRight className='text-white' size={20} />
            </div>
          </div>

          <div className='col-span-2' />

        </div>

      </div>

      {showShop &&
        <Shop onClose={() => setShowShop(false)}
          currCoins={currCoins}
          setCurrCoins={setCurrCoins}
          setTargetCoins={setTargetCoins}
          foodItems={foodItems}
          setFoodItems={setFoodItems}
          favoriteFood={favoriteFood}
          locations={locations}
          setLocations={setLocations}
          setCurrBg={setCurrBg}
          cosmetics={cosmetics}
          setCosmetics={setCosmetics}
          equipCosmetic={equipCosmetic}
        />
      }

      {showCustomize &&
        <Customize onClose={() => setShowCustomize(false)}
          currFood={currFood}
          setCurrFood={setCurrFood}
          foodItems={foodItems}
          setFoodItems={setFoodItems}
          favoriteFood={favoriteFood}
          locations={locations}
          setLocations={setLocations}
          currBg={currBg}
          setCurrBg={setCurrBg}
          cosmetics={cosmetics}
          equipCosmetic={equipCosmetic}
        />
      }

    </div>
  );
}
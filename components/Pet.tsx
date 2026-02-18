'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback, useMemo, useRef, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useOrientation } from '@/hooks/useOrientation';
import { useCheatCode } from '@/hooks/useCheatCode';
import {
  DEFAULT_FOOD_ITEMS,
  DEFAULT_LOCATIONS,
  DEFAULT_COSMETICS,
  DEFAULT_TASKS,
} from '@/constants/defaults';
import { LEVEL_REWARDS, TASK_REWARDS, EARN_REWARDS } from '@/constants/rewards';
import { gameStorage } from '@/lib/gameStorage';
import { generateSequence } from '@/lib/animations';
import { PetHeader, PetInfoPanel, PetTasksPanel, PetMain, PetFooter } from '@/components/Pet/index';
import type { Task, FoodItem, Location, Cosmetics } from '@/types';

const Shop = dynamic(() => import('./Shop').then((mod) => ({ default: mod.Shop })), { ssr: false });
const Customize = dynamic(() => import('./Customize').then((mod) => ({ default: mod.Customize })), { ssr: false });

export default function Pet() {
  const t = useTranslations('common');
  const tLandscape = useTranslations('landscape');
  const { checkFeed, isCheatActive } = useCheatCode();

  const [currUser, setCurrUser] = useState('friendlyBOT');
  const [notification, setNotification] = useState('');
  const [currCoins, setCurrCoins] = useState(0);
  const [targetCoins, setTargetCoins] = useState(0);
  const [coinIncrease, setCoinIncrease] = useState(0);
  const [coinCurrentlyIncreasing, setCoinCurrentlyIncreasing] = useState(false);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [petName, setPetName] = useState('Poofy');
  const [petNameEditing, setPetNameEditing] = useState(false);
  const [tempPetName, setTempPetName] = useState(petName);
  const [currLevel, setCurrLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [levelXPNeeded, setLevelXPNeeded] = useState(100);
  const [levelStatus, setLevelStatus] = useState('');
  const [levelUpOccurred, setLevelUpOccurred] = useState(false);
  const [showLevelUpArrow, setShowLevelUpArrow] = useState(false);
  const levelUpAnimationTriggered = useRef(false);
  const levelUpInProgressRef = useRef(false);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0);
  const [currBg, setCurrBg] = useState('livingroom/01/livingroom-01');
  const [locations, setLocations] = useState<Record<string, Location>>(DEFAULT_LOCATIONS);
  const [showFood, setShowFood] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [foodItems, setFoodItems] = useState<Record<string, FoodItem>>(DEFAULT_FOOD_ITEMS);
  const [currFood, setCurrFood] = useState('onigiri');
  const [foodOptions, setFoodOptions] = useState<string[]>([]);
  const [foodInventory, setFoodInventory] = useState<Record<string, number>>({});
  const [foodIndex, setFoodIndex] = useState(0);
  const [favoriteFood, setFavoriteFood] = useState('akami');
  const [cosmetics, setCosmetics] = useState<Cosmetics>(DEFAULT_COSMETICS);
  const [frameIndex, setFrameIndex] = useState(0);
  const [idleCount, setIdleCount] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [isPetting, setIsPetting] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [currentDay, setCurrentDay] = useState(new Date().toLocaleDateString());
  const [bgTime, setBgTime] = useState('morning');
  const [showShop, setShowShop] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  const increaseCoins = useCallback((coins: number) => {
    setCoinIncrease(coins);
    setCoinCurrentlyIncreasing(true);
    setTargetCoins((c) => c + coins);
  }, []);

  const applyRewardUnlocks = useCallback(
    (rewards: { food?: string; location?: string | null } | null, setStatus: (_val: string) => void) => {
      if (!rewards) return;
      let status = 'unlocked ';
      if (rewards.food) {
        setFoodItems((prev) => ({ ...prev, [rewards.food!]: { ...prev[rewards.food!], owned: true } }));
        status += 'new food';
      }
      if (rewards.location !== undefined && rewards.location !== null && rewards.location !== '') {
        const loc = rewards.location!;
        setLocations((prev) => ({ ...prev, [loc]: { ...prev[loc], owned: true } }));
        status += 'new location';
      }
      status += '!';
      setStatus(status);
      setTimeout(() => setStatus(''), 2000);
    },
    []
  );

  const obtainEarnRewards = useCallback(() => {
    applyRewardUnlocks(EARN_REWARDS[totalCoinsEarned + 1], setNotification);
  }, [applyRewardUnlocks, totalCoinsEarned]);

  const obtainLevelRewards = (level: number) => {
    const coinsEarned = (level - 1) * 5 + 20;
    applyRewardUnlocks(LEVEL_REWARDS[level], setLevelStatus);
    return coinsEarned;
  };

  const obtainTaskRewards = useCallback(
    (newTotalTasksCompleted: number) => {
      applyRewardUnlocks(TASK_REWARDS[newTotalTasksCompleted], setNotification);
    },
    [applyRewardUnlocks]
  );

  useEffect(() => {
    if (currCoins < targetCoins) {
      const timer = setTimeout(() => {
        setCurrCoins((c) => c + 1);
        setTotalCoinsEarned((t) => t + 1);
        obtainEarnRewards();
      }, 500 / coinIncrease);
      return () => clearTimeout(timer);
    }
    setCoinCurrentlyIncreasing(false);
  }, [currCoins, targetCoins, coinIncrease, obtainEarnRewards]);

  const handlePetNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTempPetName(event.target.value);
  }, []);

  const handlePetBlur = useCallback(() => {
    setPetName(tempPetName);
    setPetNameEditing(false);
  }, [tempPetName]);

  const togglePetEditMode = useCallback(() => setPetNameEditing(true), []);

  const applyCheat = useCallback(() => {
    setCurrCoins(999999);
    setFoodItems((prev) =>
      Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, { ...v, quantity: 999999 }]))
    );
  }, []);

  const addNewTask = (level: number) => {
    if ((level - 1) % 2 === 0) {
      setTasks((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: `task ${prev.length + 1}`,
          completed: false,
          editing: false,
          tempName: `task ${prev.length + 1}`,
          coins: 10,
        },
      ]);
    }
  };

  const levelUpAnimation = useCallback(() => {
    if (levelUpInProgressRef.current) return; // prevent double-trigger
    levelUpInProgressRef.current = true;
    setCurrentAnimation('level_up');
    setShowLevelUpArrow(true);
    setFrameIndex(0);
    setTimeout(() => {
      levelUpInProgressRef.current = false;
      setCurrentAnimation('idle');
      setFrameIndex(0);
      setShowLevelUpArrow(false);
    }, 22 * 100);
  }, []);

  const increaseLevel = (food: string) => {
    const foodXP = foodItems[food]?.xp ?? 0;
    let newProgress = levelProgress + foodXP + (food === favoriteFood ? foodXP : 0);
    let tempCurrLevel = currLevel;
    let tempLevelXPNeeded = levelXPNeeded;
    let earned = 0;
    while (newProgress >= tempLevelXPNeeded) {
      const nextLevel = tempCurrLevel + 1;
      newProgress -= tempLevelXPNeeded;
      tempLevelXPNeeded += 10;
      earned += obtainLevelRewards(nextLevel);
      addNewTask(nextLevel);
      tempCurrLevel = nextLevel;
    }
    if (tempCurrLevel > currLevel) {
      levelUpAnimationTriggered.current = false;
      setLevelUpOccurred(true);
      increaseCoins(earned);
    }
    setCurrLevel(tempCurrLevel);
    setLevelXPNeeded(tempLevelXPNeeded);
    setLevelProgress(newProgress);
  };

  const handleTaskNameChange = (event: ChangeEvent<HTMLInputElement>, taskId: number) => {
    setTasks((ts) => ts.map((task) => (task.id === taskId ? { ...task, tempName: event.target.value } : task)));
  };

  const handleTaskBlur = (taskId: number) => {
    setTasks((ts) =>
      ts.map((task) => {
        if (task.id !== taskId) return task;
        const newName = task.tempName.trim() === '' ? `task ${task.id}` : task.tempName.trim();
        return { ...task, name: newName, editing: false, tempName: newName };
      })
    );
  };

  const toggleTaskEditMode = (taskId: number) => {
    setTasks((ts) =>
      ts.map((task) =>
        task.id === taskId
          ? { ...task, editing: true, tempName: task.name.startsWith('task ') ? '' : task.tempName }
          : task
      )
    );
  };

  const completeTask = useCallback(
    (taskId: number) => {
      setTasks((ts) =>
        ts.map((task) => {
          if (task.id === taskId) {
            increaseCoins(task.coins);
            return { ...task, completed: true };
          }
          return task;
        })
      );
      setTotalTasksCompleted((prev) => {
        const next = prev + 1;
        obtainTaskRewards(next);
        return next;
      });
    },
    [increaseCoins, obtainTaskRewards]
  );

  useEffect(() => {
    const filtered = Object.entries(foodItems)
      .filter(([, d]) => d.owned && d.show)
      .map(([name]) => name);
    setFoodOptions(filtered);
    const inv = Object.fromEntries(filtered.map((name) => [name, foodItems[name].quantity]));
    setFoodInventory(inv);
    const idx = filtered.indexOf(currFood);
    if (idx !== -1) setFoodIndex(idx);
  }, [foodItems, currFood]);

  useEffect(() => {
    setCurrFood((prev) => foodOptions[foodIndex] ?? prev);
  }, [foodIndex, foodOptions]);

  const feedPet = () => {
    if (!isFeeding && (foodInventory[currFood] ?? 0) > 0 && !showLevelUpArrow && !levelUpInProgressRef.current) {
      const cheatActivated = checkFeed(currFood);
      if (cheatActivated) applyCheat();

      setIsFeeding(true);
      setCurrentAnimation('eat');
      setFrameIndex(0);
      setShowFood(true);
      setFoodItems((prev) => ({
        ...prev,
        [currFood]: { ...prev[currFood], quantity: prev[currFood].quantity - 1 },
      }));
      increaseLevel(currFood);
      setTimeout(() => {
        setCurrentAnimation('idle');
        setFrameIndex(0);
        setShowFood(false);
        setIsFeeding(false);
      }, 35 * 100);
    }
  };

  useEffect(() => {
    if (!isFeeding && levelUpOccurred && !levelUpAnimationTriggered.current) {
      levelUpAnimationTriggered.current = true;
      levelUpAnimation();
      setLevelUpOccurred(false);
    }
  }, [isFeeding, levelUpOccurred]);

  const changeFood = (direction: number) => {
    setFoodIndex((prev) => (prev + direction + foodOptions.length) % foodOptions.length);
  };

  const equipCosmetic = (type: 'head' | 'face' | 'body', itemName: string) => {
    setCosmetics((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [type]: prev.equipped[type] === itemName ? null : itemName,
      },
    }));
  };

  const animations = useMemo(() => {
    const base = {
      idle: { sequence: generateSequence('/assets/sprites/cat/01/cat-01-idle/cat-01-idle', 20), loopCount: 5 },
      yawn: { sequence: generateSequence('/assets/sprites/cat/01/cat-01-yawn/cat-01-yawn', 14), loopCount: 1 },
      brush: { sequence: generateSequence('/assets/sprites/cat/01/cat-01-brush/cat-01-brush', 50), loopCount: 1 },
      eat: { sequence: generateSequence('/assets/sprites/cat/01/cat-01-eat/cat-01-eat', 35) },
      food: { sequence: generateSequence(`/assets/food/${currFood}/${currFood}`, 35) },
      level_up: { sequence: generateSequence('/assets/sprites/cat/01/cat-01-level-up/cat-01-level-up', 22) },
      level_up_arrow: { sequence: generateSequence('/assets/miscellaneous/level-up-arrow/level-up-arrow', 22) },
    };
    const cosmeticAnims: Record<string, Record<string, { sequence: string[] }>> = {};
    (Object.keys(cosmetics.equipped) as Array<'head' | 'face' | 'body'>).forEach((type) => {
      const item = cosmetics.equipped[type];
      if (item) {
        cosmeticAnims[type] = {
          idle: { sequence: generateSequence(`/assets/cosmetics/${type}/${item}/${item}-idle/${item}-idle`, 20) },
          yawn: { sequence: generateSequence(`/assets/cosmetics/${type}/${item}/${item}-yawn/${item}-yawn`, 14) },
          ...(type !== 'head' && {
            brush: { sequence: generateSequence(`/assets/cosmetics/${type}/${item}/${item}-brush/${item}-brush`, 50) },
          }),
          eat: { sequence: generateSequence(`/assets/cosmetics/${type}/${item}/${item}-eat/${item}-eat`, 35) },
          level_up: {
            sequence: generateSequence(`/assets/cosmetics/${type}/${item}/${item}-level-up/${item}-level-up`, 22),
          },
        };
      }
    });
    return { base, cosmetics: cosmeticAnims };
  }, [cosmetics, currFood]);

  useEffect(() => {
    const frames = [
      ...Array.from({ length: 20 }, (_, i) => `/assets/sprites/cat/01/cat-01-idle/cat-01-idle${i + 1}.png`),
      ...Array.from({ length: 14 }, (_, i) => `/assets/sprites/cat/01/cat-01-yawn/cat-01-yawn${i + 1}.png`),
    ];
    frames.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
    return () => frames.forEach((src) => document.querySelector(`link[href="${src}"]`)?.remove());
  }, []);

  useEffect(() => {
    const seq =
      animations.base[currentAnimation as keyof typeof animations.base]?.sequence ??
      animations.base.idle.sequence;
    const id = setInterval(() => setFrameIndex((i) => (i + 1) % seq.length), 100);
    return () => clearInterval(id);
  }, [currentAnimation, animations]);

  useEffect(() => {
    const seq = animations.base[currentAnimation as keyof typeof animations.base]?.sequence ?? [];
    if (frameIndex === seq.length - 1) {
      if (currentAnimation === 'idle') {
        if (idleCount + 1 < (animations.base.idle as { loopCount: number }).loopCount) {
          setIdleCount((c) => c + 1);
        } else {
          setCurrentAnimation('yawn');
          setIdleCount(0);
        }
        setFrameIndex(0);
      } else if (currentAnimation === 'yawn') {
        setCurrentAnimation('idle');
        setFrameIndex(0);
      } else if (currentAnimation === 'eat') {
        setShowFood(false);
        setIsFeeding(false);
        setFrameIndex(0);
      } else if (currentAnimation === 'level_up') {
        levelUpInProgressRef.current = false;
        setShowLevelUpArrow(false);
        setCurrentAnimation('idle');
        setFrameIndex(0);
        // End animation here to avoid interval wrapping; setTimeout is fallback
      }
    }
  }, [frameIndex, currentAnimation, idleCount, animations]);

  const petHead = () => {
    if (!isFeeding && !isPetting) {
      setIsPetting(true);
      setCurrentAnimation('brush');
      setFrameIndex(0);
      setTimeout(() => {
        setCurrentAnimation('idle');
        setFrameIndex(0);
        setIsPetting(false);
      }, 50 * 100);
    }
  };

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setBgTime(h >= 6 && h < 12 ? 'morning' : h >= 12 && h < 18 ? 'sunset' : 'night');
    };
    update();
    const now = new Date();
    const next = new Date(now);
    if (now.getHours() < 6) next.setHours(6, 0, 0, 0);
    else if (now.getHours() < 12) next.setHours(12, 0, 0, 0);
    else if (now.getHours() < 18) next.setHours(18, 0, 0, 0);
    else {
      next.setDate(next.getDate() + 1);
      next.setHours(6, 0, 0, 0);
    }
    const id = setTimeout(() => {
      update();
      setInterval(update, 60 * 60 * 1000);
    }, next.getTime() - now.getTime());
    return () => clearTimeout(id);
  }, []);

  const calculateTimeLeft = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const h = Math.floor((diff / 36e5) % 24).toString().padStart(2, '0');
    const m = Math.floor((diff / 6e4) % 60).toString().padStart(2, '0');
    const s = Math.floor((diff / 1e3) % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const resetTasksForNewDay = useCallback(() => {
    setTasks((prev) =>
      prev.map((task) => ({ ...task, name: `task ${task.id}`, completed: false, editing: false, tempName: `task ${task.id}` }))
    );
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      const newDay = new Date().toLocaleDateString();
      if (currentDay !== newDay) {
        resetTasksForNewDay();
        setCurrentDay(newDay);
        setFavoriteFood((prev) => foodOptions[Math.floor(Math.random() * foodOptions.length)] ?? prev);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [currentDay, foodOptions, resetTasksForNewDay]);

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'hidden') {
        gameStorage.save({
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
          cosmetics,
        });
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [
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
    cosmetics,
  ]);

  useEffect(() => {
    const loaded = gameStorage.load();
    if (!loaded) return;
    const currentDate = new Date().toLocaleDateString();
    const lastPlayed = loaded.lastPlayed;
    setCurrUser(loaded.currUser ?? 'friendlyBOT');
    setCurrCoins(loaded.currCoins ?? 0);
    setPetName(loaded.petName ?? 'Poofy');
    setTotalCoinsEarned(loaded.totalCoinsEarned ?? 0);
    setCurrLevel(loaded.currLevel ?? 1);
    setLevelProgress(loaded.levelProgress ?? 0);
    setLevelXPNeeded(loaded.levelXPNeeded ?? 100);

    let initialTasks: Task[] = DEFAULT_TASKS;
    if (lastPlayed !== currentDate) {
      if (loaded.tasks?.length > initialTasks.length) {
        initialTasks = loaded.tasks.map((task) => ({
          ...task,
          name: `task ${task.id}`,
          completed: false,
          editing: false,
          tempName: `task ${task.id}`,
        }));
      }
    } else {
      initialTasks = loaded.tasks ?? initialTasks;
    }
    setTasks(initialTasks);
    setTotalTasksCompleted(loaded.totalTasksCompleted ?? 0);
    setCurrBg(loaded.currBg ?? 'livingroom/01/livingroom-01');
    setLocations(loaded.locations ?? DEFAULT_LOCATIONS);
    setFoodItems(loaded.foodItems ?? DEFAULT_FOOD_ITEMS);
    setCurrFood(loaded.currFood ?? 'onigiri');
    setFoodIndex(loaded.foodIndex ?? 0);
    if (lastPlayed !== currentDate) {
      const owned = Object.entries(loaded.foodItems ?? {}).filter(([, d]) => d.owned).map(([n]) => n);
      setFavoriteFood(owned[Math.floor(Math.random() * owned.length)] ?? 'akami');
    } else {
      setFavoriteFood(loaded.favoriteFood ?? 'akami');
    }
    setCosmetics(loaded.cosmetics ?? DEFAULT_COSMETICS);
  }, []);

  const handleCloseShop = useCallback(() => setShowShop(false), []);
  const handleCloseCustomize = useCallback(() => setShowCustomize(false), []);

  const handleResetClick = () => {
    if (!window.confirm('Reset Progress?')) return;
    gameStorage.clear();
    setCurrUser('friendlyBOT');
    setCurrCoins(0);
    setTargetCoins(0);
    setPetName('Poofy');
    setTotalCoinsEarned(0);
    setCurrLevel(1);
    setLevelProgress(0);
    setLevelXPNeeded(100);
    setTasks(DEFAULT_TASKS);
    setTotalTasksCompleted(0);
    setCurrBg('livingroom/01/livingroom-01');
    setLocations(DEFAULT_LOCATIONS);
    setFoodItems(DEFAULT_FOOD_ITEMS);
    setCurrFood('onigiri');
    setFoodIndex(0);
    setFavoriteFood('akami');
    setCosmetics(DEFAULT_COSMETICS);
  };

  const isLandscape = useOrientation();

  return (
    <div>
      {!isLandscape && (
        <div className="fixed inset-0 bg-black text-white text-center font-square select-none flex items-center justify-center p-12 text-xl z-50">
          {tLandscape('prompt')}
        </div>
      )}
      {isLandscape && (
        <div>
          <div id="pet" className="bg-white w-full h-screen font-square select-none">
            <div className="w-full h-full flex flex-col items-center justify-center text-center">
              <PetHeader
                onReset={handleResetClick}
                notification={notification}
                timeLeft={timeLeft}
                currCoins={currCoins}
                coinCurrentlyIncreasing={coinCurrentlyIncreasing}
                coinIncrease={coinIncrease}
                currUser={currUser}
                isCheatActive={isCheatActive}
                onCheatClick={isCheatActive ? applyCheat : undefined}
                t={t}
              />

              <div className="w-full h-[60vh] items-center justify-center text-center grid grid-cols-4 gap-8">
                <PetInfoPanel
                  petName={petName}
                  petNameEditing={petNameEditing}
                  tempPetName={tempPetName}
                  onPetNameChange={handlePetNameChange}
                  onPetBlur={handlePetBlur}
                  onToggleEdit={togglePetEditMode}
                  currLevel={currLevel}
                  levelProgress={levelProgress}
                  levelXPNeeded={levelXPNeeded}
                  levelStatus={levelStatus}
                  favoriteFood={favoriteFood}
                  onCustomizeClick={() => setShowCustomize(true)}
                  t={t}
                />
                <PetMain
                  currBg={currBg}
                  bgTime={bgTime}
                  currLevel={currLevel}
                  frameIndex={frameIndex}
                  currentAnimation={currentAnimation}
                  cosmetics={cosmetics}
                  animations={animations}
                  showFood={showFood}
                  currFood={currFood}
                  showLevelUpArrow={showLevelUpArrow}
                  onPetHead={petHead}
                />
                <PetTasksPanel
                  tasks={tasks}
                  currLevel={currLevel}
                  onTaskNameChange={handleTaskNameChange}
                  onTaskBlur={handleTaskBlur}
                  onToggleTaskEdit={toggleTaskEditMode}
                  onCompleteTask={completeTask}
                  coinCurrentlyIncreasing={coinCurrentlyIncreasing}
                  t={t}
                />
              </div>

              <PetFooter
                onShopClick={() => setShowShop(true)}
                onFeedClick={feedPet}
                isFeeding={isFeeding}
                showLevelUpArrow={showLevelUpArrow}
                foodInventory={foodInventory}
                currFood={currFood}
                foodOptions={foodOptions}
                foodIndex={foodIndex}
                onChangeFood={changeFood}
                t={t}
              />

              {showShop && (
                <Shop
                  onClose={handleCloseShop}
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
              )}

              {showCustomize && (
                <Customize
                  onClose={handleCloseCustomize}
                  currFood={currFood}
                  setCurrFood={setCurrFood}
                  foodItems={foodItems}
                  setFoodItems={setFoodItems}
                  favoriteFood={favoriteFood}
                  locations={locations}
                  currBg={currBg}
                  setCurrBg={setCurrBg}
                  cosmetics={cosmetics}
                  equipCosmetic={equipCosmetic}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

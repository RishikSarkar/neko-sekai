"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Pet() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [idleCount, setIdleCount] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState('idle');

  const animations = {
    idle: {
      sequence: generateSequence("/assets/sprites/cat/01/cat-01-idle/cat-01-idle", 10),
      loopCount: 5,
    },
    yawn: {
      sequence: generateSequence("/assets/sprites/cat/01/cat-01-yawn/cat-01-yawn", 14),
      loopCount: 1,
    },
    eat: {
      sequence: generateSequence("/assets/sprites/cat/01/cat-01-eat/cat-01-eat", 35),
    }
  };

  function generateSequence(basePath, count) {
    return Array.from({ length: count }, (_, i) => `${basePath}${i + 1}.png`);
  }

  // Update frame and handle animation transitions
  useEffect(() => {
    const currentSequence = animations[currentAnimation].sequence;
    const intervalId = setInterval(() => {
      setFrameIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % currentSequence.length;
        if (nextIndex === 0) { // Completed a loop of the current animation
          handleAnimationLoopEnd();
        }
        return nextIndex;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [currentAnimation]);

  // Handle the end of an animation loop
  const handleAnimationLoopEnd = () => {
    if (currentAnimation === 'idle') {
      if (idleCount + 1 < animations.idle.loopCount) {
        setIdleCount(idleCount + 1);
      } else {
        setCurrentAnimation('yawn');
        setIdleCount(0); // Reset idle count
        setFrameIndex(0); // Start yawn animation from first frame
      }
    } else if (currentAnimation === 'yawn') {
      setCurrentAnimation('idle');
      setFrameIndex(0); // Start idle animation from first frame
    }
  };

  // Feed pet and switch to eat animation
  const feedPet = () => {
    setCurrentAnimation('eat');
    setFrameIndex(0); // Start eat animation from first frame

    setTimeout(() => {
      setCurrentAnimation('idle');
      setFrameIndex(0); // Return to idle animation starting frame
    }, animations.eat.sequence.length * 100);
  };

  return (
    <div id='pet' className='bg-gray-200 w-full h-screen font-mono select-none'>
      <div className="w-full h-full flex flex-col items-center justify-center text-center">
        <div className="select-none mt-20 py-20 px-40 pb-0 bg-white/50">
          <Image src={animations[currentAnimation].sequence[frameIndex]} alt="Pet" width={200} height={200} unoptimized={true} />
        </div>
        <div onClick={feedPet} className='text-2xl text-black text-center m-12 py-4 px-6 bg-white/50 hover:bg-white/80 hover:cursor-pointer ease-in duration-200'>
          feed
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// export default function Pet() {
//   const [gifVersion, setGifVersion] = useState(0);
//   const [isFeeding, setIsFeeding] = useState(false);

//   const idleGif = "/assets/sprites/cat/01/gifs/cat-01-idle.gif";
//   const yawnGif = "/assets/sprites/cat/01/gifs/cat-01-yawn.gif";
//   const eatGif = "/assets/sprites/cat/01/gifs/cat-01-eat.gif";

//   const [currentGif, setCurrentGif] = useState(idleGif);

//   useEffect(() => {
//     setGifSrc(`${currentGif}?v=${gifVersion}`);
//   }, [currentGif, gifVersion]);

//   useEffect(() => {
//     if (!isFeeding) {
//       const timeoutDuration = currentGif === idleGif ? 6000 : 1400;
//       const timeoutId = setTimeout(() => {
//         const nextGif = currentGif === idleGif ? yawnGif : idleGif;
//         setCurrentGif(nextGif);
//         setGifVersion(v => v + 1);
//       }, timeoutDuration);

//       return () => clearTimeout(timeoutId);
//     }
//   }, [currentGif, isFeeding]);

//   const [gifSrc, setGifSrc] = useState(`${idleGif}?v=${gifVersion}`);

//   const feedPet = () => {
//     setIsFeeding(true);
//     setCurrentGif(eatGif);
//     setTimeout(() => {
//       setIsFeeding(false);
//       setGifVersion(v => v + 1);
//     }, 3500);
//   };

//   return (
//     <div id='pet' className='bg-gray-300 w-full h-screen font-mono select-none'>
//       <div className="w-full h-full flex flex-col items-center justify-center text-center">
//         <div className="select-none mt-20 py-20 px-40 pb-0 bg-white/50">
//           <Image src={gifSrc} alt="Pet" width={200} height={200} unoptimized={true} />
//         </div>
//         <div onClick={feedPet} className='text-2xl text-black text-center m-12 py-4 px-6 bg-white/50 hover:bg-white/70 hover:cursor-pointer ease-in duration-200'>
//           feed
//         </div>
//       </div>
//     </div>
//   );
// }
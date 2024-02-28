import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImCross } from 'react-icons/im';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { LuMinusCircle, LuCheckCircle2 } from 'react-icons/lu';

const CUSTOMIZE_SECTIONS = {
    MAIN: 'MAIN',
    FOOD: 'FOOD',
    LOCATIONS: 'LOCATIONS',
    TOYS: 'TOYS',
    COSMETICS: 'COSMETICS',
};

export const Customize = ({ onClose, foodItems, setFoodItems, favoriteFood, locations, setLocations, currBg, setCurrBg }) => {
    const [currentSection, setCurrentSection] = useState(CUSTOMIZE_SECTIONS.MAIN);

    const handleChangeSection = (section) => {
        setCurrentSection(section);
    };

    const handleShowMainCustomize = () => {
        setCurrentSection(CUSTOMIZE_SECTIONS.MAIN);
    }

    const handleShowFoodItem = (itemName) => {
        setFoodItems(prevItems => ({
            ...prevItems,
            [itemName]: {
                ...prevItems[itemName],
                show: true,
            },
        }));
    };

    const handleHideFoodItem = (itemName) => {
        setFoodItems(prevItems => ({
            ...prevItems,
            [itemName]: {
                ...prevItems[itemName],
                show: false,
            },
        }));
    };



    return (
        <div className='fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-screen h-screen bg-black/90 z-50'>
            <div className='fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[60vw] h-[90vh] bg-black/90 z-[51] rounded-xl flex justify-center items-center text-center border-8 border-white'>

                <div onClick={onClose} className='fixed top-2 right-2 p-4 rounded-full cursor-pointer hover:bg-white/10'>
                    <ImCross size={20} />
                </div>
                <div onClick={handleShowMainCustomize} className={`${(currentSection === CUSTOMIZE_SECTIONS.MAIN) ? 'hidden' : 'block'} fixed top-2 left-2 p-3 rounded-full cursor-pointer hover:bg-white/10`}>
                    <IoMdArrowRoundBack size={30} />
                </div>

                {currentSection === CUSTOMIZE_SECTIONS.MAIN &&
                    (
                        <div className='flex w-[40vw] h-[50vh] grid grid-cols-2 gap-8 items-center justify-center text-center text-2xl rounded-xl'>
                            {Object.values(CUSTOMIZE_SECTIONS).filter(section => section !== CUSTOMIZE_SECTIONS.MAIN).map((section) => (
                                <div key={section} onClick={() => handleChangeSection(section)} className='col-span-1 flex w-full h-full border-4 border-black/10 rounded-xl items-center justify-center text-center cursor-pointer bg-white text-black hover:bg-white/80 ease-in duration-100'>
                                    {section.toLowerCase()}
                                </div>
                            ))}
                        </div>
                    )
                }

                {currentSection === CUSTOMIZE_SECTIONS.FOOD && (
                    <div className='flex flex-col w-full h-full items-center justify-center text-center'>
                        <div className='py-4 text-2xl'>
                            select food items to display
                        </div>
                        <div className='flex w-[40vw] h-auto max-h-[40vh] overflow-y-scroll grid grid-cols-3 gap-4 p-4 items-center justify-center text-center text-2xl border-4 border-black/10 rounded-xl bg-white'>
                            {Object.entries(foodItems).filter(([_, itemDetails]) => itemDetails.owned).map(([itemName, itemDetails]) => (
                                <div key={itemName} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black border-4 border-white/90 rounded-xl p-8'>
                                    <Image
                                        src={`/assets/food/icons/${itemName}.png`}
                                        alt={itemName}
                                        width={100}
                                        height={100}
                                        unoptimized={true}
                                    />
                                    <span className='text-white text-lg pb-2 font-bold'>{itemName}</span>
                                    <span className='text-white text-xs pb-1'>
                                        XP: {itemName === favoriteFood ? `${itemDetails.xp} ` : itemDetails.xp}
                                        {itemName === favoriteFood && (
                                            <span className='text-white/80 animate-pulse'> (x2)</span>
                                        )}
                                    </span>
                                    <span className='text-white text-xs'>Owned: {itemDetails.quantity}</span>
                                    <button
                                        onClick={() => {
                                            if (itemDetails.show) {
                                                handleHideFoodItem(itemName);
                                            } else {
                                                handleShowFoodItem(itemName);
                                            }
                                        }}
                                        className='absolute top-1 right-1 rounded-full hover:bg-white/20 m-2 text-white transition duration-100 ease-in z-[99]'
                                    >
                                        {itemDetails.show ? <LuCheckCircle2 size={30} /> : <LuMinusCircle size={30} />}
                                    </button>
                                    {!itemDetails.show && (
                                        <div className='absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col items-center justify-center rounded-xl'>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentSection === CUSTOMIZE_SECTIONS.LOCATIONS && (
                    <div className='flex flex-col w-full h-full items-center justify-center text-center'>
                        <div className='py-4 text-2xl'>
                            set location
                        </div>
                        <div className='flex w-[40vw] h-auto max-h-[40vh] overflow-y-scroll grid grid-cols-2 gap-4 p-4 items-center justify-center text-center text-2xl border-4 border-black/10 rounded-xl bg-white'>
                            {Object.entries(locations).filter(([_, itemDetails]) => itemDetails.owned).map(([itemName, itemDetails]) => (
                                <div key={itemName} onClick={() => setCurrBg(itemDetails.bg)} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black border-4 border-white/90 rounded-xl p-8'>
                                    <div className='bg-white/90 rounded-xl overflow-hidden border-4 border-white/90 m-2'>
                                        <Image
                                            src={`/assets/backgrounds/${itemDetails.bg}-morning.gif`}
                                            alt={itemName}
                                            width={200}
                                            height={200}
                                            unoptimized={true}
                                        />
                                    </div>
                                    {currBg === itemDetails.bg ? (
                                        <div className='absolute top-1 right-1 rounded-full m-2 text-white z-[99]'>
                                            <LuCheckCircle2 size={30} />
                                        </div>
                                    ) : (
                                        <div className='absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl cursor-pointer' />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentSection === CUSTOMIZE_SECTIONS.TOYS && (
                    <div className='flex flex-col w-full h-full items-center justify-center text-center'>
                        <div className='py-4 text-2xl'>
                            coming soon!
                        </div>
                    </div>
                )}

                {currentSection === CUSTOMIZE_SECTIONS.COSMETICS && (
                    <div className='flex flex-col w-full h-full items-center justify-center text-center'>
                        <div className='py-4 text-2xl'>
                            coming soon!
                        </div>
                    </div>
                )}

            </div>
        </div>

    );
};
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

export const Customize = ({ onClose, currFood, setCurrFood, foodItems, setFoodItems, favoriteFood, locations, setLocations, currBg, setCurrBg, cosmetics, equipCosmetic }) => {
    const [currentSection, setCurrentSection] = useState(CUSTOMIZE_SECTIONS.MAIN);

    const handleChangeSection = (section) => {
        setCurrentSection(section);
    };

    const handleShowMainCustomize = () => {
        setCurrentSection(CUSTOMIZE_SECTIONS.MAIN);
    }

    const shownItemCount = Object.values(foodItems).filter(item => item.show && item.owned).length;

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
        if (shownItemCount > 1) {
            setFoodItems(prevItems => ({
                ...prevItems,
                [itemName]: {
                    ...prevItems[itemName],
                    show: false,
                },
            }));
        }
    };

    useEffect(() => {
        if (!foodItems[currFood]?.show) {
            const firstShownItem = Object.entries(foodItems).find(([_, itemDetails]) => itemDetails.show && itemDetails.owned);
            if (firstShownItem) {
                const [firstShownItemName] = firstShownItem;
                setCurrFood(firstShownItemName);
            }
        }
    }, [foodItems, currFood, setCurrFood]);

    const [activeCosmeticType, setActiveCosmeticType] = useState(null);


    return (
        <div className='fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-screen h-screen bg-black/90 z-50'>
            <div className='fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 lg:w-[60vw] w-[70vw] lg:h-[90vh] h-[80vh] bg-black/90 z-[51] rounded-xl flex justify-center items-center text-center lg:border-8 border-4 border-white'>

                <div onClick={onClose} className='fixed top-2 right-2 p-4 rounded-full cursor-pointer hover:bg-white/10 text-white'>
                    <ImCross size={20} />
                </div>
                <div onClick={handleShowMainCustomize} className={`${(currentSection === CUSTOMIZE_SECTIONS.MAIN) ? 'hidden' : 'block'} fixed top-2 left-2 p-3 rounded-full cursor-pointer hover:bg-white/10 text-white`}>
                    <IoMdArrowRoundBack size={30} />
                </div>

                {currentSection === CUSTOMIZE_SECTIONS.MAIN &&
                    (
                        <div className='flex lg:w-[40vw] w-[50vw] h-[50vh] grid grid-cols-2 gap-8 items-center justify-center text-center lg:text-2xl text-lg rounded-xl text-white'>
                            {Object.values(CUSTOMIZE_SECTIONS).filter(section => section !== CUSTOMIZE_SECTIONS.MAIN).map((section) => (
                                <div key={section} onClick={() => handleChangeSection(section)} className='col-span-1 flex w-full h-full border-4 border-black/10 rounded-xl items-center justify-center text-center cursor-pointer bg-white text-black hover:bg-white/80 ease-in duration-100'>
                                    {section.toLowerCase()}
                                </div>
                            ))}
                        </div>
                    )
                }

                {currentSection === CUSTOMIZE_SECTIONS.FOOD && (
                    <div className='flex flex-col w-full h-full items-center justify-center text-center text-white'>
                        <div className='lg:py-4 py-2 lg:text-2xl text-md'>
                            select food items to display
                        </div>
                        <div className='flex lg:w-[40vw] w-[60vw] h-auto lg:max-h-[40vh] max-h-[50vh] overflow-y-scroll grid grid-cols-3 lg:gap-4 gap-1 lg:p-4 p-1 items-center justify-center text-center lg:text-2xl text-lg border-4 border-black/10 rounded-xl bg-white'>
                            {Object.entries(foodItems).filter(([_, itemDetails]) => itemDetails.owned).map(([itemName, itemDetails]) => (
                                <div key={itemName} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black lg:border-4 lg:border-white/90 rounded-xl lg:p-8 p-2'>
                                    <div className="lg:w-[100px] lg:h-[100px] w-[70px] h-[70px]">
                                        <Image
                                            src={`/assets/food/icons/${itemName}.png`}
                                            alt={itemName}
                                            width={100}
                                            height={100}
                                            unoptimized={true}
                                            className='object-cover'
                                        />
                                    </div>
                                    <span className='text-white lg:text-lg text-sm lg:pb-2 font-bold'>{itemName}</span>
                                    <span className='text-white lg:text-xs text-[10px] lg:pb-1 lg:mb-0 -mb-2'>
                                        XP: {itemName === favoriteFood ? `${itemDetails.xp} ` : itemDetails.xp}
                                        {itemName === favoriteFood && (
                                            <span className='text-white/80 animate-pulse'> (x2)</span>
                                        )}
                                    </span>
                                    <span className='text-white lg:text-xs text-[10px]'>Owned: {itemDetails.quantity}</span>
                                    <button
                                        onClick={() => {
                                            if (itemDetails.show) {
                                                handleHideFoodItem(itemName);
                                            } else {
                                                handleShowFoodItem(itemName);
                                            }
                                        }}
                                        className='absolute top-1 right-1 rounded-full hover:bg-white/20 lg:m-2 m-1 text-white transition duration-100 ease-in z-[99]'
                                    >
                                        {itemDetails.show ? <LuCheckCircle2 className='lg:text-[30px] text-[20px]' /> : <LuMinusCircle className='lg:text-[30px] text-[20px]' />}
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
                    <div className='flex flex-col w-full h-full items-center justify-center text-center text-white'>
                        <div className='lg:py-4 py-2 lg:text-2xl text-md'>
                            set location
                        </div>
                        <div className='flex lg:w-[40vw] w-[60vw] h-auto lg:max-h-[40vh] max-h-[50vh] overflow-y-scroll grid grid-cols-2 lg:gap-4 gap-1 lg:p-4 p-1 items-center justify-center text-center lg:text-2xl text-lg border-4 border-black/10 rounded-xl bg-white'>
                            {Object.entries(locations).filter(([_, itemDetails]) => itemDetails.owned).map(([itemName, itemDetails]) => (
                                <div key={itemName} onClick={() => setCurrBg(itemDetails.bg)} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black lg:border-4 lg:border-white/90 rounded-xl p-8'>
                                    <div className='bg-white/90 rounded-xl overflow-hidden lg:border-4 border-2 border-white/90 lg:m-2 m-1'>
                                        <Image
                                            src={`/assets/backgrounds/${itemDetails.bg}-morning.gif`}
                                            alt={itemName}
                                            width={200}
                                            height={200}
                                            unoptimized={true}
                                        />
                                    </div>
                                    {currBg === itemDetails.bg ? (
                                        <div className='absolute top-1 right-1 rounded-full lg:m-2 m-1 text-white z-[99]'>
                                            <LuCheckCircle2 className='lg:text-[30px] text-[20px]' />
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
                    <div className='flex flex-col w-full h-full items-center justify-center text-center text-white'>
                        <div className='lg:py-4 py-2 lg:text-2xl text-md'>
                            coming soon!
                        </div>
                    </div>
                )}

                {currentSection === CUSTOMIZE_SECTIONS.COSMETICS && (
                    <div className='flex flex-col w-full h-full items-center justify-center text-center text-white'>

                        <div className='my-2 lg:w-[40vw] w-[50vw] bg-white/10 hover:bg-white/20 ease-in duration-100 rounded-xl items-center justify-center flex flex-col cursor-pointer' onClick={() => setActiveCosmeticType(activeCosmeticType !== 'head' ? 'head' : null)}>
                            <div className='lg:py-4 py-2 lg:text-xl text-md'>
                                head
                            </div>
                            {activeCosmeticType === 'head' && (
                                <div onClick={(e) => { e.stopPropagation() }} className='flex w-full h-auto lg:max-h-[40vh] max-h-[30vh] rounded-xl rounded-t-none overflow-y-scroll grid grid-cols-3 lg:gap-4 gap-1 lg:p-4 p-1 items-center justify-center text-center lg:text-2xl text-lg border-4 border-black/10 bg-white ease-in duration-100 cursor-default'>
                                    {Object.entries(cosmetics.head).filter(([_, itemDetails]) => itemDetails.owned).map(([itemName, itemDetails]) => (
                                        <div key={itemName} onClick={(e) => { e.stopPropagation(); equipCosmetic('head', itemName); }} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black lg:border-4 lg:border-white/90 rounded-xl cursor-pointer'>
                                            <div className="lg:w-[100px] lg:h-[100px] w-[70px] h-[70px]">
                                                <Image
                                                    src={`/assets/cosmetics/head/icons/${itemName}.png`}
                                                    alt={itemName}
                                                    width={100}
                                                    height={100}
                                                    unoptimized={true}
                                                    className='object-cover'
                                                />
                                            </div>
                                            {/* <span className='text-white text-sm pb-4'>{itemDetails.name}</span> */}

                                            {cosmetics.equipped.head === itemName ? (
                                                <div className='absolute top-1 right-1 rounded-full lg:m-2 m-1 text-white z-[99]'>
                                                    <LuCheckCircle2 className='lg:text-[30px] text-[20px]' />
                                                </div>
                                            ) : (
                                                <div className='absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl cursor-pointer'></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='my-2 lg:w-[40vw] w-[50vw] bg-white/10 hover:bg-white/20 ease-in duration-100 rounded-xl items-center justify-center flex flex-col cursor-pointer' onClick={() => setActiveCosmeticType(activeCosmeticType !== 'face' ? 'face' : null)}>
                            <div className='lg:py-4 py-2 lg:text-xl text-md'>
                                face
                            </div>
                            {activeCosmeticType === 'face' && (
                                <div onClick={(e) => { e.stopPropagation() }} className='flex w-full h-auto lg:max-h-[40vh] max-h-[30vh] rounded-xl rounded-t-none overflow-y-scroll grid grid-cols-3 lg:gap-4 gap-1 lg:p-4 p-1 items-center justify-center text-center lg:text-2xl text-lg border-4 border-black/10 bg-white ease-in duration-100 cursor-default'>
                                    {Object.entries(cosmetics.face).filter(([_, itemDetails]) => itemDetails.owned).map(([itemName, itemDetails]) => (
                                        <div key={itemName} onClick={(e) => { e.stopPropagation(); equipCosmetic('face', itemName); }} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black lg:border-4 lg:border-white/90 rounded-xl cursor-pointer'>
                                            <div className="lg:w-[100px] lg:h-[100px] w-[70px] h-[70px]">
                                                <Image
                                                    src={`/assets/cosmetics/face/icons/${itemName}.png`}
                                                    alt={itemName}
                                                    width={100}
                                                    height={100}
                                                    unoptimized={true}
                                                    className='object-cover'
                                                />
                                            </div>
                                            {/* <span className='text-white text-sm pb-4'>{itemDetails.name}</span> */}

                                            {cosmetics.equipped.face === itemName ? (
                                                <div className='absolute top-1 right-1 rounded-full lg:m-2 m-1 text-white z-[99]'>
                                                    <LuCheckCircle2 className='lg:text-[30px] text-[20px]' />
                                                </div>
                                            ) : (
                                                <div className='absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl cursor-pointer'></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='my-2 lg:w-[40vw] w-[50vw] bg-white/10 hover:bg-white/20 ease-in duration-100 rounded-xl items-center justify-center flex flex-col cursor-pointer' onClick={() => setActiveCosmeticType(activeCosmeticType !== 'body' ? 'body' : null)}>
                            <div className='lg:py-4 py-2 lg:text-xl text-md'>
                                body
                            </div>
                            {activeCosmeticType === 'body' && (
                                <div onClick={(e) => { e.stopPropagation() }} className='flex w-full h-auto lg:max-h-[40vh] max-h-[30vh] rounded-xl rounded-t-none overflow-y-scroll grid grid-cols-3 lg:gap-4 gap-1 lg:p-4 p-1 items-center justify-center text-center lg:text-2xl text-lg border-4 border-black/10 bg-white ease-in duration-100 cursor-default'>
                                    {Object.entries(cosmetics.body).filter(([_, itemDetails]) => itemDetails.owned).map(([itemName, itemDetails]) => (
                                        <div key={itemName} onClick={(e) => { e.stopPropagation(); equipCosmetic('body', itemName); }} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black lg:border-4 lg:border-white/90 rounded-xl cursor-pointer'>
                                            <div className="lg:w-[100px] lg:h-[100px] w-[70px] h-[70px]">
                                                <Image
                                                    src={`/assets/cosmetics/body/icons/${itemName}.png`}
                                                    alt={itemName}
                                                    width={100}
                                                    height={100}
                                                    unoptimized={true}
                                                    className='object-cover'
                                                />
                                            </div>
                                            {/* <span className='text-white text-sm pb-4'>{itemDetails.name}</span> */}

                                            {cosmetics.equipped.body === itemName ? (
                                                <div className='absolute top-1 right-1 rounded-full lg:m-2 m-1 text-white z-[99]'>
                                                    <LuCheckCircle2 className='lg:text-[30px] text-[20px]' />
                                                </div>
                                            ) : (
                                                <div className='absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl cursor-pointer'></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )}

            </div>
        </div>

    );
};
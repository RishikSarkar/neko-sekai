import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImCross } from 'react-icons/im';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { LuPlusCircle } from 'react-icons/lu';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';

const SHOP_SECTIONS = {
    MAIN: 'MAIN',
    FOOD: 'FOOD',
    LOCATIONS: 'LOCATIONS',
    TOYS: 'TOYS',
    COSMETICS: 'COSMETICS',
    SPECIAL: 'SPECIAL',
    GAMES: 'GAMES',
};

export const Shop = ({ onClose, currCoins, setCurrCoins, setTargetCoins, foodItems, setFoodItems, favoriteFood, locations, setLocations, setCurrBg, cosmetics, setCosmetics, equipCosmetic }) => {
    const [coinDecrease, setCoinDecrease] = useState(0);
    const [tempCoins, setTempCoins] = useState(currCoins);
    const [tempTargetCoins, setTempTargetCoins] = useState(currCoins);
    const [coinCurrentlyDecreasing, setCoinCurrentlyDecreasing] = useState(false);

    const [currentSection, setCurrentSection] = useState(SHOP_SECTIONS.MAIN);

    const handleChangeSection = (section) => {
        setCurrentSection(section);
    };

    const decreaseCoins = (coins) => {
        if (currCoins - coins >= 0) {
            setCoinDecrease(coins);
            setCoinCurrentlyDecreasing(true);
            setTempTargetCoins(currCoins - coins);
            setTempCoins(currCoins);
        }
    };

    const handleFoodPurchase = (itemName) => {
        const itemPrice = foodItems[itemName].price;
        if (currCoins >= itemPrice) {
            decreaseCoins(itemPrice);
            const newFoodItems = {
                ...foodItems,
                [itemName]: {
                    ...foodItems[itemName],
                    quantity: foodItems[itemName].quantity + 1,
                },
            };
            setFoodItems(newFoodItems);
        };
    };

    const handleLocationPurchase = (locationName) => {
        const itemPrice = locations[locationName].price;
        if (currCoins >= itemPrice && !locations[locationName].owned) {
            decreaseCoins(itemPrice);

            const newLocations = {
                ...locations,
                [locationName]: {
                    ...locations[locationName],
                    owned: true,
                },
            };

            setLocations(newLocations);
            setCurrBg(locations[locationName].bg);

            const newFoodItems = Object.keys(foodItems).reduce((acc, itemName) => {
                const item = foodItems[itemName];
                if (item.location === locationName) {
                    acc[itemName] = { ...item, owned: true };
                } else {
                    acc[itemName] = item;
                }
                return acc;
            }, {});

            setFoodItems(newFoodItems);

            const newCosmetics = Object.keys(cosmetics).reduce((newCosmeticType, type) => {
                newCosmeticType[type] = Object.keys(cosmetics[type]).reduce((acc, itemName) => {
                    const item = cosmetics[type][itemName];
                    if (item.location === locationName) {
                        acc[itemName] = { ...item, unlocked: true };
                    } else {
                        acc[itemName] = item;
                    }
                    return acc;
                }, {});
                return newCosmeticType;
            }, {});

            setCosmetics(newCosmetics);
        };
    }

    const handleShowMainShop = () => {
        setCurrentSection(SHOP_SECTIONS.MAIN);
    }

    useEffect(() => {
        let coinDiff = currCoins - tempTargetCoins;

        if (tempCoins > tempTargetCoins) {
            const timer = setTimeout(() => {
                setTempCoins(tempCoins - 1);
            }, 500 / coinDiff);

            return () => clearTimeout(timer);
        }

        setCurrCoins(tempCoins);
        setTargetCoins(tempCoins);
        setCoinCurrentlyDecreasing(false);

    }, [tempCoins, currCoins, tempTargetCoins, setCurrCoins, setTargetCoins]);

    const [activeCosmeticType, setActiveCosmeticType] = useState(null);

    const handleCosmeticPurchase = (type, cosmeticName) => {
        const itemDetails = cosmetics[type][cosmeticName];

        if (itemDetails.unlocked && !itemDetails.owned && currCoins >= itemDetails.price) {
            decreaseCoins(itemDetails.price);

            const newCosmetics = {
                ...cosmetics,
                [type]: {
                    ...cosmetics[type],
                    [cosmeticName]: {
                        ...itemDetails,
                        owned: true,
                    },
                },
            };

            setCosmetics(newCosmetics);

            equipCosmetic(type, cosmeticName);
        }
    };

    return (
        <div className='fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-screen h-screen bg-black/90 z-50'>
            <div className='fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 lg:w-[80vw] w-[90vw] lg:h-[90vh] h-[80vh] bg-black/90 z-[51] rounded-xl flex justify-center items-center text-center lg:border-8 border-4 border-white'>

                <div onClick={() => { if (!coinCurrentlyDecreasing) onClose(); }} className='fixed top-2 right-2 p-4 rounded-full cursor-pointer hover:bg-white/10 text-white'>
                    <ImCross className='lg:text-[20px] text-[15px]' />
                </div>
                <div onClick={handleShowMainShop} className={`${(currentSection === SHOP_SECTIONS.MAIN) ? 'hidden' : 'block'} fixed top-2 left-2 p-3 rounded-full cursor-pointer hover:bg-white/10 text-white`}>
                    <IoMdArrowRoundBack className='lg:text-[30px] text-[25px]' />
                </div>

                <div className='fixed lg:top-6 top-2 left-1/2 transform -translate-x-1/2'>
                    <div className='col-span-1 md:px-6 px-1 md:py-2 py-1 flex grid grid-cols-5 justify-center bg-white/10 items-center text-white lg:text-xl text-md lg:border-l-8 border-l-4 lg:border-r-8 border-r-4 border-white/10'>
                        <div className='col-span-1'>
                            <MdOutlineAttachMoney className='lg:text-[30px] text-[20px]' />
                        </div>
                        <div className='col-span-3'>
                            {`${coinCurrentlyDecreasing ? tempCoins : currCoins}`}
                        </div>
                        <div className='col-span-1'>
                            <span className={`${coinCurrentlyDecreasing ? 'block' : 'hidden'} lg:text-sm text-xs text-white/50`}>
                                -{`${coinDecrease}`}
                            </span>
                        </div>
                    </div>
                </div>

                {currentSection === SHOP_SECTIONS.MAIN &&
                    (
                        <div className='flex lg:w-[60vw] w-[70vw] lg:h-[50vh] h-[45vh] grid grid-cols-3 lg:gap-8 gap-4 items-center justify-center text-center lg:text-2xl text-lg rounded-xl'>
                            {Object.values(SHOP_SECTIONS).filter(section => section !== SHOP_SECTIONS.MAIN).map((section) => (
                                <div key={section} onClick={() => handleChangeSection(section)} className='col-span-1 flex w-full h-full border-4 border-black/10 rounded-xl items-center justify-center text-center cursor-pointer bg-white text-black hover:bg-white/80 ease-in duration-100'>
                                    {section.toLowerCase()}
                                </div>
                            ))}
                        </div>
                    )
                }

                {currentSection === SHOP_SECTIONS.FOOD && (
                    <div className='flex lg:w-[60vw] w-[70vw] h-auto lg:max-h-[50vh] max-h-[45vh] overflow-y-scroll grid grid-cols-4 lg:gap-4 gap-1 lg:p-4 p-1 items-center justify-center text-center lg:text-2xl text-lg border-4 border-black/10 rounded-xl bg-white text-white'>
                        {Object.entries(foodItems).map(([itemName, itemDetails]) => (
                            <div key={itemName} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black lg:border-4 lg:border-white/90 rounded-xl lg:p-8 p-2'>
                                <div className="lg:w-[100px] lg:h-[100px] w-[70px] h-[70px]">
                                    <Image
                                        src={`/assets/food/icons/${itemName}.png`}
                                        alt={itemName}
                                        width={100}
                                        height={100}
                                        unoptimized={true}
                                    />
                                </div>
                                <span className='text-white lg:text-lg text-sm lg:pb-2 pb-1 font-bold'>{itemName}</span>
                                <span className='text-white lg:text-sm text-xs lg:pb-1'>Price: ${itemDetails.price}</span>
                                <span className='text-white lg:text-xs text-[10px] lg:pb-1 lg:mb-0 -mb-2'>
                                    XP: {itemName === favoriteFood ? `${itemDetails.xp} ` : itemDetails.xp}
                                    {itemName === favoriteFood && (
                                        <span className='text-white/80 animate-pulse'> (x2)</span>
                                    )}
                                </span>
                                <span className='text-white lg:text-xs text-[10px]'>Owned: {itemDetails.quantity}</span>
                                <button
                                    onClick={() => { if (!coinCurrentlyDecreasing) { handleFoodPurchase(itemName) } }}
                                    className={`${itemDetails.owned ? 'block' : 'hidden'} absolute top-1 right-1 rounded-full hover:bg-white/20 lg:m-2 m-1 text-white transition duration-100 ease-in cursor-pointer`}
                                >
                                    <LuPlusCircle className='lg:text-[40px] text-[25px]' />
                                </button>
                                {!itemDetails.owned && (
                                    <div className='absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center rounded-xl'>
                                        <FaLock className='my-4 lg:text-[30px] text-[20px]' />
                                        <span className='text-white lg:text-xl text-sm'>
                                            {itemDetails.level > 0 ? `level ${itemDetails.level}` :
                                                itemDetails.task > 0 ? `${itemDetails.task} tasks` :
                                                    itemDetails.earn > 0 ? `earn $${itemDetails.earn}` :
                                                        itemDetails.location !== 'all' ? `unlock ${itemDetails.location}` : ''}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {currentSection === SHOP_SECTIONS.LOCATIONS && (
                    <div className='flex lg:w-[60vw] w-[70vw] h-auto lg:max-h-[50vh] max-h-[45vh] overflow-y-scroll grid grid-cols-2 lg:gap-4 gap-1 lg:p-4 p-1 items-center justify-center text-center lg:text-2xl text-lg border-4 border-black/10 rounded-xl bg-white text-white'>
                        {Object.entries(locations).map(([itemName, itemDetails]) => (
                            <div key={itemName} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black lg:border-4 lg:border-white/90 rounded-xl p-8'>
                                <div className={`${itemDetails.owned ? 'opacity-50' : 'opacity-100'} bg-white/90 rounded-xl overflow-hidden border-4 border-white/90`}>
                                    <Image
                                        src={`/assets/backgrounds/${itemDetails.bg}-morning.gif`}
                                        alt={itemName}
                                        width={300}
                                        height={300}
                                        unoptimized={true}
                                    />
                                </div>
                                <span className='text-white lg:text-lg text-sm lg:pt-4 pt-1 lg:py-2 py-1 font-bold'>{itemDetails.name}</span>
                                <span className='text-white lg:text-sm text-xs lg:mb-0 -mb-4'>{itemDetails.owned ? 'owned' : `Price: $${itemDetails.price}`}</span>
                                <button
                                    onClick={() => { if (!coinCurrentlyDecreasing) { handleLocationPurchase(itemName) } }}
                                    className={`${itemDetails.owned ? 'hidden' : 'block'} absolute top-1 right-1 rounded-full hover:bg-white/20 lg:m-2 m-1 text-white transition duration-100 ease-in cursor-pointer`}
                                >
                                    <LuPlusCircle className='lg:text-[40px] text-[25px]' />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {currentSection === SHOP_SECTIONS.TOYS && (
                    <div className='flex flex-col w-full h-full items-center justify-center text-center text-white'>
                        <div className='lg:py-4 py-2 lg:text-2xl text-md'>
                            coming soon!
                        </div>
                    </div>
                )}

                {currentSection === SHOP_SECTIONS.COSMETICS && (
                    <div className='flex flex-col w-full h-full items-center justify-center text-center text-white'>

                        <div className='my-2 lg:w-[60vw] w-[70vw] bg-white/10 hover:bg-white/20 ease-in duration-100 rounded-xl items-center justify-center flex flex-col cursor-pointer' onClick={() => setActiveCosmeticType(activeCosmeticType !== 'head' ? 'head' : null)}>
                            <div className='lg:py-4 py-2 lg:text-xl text-md'>
                                head
                            </div>
                            {activeCosmeticType === 'head' && (
                                <div onClick={(e) => { e.stopPropagation() }} className='flex w-full h-auto lg:max-h-[33vh] max-h-[18vh] rounded-xl rounded-t-none overflow-y-scroll grid grid-cols-4 lg:gap-4 gap-1 lg:p-4 p-1 items-center justify-center text-center lg:text-2xl text-lg border-4 border-black/10 bg-white ease-in duration-100 cursor-default'>
                                    {Object.entries(cosmetics.head).map(([itemName, itemDetails]) => (
                                        <div key={itemName} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black lg:border-4 lg:border-white/90 rounded-xl'>
                                            <div className="lg:w-[100px] lg:h-[100px] w-[70px] h-[70px]">
                                                <Image
                                                    className='pt-2 object-cover'
                                                    src={`/assets/cosmetics/head/icons/${itemName}.png`}
                                                    alt={itemName}
                                                    width={100}
                                                    height={100}
                                                    unoptimized={true}
                                                />
                                            </div>

                                            <span className='text-white lg:text-lg text-sm lg:pb-2 font-bold'>{itemDetails.name}</span>
                                            <span className='text-white lg:text-sm text-xs pb-6'>{itemDetails.owned ? 'owned' : `Price: $${itemDetails.price}`}</span>
                                            <button
                                                onClick={() => { if (!coinCurrentlyDecreasing) { handleCosmeticPurchase('head', itemName) } }}
                                                className={`${itemDetails.owned ? 'hidden' : 'block'} absolute top-1 right-1 rounded-full hover:bg-white/20 lg:m-2 m-1 text-white transition duration-100 ease-in cursor-pointer`}
                                            >
                                                <LuPlusCircle className='lg:text-[40px] text-[25px]' />
                                            </button>
                                            {!itemDetails.unlocked && (
                                                <div className='absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center rounded-xl'>
                                                    <FaLock className='lg:my-4 my-1 lg:text-[30px] text-[20px]' />
                                                    <span className='text-white lg:text-xl text-sm'>
                                                        {itemDetails.level > 0 ? `level ${itemDetails.level}` :
                                                            itemDetails.task > 0 ? `${itemDetails.task} tasks` :
                                                                itemDetails.earn > 0 ? `earn $${itemDetails.earn}` :
                                                                    itemDetails.location !== 'all' ? `unlock ${itemDetails.location}` : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='my-2 lg:w-[60vw] w-[70vw] bg-white/10 hover:bg-white/20 ease-in duration-100 rounded-xl items-center justify-center flex flex-col cursor-pointer' onClick={() => setActiveCosmeticType(activeCosmeticType !== 'face' ? 'face' : null)}>
                            <div className='lg:py-4 py-2 lg:text-xl text-md'>
                                face
                            </div>
                            {activeCosmeticType === 'face' && (
                                <div onClick={(e) => { e.stopPropagation() }} className='flex w-full h-auto lg:max-h-[33vh] max-h-[18vh] rounded-xl rounded-t-none overflow-y-scroll grid grid-cols-4 lg:gap-4 gap-1 lg:p-4 p-1 items-center justify-center text-center lg:text-2xl text-lg border-4 border-black/10 bg-white ease-in duration-100 cursor-default'>
                                    {Object.entries(cosmetics.face).map(([itemName, itemDetails]) => (
                                        <div key={itemName} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black border-4 border-white/90 rounded-xl'>
                                            <div className="lg:w-[100px] lg:h-[100px] w-[70px] h-[70px]">
                                                <Image
                                                    className='pt-2 object-cover'
                                                    src={`/assets/cosmetics/face/icons/${itemName}.png`}
                                                    alt={itemName}
                                                    width={100}
                                                    height={100}
                                                    unoptimized={true}
                                                />
                                            </div>

                                            <span className='text-white lg:text-lg text-sm lg:pb-2 font-bold'>{itemDetails.name}</span>
                                            <span className='text-white lg:text-sm text-xs pb-6'>{itemDetails.owned ? 'owned' : `Price: $${itemDetails.price}`}</span>
                                            <button
                                                onClick={() => { if (!coinCurrentlyDecreasing) { handleCosmeticPurchase('face', itemName) } }}
                                                className={`${itemDetails.owned ? 'hidden' : 'block'} absolute top-1 right-1 rounded-full hover:bg-white/20 m-2 text-white transition duration-100 ease-in cursor-pointer`}
                                            >
                                                <LuPlusCircle className='lg:text-[40px] text-[25px]' />
                                            </button>
                                            {!itemDetails.unlocked && (
                                                <div className='absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center rounded-xl'>
                                                    <FaLock className='lg:my-4 my-1 lg:text-[30px] text-[20px]' />
                                                    <span className='text-white lg:text-xl text-sm'>
                                                        {itemDetails.level > 0 ? `level ${itemDetails.level}` :
                                                            itemDetails.task > 0 ? `${itemDetails.task} tasks` :
                                                                itemDetails.earn > 0 ? `earn $${itemDetails.earn}` :
                                                                    itemDetails.location !== 'all' ? `unlock ${itemDetails.location}` : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='my-2 lg:w-[60vw] w-[70vw] bg-white/10 hover:bg-white/20 ease-in duration-100 rounded-xl items-center justify-center flex flex-col cursor-pointer' onClick={() => setActiveCosmeticType(activeCosmeticType !== 'body' ? 'body' : null)}>
                            <div className='lg:py-4 py-2 lg:text-xl text-md'>
                                body
                            </div>
                            {activeCosmeticType === 'body' && (
                                <div onClick={(e) => { e.stopPropagation() }} className='flex w-full h-auto lg:max-h-[33vh] max-h-[18vh] rounded-xl rounded-t-none overflow-y-scroll grid grid-cols-4 lg:gap-4 gap-1 lg:p-4 p-1 items-center justify-center text-center lg:text-2xl text-lg border-4 border-black/10 bg-white ease-in duration-100 cursor-default'>
                                    {Object.entries(cosmetics.body).map(([itemName, itemDetails]) => (
                                        <div key={itemName} className='relative col-span-1 flex flex-col items-center justify-center text-center bg-black border-4 border-white/90 rounded-xl'>
                                            <div className="lg:w-[100px] lg:h-[100px] w-[70px] h-[70px]">
                                                <Image
                                                    className='pt-2 object-cover'
                                                    src={`/assets/cosmetics/body/icons/${itemName}.png`}
                                                    alt={itemName}
                                                    width={100}
                                                    height={100}
                                                    unoptimized={true}
                                                />
                                            </div>

                                            <span className='text-white lg:text-lg text-sm lg:pb-2 font-bold'>{itemDetails.name}</span>
                                            <span className='text-white lg:text-sm text-xs pb-6'>{itemDetails.owned ? 'owned' : `Price: $${itemDetails.price}`}</span>
                                            <button
                                                onClick={() => { if (!coinCurrentlyDecreasing) { handleCosmeticPurchase('body', itemName) } }}
                                                className={`${itemDetails.owned ? 'hidden' : 'block'} absolute top-1 right-1 rounded-full hover:bg-white/20 m-2 text-white transition duration-100 ease-in cursor-pointer`}
                                            >
                                                <LuPlusCircle className='lg:text-[40px] text-[25px]' />
                                            </button>
                                            {!itemDetails.unlocked && (
                                                <div className='absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center rounded-xl'>
                                                    <FaLock className='lg:my-4 my-1 lg:text-[30px] text-[20px]' />
                                                    <span className='text-white lg:text-xl text-sm'>
                                                        {itemDetails.level > 0 ? `level ${itemDetails.level}` :
                                                            itemDetails.task > 0 ? `${itemDetails.task} tasks` :
                                                                itemDetails.earn > 0 ? `earn $${itemDetails.earn}` :
                                                                    itemDetails.location !== 'all' ? `unlock ${itemDetails.location}` : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )}

                {currentSection === SHOP_SECTIONS.SPECIAL && (
                    <div className='flex flex-col w-full h-full items-center justify-center text-center text-white'>
                        <div className='lg:py-4 py-2 lg:text-2xl text-md'>
                            coming soon!
                        </div>
                    </div>
                )}

                {currentSection === SHOP_SECTIONS.GAMES && (
                    <div className='flex flex-col w-full h-full items-center justify-center text-center'>
                        <div className='lg:py-4 py-2 lg:text-2xl text-md'>
                            coming soon!
                        </div>
                    </div>
                )}

            </div>
        </div>

    );
};
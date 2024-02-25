import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImCross } from "react-icons/im";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LuPlusCircle } from "react-icons/lu";
import { MdOutlineAttachMoney } from 'react-icons/md';
import { FaLock } from "react-icons/fa";

const CUSTOMIZE_SECTIONS = {
    MAIN: 'MAIN',
    FOOD: 'FOOD',
    LOCATIONS: 'LOCATIONS',
    TOYS: 'TOYS',
    FASHION: 'FASHION',
};

export const Customize = ({ onClose, currCoins, setCurrCoins, setTargetCoins, foodItems, setFoodItems, favoriteFood, locations, setLocations, setCurrBg }) => {
    const [coinDecrease, setCoinDecrease] = useState(0);
    const [tempCoins, setTempCoins] = useState(currCoins);
    const [tempTargetCoins, setTempTargetCoins] = useState(currCoins);
    const [coinCurrentlyDecreasing, setCoinCurrentlyDecreasing] = useState(false);

    const [currentSection, setCurrentSection] = useState(CUSTOMIZE_SECTIONS.MAIN);

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
        };
    }

    const handleShowMainCustomize = () => {
        setCurrentSection(CUSTOMIZE_SECTIONS.MAIN);
    }

    useEffect(() => {
        let coinDiff = currCoins - tempTargetCoins;

        if (tempCoins > tempTargetCoins) {
            const timer = setTimeout(() => {
                setTempCoins(tempCoins - 1);
            }, 500 / coinDiff);

            return () => clearTimeout(timer);
        }

        setCoinCurrentlyDecreasing(false);
        setCurrCoins(tempCoins);
        setTargetCoins(tempCoins);

    }, [tempCoins, currCoins, tempTargetCoins, setCurrCoins, setTargetCoins]);

    return (
        <div className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-screen h-screen bg-black/90 z-50">
            <div className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[60vw] h-[90vh] bg-black/90 z-[51] rounded-xl flex justify-center items-center text-center border-8 border-white">

                <div onClick={onClose} className="fixed top-2 right-2 p-4 rounded-full cursor-pointer hover:bg-white/10">
                    <ImCross size={20} />
                </div>
                <div onClick={handleShowMainCustomize} className={`${(currentSection === CUSTOMIZE_SECTIONS.MAIN) ? 'hidden' : 'block'} fixed top-2 left-2 p-3 rounded-full cursor-pointer hover:bg-white/10`}>
                    <IoMdArrowRoundBack size={30} />
                </div>

                {currentSection === CUSTOMIZE_SECTIONS.MAIN &&
                    (
                        <div className="flex w-[40vw] h-[50vh] grid grid-cols-2 gap-8 items-center justify-center text-center text-2xl rounded-xl">
                            {Object.values(CUSTOMIZE_SECTIONS).filter(section => section !== CUSTOMIZE_SECTIONS.MAIN).map((section) => (
                                <div key={section} onClick={() => handleChangeSection(section)} className="col-span-1 flex w-full h-full border-4 border-black/10 rounded-xl items-center justify-center text-center cursor-pointer bg-white text-black hover:bg-white/80 ease-in duration-100">
                                    {section.toLowerCase()}
                                </div>
                            ))}
                        </div>
                    )
                }

                {currentSection === CUSTOMIZE_SECTIONS.FOOD && (
                    <div className="flex w-[60vw] h-auto max-h-[50vh] overflow-y-scroll grid grid-cols-4 gap-4 p-4 items-center justify-center text-center text-2xl border-4 border-black/10 rounded-xl bg-white">
                        {Object.entries(foodItems).map(([itemName, itemDetails]) => (
                            <div key={itemName} className="relative col-span-1 flex flex-col items-center justify-center text-center bg-black border-4 border-white/90 rounded-xl p-8">
                                <Image
                                    src={`/assets/food/icons/${itemName}.png`}
                                    alt={itemName}
                                    width={100}
                                    height={100}
                                    unoptimized={true}
                                />
                                <span className='text-white text-xl pb-2 font-bold'>{itemName}</span>
                                <span className="text-white text-sm pb-1">Price: ${itemDetails.price}</span>
                                <span className="text-white text-sm pb-1">
                                    XP: {itemName === favoriteFood ? `${itemDetails.xp} ` : itemDetails.xp}
                                    {itemName === favoriteFood && (
                                        <span className="text-white/80 animate-pulse"> (x2)</span>
                                    )}
                                </span>
                                <span className="text-white text-sm">Owned: {itemDetails.quantity}</span>
                                <button
                                    onClick={() => { if (!coinCurrentlyDecreasing) { handleFoodPurchase(itemName) } }}
                                    className={`${itemDetails.owned ? 'block' : 'hidden'} absolute top-1 right-1 rounded-full hover:bg-white/20 m-2 text-white transition duration-100 ease-in`}
                                >
                                    <LuPlusCircle size={40} />
                                </button>
                                {!itemDetails.owned && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col items-center justify-center rounded-xl">
                                        <FaLock className='my-4' size={30} />
                                        <span className="text-white text-xl">Unlock {itemDetails.location}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {currentSection === CUSTOMIZE_SECTIONS.LOCATIONS && (
                    <div className="flex w-[60vw] h-auto max-h-[50vh] overflow-y-scroll grid grid-cols-2 gap-4 p-4 items-center justify-center text-center text-2xl border-4 border-black/10 rounded-xl bg-white">
                        {Object.entries(locations).map(([itemName, itemDetails]) => (
                            <div key={itemName} className="relative col-span-1 flex flex-col items-center justify-center text-center bg-black border-4 border-white/90 rounded-xl p-8">
                                <div className={`${itemDetails.owned ? 'opacity-50' : 'opacity-100'} bg-white/90 rounded-xl overflow-hidden border-4 border-white/90`}>
                                    <Image
                                        src={`/assets/backgrounds/${itemDetails.bg}-morning.gif`}
                                        alt={itemName}
                                        width={300}
                                        height={300}
                                        unoptimized={true}
                                    />
                                </div>
                                <span className='text-white text-xl pt-4 py-2 font-bold'>{itemDetails.name}</span>
                                <span className="text-white text-sm">{itemDetails.owned ? 'owned' : `Price: ${itemDetails.price}`}</span>
                                <button
                                    onClick={() => { if (!coinCurrentlyDecreasing) { handleLocationPurchase(itemName) } }}
                                    className={`${itemDetails.owned ? 'hidden' : 'block'} absolute top-1 right-1 rounded-full hover:bg-white/20 m-2 text-white transition duration-100 ease-in`}
                                >
                                    <LuPlusCircle size={40} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>

    );
};
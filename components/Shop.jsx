import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImCross } from "react-icons/im";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LuPlusCircle } from "react-icons/lu";
import { MdOutlineAttachMoney } from 'react-icons/md';

const SHOP_SECTIONS = {
    MAIN: 'MAIN',
    FOOD: 'FOOD',
    LOCATIONS: 'LOCATIONS',
    TOYS: 'TOYS',
    FASHION: 'FASHION',
    SPECIAL: 'SPECIAL',
    COINS: 'COINS',
};

export const Shop = ({ onClose, currCoins, setCurrCoins, setTargetCoins, foodItems, setFoodItems }) => {
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

    const handleShowMainShop = () => {
        setCurrentSection(SHOP_SECTIONS.MAIN);
    }

    useEffect(() => {
        if (tempCoins > tempTargetCoins) {
            const timer = setTimeout(() => {
                setTempCoins(tempCoins - 1);
            }, 50);

            return () => clearTimeout(timer);
        }

        setCoinCurrentlyDecreasing(false);
        setCurrCoins(tempCoins);
        setTargetCoins(tempCoins);

    }, [tempCoins, currCoins, tempTargetCoins, setCurrCoins, setTargetCoins]);

    return (
        <div className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-screen h-screen bg-black/90 z-50">
            <div className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[90vw] h-[90vh] bg-black/90 z-[51] rounded-xl flex justify-center items-center text-center border-8 border-white">

                <div onClick={onClose} className="fixed top-2 right-2 p-4 rounded-full cursor-pointer hover:bg-white/10">
                    <ImCross size={20} />
                </div>
                <div onClick={handleShowMainShop} className={`${(currentSection === SHOP_SECTIONS.MAIN) ? 'hidden' : 'block'} fixed top-2 left-2 p-3 rounded-full cursor-pointer hover:bg-white/10`}>
                    <IoMdArrowRoundBack size={30} />
                </div>

                <div className="fixed top-6 left-1/2 transform -translate-x-1/2">
                    <div className='col-span-1 px-6 py-2 flex grid grid-cols-5 justify-center bg-white/10 items-center text-white text-xl border-l-8 border-r-8 border-white/10'>
                        <div className='col-span-1'>
                            <MdOutlineAttachMoney size={30} />
                        </div>
                        <div className='col-span-3'>
                            {`${coinCurrentlyDecreasing ? tempCoins : currCoins}`}
                        </div>
                        <div className='col-span-1'>
                            <span className={`${coinCurrentlyDecreasing ? 'block' : 'hidden'} text-sm text-white/50`}>
                                -{`${coinDecrease}`}
                            </span>
                        </div>
                    </div>
                </div>

                {currentSection === SHOP_SECTIONS.MAIN &&
                    (
                        <div className="flex w-[70vw] h-[60vh] grid grid-cols-3 items-center justify-center text-center text-2xl border-2 border-white rounded-xl bg-white/10">
                            {Object.values(SHOP_SECTIONS).filter(section => section !== SHOP_SECTIONS.MAIN).map((section) => (
                                <div key={section} onClick={() => handleChangeSection(section)} className="col-span-1 flex w-full h-full border-2 border-white items-center justify-center text-center cursor-pointer hover:bg-black ease-in duration-100">
                                    {section.toLowerCase()}
                                </div>
                            ))}
                        </div>
                    )
                }

                {currentSection === SHOP_SECTIONS.FOOD && (
                    <div className="flex w-[70vw] h-auto max-h-[60vh] overflow-y-scroll grid grid-cols-4 gap-4 p-4 items-center justify-center text-center text-2xl border-4 border-white rounded-xl bg-white/10">
                        {Object.entries(foodItems).map(([itemName, itemDetails]) => (
                            <div key={itemName} className="relative col-span-1 flex flex-col items-center justify-center text-center bg-black border-4 border-white rounded-xl p-8">
                                <Image
                                    src={`/assets/food/icons/${itemName}.png`}
                                    alt={itemName}
                                    width={100}
                                    height={100}
                                    unoptimized={true}
                                />
                                <span className="text-white text-xl pb-2 font-bold">{itemName}</span>
                                <span className="text-white text-sm pb-1">Price: ${itemDetails.price}</span>
                                <span className="text-white text-sm">Owned: {itemDetails.quantity}</span>
                                <button onClick={() => handleFoodPurchase(itemName)} className="absolute top-1 right-1 rounded-full hover:bg-white/20 m-2 text-white transition duration-100 ease-in">
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
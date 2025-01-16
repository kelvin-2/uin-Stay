import React,{useState} from "react";
import { Search, MapPin, Wallet, Calendar } from 'lucide-react';

const SearchBox (){
    const [activePanel, setActivePanel] = useState(null);
    const [location, setLocation] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);

    const towns = ['Summerstrand','Central','Humewood','Forest Hill' ,'Wallmer'];
    const paymentMethods=['Cash' ,'Busary' ,'NSFAS']

    const handelPanelClick=(panel)=>{
        setActivePanel(activePanel===panel ?null:panel);
    };

    return(
        <div className="w-full max-4xl mx-auto">
            <div className="bg-white rounded-full shadow-lg border border-gray-200 divide-x">
                <div className="flex items-center h-16">
                    <button
                            onClick={() => handlePanelClick('location')}
                            className={`flex-1 flex items-center px-6 h-full rounded-l-full hover:bg-gray-50 transition-colors relative ${
                            activePanel === 'location' ? 'bg-gray-50' : ''
                            }`}
                    >
                        <div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="font-medium">Location</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            {location || 'Where are you going?'}
                        </p>
                        </div>
                    </button>
                   {/* Payment Method Button */}
                    <button
                    onClick={() => handlePanelClick('paymentMethod')}
                    className={`flex-1 flex items-center px-6 h-full hover:bg-gray-50 transition-colors ${
                        activePanel === 'payment' ? 'bg-gray-50' : ''
                      }`}
                    >
                        <div>
                            <div className="flex items-center">
                                <Wallet className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="font-medium">Payment</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                {paymentMethod || 'Add payment method'}
                            </p>
                        </div>
                    </button>
                       {/* Price Range Button */}
                    <button
                        onClick={() => handlePanelClick('price')}
                        className={`flex-1 flex items-center px-6 h-full hover:bg-gray-50 transition-colors ${
                        activePanel === 'price' ? 'bg-gray-50' : ''
                        }`}
                    >
                        <div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="font-medium">Price</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                R{priceRange[0]} - R{priceRange[1]}
                            </p>
                        </div>
                    </button>
                    <button className="px-6 h-full rounded-r-full bg-blue-500 hover:bg-blue-600 transition-colors">
                        <Search className="w-5 h-5 text-white" />
                    </button>
                </div> 
            </div>
        </div>
    )
}
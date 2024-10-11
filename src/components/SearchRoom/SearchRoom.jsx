import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

function SearchRoom() {
    return ( 
        <>
            <div className='absolute bottom-0 transform -translate-x-1/2 left-1/2 z-10'>
                <div className="container mx-auto">
                    <div className="bg-white bg-opacity-35 rounded-3xl shadow-lg px-8 py-6 text-white mx-10">
                        <div className="grid grid-cols-12 items-center">
                            {/* Location Select with Icon */}
                            <div className='col-span-3'>
                                <div className='text-white font-garamond text-base'>Location</div>
                                <div className="flex items-center justify-between border-r-2 border-r-white mr-8">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#B5986D] mr-2" />
                                    <select className="bg-transparent font-bold rounded-md mr-16 text-xl  w-full focus:outline-none">
                                        <option>Ho Chi Minh</option>
                                        <option>Hanoi</option>
                                        <option>Da Nang</option>
                                        <option>Nha Trang</option>
                                        <option>Phu Quoc</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-5 flex gap-6 justify-center">
                                {/* Check-in Input with Icon */}
                                <div >
                                    <div className='text-white font-garamond text-base'>CheckIn</div>
                                    <div className="flex items-center border-r-2 border-r-white mr-8">
                                        {/* <FontAwesomeIcon icon={faCalendarAlt} className="text-[#B5986D] mr-2" /> */}
                                        <input
                                            type="date"
                                            className="bg-transparent text-xl rounded-md w-full focus:outline-none mr-8"
                                        />
                                    </div>
                                </div>
                                {/* Check-out Input with Icon */}
                                <div>
                                    <div className='text-white font-garamond text-base'>CheckOut</div>
                                    <div className="flex items-center border-r-2 border-r-white mr-8">
                                        {/* <FontAwesomeIcon icon={faCalendarAlt} className="text-[#B5986D] mr-2" /> */}
                                        <input
                                            type="date"
                                            className="bg-transparent text-xl rounded-md w-full focus:outline-none mr-8"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Room Type Select with Icon */}
                            <div className='col-span-3'>
                                <div className='text-white font-garamond text-base'>Abode</div>
                                <div className="flex items-center justify-between">
                                    <FontAwesomeIcon icon={faUsers} className="text-[#B5986D] mr-2" />
                                    <select className="bg-transparent font-bold rounded-md mr-16 text-xl  w-full focus:outline-none">
                                        <option className='bg-[#B5986D]'>Single Room</option>
                                        <option>Double Room</option>
                                      
                                    </select>
                                </div>
                            </div>
                        {/* Search Button */}
                            <div className="flex justify-center mt-4 col-span-1 col-start-12">
                                <button className="bg-[#B5986D] text-white rounded-[20px] py-2 px-8 hover:bg-[#8A6A4E]">
                                    Search
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchRoom;
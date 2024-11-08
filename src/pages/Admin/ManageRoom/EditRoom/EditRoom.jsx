import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import Swal from 'sweetalert2';

function EditRoom({ isOpen, onClose, roomData, fetchData }) {
    const accessToken = getAccessTokenFromLS();
    const [name, setName] = useState(roomData.name || '');
    const [description, setDescription] = useState(roomData.description || '');
    const [adultNumber, setAdultNumber] = useState(roomData.adultNumber || '');
    const [adultMax, setAdultMax] = useState(roomData.adultMax || '');
    const [roomRank, setRoomRank] = useState(roomData.roomRankId || null);
    const [selectedServices, setSelectedServices] = useState(roomData.roomServiceList.map(service => ({
        value: service.id,
        label: service.name,
        customPrice: service.price || 0
    })) || []);
    const [selectedPolicies, setSelectedPolicies] = useState(roomData.policyList.map(policy => ({
        value: policy.typeId,
        label: policy.type,
        content: policy.content,
        description: policy.description
    })) || []);
    const [allServices, setAllServices] = useState([]);
    const [allPolicies, setAllPolicies] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [price, setPrice] = useState(roomData.price || '');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedAvailableRooms, setSelectedAvailableRooms] = useState(roomData.roomDetailList.map(room => ({
        value: room.id,
        label: `Số phòng: ${room.roomNumber}`
    })) || []);

    useEffect(() => {
        const fetchServices = async () => {
            const response = await adminApi.getAllServiceRoom(accessToken);
            setAllServices(response.data.data);
        };

        const fetchPolicies = async () => {
            const response = await adminApi.getAllPolicy(accessToken);
            setAllPolicies(response.data.data);
        };

        const fetchRoomTypes = async () => {
            const response = await adminApi.getAllTypeRoom(accessToken);
            setRoomTypes(response.data.data);
        };

        const fetchAvailableRooms = async () => {
            const response = await adminApi.getNumberRoomNoBooked(accessToken);
            setAvailableRooms(response.data.data);
        };

        fetchServices();
        fetchPolicies();
        fetchRoomTypes();
        fetchAvailableRooms();
    }, [accessToken]);

    const handleEditRoom = async () => {
        if (!name || !description || !price || !adultNumber || !adultMax || !roomRank || selectedServices.length === 0 || selectedPolicies.length === 0 || selectedAvailableRooms.length === 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
        // Validate selected services
        if (selectedServices.length === 0 || selectedServices.some(service => !service.customPrice)) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng chọn ít nhất một dịch vụ và điền giá cho tất cả các dịch vụ đã chọn!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Validate selected policies
        if (selectedPolicies.length === 0 || selectedPolicies.some(policy => !policy.content || !policy.description)) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng chọn ít nhất một chính sách và điền nội dung cũng như mô tả cho tất cả các chính sách đã chọn!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Validate selected rooms
        if (selectedAvailableRooms.length === 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng chọn ít nhất một số phòng!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
        const updatedRoomData = {
            roomId: roomData.id,
            name,
            description,
            price: parseFloat(price),
            adultNumber: parseInt(adultNumber),
            adultMax: parseInt(adultMax),
            roomRank,
            serviceList: selectedServices.map(service => ({
                serviceId: service.value,
                price: parseInt(service.customPrice)
            })),
            policyList: selectedPolicies.map(policy => ({
                typeId: policy.value,
                content: policy.content,
                description: policy.description,
            })),
            roomList: selectedAvailableRooms.map(room => room.value),
        };

        try {
            console.log(updatedRoomData);
            const response = await adminApi.editRoom(accessToken, updatedRoomData);
            console.log(response);
            if (response.data.statusCode === 200) {
                fetchData();
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Phòng đã được cập nhật thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                onClose();
            }
        } catch (error) {
            console.error('Error updating room:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi cập nhật phòng. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const handlePolicyChange = (selectedPolicy) => {
        setSelectedPolicies(prev => [...prev, { ...selectedPolicy, content: '', description: '' }]);
    };

    const handleRemovePolicy = (index) => {
        setSelectedPolicies(prev => prev.filter((_, i) => i !== index));
    };

    const handleServiceChange = (selectedOptions) => {
        setSelectedServices(selectedOptions);
    };

    const handleRemoveService = (index) => {
        setSelectedServices(prev => prev.filter((_, i) => i !== index));
    };

    const availableServices = allServices.filter(service => !selectedServices.some(selected => selected.value === service.id));
    const availablePolicies = allPolicies.filter(policy => !selectedPolicies.some(selected => selected.value === policy.id));
    const availableRoomOptions = availableRooms.map(room => ({ value: room.id, label: `Số phòng: ${room.roomNumber}` }));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative overflow-auto max-h-[90%]">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <div className="text-xl font-inter font-semibold mb-4">Chỉnh sửa phòng</div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Tên phòng"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <textarea
                            placeholder="Mô tả"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4 resize-none h-24"
                        />
                        <input
                            type="number"
                            placeholder="Giá"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Số người lớn tối thiểu"
                            value={adultNumber}
                            onChange={(e) => setAdultNumber(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Số người lớn tối đa"
                            value={adultMax}
                            onChange={(e) => setAdultMax(e.target.value)}
                            className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-4"
                        />
                        <Select
                            options={roomTypes.map(type => ({ value: type.id, label: type.name }))}
                            onChange={setRoomRank}
                            placeholder="Chọn hạng phòng"
                            className="mb-4"
                            value={roomTypes.find(type => type.id === roomRank) ? { value: roomRank, label: roomTypes.find(type => type.id === roomRank).name } : roomRank}
                        />
                        <Select
                            isMulti
                            options={availableServices.map(service => ({ value: service.id, label: service.name }))}
                            onChange={handleServiceChange}
                            placeholder="Chọn dịch vụ"
                            className="mb-4"
                            value={selectedServices}
                        />
                        {selectedServices.map((service, index) => (
                            <div key={service.value} className=" items-center mb-2">
                                <span className="ml-2">{service.label}</span>
                                <button onClick={() => handleRemoveService(index)} className="ml-3 text-red-500">
                                    Xóa
                                </button>
                                <input
                                    type="number"
                                    placeholder="Giá"
                                    value={service.customPrice}
                                    onChange={(e) => {
                                        const updatedServices = [...selectedServices];
                                        updatedServices[index].customPrice = e.target.value;
                                        setSelectedServices(updatedServices);
                                    }}
                                    className="ml-2 mt-2 w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded"
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <Select
                            options={availablePolicies.map(policy => ({ value: policy.id, label: policy.type }))}
                            onChange={handlePolicyChange}
                            placeholder="Chọn chính sách"
                            className="mb-4"
                        />
                        {selectedPolicies.map((policy, index) => (
                            <div key={policy.value} className="mb-4 ml-2">
                                <div className="flex items-center mb-2">
                                    <span className="mr-2">{policy.label}</span>
                                    <button onClick={() => handleRemovePolicy(index)} className="text-red-500">
                                        Xóa
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nội dung"
                                    value={policy.content}
                                    onChange={(e) => {
                                        const updatedPolicies = [...selectedPolicies];
                                        updatedPolicies[index].content = e.target.value;
                                        setSelectedPolicies(updatedPolicies);
                                    }}
                                    className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Mô tả"
                                    value={policy.description}
                                    onChange={(e) => {
                                        const updatedPolicies = [...selectedPolicies];
                                        updatedPolicies[index].description = e.target.value;
                                        setSelectedPolicies(updatedPolicies);
                                    }}
                                    className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-2"
                                />
                            </div>
                        ))}
                        <Select
                            isMulti
                            options={availableRoomOptions}
                            onChange={setSelectedAvailableRooms}
                            placeholder="Chọn số phòng"
                            className="mb-4"
                            value={selectedAvailableRooms}
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={handleEditRoom}
                        className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
                    >
                        Cập nhật phòng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditRoom;
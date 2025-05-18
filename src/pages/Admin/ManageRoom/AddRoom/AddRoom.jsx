import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import adminApi from '../../../../api/adminApi';
import { getAccessTokenFromLS } from '../../../../utils/auth';
import Swal from 'sweetalert2';

function AddRoom({ isOpen, onClose, fetchData }) {
    const accessToken = getAccessTokenFromLS();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [adultNumber, setAdultNumber] = useState('');
    const [adultMax, setAdultMax] = useState('');
    const [roomRank, setRoomRank] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedPolicies, setSelectedPolicies] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [allPolicies, setAllPolicies] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [price, setPrice] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedAvailableRooms, setSelectedAvailableRooms] = useState([]);

    const fetchServices = async () => {
        const response = await adminApi.getAllServiceRoom(accessToken);
        setAllServices(response.data.data);
    };

    const fetchPolicies = async () => {
        const response = await adminApi.getAllPolicy(accessToken);
        console.log(response.data.data)
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

    useEffect(() => {
        fetchServices();
        fetchPolicies();
        fetchRoomTypes();
        fetchAvailableRooms();
    }, [accessToken]);

    const handleAddRoom = async () => {
        // Validate required fields
        if (!name || !description || !price || !adultNumber || !adultMax || !roomRank) {
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
        if (selectedPolicies.length === 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng chọn ít nhất một chính sách!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Validate payment policy is required
        const hasPaymentPolicy = selectedPolicies.some(policy => policy.type === 'Thanh toán');
        if (!hasPaymentPolicy) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng chọn chính sách thanh toán!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Validate all policies have content and description
        const invalidPolicies = selectedPolicies.filter(policy => {
            if (!policy.content || !policy.description) return true;

            switch (policy.type) {
                case 'Thanh toán':
                    const paymentValue = parseFloat(policy.content);
                    return isNaN(paymentValue) || paymentValue < 0 || paymentValue > 100 || paymentValue % 10 !== 0;
                case 'Phụ thu người lớn':
                case 'Phụ thu trẻ em':
                    const surchargeValue = parseFloat(policy.content);
                    return isNaN(surchargeValue) || surchargeValue < 0;
                case 'Nhận phòng':
                case 'Trả phòng':
                    return !policy.content.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
                default:
                    return !policy.content.trim();
            }
        });

        if (invalidPolicies.length > 0) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng kiểm tra lại thông tin các chính sách!',
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

        const roomData = {
            name,
            description,
            price: parseFloat(price),
            adultNumber: parseInt(adultNumber),
            adultMax: parseInt(adultMax),
            roomRank: roomRank.value,
            serviceList: selectedServices.map(service => ({
                serviceId: service.value,
                price: parseInt(service.customPrice)
            })),
            policyList: selectedPolicies.map((policy) => ({
                typeId: policy.value,
                content: policy.content,
                description: policy.description,
            })),
            roomList: selectedAvailableRooms.map(room => room.value),
        };
        console.log(roomData)
        try {
            const response = await adminApi.addRoom(accessToken, roomData);
            if (response.data.statusCode === 201) {
                fetchData();
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Phòng đã được thêm thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                onClose();
                // Reset state variables
                setName('');
                setDescription('');
                setPrice('');
                setAdultNumber('');
                setAdultMax('');
                setRoomRank(null);
                setSelectedServices([]);
                setSelectedPolicies([]);
                setSelectedAvailableRooms([]);
            }
        } catch (error) {
            console.error('Error adding room:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi thêm phòng. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const handlePolicyChange = (selectedPolicy) => {
        setSelectedPolicies((prev) => [...prev, {
            ...selectedPolicy,
            content: '',
            description: '',
            typeId: selectedPolicy.value,
            type: selectedPolicy.label
        }]);
    };

    const validatePolicyInput = (policy, value) => {
        if (!value) {
            Swal.fire({
                title: 'Lỗi!',
                text: 'Vui lòng nhập đầy đủ thông tin!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return false;
        }

        switch (policy.type) {
            case 'Thanh toán':
                const paymentValue = parseFloat(value);
                if (isNaN(paymentValue)) {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Giá trị thanh toán phải là số!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return false;
                }
                if (paymentValue < 0 || paymentValue > 100) {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Giá trị thanh toán phải từ 0 đến 100!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return false;
                }
                if (paymentValue % 10 !== 0) {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Giá trị thanh toán phải chia hết cho 10!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return false;
                }
                break;

            case 'Phụ thu người lớn':
            case 'Phụ thu trẻ em':
                const surchargeValue = parseFloat(value);
                if (isNaN(surchargeValue)) {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Giá trị phụ thu phải là số!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return false;
                }
                if (surchargeValue < 0) {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Giá trị phụ thu phải là số dương!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return false;
                }
                break;

            case 'Nhận phòng':
            case 'Trả phòng':
                // Validate time format HH:mm
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                if (!timeRegex.test(value)) {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Vui lòng nhập đúng định dạng thời gian (HH:mm)!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return false;
                }
                break;

            default:
                if (!value.trim()) {
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Vui lòng nhập nội dung!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return false;
                }
                break;
        }
        return true;
    };

    const handlePolicyContentChange = (index, value) => {
        const policy = selectedPolicies[index];
        if (!validatePolicyInput(policy, value)) {
            return;
        }
        const updatedPolicies = [...selectedPolicies];
        updatedPolicies[index].content = value;
        setSelectedPolicies(updatedPolicies);
    };

    const getPolicyInputProps = (policyType) => {
        switch (policyType) {
            case 'Thanh toán':
                return {
                    type: 'number',
                    min: '0',
                    max: '100',
                    step: '10',
                    placeholder: 'Nhập phần trăm thanh toán (0-100, chia hết cho 10) *'
                };
            case 'Phụ thu người lớn':
            case 'Phụ thu trẻ em':
                return {
                    type: 'number',
                    min: '0',
                    placeholder: 'Nhập số tiền phụ thu *'
                };
            case 'Nhận phòng':
            case 'Trả phòng':
                return {
                    type: 'time',
                    placeholder: 'Nhập giờ *'
                };
            default:
                return {
                    type: 'text',
                    placeholder: 'Nhập nội dung *'
                };
        }
    };

    const getPolicyDescriptionPlaceholder = (policyType) => {
        switch (policyType) {
            case 'Thanh toán':
                return 'Mô tả phương thức thanh toán *';
            case 'Phụ thu người lớn':
                return 'Mô tả chính sách phụ thu người lớn *';
            case 'Phụ thu trẻ em':
                return 'Mô tả chính sách phụ thu trẻ em *';
            case 'Nhận phòng':
                return 'Mô tả quy định nhận phòng *';
            case 'Trả phòng':
                return 'Mô tả quy định trả phòng *';
            default:
                return 'Mô tả chi tiết *';
        }
    };

    const handleRemovePolicy = (index) => {
        setSelectedPolicies((prev) => prev.filter((_, i) => i !== index));
    };

    const handleServiceChange = (selectedOptions) => {
        setSelectedServices(selectedOptions);
    };

    const handleRemoveService = (index) => {
        setSelectedServices((prev) => prev.filter((_, i) => i !== index));
    };

    const availableServices = allServices.filter(service => !selectedServices.some(selected => selected.value === service.id));
    const availablePolicies = allPolicies.filter(policy => !selectedPolicies.some(selected => selected.value === policy.id));
    const availableRoomOptions = availableRooms.map(room => ({ value: room.id, label: `Số phòng: ${room.roomNumber}` }));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative overflow-y-auto max-h-[80%]">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
                <div className="text-xl font-inter font-semibold mb-4">Thêm phòng</div>
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
                        />
                        <Select
                            isMulti
                            options={availableServices.map(service => ({ value: service.id, label: service.name }))}
                            onChange={handleServiceChange}
                            placeholder="Chọn dịch vụ"
                            className="mb-4"
                        />
                        {selectedServices.map((service, index) => (
                            <div key={index} className=" items-center mb-2">
                                <span className="ml-2">{service.label}</span>
                                <button onClick={() => handleRemoveService(index)} className="ml-2 text-red-500">
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
                            options={availablePolicies.map(policy => ({ value: policy.id, label: policy.name }))}
                            onChange={handlePolicyChange}
                            placeholder="Chọn chính sách"
                            className="mb-4"
                        />
                        {selectedPolicies.map((policy, index) => (
                            <div key={index} className="mb-4 ml-2">
                                <div className="flex items-center mb-2">
                                    <span className="mr-2">{policy.type}</span>
                                    <button
                                        onClick={() => handleRemovePolicy(index)}
                                        className="text-red-500"
                                        type="button"
                                    >
                                        Xóa
                                    </button>
                                </div>
                                <input
                                    {...getPolicyInputProps(policy.type)}
                                    value={policy.content}
                                    onChange={(e) => handlePolicyContentChange(index, e.target.value)}
                                    className="w-full p-2 border focus:border-yellow-500 hover:border-yellow-500 rounded mb-2"
                                />
                                <input
                                    type="text"
                                    placeholder={getPolicyDescriptionPlaceholder(policy.type)}
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
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={handleAddRoom}
                        className="px-3 py-2 text-base rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold"
                    >
                        Thêm phòng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRoom;
import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../API/axiosInstance';
import "./realWedding.css"
import useAuthCheck from '../../../Auth/useAuthCheck';
export default function RealWeddings() {
    useAuthCheck();
    const [weddings, setWeddings] = useState([]);
    const [selectedWedding, setSelectedWedding] = useState(null);
    const [token, setToken] = useState(null);


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }

        axiosInstance.get("/api/real-weddings/all")
            .then(res => setWeddings(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleOpenModal = (wedding) => {
        setSelectedWedding(wedding);
    };

    const handleCloseModal = () => {
        setSelectedWedding(null);
    };

    const handleDelete = (wedding) => {
        const response = axiosInstance.delete(`/api/real-weddings/delete/${wedding.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    return (
        <>
            <div className="px-4 py-8">
                <h2 className="text-center real-wedding-title">Real Weddings</h2>
                <div className="space-y-6">
                    {weddings.map(wedding => (
                        <div key={wedding.id} className="wedding-tile">
                            <img
                                src={wedding.fileUrls[0]}
                                alt={wedding.title}
                                className="w-full md:w-1/3 h-64 object-cover p-3"
                            />
                            <div className="p-6 flex flex-col justify-center md:w-2/3 details">
                                <h2 className="text-2xl font-bold">{wedding.title}</h2>
                                <p className="text-sm text-gray-500">{new Date(wedding.createdAt).toLocaleDateString()}</p>
                                <button
                                    onClick={() => handleOpenModal(wedding)}
                                    className="btn btn-primary my-1"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#real-wedding"
                                >
                                    View More
                                </button>
                                <button
                                    onClick={() => handleDelete(wedding)}
                                    className="btn btn-danger my-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {selectedWedding && (
                    <div class="modal" tabindex="-1" id='real-wedding'>
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">{ selectedWedding.title }</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {selectedWedding.fileUrls.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`wedding-${index}`}
                                                className="w-full h-64 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    // <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
                    //     <div className="bg-white rounded-xl w-11/12 md:w-3/4 max-h-[90vh] overflow-y-auto p-6 relative">
                    //         <button
                    //             className="absolute top-4 right-4 text-xl font-bold text-gray-700"
                    //             onClick={handleCloseModal}
                    //         >
                    //             ✕
                    //         </button>
                    //         <h2 className="text-2xl font-bold mb-4">{selectedWedding.title}</h2>

                    //     </div>
                    // </div>
                )}
            </div>
        </>
    )
}

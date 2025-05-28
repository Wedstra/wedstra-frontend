import React, { useState, useEffect } from 'react'
import "./displayRealWedding.css"
import Slider from "react-slick";
import axiosInstance from '../../../API/axiosInstance';
export default function DisplayRealWeddings() {
    const [weddings, setWeddings] = useState([]);
    const [selectedWedding, setSelectedWedding] = useState(null);

    useEffect(() => {
        axiosInstance.get("/api/real-weddings/all")
            .then(res => setWeddings(res.data))
            .catch(err => console.error(err));
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ]
    };

    const handleOpenModal = (wedding) => {
        setSelectedWedding(wedding);
    };

    return (
        <div className="py-3" style={{ overflowX: "hidden" }}>
            <Slider {...settings}>
                {weddings.map((wedding) => (
                    <div key={wedding.id} className="px-2" >
                        <div
                            className="relative rounded-xl overflow-hidden real-wedding-slide"
                            style={{
                                backgroundImage: `url(${wedding.fileUrls?.[0] || '/fallback.jpg'})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 absolute-inset">
                                <h3 className="text-white text-2xl font-bold">{wedding.title}</h3>
                                <button
                                    onClick={() => handleOpenModal(wedding)}
                                    className="btn btn-light"
                                    data-bs-toggle="modal"
                                    data-bs-target="#real-wedding-modal"
                                >
                                    View More
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>



            {/* Modal */}
            {selectedWedding && (
                <div class="modal fade" id="real-wedding-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="real-wedding-modalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="real-wedding-modalLabel">{ selectedWedding.title }</h1>
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
            )}
        </div>
    );
}
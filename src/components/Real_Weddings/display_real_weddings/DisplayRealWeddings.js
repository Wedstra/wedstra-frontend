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
        infinite: false,
        speed: 600,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ]
    };

    const handleOpenModal = (wedding, e) => {
        // Prevent clicking cloned slides
        if (e?.currentTarget?.closest(".slick-cloned")) return;
        setSelectedWedding(wedding);
    };

    const closeModal = () => setSelectedWedding(null);

    return (
        <div className="py-3" style={{ overflowX: "hidden", overflowY:"hidden" }}>
            <Slider {...settings}>
                {weddings.map((wedding) => (
                    <div key={wedding.id} className="px-2">
                        <div
                            className="relative rounded-xl overflow-hidden real-wedding-slide"
                            style={{
                                backgroundImage: `url(${wedding.fileUrls?.[0] || '/fallback.jpg'})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 absolute-inset" id='slide-backdeop'>
                                <h3 className="text-white text-2xl font-bold">{wedding.title}</h3>
                                <button
                                    onClick={(e) => handleOpenModal(wedding, e)}
                                    className="btn btn-light"
                                >
                                    View More
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* React-only Modal */}
            {selectedWedding && (
                <div className="modal-backdrop-custom" onClick={closeModal}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header d-flex justify-between items-center mb-4">
                            <h5 className="modal-title">{selectedWedding.title}</h5>
                            <button className="btn-close" onClick={closeModal}></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedWedding.fileUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`wedding-${index}`}
                                    style={{ width:500, height: 300, objectFit: "cover", padding:"5px" }}
                                />
                            ))}
                        </div>
                        <div className="modal-footer mt-4">
                            <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

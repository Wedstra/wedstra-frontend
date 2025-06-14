import React, { useState } from 'react';
import '../vendorDetails.css';
function ImageGallery({ photos }) {
    const [selectedImage, setSelectedImage] = useState(photos?.[0]);

    return (
        <div className="image-gallery d-flex flex-column flex-md-row gap-4">
            {/* Thumbnails */}
            <div
                className="d-flex flex-md-column gap-2 overflow-auto thuimbnail-container"
            >
                {photos.map((photo, index) => (
                    <img
                        key={index}
                        src={photo}
                        alt={`Thumbnail ${index}`}
                        onClick={() => setSelectedImage(photo)}
                        className={`thumbnail-img img-thumbnail ${selectedImage === photo ? "border-primary" : ""}`}
                        style={{
                            cursor: "pointer",
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            border: "2px solid transparent"
                        }}
                    />
                ))}
            </div>

            {/* Main Image */}
            <div className="main-image border rounded shadow-sm">
                <img
                    src={selectedImage}
                    alt="Selected"
                    className="img-fluid"
                    style={{ height: "500px", objectFit: "contain", width: "100%" }}
                />
            </div>
        </div>
    );
}

export default ImageGallery;
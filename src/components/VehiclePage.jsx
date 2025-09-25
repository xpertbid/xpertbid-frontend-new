'use client';

import React, { useState } from 'react';

const VehiclePage = ({ vehicle }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = vehicle?.images || ['/images/placeholder.svg'];

  return (
    <div className="vehicle-page">
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-6">
            <div className="vehicle-images">
              <div className="main-image">
                <img 
                  src={images[selectedImage]} 
                  alt={vehicle?.title || 'Vehicle'}
                  className="img-fluid"
                />
              </div>
              <div className="thumbnail-images">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${vehicle?.title || 'Vehicle'} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="vehicle-details">
              <h1>{vehicle?.title || 'Vehicle'}</h1>
              <p>{vehicle?.description || 'No description available'}</p>
              <div className="price">
                <span>${vehicle?.price?.toLocaleString() || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclePage;

import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageCarousel = ({ images }) => {
  const settings = {
    dots:true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    
    arrows: true,
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 600,
      margin: 'auto'
    }}>
      <Slider {...settings}>
        {images.map((src, index) => (
          <Box 
            key={index} 
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
            }}
          >
            <img 
              src={src} 
              alt={`Slide ${index + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ImageCarousel;
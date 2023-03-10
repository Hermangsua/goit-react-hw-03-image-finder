import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import propTypes from 'prop-types';
import css from './ImageGallery.module.css';
import React from 'react';

export const ImageGallery = React.forwardRef(
  ({ images, onImageClick }, ref) => (
    <ul ref={ref} className={css.ImageGallery}>
      {images.map((image, index) => (
        <ImageGalleryItem onclick={onImageClick} image={image} key={index} />
      ))}
    </ul>
  )
);

ImageGallery.propTypes = {
  images: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.number.isRequired,
    })
  ),
  onImageClick: propTypes.func.isRequired,
};

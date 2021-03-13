import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Img = ({
  src,
  height,
  width,
  alt,
  className = '',
  jp2 = null,
  avif = null,
  webp = null,
  svg = null,
  ...restProps
}) => {
  return (
    <picture>
      {svg && <source src={svg} type="image/svg+xml" />}
      {avif && <source src={avif} type="image/avif" />}
      {webp && <source src={webp} type="image/webp" />}
      {jp2 && <source src={jp2} type="image/jp2" />}
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading="lazy"
        className={classNames('lazy', className)}
        {...restProps}
      />
    </picture>
  );
};

Img.propTypes = {
  src: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  avif: PropTypes.string,
  webp: PropTypes.string,
  jp2: PropTypes.string,
  svg: PropTypes.string,
};

export default Img;

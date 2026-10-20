import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  className?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fill,
  priority,
  sizes,
  quality,
  className = '',
  style,
  ...props
}) => {
  const fillStyles: React.CSSProperties = fill
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }
    : {};

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes}
      className={className}
      style={{ ...fillStyles, ...style }}
      {...props}
    />
  );
};

export default Image;

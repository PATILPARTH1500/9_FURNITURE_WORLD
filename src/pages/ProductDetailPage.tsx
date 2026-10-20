import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetailPageComponent from '@/app/products/[slug]/page';

export default function ProductRoute() {
  const params = useParams<{ slug: string }>();
  return <ProductDetailPageComponent params={{ slug: params.slug || '' }} />;
}


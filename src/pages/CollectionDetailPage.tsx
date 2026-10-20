import React from 'react';
import { useParams } from 'react-router-dom';
import CollectionDetailPageComponent from '@/app/collections/[slug]/page';

export default function CollectionRoute() {
  const params = useParams<{ slug: string }>();
  return <CollectionDetailPageComponent params={{ slug: params.slug || '' }} />;
}

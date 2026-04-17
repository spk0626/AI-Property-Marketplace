import { render, screen } from '@testing-library/react';
import PropertyCard from './PropertyCard';
import type { Property } from '@/types';

const baseProperty: Property = {
  id: 'property-1',
  ownerId: 'owner-1',
  title: 'Test Listing',
  description: 'Test description',
  price: 50000,
  location: 'Colombo 03',
  bedrooms: 2,
  bathrooms: 2,
  parking: true,
  area: 900,
  createdAt: new Date().toISOString(),
  images: [],
  owner: { name: 'Owner Name', email: 'owner@example.com' },
};

describe('PropertyCard', () => {
  it('renders fallback image when no images are provided', () => {
    const { container } = render(<PropertyCard property={baseProperty} />);

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      'src',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
    );
  });

  it('renders key listing details', () => {
    render(<PropertyCard property={baseProperty} />);

    expect(screen.getByText('Test Listing')).toBeInTheDocument();
    expect(screen.getByText('Colombo 03')).toBeInTheDocument();
    expect(screen.getByText('2 Beds')).toBeInTheDocument();
    expect(screen.getByText('2 Baths')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
  });
});

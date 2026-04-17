import Image from 'next/image';
import { Property } from '@/types';
import Link from 'next/link';
import { MapPin, Bed, Car, Ban } from 'lucide-react';

export default function PropertyCard({ property }: { property: Property }) {
  // Use the first image or a placeholder
  const imageUrl = property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop';

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group bg-white rounded-2xl border border-gray-100/50 overflow-hidden hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-56 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/0 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <img 
            src={imageUrl} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-teal-700 shadow-sm border border-white/20">
            LKR {property.price.toLocaleString()}
          </div>
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 text-white/90">
             <MapPin className="w-4 h-4" />
             <span className="text-sm font-medium drop-shadow-md">{property.location}</span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-teal-700 transition-colors">{property.title}</h3>
          
          <div className="flex items-center gap-4 mt-4 text-sm font-medium text-gray-500 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
             <div className="flex flex-col items-center flex-1 border-r border-gray-200/60 last:border-0">
               <Bed className="w-4 h-4 text-gray-400 mb-1" /> 
               <span className="text-xs text-gray-600">{property.bedrooms} Beds</span>
             </div>
             <div className="flex flex-col items-center flex-1 border-r border-gray-200/60 last:border-0">
               <div className="w-4 h-4 text-gray-400 mb-1 font-bold flex justify-center items-center font-sans tracking-tighter">BA</div>
               <span className="text-xs text-gray-600">{property.bathrooms} Baths</span>
             </div>
             <div className="flex flex-col items-center flex-1">
               {property.parking ? <Car className="w-4 h-4 text-gray-400 mb-1" /> : <Ban className="w-4 h-4 text-gray-300 mb-1" />}
               <span className="text-xs text-gray-600">{property.parking ? 'Parking' : 'None'}</span>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

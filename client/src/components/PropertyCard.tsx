import Link from "next/link";
import { Property } from "@/types";
import { CldImage } from 'next-cloudinary';

export default function PropertyCard({ property }: { property: Property }) {
    const image = property.images?.[0]?.url;

    return (
        <Link href={`/properties/${property.id}`}>
            <div className="bg-white rounded-x1 shadow-sm border hover: shaddow-md transition-shadow overflow-hidden cursor-pointer">
                <div className="h-48 bg-gray-100 relative">
                    {image? (
                        <CldImage
  src={property.images[0].publicId}  
  width={400}
  height={300}
  alt={property.title}
  className="w-full h-full object-cover"
  crop={{ type: 'fill', source: true }}
/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No Image
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">
                        {property.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{property.location}</p>
                    <p className="text-indigo-600 font-semibold mt-2">
                        LKR {property.price.toLocaleString()}
                    </p>
                    <div className="flex gap-4 mt-3 text-gray-500 text-sm">
                        <span>{property.bedrooms} Beds</span>
                        <span>{property.bathrooms} Baths</span>
                        {property.parking && <span>🅿 Parking </span>}
                        {property.area && <span> {property.area} sq ft </span>}
                    </div>
                </div>
            </div>
        </Link>
    );
}
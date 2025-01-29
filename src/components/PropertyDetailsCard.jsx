import React from 'react';
import { Pencil, ArrowLeft } from 'lucide-react';

const PropertyDetails = ({ property, onBackToList, onEditProperty }) => (
  <div className="bg-white rounded-lg shadow p-6 space-y-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button onClick={onBackToList} className="text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold">{property.address}</h2>
      </div>
      <button 
        onClick={onEditProperty}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Pencil className="h-4 w-4" />
        <span>Edit Property</span>
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Property Details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Room Type:</span> {property.roomType}</p>
            <p><span className="font-medium">Lease Length:</span> {property.leaseLength}</p>
            <p><span className="font-medium">Deposit Amount:</span> R{property.depositAmount}</p>
            <p><span className="font-medium">Distance from Shuttle:</span> {property.distanceFromShuttle}km</p>
            <p><span className="font-medium">Distance from School:</span> {property.distanceFromSchool}km</p>
            <p><span className="font-medium">Total Views:</span> {property.views}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">House Rules</h3>
          <div className="flex flex-wrap gap-2">
            {property.houseRules.map((rule, index) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {rule}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
          <div className="flex flex-wrap gap-2">
            {property.paymentAccepted.map((payment, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {payment}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Property Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {property.images.length > 0 ? (
              property.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Property ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))
            ) : (
              <div className="col-span-2 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              To schedule a viewing or inquire about this property, please use the contact form below.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PropertyDetails;
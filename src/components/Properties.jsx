import React, { useState, useEffect } from 'react';

const Properties = () =>{
    const [properties, setProperties] = useState([]);

    //fecthing data 
    useEffect( ()=> {
        fetch('/propertyData.json').then(response=>response.json())
        .then(data=>setProperties(data))
        .catch(error => console.error('Error loading properties:', error))
    },[]);
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
            <div key={property.id} className="border rounded-lg p-4 shadow-lg">
            <img
                src={property.image}
                alt={property.name}
                className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-bold">{property.name}</h3>
            <p className="text-gray-500">{property.location}</p>
            <p className="mt-2 text-lg font-semibold">{property.price}</p>
        </div>
      ))}
    </div>
    )
}

export default Properties;
import React, { useState, useEffect } from 'react';

const PropertyGrid = () =>{
    const [properties, setProperties] = useState([]);

    //fecthing data 
    useEffect( ()=> {
        fetch('/propertyData.json').then(response=>response.json())
        .then(data=>setProperties(data))
        .catch(error => console.error('Error loading properties:', error))
    },[]);
}
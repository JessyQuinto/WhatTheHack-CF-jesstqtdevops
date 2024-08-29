import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import Hours from '../components/Hours';
import PetList from '../components/PetList';

export default function Home() {
  const [dogImage, setDogImage] = useState('');
  const [pet, setPet] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchNewDogImage();
  }, []);

  const fetchNewDogImage = () => {
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(res => res.json())
      .then(async data => {
        setDogImage(data.message);
        
        const res = await fetch(`/api/pets?image_url=${data.message}`);
        const petData = await res.json();
        
        if (petData.length > 0) {
          setPet(petData[0]);
        } else {
          setPet(null);
        }
      });
  };

  const handleEdit = () => router.push(`/edit/${pet._id}`);
  const handleView = () => router.push(`/pet/${pet._id}`);
  const handleAdd = () => router.push({ pathname: '/new', query: { image_url: dogImage } });
  const handleNewDog = () => fetchNewDogImage();

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f0f0f0',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '2.5em',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>Reto WhatTheHack-CF-JESSY QUINTO TORRES</h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        {dogImage && (
          <img 
            src={dogImage} 
            alt="Random dog" 
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }} 
          />
        )}
        
        {pet ? (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{pet.name}</h2>
            <p style={{ color: '#555', marginBottom: '5px' }}>Owner: {pet.owner_name}</p>
            <p style={{ color: '#555', marginBottom: '15px' }}>Species: {pet.species}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleEdit} style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}>
                Edit Pet
              </button>
              <button onClick={handleView} style={{
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2ecc71'}>
                View Details
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#888', fontSize: '1.2rem', marginBottom: '20px' }}>Esta mascota no se encuentra registrada.</p>
            <button onClick={handleAdd} style={{
              padding: '10px 20px',
              backgroundColor: '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d35400'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e67e22'}>
              Registrar mascota
            </button>
          </div>
        )}

        <button onClick={handleNewDog} style={{
          padding: '10px 20px',
          backgroundColor: '#9b59b6',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#8e44ad'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9b59b6'}>
          Siguiente
        </button>
      </div>

      <div style={{ marginTop: '50px' }}>
        <PetList />
      </div>

      <div style={{ marginTop: '50px' }}>
        <Hours />
      </div>
    </div>
  );
}

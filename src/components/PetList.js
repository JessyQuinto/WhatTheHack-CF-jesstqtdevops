import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPets = async () => {
      const res = await fetch('/api/pets');
      const { data } = await res.json();
      setPets(data);
    };
    fetchPets();
  }, []);

  const handleView = (id) => router.push(`/pet/${id}`);
  const handleEdit = (id) => router.push(`/edit/${id}`);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f8f8f8',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#333'
      }}>Registered Pets</h2>
      {pets.length === 0 ? (
        <p style={{
          textAlign: 'center',
          color: '#888'
        }}>No pets registered yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {pets.map((pet) => (
            <div
              key={pet._id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'}
            >
              <img 
                src={pet.image_url || '/api/placeholder/300/200'} 
                alt={pet.name} 
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '10px'
                }}>{pet.name}</h3>
                <p style={{ color: '#555', marginBottom: '5px' }}>Owner: {pet.owner_name}</p>
                <p style={{ color: '#555', marginBottom: '15px' }}>Species: {pet.species}</p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => handleView(pet._id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#3498db',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(pet._id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#2ecc71',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2ecc71'}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetList;

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const petsPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/pets');
        const { data } = await res.json();
        setPets(data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
      setIsLoading(false);
    };
    fetchPets();
  }, []);

  const handleEdit = (id) => router.push(`/${id}/edit`);
  const handleView = (pet) => setSelectedPet(pet);
  const closeView = () => setSelectedPet(null);

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        <p style={{ textAlign: 'center', color: '#888' }}>No pets registered yet.</p>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {currentPets.map((pet) => (
              <div key={pet._id} style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease'
              }}>
                <img 
                  src={pet.image_url || '/api/placeholder/300/200'} 
                  alt={pet.name} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '10px' }}>{pet.name}</h3>
                  <p style={{ color: '#555', marginBottom: '5px' }}>Owner: {pet.owner_name}</p>
                  <p style={{ color: '#555', marginBottom: '15px' }}>Species: {pet.species}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={() => handleEdit(pet._id)} style={{
                      padding: '10px 20px',
                      backgroundColor: '#3498db',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}>
                      Editar
                    </button>
                    <button onClick={() => handleView(pet)} style={{
                      padding: '10px 20px',
                      backgroundColor: '#2ecc71',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}>
                      Visualizar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
            gap: '10px'
          }}>
            {Array.from({ length: Math.ceil(pets.length / petsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                style={{
                  padding: '10px 15px',
                  backgroundColor: currentPage === index + 1 ? '#3498db' : '#ddd',
                  color: currentPage === index + 1 ? '#fff' : '#333',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
      
      {selectedPet && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90%',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>{selectedPet.name}</h2>
            <img 
              src={selectedPet.image_url || '/api/placeholder/300/200'} 
              alt={selectedPet.name} 
              style={{ width: '100%', height: 'auto', marginBottom: '20px', borderRadius: '8px' }}
            />
            <p><strong>Owner:</strong> {selectedPet.owner_name}</p>
            <p><strong>Species:</strong> {selectedPet.species}</p>
            <p><strong>Age:</strong> {selectedPet.age}</p>
            <p><strong>Potty Trained:</strong> {selectedPet.poddy_trained ? 'Yes' : 'No'}</p>
            <p><strong>Diet:</strong> {selectedPet.diet}</p>
            <p><strong>Likes:</strong> {selectedPet.likes.join(', ')}</p>
            <p><strong>Dislikes:</strong> {selectedPet.dislikes.join(', ')}</p>
            <button onClick={closeView} style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetList;
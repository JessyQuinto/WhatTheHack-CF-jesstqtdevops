import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import Hours from '../components/Hours';

// Mock del módulo @actions/core (simulación para evitar errores)
const core = {
  getInput: () => 'mock-token',
  setFailed: console.error
};

// Mock del módulo @actions/github (simulación para evitar errores)
const github = {
  getOctokit: () => ({
    rest: {
      issues: {
        create: async () => ({ data: { html_url: 'https://github.com/mock-issue' } }),
        createComment: async () => {}
      }
    }
  }),
  context: {
    payload: { pull_request: { title: 'Mock PR', body: 'Mock body', number: 1 } },
    repo: { owner: 'mock-owner', repo: 'mock-repo' }
  }
};

// Función asíncrona para manejar la lógica del PR
async function run() {
  try {
    const token = core.getInput("repo-token", { required: true });
    const octokit = github.getOctokit(token);
    const { context } = github;

    const pr = context.payload.pull_request;
    console.log(pr.title);
    
    console.log("Creating issue for PR");
    const issue = await octokit.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: pr.title,
      body: pr.body,
    });

    console.log("Adding comment to PR");
    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      body: `Issue created: ${issue.data.html_url}`,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

export default function Home() {
  const [dogImage, setDogImage] = useState('');
  const [pet, setPet] = useState(null);
  const router = useRouter();

  useEffect(() => {
    run();
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

  const handleEdit = () => {
    router.push(`/edit/${pet._id}`);
  };

  const handleView = () => {
    router.push(`/pet/${pet._id}`);
  };

  const handleAdd = () => {
    router.push({
      pathname: '/new',
      query: { image_url: dogImage },
    });
  };

  const handleNewDog = () => {
    fetchNewDogImage();
  };

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
      }}>Reto WhatTheHack-CF-JESSY</h1>
      
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
          <div>
            <h2>{pet.name}</h2>
            <p>Owner: {pet.owner_name}</p>
            <p>Species: {pet.species}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleEdit} style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>Edit Pet</button>
              <button onClick={handleView} style={{
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>View Details</button>
            </div>
          </div>
        ) : (
          <div>
            <p>Esta mascota no se ha registrado.</p>
            <button onClick={handleAdd} style={{
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}>Registrar nueva mascota</button>
          </div>
        )}
        
        <button onClick={handleNewDog} style={{
          padding: '10px 20px',
          backgroundColor: '#34495e',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}>Mostrar Nueva mascota</button>
      </div>
      
      <div style={{
        marginTop: '40px',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <Hours />
      </div>
    </div>
  );
}
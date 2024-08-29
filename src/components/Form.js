import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';

const Form = ({ formId, petForm, forNewPet = true }) => {
  const router = useRouter();
  const contentType = 'application/json';
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: petForm.name,
    owner_name: petForm.owner_name,
    species: petForm.species,
    age: petForm.age,
    poddy_trained: petForm.poddy_trained,
    diet: petForm.diet,
    image_url: petForm.image_url,
    likes: petForm.likes,
    dislikes: petForm.dislikes,
  });

  useEffect(() => {
    // Update form when petForm changes (e.g., when editing an existing pet)
    setForm(petForm);
  }, [petForm]);

  const putData = async (form) => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();
      mutate(`/api/pets/${id}`, data, false);
      router.push('/');
    } catch (error) {
      setMessage('Failed to update pet');
    }
  };

  const postData = async (form) => {
    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      router.push('/');
    } catch (error) {
      setMessage(`Failed to add pet: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    const value = target.name === 'poddy_trained' ? target.checked : target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const formValidate = () => {
    let err = {};
    if (!form.name) err.name = 'Name is required';
    if (!form.owner_name) err.owner_name = 'Owner is required';
    if (!form.species) err.species = 'Species is required';
    if (!form.image_url) err.image_url = 'Image URL is required';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      setMessage('Saving...');
      if (forNewPet) {
        await postData(form);
      } else {
        await putData(form);
      }
    } else {
      setErrors(errs);
      setMessage('Please fill all required fields');
    }
  };

  return (
    <>
      <form id={formId} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          maxLength="20"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label htmlFor="owner_name">Owner</label>
        <input
          type="text"
          maxLength="20"
          name="owner_name"
          value={form.owner_name}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label htmlFor="species">Species</label>
        <input
          type="text"
          maxLength="30"
          name="species"
          value={form.species}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label htmlFor="age">Age</label>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label htmlFor="poddy_trained">Potty Trained</label>
        <input
          type="checkbox"
          name="poddy_trained"
          checked={form.poddy_trained}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label htmlFor="diet">Diet</label>
        <textarea
          name="diet"
          maxLength="60"
          value={form.diet}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label htmlFor="image_url">Image URL</label>
        <input
          type="url"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label htmlFor="likes">Likes</label>
        <textarea
          name="likes"
          maxLength="60"
          value={form.likes}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label htmlFor="dislikes">Dislikes</label>
        <textarea
          name="dislikes"
          maxLength="60"
          value={form.dislikes}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <button type="submit" className="btn" style={{
          padding: '10px 20px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
        >
          {forNewPet ? 'Add Pet' : 'Update Pet'}
        </button>
      </form>
      <p style={{ color: message.includes('Failed') ? 'red' : 'green', fontSize: '1.2rem', marginTop: '20px' }}>{message}</p>
      <div>
        {Object.keys(errors).map((err, index) => (
          <li key={index} style={{ color: 'red' }}>{err}</li>
        ))}
      </div>
    </>
  );
};

export default Form;
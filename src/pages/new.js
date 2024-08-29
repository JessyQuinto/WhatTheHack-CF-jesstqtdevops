import { useRouter } from 'next/router'
import Form from '../components/Form'

const NewPet = () => {
  const router = useRouter()
  const { image_url } = router.query

  const petForm = {
    name: '',
    owner_name: '',
    species: '',
    age: 0,
    poddy_trained: false,
    diet: [],
    image_url: image_url || '',
    likes: [],
    dislikes: [],
  }

  return <Form formId="add-pet-form" petForm={petForm} />
}

export default NewPet
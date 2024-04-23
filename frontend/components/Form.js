import React, { useEffect, useState } from 'react'
import * as Yup from 'yup';
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const orderSchema = Yup.object().shape({
    fullName: Yup.string()
    .min(3, 'full name must be at leat 3 characters')
    .max(20, 'full name must be at most 20 characters')
    .required('Required'),
    size: Yup.string().required('size is required')
    
})



const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]


export default function Form() {

const getInitialValues = () => ({
 fullName: "", 
  size:"",
  toppings:[],
  agreement: false,
})
const getInitialErrors = () => ({
  fullName: "", 
   size:"",
   toppings:"",
   agreement:"",
 })
 const [values, setValues] = useState(getInitialValues())
 const [errors, setErrors] =useState(getInitialErrors())
 const [serverSuccess, setServerSuccess] = useState()
 const [serverFailure, setServerFailure] = useState()
 const [formEnabled, setFormEnabled] = useState(false)

 useEffect(() =>{
  orderSchema.isValid(values).then(setFormEnabled)
 }, [values])

const handleChange=(e) => {
  const { name, type, value, checked } = e.target
  const id = e.target.id
  console.log(id)
   setValues({
   ...values,
    [id]: e.target.value
   })
   Yup.reach(orderSchema, e.target.id).validate(e.target.value)
   .then(() => {
    setErrors({...errors,[e.target.id]:""})
   })
   .catch(err => {
    setErrors({...errors,[e.target.id]:err.errors[0]})
   })
   }
   const onSubmit = evt => {
    evt.preventDefault()
   
    axios.post('http://localhost:9009/api/order',values)
    .then(res =>{
      setValues(getInitialValues())
      setServerSuccess(res.data.message)
      setServerFailure()
       })
       .catch(err =>{
        setServerFailure(err.response.data.message)
        setServerSuccess(res.data.message)

       }) 
      }

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className='success'>{serverSuccess}</div>}
      {serverFailure && <div className='failure'>{serverFailure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={values.fullName} onChange={handleChange} placeholder="Type full name" id="fullName" type="text" />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" value={values.size} onChange={handleChange}>
            <option value="">----Choose Size----</option>
            {<option value="S">Small</option>}
           { <option value="M">Medium</option>}
            {<option value="L">Large</option>}
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {}
        <label key="1">
          <input
            name="Pepperoni"
            type="checkbox"
            onChange={handleChange}
            checked={values.toppings =='Pepperoni'}
          />
          Pepperoni<br />
        </label >
        <label key="2">
          <input
          name="Green Peppers"
          type="checkbox"
          onChange={handleChange}
          checked={values.toppings == 'Green Peppers'}
          />
          Green Peppers
          </label>
          <label key="3">
            <input
            name="Pineapple"
            type="checkbox"
            onChange={handleChange}
            checked={values.toppings == 'pineapple'}
            />
            Pineapple
        </label>
        <label key="4">
          <input
          name="Mushrooms"
          type="checkbox"
          onChange={handleChange}
          checked={values.toppings == 'Mushrooms'}
          />
          Mushrooms
        </label>
      <label key="5">
          <input
          name="Ham"
          type="checkbox"
          onChange={handleChange}
          checked={values.toppings == 'Ham'}
          />
          Ham
        </label>
        


      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!formEnabled} type="submit"/>
    </form>
  )
}

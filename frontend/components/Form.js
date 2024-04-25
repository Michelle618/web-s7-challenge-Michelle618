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
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('Required'),
    size: Yup.string().required(validationErrors.sizeIncorrect),
    pepperoni:Yup.boolean(),
    greenPeppers:Yup.boolean(),
    pineapple:Yup.boolean(),
    mushrooms:Yup.boolean(),
    ham:Yup.boolean(),
  


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
  pepperoni: false,
  greenPeppers: false,
  pineapple: false,
  mushrooms: false,
  ham: false,
  // agreement: false,
})
const getInitialErrors = () => ({
  fullName: "", 
   size:"",
   toppings:"",
  //  agreement:"",
 })
 const [values, setValues] = useState(getInitialValues())
 const [errors, setErrors] =useState(getInitialErrors())
 const [serverSuccess, setServerSuccess] = useState("")
 const [serverFailure, setServerFailure] = useState("")
 const [formEnabled, setFormEnabled] = useState(false)

 useEffect(() =>{
  orderSchema.isValid(values).then(setFormEnabled)
 }, [values])
 

const handleChange=(e) => {
  let { name, type, value, checked } = e.target
  console.log(name)
   setValues({
   ...values,
   [name]: type === "checkbox" ? checked : value
   })
   Yup.reach(orderSchema, e.target.name).validate(e.target.value)
   .then(() => {
    setErrors({...errors,[e.target.name]:""})
   })
   .catch(err => {
  
    setErrors({...errors,[e.target.name]:err.errors[0]})
   })
   }
   
   const onSubmit = evt => {
    evt.preventDefault()
   
    axios.post('http://localhost:9009/api/order',values)
    .then(res =>{
     
      setValues(getInitialValues())
      // create a variable that is template literal
      // loop over data to find how many are true(variable called count)
      let toppingsCount = 0
      for (const property in values) {
       if(values[property] === true) {
        toppingsCount++
       }
      }
   
  
      // should contain # of toppings as a # this is (the variable count)
      // template literal needs res.data.message
     let orderMessage = `Thank you for your order, ${values.fullName}! Your medium pizza with ${toppingsCount} toppings is on the way.`
      // if count is zero, use res.data.message
     let orderMessages = toppingsCount === 0? res.data.message: orderMessage
     
      // if count is >0, put count in place of 'no'
      // const orderMessage = ``
      setServerSuccess(orderMessages)
      setServerFailure("")
       })
       .catch(err =>{
        setServerFailure(err.response.data.message)
        setServerSuccess("")

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
          <input value={values.fullName} onChange={handleChange} placeholder="Type full name" name='fullName' id="fullName" type="text" />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select name="size" id="size" value={values.size} onChange={handleChange}>
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
            name="pepperoni"
            type="checkbox"
            onChange={handleChange}
            checked={values.name}
          />
          Pepperoni<br />
        </label >
        <label key="2">
          <input
          name="greenPeppers"
          type="checkbox"
          onChange={handleChange}
          checked={values.name}
          />
          Green Peppers
          </label>
          <label key="3">
            <input
            name="pineapple"
            type="checkbox"
            onChange={handleChange}
            checked={values.name}
            />
            Pineapple
        </label>
        <label key="4">
          <input
          name="mushrooms"
          type="checkbox"
          onChange={handleChange}
          checked={values.name}
          />
          Mushrooms
        </label>
      <label key="5">
          <input
          name="ham"
          type="checkbox"
          onChange={handleChange}
          checked={values.name}
          />
          Ham
        </label>
        


      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!formEnabled} type="submit"/>
    </form>
  )
}

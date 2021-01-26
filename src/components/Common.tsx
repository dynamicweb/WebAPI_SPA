import React from 'react'
import { Link } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

export function Spinner() {
  return (
    <div className='d-flex justify-content-center'>
      <BarLoader />
    </div>
  )
}

export function NoProductsFound() {
  return (
    <div>
      <Link to='/'>Back</Link>
      <div>'404'</div>
    </div>
  ) //todo make nicer
}

import React from 'react'
import './ShoppingFilter.scss'

const ShoppingFilter = (props) => {
  const dropdownChangeHandler = (event) => {
    props.onChangeFilter(event.target.value)
  }

  return (
    <div className="filter">
      <select value={props.selected} onChange={dropdownChangeHandler}>
        <option key={Math.random()} value="All">
          All
        </option>

        {props.uniqueCategories.length > 0 &&
          props.uniqueCategories.map((category) => (
            <option key={Math.random()} value={category}>
              {category} {/* Display the category value */}
            </option>
          ))}
      </select>
    </div>
  )
}

export default ShoppingFilter

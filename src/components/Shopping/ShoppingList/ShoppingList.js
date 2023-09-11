import React from 'react'
import ShoppingItem from '../../Shopping/ShoppingItem/ShoppingItem'
import './ShoppingList.scss'

const ShoppingList = (props) => {

  if (props.items.length === 0) {
    return (
      <div className="alert">
        <h2 className="alert__message">Found no shopping data.</h2>
      </div>
    )
  }
  //key={expense.id},
  return (
    <ul className="list">
      {props.items.map((expense) => (
        <ShoppingItem
          key={Math.random()}
          shopItemId={expense.id}
          title={expense.title}
          category={expense.category}
          onDeleteShopping={props.onDeleteShopping}
          onCompleteShopping={props.onCompleteShopping}
          onEditShopping={props.onEditHandler}
          isCompleted={expense.isCompleted}
        />
      ))}
    </ul>
  )
}

export default ShoppingList

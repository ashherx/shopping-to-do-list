import React, { useState } from 'react'
import AddShoppingForm from '../Form/AddShoppingForm/AddShoppingForm'
import Button from '../UI/Button/Button'
import ShoppingFilter from '../Shopping/ShoppingFilter/ShoppingFilter'
import { ReactComponent as AddIcon } from '../../assets/icons/add-plus.svg'
import './NewShoppingItem.scss'
import firebase from '../../firebase'

const NewShoppingItem = (props) => {
  const [isAdding, setIsAdding] = useState(false)
  const [filteredCategory, setFilteredCategory] = useState('All')

  const filterChangeHandler = async (selectedCategory) => {
    await setFilteredCategory(selectedCategory)
    props.onFilterValueChange(selectedCategory)
  }

  const addItemToFirestore = async (shoppingData) => {
    try {
      const itemsCollectionRef = firebase.firestore().collection('items')
      const newItemRef = await itemsCollectionRef.add(shoppingData)

      const shoppingData2 = {
        id: newItemRef.id,
        title: shoppingData.title,
        category: shoppingData.category,
        isCompleted: false,
      }
      props.onAddShopping(shoppingData2)
      setIsAdding(false)
    } catch (error) {
      console.error('Error adding item: ', error)
    }
  }

  const saveShoppingDataHandler = (enteredShoppingData) => {
    const shoppingData = {
      title: enteredShoppingData.title,
      category: enteredShoppingData.category,
      isCompleted: false,
    }
    addItemToFirestore(shoppingData)
  }

  const startAddingHandler = () => {
    setIsAdding(true)
  }

  const stopAddingHandler = () => {
    setIsAdding(false)
  }

  return (
    <div className="new-expense">
      {!isAdding && (
        <Button
          type="button"
          className="button--rounded button__add"
          onClick={startAddingHandler}
        >
          <AddIcon />
        </Button>
      )}

      {isAdding && (
        <AddShoppingForm
          onSaveShoppingData={saveShoppingDataHandler}
          onCancel={stopAddingHandler}
        />
      )}

      <ShoppingFilter
        selected={filteredCategory}
        onChangeFilter={filterChangeHandler}
        uniqueCategories={props.uniqueCategories}
      />
    </div>
  )
}

export default NewShoppingItem

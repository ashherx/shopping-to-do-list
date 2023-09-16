import React, { useEffect, useState } from 'react'
import NewShoppingItem from './components/NewShoppingItem/NewShoppingItem'
import ShoppingBoard from './components/Shopping/ShoppingBoard/ShoppingBoard'
import Background from './components/UI/Background/Background'
import EditShoppingForm from './components/Form/EditShoppingForm/EditShoppingForm'
import ShoppingCounter from './components/Shopping/ShoppingCounter/ShoppingCounter'
import './App.scss'
import firebase from './firebase'

const App = () => {
  const [expenses, setExpenses] = useState([])
  const [filteredCategory, setFilteredCategory] = useState('All')
  const [isExpenseAdded, setIsExpenseAdded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editItemId, setEditItemId] = useState()
  const [filterCategories, setFilterCategories] = useState([])
  const [loading, setLoading] = useState(true)  

  const itemsCollectionRef = firebase.firestore().collection('items')

  async function getItems() {
    try {
      const uniqueCategories = new Set()
      const items = []
      const querySnapshot = await itemsCollectionRef.get()
      const promises = querySnapshot.docs.map(async (itemDoc) => {
        const itemData = itemDoc.data()
        uniqueCategories.add(itemData.category)

        const combinedData = {
          id: itemDoc.id,
          title: itemData.title,
          category: itemData.category,
          isCompleted: itemData.isCompleted,
        }
        items.push(combinedData)
      })
      await Promise.all(promises)
      setExpenses(items)
      setLoading(false)
      setFilterCategories(Array.from(uniqueCategories))
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error fetching data: ', error)
    }
  }

  useEffect(() => {
    async function fetchData() {
      await getItems()
    }
    fetchData()
  }, [])

  const addShoppingHandler = (expense) => {
    setExpenses(
      (prevExpenses) => {
        return [expense, ...prevExpenses]
      },
      [expenses]
    )

    const tempSet = new Set()
    tempSet.add(expense.category)

    expenses.map((e) => {
      tempSet.add(e.category)
    })

    setFilterCategories(Array.from(tempSet))
    setIsExpenseAdded(true)
  }

  const filterItems = (currentCategory) => {
    setFilteredCategory(currentCategory)
  }

  const deleteShoppingHandler = async (id) => {
    const itemRef = itemsCollectionRef.doc(id)
    await itemRef.delete()

    const shoppingList = expenses.filter((item) => {
      return item.id !== id
    })

    if (shoppingList.length === 0) {
      setIsExpenseAdded(false)
    }

    setExpenses(shoppingList)

    if (shoppingList.length > 0) {
      let tempCategory = new Set()
      shoppingList.map((item) => {
        tempCategory.add(item.category)
      })
      setFilterCategories(Array.from(tempCategory))
    }
  }

  const completeShoppingHandler = async (id) => {
    const newExpenseList = [...expenses]

    const itemRef = itemsCollectionRef.doc(id)
    const itemDoc = await itemRef.get()
    const currentIsCompleted = itemDoc.data().isCompleted
    await itemRef.update({ isCompleted: !currentIsCompleted })

    newExpenseList.map((item) => {
      if (item.id === id) {
        item['isCompleted'] = !item['isCompleted']

        return item
      }
      return item
    })

    setExpenses(newExpenseList)
  }

  const editShoppingHandler = (id) => {
    setIsEditing(!isEditing)
    setEditItemId(id)
  }

  const updateItem = async (itemId, newTitle, newCategory) => {
    try {
      const itemRef = itemsCollectionRef.doc(itemId)
      await itemRef.update({
        title: newTitle,
        category: newCategory,
      })
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error updating title and category: ', error)
      throw error
    }
  }

  const onCompleteEdit = async (editedItem) => {
    if (editedItem['title'] === '' || editedItem['category'] === '') {
      setIsEditing(false)
      setEditItemId('')
      return
    }

    const newExpenseList = [...expenses]
    await updateItem(editItemId, editedItem['title'], editedItem['category'])

    newExpenseList.map((item) => {
      if (item.id === editItemId) {
        item['title'] = editedItem['title']
        item['category'] = editedItem['category']
        return item
      }

      return item
    })

    const tempSet = new Set()
    newExpenseList.map((c) => {
      tempSet.add(c.category)
    })
    setFilterCategories(Array.from(tempSet))
    setExpenses(newExpenseList)
    setIsEditing(false)
    setEditItemId('')
  }

  const onCancelEdit = () => {
    setIsEditing(false)
    setEditItemId('')
  }

  return (
    <>
      <Background />

      <div className="app">
        <div className="app__container">
          <NewShoppingItem
            onFilterValueChange={filterItems}
            onAddShopping={addShoppingHandler}
            isExpenseAdded={isExpenseAdded}
            uniqueCategories={filterCategories}
          />

          {isEditing ? (
            <EditShoppingForm
              onCancelEdit={onCancelEdit}
              onCompleteEdit={onCompleteEdit}
              id={editItemId}
            />
          ) : (
            ''
          )}

          <ShoppingBoard
            onCompleteShopping={completeShoppingHandler}
            onEditHandler={editShoppingHandler}
            onDeleteShopping={deleteShoppingHandler}
            items={expenses}
            currentCategory={filteredCategory}
            isLoading={loading}
          />

          <ShoppingCounter
            items={
              filteredCategory === 'All'
                ? expenses
                : expenses.filter((item) => item.category === filteredCategory)
            }
          />
        </div>
      </div>
    </>
  )
}

export default App

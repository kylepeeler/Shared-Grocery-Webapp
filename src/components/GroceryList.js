import React, { useState, useReducer } from "react"
import { Box, Paragraph, Heading, Input, Flex, Button, styled } from "reakit"
import { theme } from "styled-tools"
import posed, { PoseGroup } from "react-pose"

const TitleInput = styled(Input)`
  font-weight: bold;
  font-size: ${theme("fontSize.3")};
  margin-bottom: 0.5em;
`

const Item = styled(Flex)`
  padding: 0.5em 0em;
  padding-right: 1em;
`

const PosedItem = posed.div({
  before: { opacity: 0, paddingLeft: 0 },
  enter: { opacity: 1, paddingLeft: 50 },
  exit: { opacity: 0, paddingLeft: 500 },
})

const ItemName = styled(Heading)`
  cursor: pointer;
  display: inline-block;
  padding: 0.5em 0;
`

const Strike = styled.span`
  display: inline-block;
  text-decoration: line-through;
  position: relative;
  left: -19px;
  &:before,
  &:after {
    content: "\00a0\00a0\00a0\00a0";
  }
`

const ListItem = ({ itemName, done, dispatch, index }) => (
  <Item justifyContent="space-between">
    <ItemName as="span" onClick={() => dispatch({ type: "toggleDone", index })}>
      {done ? <Strike>{itemName}</Strike> : itemName}
    </ItemName>
    <Button opaque={false} onClick={() => dispatch({ type: "remove", index })}>
      ❌
    </Button>
  </Item>
)

const NewItem = ({ dispatch }) => {
  // useState to keep the state of the item
  const [itemName, setItem] = useState("")

  const addItem = () => {
    dispatch({ type: "addItem", itemName })
    setItem("")
  }

  return (
    <Flex>
      <Input
        value={itemName}
        onChange={event => setItem(event.target.value)}
        onKeyPress={({ key }) => (key === "Enter" ? addItem() : null)}
        placeholder="What do you need to buy? 🤑"
      />
      <Button onClick={addItem}>Add</Button>
    </Flex>
  )
}

function reducer(state, action) {
  const index = action.index
  switch (action.type) {
    case "addItem":
      return [
        ...state,
        {
          itemName: action.itemName,
          key: new Date().toISOString(),
        },
      ]
    case "toggleDone":
      return [
        ...state.slice(0, index),
        {
          ...state[index],
          done: !state[index].done,
        },
        ...state.slice(index + 1),
      ]
    case "remove":
      return [...state.slice(0, index), ...state.slice(index + 1)]
    default:
      throw Error("Unknown action")
  }
}

const GroceryList = ({ listId, initialState }) => {
  const [listName, setListName] = useState(initialState.listName)
  const [groceries, dispatch] = useReducer(reducer, initialState.groceries)

  return (
    <Box>
      <TitleInput value="Workshop Party" placeholder="Give your list a name" />
      {!groceries.length && <p>You should add some grocery items!</p>}
      {groceries.map((groceryItem, index) => (
        <ListItem
          {...groceryItem}
          index={index}
          key={groceryItem.key}
          dispatch={dispatch}
        />
      ))}
      <NewItem dispatch={dispatch} />
    </Box>
  )
}

export default GroceryList

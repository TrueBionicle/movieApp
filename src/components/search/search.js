import React from 'react'
import './search.css'
import { debounce } from 'lodash'

export default class Search extends React.Component {
  state = {
    label: '',
  }

  render() {
    const { onSearch, context } = this.props
    return (
      <input
        type="text"
        className="search"
        placeholder="Type to search ..."
        onChange={debounce((e) => {
          onSearch(context, e.target.value, 1)
        }, 1000)}
      ></input>
    )
  }
}

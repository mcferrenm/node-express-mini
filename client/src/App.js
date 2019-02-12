import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = "http://localhost:4000"

class App extends Component {
  state = {
    users: [],
    userInputs: {
      name: '',
      bio: ''
    },
    isLoading: false,
    error: ''
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    axios.get(`${BASE_URL}/api/users`)
      .then(res => this.setState({
        users: res.data,
        isLoading: false
      }))
      .catch(err => this.setState({ error: err, isLoading: false }))
  }

  handleChange = e => {
    e.persist();
    this.setState(prevState => ({
      userInputs: {
        ...prevState.userInputs,
        [e.target.name]: e.target.value
      }
    }));
  };

  handleAddUser = () => {

    axios.post(`${BASE_URL}/api/users`, this.state.userInputs)
      .then(res => {
        this.setState(prevState => ({
          users: [...prevState.users, res.data]
        }))
      })
      .catch(err => console.log(err));
  }

  handleDeleteUser = (id) => {
    const users = this.state.users.filter(user => user.id !== id);

    axios.delete(`${BASE_URL}/api/users/${id}`)
      .then(res => this.setState(prevState => ({
        users
      })))
      .catch(err => console.log(err))
  }

  render() {
    const { isLoading, error, userInputs: { name, bio } } = this.state;
    if (isLoading) {
      return <p>Loading...</p>
    }
    if (error) {
      return <p>{error}</p>
    }

    return (
      <div className="App">
        <input onChange={this.handleChange} type="text" name="name" value={name} />
        <input onChange={this.handleChange} type="text" name="bio" value={bio} />
        <button onClick={this.handleAddUser}>Add user</button>
        {this.state.users.map(({ name, bio, id }) =>
          <div key={id} onClick={() => this.handleDeleteUser(id)}>
            <p>{name}</p>
            <p>{bio}</p>
          </div>
        )}
      </div>
    );
  }
}

export default App;

import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sentence: ""
    };

    this.saveSentence = this.saveSentence.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  saveSentence(event) {
    event.preventDefault();

    fetch("/.netlify/functions/saveSentence", {
      body: JSON.stringify({
        content: this.state.sentence
      }),
      method: 'POST'
    })
      .then(response => response.json())
      .then(response => {
        console.log('API response:', response);
        this.setState({sentence: ""});
      })
  };

  handleChange(event) {
    this.setState({sentence: event.target.value});
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.saveSentence}>
          <input type="text" value={this.state.sentence} onChange={this.handleChange} />
          <input type="submit" value="Save Sentence" />
        </form>
      </div>
    )
  };
}

export default App;

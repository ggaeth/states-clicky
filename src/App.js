import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Item from './components/Item';
import Footer from './components/Footer';
import states from "./states.json";
import './App.css';

class App extends Component {
  // Setting the initial state of the App component
  constructor(){
    super()

    this.handleShuffleChararcters = this.handleShuffleChararcters.bind(this)
  }

  state = {
    score: 0,
    topScore: 0,
    maxScore: 12,
    message: "Click an image to begin!",
    messageClass: "",
    states: states
  };

  shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleCorrectSelection = () => {
    
    if (this.state.score+1 > this.state.topScore) {
      this.setState({topScore: this.state.topScore+1})
    }
    if (this.state.score+1 === this.state.maxScore) {
      this.setState({score: this.state.score+1, message: "Congrats! You win!", messageClass:"correct"})
    }else{
      this.setState({score: this.state.score+1, message: "You guessed correctly!", messageClass:"correct"})
    }
  }

  handleResetWin = (currentStates) => {
    //if current score is at max reset score to 0 and topscore to 0
    if (this.state.score+1 === this.state.maxScore) {
      this.setState({score: 0, topScore: 0})
      //reset clicked state for states
      const updatedStates = currentStates.map(ch => (true) ? { ...ch, isClicked: false } : ch)
      return updatedStates
    }else{
      return currentStates
    }
  }

  handleIncorrectSelection = () => {
    //incorrect selection made, reset score to 0
    this.setState({score: 0, message: "You guessed incorrectly!"})
    //reset clicked state for states
    const updatedStates = this.state.states.map(ch => ch.isClicked === true ? { ...ch, isClicked: false } : ch)
    return updatedStates
  }


  handleShuffleChararcters = (name) => {
    // this.handleResetWin();
    var resetNeeded = false;
    const states = this.state.states.map(ch => {
      //ch.name === name ? { ...ch, isClicked: true } : ch
      if(ch.name === name) {
        if (ch.isClicked === false) {
          this.handleCorrectSelection()
          return { ...ch, isClicked: true}
        }else{
          resetNeeded = true
          return { ...ch, isClicked: false}
        }
      }
      return ch
    })

    if (resetNeeded) {
      this.setState({
        states: this.shuffle(this.handleIncorrectSelection()),
        messageClass:"incorrect"
      })
      
    }else{
      //check if game is won before rendering states
      this.setState({ states: this.shuffle(this.handleResetWin(states)) })
    }
    
  }

  handleRenderStates = () => {
    return this.state.states.map((character) =>
            <Item 
              image={character.image} 
              name={character.name} 
              key={character.id} 
              onClick={this.handleShuffleChararcters} 
            />
          );
  }

  render() {
    return (
      <div className="App">
        <Navbar
          score={this.state.score}
          topscore={this.state.topScore}
          message={this.state.message}
          messageClass={this.state.messageClass}
        />
        <Header />
        <div className="content">
          {this.handleRenderStates()}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;

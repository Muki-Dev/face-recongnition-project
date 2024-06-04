import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';



const app = new Clarifai.App({
 apiKey: '7f59a4752aef4e4186262e574dcd0390'
});

class App extends Component{
  constructor(){
    super()
    this.state = {
      input: ''
    }
  }

  onInputChange =  (event) => {
    console.log(event.target.value);
  }

  onButtonSubmit = () => {
    console.log('click');

    app.models.predict('face-detection','https://samples.clarifai.com/metro-north.jpg').then(
        function(response){
            console.log(response);
        },
        function(err){

        }
      );

  }
  render(){
    return(
      <div className='App'>
          <ParticlesBg type="fountains" bg={true} />
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit} 
          />
      </div>
       
      )
    
  }
}

export default App;
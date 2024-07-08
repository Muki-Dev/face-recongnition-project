import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
// import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';


// You must add your own key from clarifai
// const app = new Clarifai.App({
//  apiKey: 'YOUR_KEY'
// });

 const returnClarifaiRequestOptions = (imageUrl) => {
    
    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = 'YOUR_PAT_KEY';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 't6u13lb9e7m7';       
    const APP_ID = 'test';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';   
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    return requestOptions;
 }

 const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user:{
    id:'',
    name:'',
    email:'',
    entries: 0,
    joined:''
  }
}

class App extends Component{
  constructor(){
    super()
    this.state = initialState;
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('imageInput');
    const width = Number(image.width);
    const height= Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

displayFaceBox = (box) => {
  this.setState({box:box});
}

  onInputChange =  (event) => {
    this.setState({input:event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)

    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' +"/outputs", returnClarifaiRequestOptions(this.state.input))
        .then(response => response.json())
        .then(response => {
          if(response){
            fetch('http://localhost:3000/image',{
            method: 'put',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
      if(route === 'signout'){
        this.setState(initialState)
      }else if(route === 'home'){
        this.setState({isSignedIn: true})
      }
      this.setState({route: route})
    }

    loadUser = (data) => {
      this.setState({user: {
        id:data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }})
    }

  render(){

    const { route,isSignedIn,box,imageUrl }  = this.state;
    return(
      <div className='App'>
          <ParticlesBg type="circle" bg={true} />
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
          { route === 'home'
            ? <div>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries} />
                <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onPictureSubmit={this.onPictureSubmit} 
                />
                <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
            :(
                route === 'signin' ?  <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

              )
            
            
          }
          
      </div>
       
      )
    
  }
}

export default App;
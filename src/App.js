import React, { Component } from 'react';
import './App.css';
import ListGroup from 'react-bootstrap/lib/ListGroup'
import Accordion from 'react-bootstrap/lib/Accordion'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import Modal from 'react-bootstrap/lib/Modal'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'

class Content extends Component {

state = {
  recipes : [],
  showAdd : false,
  showEdit : false,
  newestRecipe : {recipeName : "", Ingredients : []},
  currentIndex : 0,
}


//Open a given Modal
open(state, currentIndex) {
  this.setState({[state] : true});
  this.setState({currentIndex});
  // console.log(currentIndex);
}

//Close Modals
close = () => {
  if (this.state.showAdd) {
    this.setState({showAdd : false});
  }
  if (this.state.showEdit) {
    this.setState({showEdit : false});
  }
}

//Update the newest recipe
updateNewestRecipe(recipeName, Ingredients) {
  this.setState({newestRecipe : {recipeName : recipeName, Ingredients : Ingredients}});
}

//Save the new recipe and clear the newest recipe
saveNewestRecipe() {
  this.state.recipes.push(this.state.newestRecipe);
  this.setState({newestRecipe : {recipeName : "", Ingredients : []}});
  this.close();
}

//Delete the selected recipe
deleteRecipe(index) {
  let recipes = this.state.recipes.slice();
  recipes.splice(index,1);
  localStorage.setItem("recipes",JSON.stringify(recipes));
  this.setState({recipes});
}

//Update given recipe's name
updateExistingRecipeName(recipeName, currentIndex) {
  let recipes = this.state.recipes.slice();
  recipes[currentIndex] = {recipeName : recipeName, Ingredients : recipes[currentIndex].Ingredients};
  localStorage.setItem("recipes",JSON.stringify(recipes));
  this.setState({recipes});
  // console.log("recipes Name = " + this.state.recipes[currentIndex].recipeName);
  // console.log("ingredients = " + this.state.recipes[currentIndex].Ingredients);
}

//Update existing recipe's ingredients
updateExistingRecipeIngredients(Ingredients, currentIndex) {
  let recipes = this.state.recipes.slice();
  recipes[currentIndex] = {recipeName : recipes[currentIndex].recipeName, Ingredients : Ingredients};
  localStorage.setItem("recipes",JSON.stringify(recipes));
  this.setState({recipes});
  // console.log("recipes Name = " + this.state.recipes[currentIndex].recipeName);
  // console.log("ingredients = " + this.state.recipes[currentIndex].Ingredients);
}

componentDidMount() {
  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  this.setState({recipes});
}

  render() {
    const {recipes, recipeName, Ingredients, showEdit, showAdd, newestRecipe, currentIndex} = this.state;

    return (
      <div className = "App container">
        {recipes.length > 0 && (
        <div>
        <Accordion>
        {recipes.map((recipe, index) => (
          <Panel header = {recipe.recipeName} eventKey = {index} key = {index}>
            {recipe.Ingredients.map((item) => (
              <ListGroupItem key = {item}>{item}</ListGroupItem>
            ))
            }
            <ButtonToolbar className = "editDeleteButtons">
            <Button bsStyle = "danger" onClick = {(event) => this.deleteRecipe(index)}>Delete</Button>
            <Button bsStyle = "default"onClick = {(event) => this.open("showEdit", index)}>Edit</Button>
            </ButtonToolbar>
          </Panel>
        ))
        }
        </Accordion>
        
        {/* Create edit Modal */}
        <Modal show = {showEdit} onHide = {this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId = "formBasicText">
              <ControlLabel>Ingredients</ControlLabel>
              <FormControl
                type = "text"
                value = {recipes[currentIndex].recipeName}
                placeholder = "ex : Spaghetti Bolognese"
                onChange = {(event) => this.updateExistingRecipeName(event.target.value, currentIndex)}>
              </FormControl>
              </FormGroup>
              <FormGroup controlId = "formControlTextarea">
              <ControlLabel>Ingredients</ControlLabel>
              <FormControl
                type = "textarea"
                value = {recipes[currentIndex].Ingredients}
                placeholder = "Separate,Ingredients,By commas (ex : Spaghetti,Meat,Tomato Sauce,Cheese)"
                onChange = {(event) => this.updateExistingRecipeIngredients(event.target.value.split(","), currentIndex)}>
              </FormControl>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick = {(event) => this.close()}>Save & Close</Button>
          </Modal.Footer>
        </Modal>
        </div>
        )}

        {/* Create the Add-Recipe Modal */}
          <Modal show = {showAdd} onHide = {this.close}>
            <Modal.Header closeButton>
              <Modal.Title>Add Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup controlId = "formBasicText">
                <ControlLabel>Recipe Name</ControlLabel>
                <FormControl
                  type = "text"
                  value = {newestRecipe.recipeName}
                  placeholder = "ex : Spaghetti Bolognese"
                  onChange = {(event) => this.updateNewestRecipe(event.target.value, newestRecipe.Ingredients)}
                ></FormControl>
                </FormGroup>
                <FormGroup controlId = "formControlTextarea">
                <ControlLabel>Ingredients</ControlLabel>
                <FormControl
                  type = "text"
                  value = {newestRecipe.Ingredients}
                  placeholder = "Separate,Ingredients,By commas (ex : Spaghetti,Meat,Tomato Sauce,Cheese)"
                  onChange = {(event) => this.updateNewestRecipe(newestRecipe.recipeName, event.target.value.split(","))}
                ></FormControl>
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle = "primary" onClick = {(event) => this.saveNewestRecipe()}>Add to list</Button>
            </Modal.Footer>
          </Modal>

        <Button bsStyle = "primary" onClick = {(event) => this.open("showAdd", currentIndex)}>Add Recipe</Button>
      </div>
    );
  }
}

class Title extends Component {
  render() {
    return (
      <div>
        <div className = "container pageTitle">Malo's recipe box</div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Title/>
        <Content/>
      </div>
    );
  }
}

export default App;

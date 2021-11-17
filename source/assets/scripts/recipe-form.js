function init() {
    //Add event listener for "Add Ingredient" Button Press
    const add_ingredient_button = document.querySelector("#add-ingredient");
    add_ingredient_button.addEventListener("click", add_ingredient);

    //Add event listener for "Remove Ingredient" Button Press
    const remove_ingr_button = document.querySelector("#remove-ingredient");
    remove_ingr_button.addEventListener("click", remove_ingredient);

    //Add event listneer for "Add Step" Button Press
    const add_step_button = document.querySelector("#add-step");
    add_step_button.addEventListener("click", add_step);

    //Add event listener for "Remove Step" Button Press
    const remove_step_button = document.querySelector("#remove-step");
    remove_step_button.addEventListener("click", remove_step);

    //Add event listener for Submitting the Form
    const form_submitted = document.querySelector("#recipeForm");
    form_submitted.addEventListener("submit", buildJSON);
}

window.addEventListener("DOMContentLoaded", init);

/**
 *  Function to build the JSON from the HTML form data.
 *  @param {event} event - The event that the event listener returns.
 */
function buildJSON(event) {
    //prevent submit button from refreshing the page.
    event.preventDefault();
    console.log("building JSON");
    
    //Query select all the "input" elements within #recipeForm, make an array out of it  
    // in order to run reduce on it
    const recipeInput = Array.from(document.querySelectorAll("#recipeForm input"));
   
    //Take all the inputs and make it a key value pair
    const formattedInputs  = recipeInput.reduce((acc,input) => ({...acc,[input.id]: input.value}), {});
    console.log(formattedInputs);

    //Take all the "textarea" elements within #recipeFor, repeat the above steps
    const recipeTextArea = Array.from(document.querySelectorAll("#recipeForm textarea"));
    const formattedTextArea = recipeTextArea.reduce((acc,textarea) => 
        ({...acc,[textarea.id]: textarea.value}), {});
    console.log(formattedTextArea);
    
}    




/**
 *  Function to append a new input to the Ingredients part of the form.
 *  On button click, a new Ingredient form will appear along with its
 *  corresponding input fields.
 */
function add_ingredient() {
    //Create HTML elements
    const newField = document.createElement("div");
    const newIngredient = document.createElement("input");
    const newQuantity = document.createElement("input");

    //Populate Input Fields
    newIngredient.type = "text";
    newQuantity.type = "text";

    //set classes
    newIngredient.className = "ingredient";
    newQuantity.className = "quantity";

    //Append to HTML doc
    newField.appendChild(newIngredient);
    newField.appendChild(newQuantity);
    document.querySelector(".ingredients-field").appendChild(newField);
}

/**
 * Just removes the last element (bottom-most) from the Ingredients input
 * fields. You can remove any of the HTML elements added but not the first one.
 */
function remove_ingredient() {

    //Return without doing anything if there is only one element
    if (document.querySelector(".ingredients-field").childElementCount === 1) {
        return;
    }

    let remove = document.querySelector(".ingredients-field");
    remove.removeChild(remove.lastChild);
}

/**
 * Dynamically adds additional steps to the HTML document.
 */
function add_step() {
    //Create HTML elements
    const newField = document.createElement("div");
    const label = document.createElement("label");
    const newStep = document.createElement("textarea");
    const parentDiv = document.querySelector(".recipe-steps");

    //Set the step label to be the number of "steps" fields there will be.
    label.textContent = (parentDiv.childElementCount + 1) + ".";

    //Adjust some basic styles for  the textarea element
    newStep.style.height = "70px";
    newStep.style.width = "300px";
    newStep.style.verticalAlign = "middle";

    //Append HTMl elements to DOM
    newField.appendChild(label);
    newField.appendChild(newStep);
    document.querySelector(".recipe-steps").appendChild(newField);
}

/**
 * Just removes the last element (bottom-most) from the Steps input fields.
 * You can remove any of the HTML elements added but not the first one.
 */
function remove_step() {
    //Return without doing anything if there is only one element
    if (document.querySelector(".recipe-steps").childElementCount === 1) {
        return;
    }

    let remove = document.querySelector(".recipe-steps");
    remove.removeChild(remove.lastChild);
}
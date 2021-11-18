/**
 * Initialization for buttons.
 */
function init() {
  // Add event listener for "Add Ingredient" Button Press
  const addIngredientButton = document.querySelector('#add-ingredient');
  addIngredientButton.addEventListener('click', addIngredient);

  const removeIngrButton = document.querySelector('#remove-ingredient');
  removeIngrButton.addEventListener('click', removeIngredient);

  const addStepButton = document.querySelector('#add-step');
  addStepButton.addEventListener('click', addStep);

  const removeStepButton = document.querySelector('#remove-step');
  removeStepButton.addEventListener('click', removeStep);
}
window.addEventListener('DOMContentLoaded', init);


/**
 *  Function to append a new input to the Ingredients part of the form.
 *  On button click, a new Ingredient form will appear along with its
 *  corresponding input fields.
 */
function addIngredient() {
  // Create HTML elements
  const newField = document.createElement('div');
  const newIngredient = document.createElement('input');
  const newQuantity = document.createElement('input');

  // Populate Input Fields
  newIngredient.type = 'text';
  newQuantity.type = 'text';

  // set classes
  newIngredient.className = 'ingredient';
  newQuantity.className = 'quantity';

  // Append to HTML doc
  newField.appendChild(newIngredient);
  newField.appendChild(newQuantity);
  document.querySelector('.ingredients-field').appendChild(newField);
}

/**
 * Just removes the last element (bottom-most) from the Ingredients input
 * fields. You can remove any of the HTML elements added but not the first one.
 */
function removeIngredient() {
  // Return without doing anything if there is only one element
  if (document.querySelector('.ingredients-field').childElementCount === 1) {
    return;
  }

  const remove = document.querySelector('.ingredients-field');
  remove.removeChild(remove.lastChild);
}

/**
 * Dynamically adds additional steps to the HTML document.
 */
function addStep() {
  // Create HTML elements
  const newField = document.createElement('div');
  const label = document.createElement('label');
  const newStep = document.createElement('textarea');
  const parentDiv = document.querySelector('.recipe-steps');

  // Set the step label to be the number of "steps" fields there will be.
  label.textContent = (parentDiv.childElementCount + 1) + '.';

  // Adjust some basic styles for  the textarea element
  newStep.style.height = '70px';
  newStep.style.width = '300px';
  newStep.style.verticalAlign = 'middle';

  // Append HTMl elements to DOM
  newField.appendChild(label);
  newField.appendChild(newStep);
  document.querySelector('.recipe-steps').appendChild(newField);
}

/**
 * Just removes the last element (bottom-most) from the Steps input fields.
 * You can remove any of the HTML elements added but not the first one.
 */
function removeStep() {
  // Return without doing anything if there is only one element
  if (document.querySelector('.recipe-steps').childElementCount === 1) {
    return;
  }

  const remove = document.querySelector('.recipe-steps');
  remove.removeChild(remove.lastChild);
}

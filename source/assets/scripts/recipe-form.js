window.addEventListener('DOMContentLoaded', init);


function init() {
    //Add event listener for "Add Ingredient" Button Press
    const add_ingredient_button = document.querySelector('#add_ingredient');
    add_ingredient_button.addEventListener('click',add_ingredient);

    const remove_ingredient_button = document.querySelector('#remove_ingredient');
    remove_ingredient_button.addEventListener('click',remove_ingredient);
}


/* 
 *  Function to append a new input to the Ingredients part of the form.
 *  On button click, a new Ingredient form will appear along with its
 *  corresponding input fields.
 */ 
function add_ingredient() {
    //Create HTML elements
    const newField = document.createElement('div');
    const newInput = document.createElement('input');

    //Populate Input Fields
    newInput.type = 'text';

    //Append to HTML doc
    newField.appendChild(newInput);
    document.querySelector('.ingredients_field').appendChild(newField);
}

function remove_ingredient() {
    let remove = document.querySelector('.ingredients_field')
    remove.removeChild(remove.lastChild);
}
  
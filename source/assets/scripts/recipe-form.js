/**
 * Function that runs when DOM COntent is loaded
 */
function init() {
  // Add event listener for "Add Ingredient" Button Press
  const addIngredientButton = document.querySelector('#add-ingredient');
  addIngredientButton.addEventListener('click', addIngredient);

  // Add event listener for "Remove Ingredient" Button Press
  const removeIngrButton = document.querySelector('#remove-ingredient');
  removeIngrButton.addEventListener('click', removeIngredient);

  // Add event listener for "Add Step" Button Press
  const addStepButton = document.querySelector('#add-step');
  addStepButton.addEventListener('click', addStep);

  // Add event listener for "Remove Step" Button Press
  const removeStepButton = document.querySelector('#remove-step');
  removeStepButton.addEventListener('click', removeStep);

  // Add event listener for Submitting the Form
  const formSubmitted = document.querySelector('#recipeForm');
  formSubmitted.addEventListener('submit', buildJSON);

  // Add event listener for adding the tag
  const buttonTag = document.querySelector('#add-tag');
  buttonTag.addEventListener('click', addTag);

  // Add event listener for "Cancel" Button Press
  const cancelRecipeButton = document.querySelector('#cancel');
  cancelRecipeButton.addEventListener('click', cancelRecipe);
}

window.addEventListener('DOMContentLoaded', init);

/**
 *  Function to build the JSON from the HTML form data.
 *  @param {event} event - The "submit" event that the event listener returns.
 */
async function buildJSON(event) {
  // prevent submit button from refreshing the page.
  event.preventDefault();
  // console.log('building JSON');

  // Query select all the "input" elements within .ingredients-field
  // make an array order to run reduce on it and scrape out
  // the necessary data.
  const allInputs = document.querySelectorAll('.ingredients-field input');
  const recipeInput = Array.from(allInputs);

  // Take all the inputs and make it a key value pair, scrape data
  // Then build an array of strings with the ingredients as the entries.
  const formattedIngredients = recipeInput.reduce((acc, input) =>
    ({...acc, [input.id]: input.value}), {});
  const ingredientArray = [];
  for (const currIngred in formattedIngredients) {
    if (formattedIngredients[currIngred]) {
      ingredientArray.push(formattedIngredients[currIngred]);
    }
  }

  // Take all the "textarea" elements within .recipeSteps scrape data
  // Then build a string int he format that the JSON schema expects
  const allTextAreas = document.querySelectorAll('.recipe-steps textarea');
  const recipeTextArea = Array.from(allTextAreas);
  const formattedSteps = recipeTextArea.reduce((acc, textarea) =>
    ({...acc, [textarea.id]: textarea.value}), {});
  const stepString = [];
  for (const currStep in formattedSteps) {
    if (formattedSteps[currStep]) {
      stepString.push(formattedSteps[currStep]);
    }
  }


  // convert cooktime to ISO 8601 Duration format
  const numHours = document.querySelector('#num-hours').value;
  const numMinutes = document.querySelector('#num-minutes').value * 5;
  let cookTime;
  if (numHours == 0 && numMinutes != 0) {
    cookTime = 'PT' + numMinutes + 'M';
  } else if (numHours != 0 && numMinutes == 0) {
    cookTime = 'PT' + numHours + 'H';
  } else if (numHours == 0 && numMinutes == 0) {
    alert('Cook Time cannot be Blank!');
  } else {
    cookTime = 'PT' + numHours + 'H' + numMinutes + 'M';
  }

  // Get the image, serverside implementation needed
  const recipeImage = document.querySelector('#recipe-image');

  // If user has not uploaded in recipes throw alert.
  if (!recipeImage.files[0]) {
    alert('Please upload an image of your recipe');
  }

  // Retrieve all the tags selected
  const tags = document.querySelectorAll('#selected-tags div');
  const tagArray = [];
  for (let i = 0; i < tags.length; i++) {
    tagArray.push(tags[i].textContent.slice(0, -1));
  }


  // Start building JSON string first from object, fill out the form values.
  const object = {};
  object.name = document.querySelector('#recipe-title').value;
  object.author = document.querySelector('#author').value;
  object.description = document.querySelector('#description').value;
  object.datePublished = new Date();
  object.cookTime = cookTime;
  object.recipeIngredient = ingredientArray;
  object.recipeInstructions = stepString;
  object.tags = tagArray;

  const userID = firebase.auth().currentUser.uid;

  // Upload image to server, once that process is complete (async),
  // write the object to database
  const uniqueImageName = Date.now().toString();
  const ref = storage.ref().child(`images/${userID}-${uniqueImageName}`);
  const uploadTask = ref.put(recipeImage.files[0]);
  uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
        console.log(progress + '% done');
      },
      (error) => {
        console.error('Error uploading image: ' + error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('Successfully uploaded image at: ' + downloadURL);

          // once the image is uploaded, we retrieve the download URL
          // and attach it to the object, then push object to DB
          object.imageURL = downloadURL;
          createRecipe(object);
          alert('Succesfully Uploaded Recipe!');
        });
      },
  );

  // Use JSON stringify to create json string from object for debug purposes
  // const jsonString = JSON.stringify(object);
  // console.log(jsonString);
}
/**
 * Function to remove a tag when the corresponding button is clicked
 */
function deleteTag() {
  const parent = this.parentNode; // eslint-disable-line no-invalid-this
  const grandParent = parent.parentNode;
  grandParent.removeChild(parent);
}
/**
 * Function to allow the user to use a multiple select and select multiple
 * tags for their recipes. The multiselect prohibits the default tag
 * "select tags" from being selected. It also will prohibit duplicate tags
 * It will add the tag as a <div> with a button that is linked to it.
 * This button is linked to deleteTag so it will remove the tag onclick.
 */
function addTag() {
  const tagsDiv = document.querySelector('#selected-tags');
  const itemList = document.getElementById('tags');
  const collection = itemList.selectedOptions;
  for (let i = 0; i < collection.length; i++) {
    const currLabel = collection[i].label;

    // shouldn't add the "select tags: option" or any tags already added
    if (currLabel != 'Select Tags:') {
      // prevent duplicate
      const tags = document.querySelectorAll('#selected-tags div');
      if (tags.length) {
        // search through div to make sure no dupilcates are added
        for (let j = 0; j < tags.length; j++) {
          const divLabel = tags[j].textContent.slice(0, -1);
          if (currLabel == divLabel) {
            // remove old elements
            tags[j].remove();
          }
        }
      }
      // add elements also add a button to remove
      // the tag.
      const newTag = document.createElement('div');
      const newButton = document.createElement('button');
      newButton.type = 'button';
      newButton.onclick = deleteTag;
      newButton.textContent = 'x';
      newTag.textContent = currLabel;
      newTag.appendChild(newButton);
      tagsDiv.appendChild(newTag);
    }
  }
}

/**
 *  Function to append a new input to the Ingredients part of the form.
 *  On button click, a new Ingredient form will appear along with its
 *  corresponding input fields.
 */
function addIngredient() {
  // Create HTML elements
  const newField = document.createElement('div');
  const newIngredient = document.createElement('input');

  // Populate Input Fields
  newIngredient.type = 'text';

  // set classes
  newIngredient.className = 'ingredient';


  // set unique id's, the name of the ingredient is ingredient
  // + number of children the parent div will
  // have after these elements are added.
  const idNum = document.querySelector('.ingredients-field').childElementCount +
    1;
  newIngredient.id = 'ingredient' + idNum;


  // Append to HTML doc
  newField.appendChild(newIngredient);
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
  // newStep.style.height = '70px';
  // newStep.style.width = '300px';
  // newStep.style.verticalAlign = 'middle';

  // Add unique id's to the textareas, the id is "step" and the step number
  const idNum = document.querySelector('.recipe-steps').childElementCount + 1;
  newStep.id = 'step' + idNum;

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

/**
 * Returns to home page when 'cancel' button is pressed.
 */
function cancelRecipe() {
  window.location.href = 'home-page.html';
}

/**
 * If user is logged in navigate to my page
 * Otherwise, navigate to login page.
 */
function navigateMyPage() { // eslint-disable-line no-unused-vars
  if (firebase.auth().currentUser) {
    window.location.href = 'person.html';
  } else {
    window.location.href = 'login.html';
  }
}

/**
 * If user is logged in navigate to create new recipe page.
 * Otherwise, navigate to login page.
 */
function navigateCreateNewRecipe() { // eslint-disable-line no-unused-vars
  if (firebase.auth().currentUser) {
    window.location.href = 'new-recipe.html';
  } else {
    window.location.href = 'login.html';
  }
}



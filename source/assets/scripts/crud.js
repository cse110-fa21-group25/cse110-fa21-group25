export { uploadImage };

const db = firebase.firestore();
const storage = firebase.storage();

/**
 * CREATE/UPDATE/DELETE: only works when user is logged in
 * GET: works regardless of authentication
 */

/**
 * upload an image to firebase storage
 * @param {string} name the name to store the image under
 * @param {File} file the image file
 * @returns {Promise} promise resolves to URL of uploaded image
 */
function uploadImage(name, file) {
  let ref = storage.ref().child(`images/${name}-${file.name}`);
  let uploadTask = ref.put(file);
  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(progress + '% done');
    },
    (error) => {
      console.error('Error uploading image: ' + error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
       console.log('Successfully uploaded image at: ' + downloadURL);
      });
    }
  );
  return ref.getDownloadURL();
}

/**
 * delete an image from firebase storage 
 * @param {string} imageURL the downloaded url of the image
 */
function deleteImage(imageURL) {
  let ref = storage.refFromURL(imageURL);
  ref.delete().then(() => {
    console.log('File deleted');
  }).catch((err) => {
    console.error('Error deleting image: ' + err);
  });
}

/**
 * function retrieves all of the existing recipes
 * @return {Promise} a promise for all of the recipe
 */
function getAllRecipes() { // eslint-disable-line no-unused-vars
  return db.collection('recipes').get().then((querySnapshot) => {
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({id: doc.id, data: doc.data()});
    });
    return results;
  });
}

/**
 * function takes in a recipe ID and searches the database for an
 * existing recipe
 * @param {string} recipeId the document id
 * @return {Promise} a promise for the specific recipe
 */
function getRecipeById(recipeId) { // eslint-disable-line no-unused-vars
  return db.collection('recipes').doc(recipeId).get().then((querySnapshot) => {
    return {id: querySnapshot.id, data: querySnapshot.data()};
  });
}

/**
 * function that gets recipes based on name of recipe
 * @param {string} title name of recipe
 * @return {Promise} a promise for all the recipes containing the given title
 */
function getRecipesByTitle(title) { // eslint-disable-line no-unused-vars
  return db.collection('recipes').get().then((querySnapshot) => {
    const results = [];
    querySnapshot.forEach((doc) => {
      const resultTitle = doc.data().title;
      if (resultTitle.toLowerCase().includes(title.toLowerCase())) {
        results.push({id: doc.id, data: doc.data()});
      }
    });
    return results;
  });
}

/**
 * function that gets recipes based on tags
 * @param {string} tag tags associated with recipe
 * @return {Promise} a promise for all the recipes containing tags
 */
function getRecipesByTag(tag) { // eslint-disable-line no-unused-vars
  return db.collection('recipes')
      .where('tags', 'array-contains', tag)
      .get().then((querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({id: doc.id, data: doc.data()});
        });
        return results;
      });
}

/**
 * function creates a new recipe in the firestore database
 * @param {object} recipeData the recipe document
 * @return {Promise} a promise for the creation of the given recipe
 */
function createRecipe(recipeData) { // eslint-disable-line no-unused-vars
  return db.collection('recipes').doc().set(recipeData)
      .then(() => {
        return console.log('Document successfully written!');
      })
      .catch((error) => {
        console.error('Error creating document: ', error);
      });
}

/**
 * function takes in a recipe object and updates based on modifications
 * by user
 * @param {object} recipe object include both id & data (document id & document)
 * @return {Promise} a promise for the modification of the given recipe
 */
function updateRecipe(recipe) { // eslint-disable-line no-unused-vars
  return db.collection('recipes').doc(recipe.id).set(recipe.data).then(() => {
    return console.log('Document successfully written!');
  })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
}

/**
 * function takes in a recipe ID and searches the database for an
 * existing recipe and deletes it from the database
 * @param {string} recipeId the document id
 * @return {Promise} a promise for the deletion of the given recipe
 */
function deleteRecipeById(recipeId) { // eslint-disable-line no-unused-vars
  return db.collection('recipes').doc(recipeId).delete().then(() => {
    return console.log('Document successfully written!');
  })
      .catch((error) => {
        console.error('Error deleting recipe: ', error);
      });
}


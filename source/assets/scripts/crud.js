const db = firebase.firestore();

/**
 * CREATE/UPDATE/DELETE: only works when user is logged in
 * GET: works regardless of authentication
 */

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
 * function that gets recipes based on userId
 * @param {string} userId userId associated with recipe
 * @return {Promise} a promise for all the recipes containing the userId
 */
function getRecipesByUserId(userId) { // eslint-disable-line no-unused-vars
  return db.collection('recipes')
      .where('userId', '==', userId)
      .get().then((querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({id: doc.id, data: doc.data()});
        });
        return results;
      });
}

/**
 * function that gets recipes based on name of recipe
 * @param {string} name name of recipe
 * @return {Promise} a promise for all the recipes containing the given name
 */
function getRecipesByName(name) { // eslint-disable-line no-unused-vars
  return db.collection('recipes').get().then((querySnapshot) => {
    const results = [];
    querySnapshot.forEach((doc) => {
      const resultName = doc.data().name;
      if (resultName.toLowerCase().includes(name.toLowerCase())) {
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
  const user = firebase.auth().currentUser;
  return db.collection('recipes').doc().set({...recipeData, userId: user.uid})
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
  const user = firebase.auth().currentUser;
  try {
    if (user.uid !== recipe.data.userId) throw new Error('not authenticated');
    return db.collection('recipes').doc(recipe.id)
        .set({...recipe.data}).then(() => {
          return console.log('Document successfully written!');
        });
  } catch (error) {
    console.error('Error updating document: ', error);
  }
}

/**
 * function takes in a recipe ID and searches the database for an
 * existing recipe and deletes it from the database
 * @param {string} recipeId the document id
 * @return {Promise} a promise for the deletion of the given recipe
 */
function deleteRecipeById(recipeId) { // eslint-disable-line no-unused-vars
  const user = firebase.auth().currentUser;
  try {
    if (user.uid !== recipe.data.userId) throw new Error('not authenticated');
    return db.collection('recipes').doc(recipeId).delete().then(() => {
      return console.log('Document successfully written!');
    });
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
}

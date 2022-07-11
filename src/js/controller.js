import 'core-js/stable'; //everything
import 'regenerator-runtime/runtime'; //async await
import { async } from 'regenerator-runtime'; //async await

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addReceipeView from './views/addReceipeView.js';
import { API_KEY, MODEL_CLOSE_SEC } from './config.js';


// if (module.hot) {
//   module.hot.accept();
// };

console.log('welcome to the application');

const controlRecipe = async function () {
  try {

    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //loading recipe    
    await model.loadRecipe(id);

    //render receipe
    recipeView.render(model.state.recipe);
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);
    //TEST
    //model.addBookmark(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //load results
    const query = searchView.getQuery();

    if (!query) return;

    await model.loadSearchResults(`${query}?key=${API_KEY}}`);

    //render results
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);

  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  model.updateServings(updateTo);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else
    model.addBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const controlLoadBookmark = function () {
  model.loadBookmarkedRecipe();
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  try {
    addReceipeView.renderSpinner();

    await model.uploadRecipe(data);

    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);
    addReceipeView.renderMessage();

    //update hash
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addReceipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000)
  } catch (err) {
    addReceipeView.renderError(err.message);
  }
};

const init = function () {
  //pusblisher-subscriber patern: subscriber
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmarkRecipe(controlAddBookmark)
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
  bookmarkView.addHandlerRender(controlLoadBookmark);
  addReceipeView.addHandlerUpload(controlAddRecipe);
}

init();

import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { AJAX, toJSON, JSONtoString } from './helpers.js'

//console.log(async);

export const state = {
    recipe: {},
    search: {
        query: '',
        page: 1,
        results: []
    },
    bookmarks: []
};

const createRecipeObject = function(data) {
    const { recipe } = data.data;    
    return {
        id: recipe.id,
        title: recipe.title,
        ingredients: recipe.ingredients,
        cookingTime: recipe.cooking_time,
        imageUrl: recipe.image_url,
        sourceUrl: recipe.source_url,
        servings: recipe.servings,
        publisher: recipe.publisher,
        ...(recipe.key && {key: recipe.key})
    };
};

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}`);

        state.recipe = createRecipeObject(data);

        const recipeIndex = state.bookmarks.findIndex(recipe => recipe.id === id);
        if (recipeIndex !== -1) {
            state.recipe = state.bookmarks[recipeIndex];
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
    } catch (err) {
        throw err;
    }
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        state.search.page = 1;

        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                imageUrl: recipe.image_url,
                publisher: recipe.publisher,
                ...(recipe.key && {key: recipe.key})
            }
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * RESULTS_PER_PAGE;
    const end = page * RESULTS_PER_PAGE;

    return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
    // newServ/oldServ = newQty/oldQty
    state.recipe.ingredients.forEach (function (ingredient) {
        if (Number.isFinite(ingredient.quantity))
            ingredient.quantity = ingredient.quantity * newServings / state.recipe.servings;
    });
    state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
    if (state.bookmarks.find(rec => rec.id === recipe.id)) return;
    state.bookmarks.push(recipe);
    saveToLocalStorage();
    state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
    const recipeIndex = state.bookmarks.findIndex(recipe => recipe.id === id);
    state.bookmarks.splice(recipeIndex, 1);
    saveToLocalStorage();
    state.recipe.bookmarked = false;
};

export const loadBookmarkedRecipe = function () {
    const bookmark = toJSON(window.localStorage.getItem('recipes'));

    if (!bookmark) return;

    state.bookmarks = bookmark;
};

const saveToLocalStorage = function () {
    const newBookmark = JSONtoString(state.bookmarks);
    if (!newBookmark) return;
    window.localStorage.setItem('recipes', newBookmark);
};

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].includes('ingredient') && entry[1].trim() != '')
        .map(ing => {
            const ingArr = ing[1].replaceAll(' ', '').split(',');
            if (ingArr.length !== 3) 
                throw new Error('Wrong ingredient format. Please try the correct format');
            const [quantity, unit, description] = ingArr;
            return { quantity: +quantity || null, unit, description};
        });

        const recipe = {
            title: newRecipe.title,
            ingredients: ingredients,
            cooking_time: +newRecipe.cookingTime,
            image_url: newRecipe.image,
            source_url: newRecipe.sourceUrl,
            servings: +newRecipe.servings,
            publisher: newRecipe.publisher
        };

        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
}
import View from "./view";
import icons from '../../img/icons.svg';
import previewView from "./previewView";

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query. Please try again!';

    _generateMarkup () {
        return this._data.map(recipe => previewView.render(recipe, false)).join('');
    }
};

export default new ResultsView();
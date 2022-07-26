import previewView from "./previewView";
import View from "./view";

class BookmarkView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

    _generateMarkup () {
        return this._data.map(data => previewView.render(data, false)).join('');
    }

    addHandlerRender (handler) {
        window.addEventListener('load', handler);
    }
};

export default new BookmarkView();
import View from "./view";

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _addBtn = document.querySelector('.nav__btn--add-recipe');
    _closeBtn = document.querySelector('.btn--close-modal');
    _message = 'Recipe was successfully uploaded :)';

    constructor () {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
        // this.addHandlerUpload();
    }

    toggleWindow () {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow () {
        this._addBtn.addEventListener('click', this.toggleWindow.bind(this))
    }

    _addHandlerHideWindow () {
        this._closeBtn.addEventListener('click', this.toggleWindow.bind(this))
    }

    addHandlerUpload (handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = [...new FormData(this)];
            handler(Object.fromEntries(data));
        });
    }
};

export default new AddRecipeView();
import View from "./view";
import icons from '../../img/icons.svg';
import { RESULTS_PER_PAGE } from "../config";

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    _generateMarkup () {
        const nextPageBtn = `<button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
        const prevPageBtn = `<button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
        </button>`;

        const numPages = Math.ceil(this._data.results.length / RESULTS_PER_PAGE);

        //page 1 or no data
        if (numPages <= 1 ) return '';
        //page 1 
        if (this._data.page === 1) 
            return nextPageBtn;
        //last page
        if (this._data.page === numPages)
            return prevPageBtn;

        //other page
        return `${prevPageBtn}${nextPageBtn}`;
    }

    addHandlerRender (handler) { //pusblisher-subscriber patern:publisher
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('button');
            // if (btn?.classList.contains('pagination__btn--next')) handler(1);
            // if (btn?.classList.contains('pagination__btn--prev')) handler(-1);

            if (!btn) return;

            const gotoPage = Number.parseInt(btn.dataset.goto);

            handler(gotoPage);
        })
    }

}

export default new PaginationView();
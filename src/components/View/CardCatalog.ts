import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card, TCardData } from './Card';

export type TCardCatalogData =
    TCardData &
    Pick<IProduct, 'image' | 'category'>;

export class CardCatalog extends Card<TCardCatalogData> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement,
        productId: string
    ) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            this.container
        );

        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            this.container
        );

        this.container.addEventListener('click', () => {
            this.events.emit('card:select', {
                id: productId
            });
        });
    }

    set image(value: string) {
        this.setImage(this.imageElement, value);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        Object.values(categoryMap).forEach((className) => {
            this.categoryElement.classList.remove(className);
        });

        const categoryClass =
            categoryMap[value as keyof typeof categoryMap];

        if (categoryClass) {
            this.categoryElement.classList.add(categoryClass);
        }
    }
}
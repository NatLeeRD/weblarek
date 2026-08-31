//created after review - промежуточный класс общий только для CardCatalog и CardPreview, т.к. CardBasket не содержит категории и картинки

import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Card, TCardData } from './Card';

export type TCardWithImageData = TCardData & Pick<IProduct, 'image' | 'category'>;

export class CardWithImage<T extends TCardWithImageData> extends Card<T> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            this.container
        );

        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            this.container
        );
    }

    set image(value: string) {
        this.setImage(
            this.imageElement,
            value,
            this.titleElement.textContent ?? ''
        );
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
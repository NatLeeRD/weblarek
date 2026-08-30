import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export type TCardData = Pick<IProduct, 'title' | 'price'>;

export class Card<T extends TCardData> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected imageElement: HTMLImageElement | null;
    protected categoryElement: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>(
            '.card__title',
            this.container
        );

        this.priceElement = ensureElement<HTMLElement>(
            '.card__price',
            this.container
        );

        this.imageElement =
            this.container.querySelector<HTMLImageElement>('.card__image');

        this.categoryElement =
            this.container.querySelector<HTMLElement>('.card__category');
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent =
            value === null ? 'Бесценно' : `${value} синапсов`;
    }

    set image(value: string) {
        if (this.imageElement) {
            this.setImage(
                this.imageElement,
                value,
                this.titleElement.textContent ?? ''
            );
        }
    }

    set category(value: string) {
        if (!this.categoryElement) {
            return;
        }

        this.categoryElement.textContent = value;

        Object.values(categoryMap).forEach((className) => {
            this.categoryElement?.classList.remove(className);
        });

        const categoryClass =
            categoryMap[value as keyof typeof categoryMap];

        if (categoryClass) {
            this.categoryElement.classList.add(categoryClass);
        }
    }
}
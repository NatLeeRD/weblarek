import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card, TCardData } from './Card';

export type TCardPreviewData =
    TCardData &
    Pick<IProduct, 'image' | 'category' | 'description'> & {
        buttonDisabled: boolean;
        buttonText: string;
    };

export class CardPreview extends Card<TCardPreviewData> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

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

        this.descriptionElement = ensureElement<HTMLElement>(
            '.card__text',
            this.container
        );

        this.buttonElement = ensureElement<HTMLButtonElement>(
            '.card__button',
            this.container
        );

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('card:add', {
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

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }
}
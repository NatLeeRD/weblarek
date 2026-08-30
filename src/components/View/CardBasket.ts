import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card, TCardData } from './Card';

export type TCardBasketData =
    TCardData & {
        index: number;
    };

export class CardBasket extends Card<TCardBasketData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement,
        productId: string
    ) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>(
            '.basket__item-index',
            this.container
        );

        this.deleteButton = ensureElement<HTMLButtonElement>(
            '.basket__item-delete',
            this.container
        );

        this.deleteButton.addEventListener('click', () => {
            this.events.emit('basket:item-delete', {
                id: productId
            });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
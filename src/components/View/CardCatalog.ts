import { IEvents } from '../base/Events';
import { CardWithImage, TCardWithImageData } from './CardWithImage';

export type TCardCatalogData = TCardWithImageData;
export class CardCatalog extends CardWithImage<TCardCatalogData> {

    constructor(
        protected events: IEvents,
        container: HTMLElement,
        productId: string
    ) {
        super(container);
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', {
                id: productId
            });
        });
    }
}
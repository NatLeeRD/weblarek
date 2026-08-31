import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { CardWithImage, TCardWithImageData } from './CardWithImage';

export type TCardPreviewData = TCardWithImageData & Pick<IProduct, 'description'> & {
        buttonDisabled: boolean;
        buttonText: string;
    };

export class CardPreview extends CardWithImage<TCardPreviewData> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement,
        ) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>(
            '.card__text',
            this.container
        );

        this.buttonElement = ensureElement<HTMLButtonElement>(
            '.card__button',
            this.container
        );

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('preview:click');
            });
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

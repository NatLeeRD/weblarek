import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement
    ) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>(
            '.modal__close',
            this.container
        );

        this.contentElement = ensureElement<HTMLElement>(
            '.modal__content',
            this.container
        );

        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        this.container.addEventListener('mousedown', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (
                event.key === 'Escape' &&
                this.container.classList.contains('modal_active')
            ) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.contentElement.replaceChildren();

        this.events.emit('modal:close');
    }
}
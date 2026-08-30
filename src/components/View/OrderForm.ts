import { IBuyer, TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export type TOrderFormData =
    Pick<IBuyer, 'payment' | 'address'>;

export class OrderForm extends Form<
    Pick<IBuyer, 'payment' | 'address'>
> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;

    constructor(
        events: IEvents,
        container: HTMLFormElement
    ) {
        super(events, container);

        this.paymentButtons =
            this.container.querySelectorAll<HTMLButtonElement>(
                '.order__buttons button'
            );

        this.addressInput = ensureElement<HTMLInputElement>(
            'input[name="address"]',
            this.container
        );

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.events.emit('order.payment:change', {
                    field: 'payment',
                    value: button.name as TPayment
                });
            });
        });
    }

    set payment(value: TPayment | null) {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle(
                'button_alt-active',
                button.name === value
            );
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}
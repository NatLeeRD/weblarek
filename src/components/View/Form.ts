import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormState {
    valid: boolean;
    errors: string;
}

export class Form<T extends object> extends Component<T & IFormState> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(
        protected events: IEvents,
        protected readonly form: HTMLFormElement
    ) {
        super(form);

        this.submitButton = ensureElement<HTMLButtonElement>(
            'button[type="submit"]',
            this.container
        );

        this.errorsElement = ensureElement<HTMLElement>(
            '.form__errors',
            this.container
        );

        this.container.addEventListener('input', (event) => {
            const target = event.target;

            if (!(target instanceof HTMLInputElement)) {
                return;
            }

            const field = target.name;
            const value = target.value;

            this.events.emit(`${this.form.name}.${field}:change`, {
                field,
                value
            });
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();

            this.events.emit(`${this.form.name}:submit`);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}
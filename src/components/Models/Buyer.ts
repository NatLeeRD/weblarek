//added

import { IBuyer } from '../../types';

export class Buyer {
    private data: Partial<IBuyer> = {};

    setData(data: Partial<IBuyer>): void {
        this.data = {
            ...this.data,
            ...data,
        };
    }

    getData(): Partial<IBuyer> {
        return this.data;
    }

    clear(): void {
        this.data = {};
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.data.address) {
            errors.address = 'Укажите адрес доставки';
        }

        if (!this.data.email) {
            errors.email = 'Укажите email';
        }

        if (!this.data.phone) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}
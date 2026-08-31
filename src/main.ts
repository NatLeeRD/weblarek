import './scss/styles.scss';

import { IBuyer, IOrderRequest } from './types';

import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { WebLarekApi } from './components/API/WebLarekApi';

import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { Basket as BasketView } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Modal } from './components/View/Modal';
import { Success } from './components/View/Success';


// ==================================================
// БРОКЕР СОБЫТИЙ
// ==================================================

const events = new EventEmitter();

// ==================================================
// API
// ==================================================

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// ==================================================
// МОДЕЛИ ДАННЫХ
// ==================================================

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);


// ==================================================
// ОСНОВНЫЕ КОМПОНЕНТЫ VIEW
// ==================================================

const header = new Header(
    events,
    ensureElement<HTMLElement>('.header')
);

const gallery = new Gallery(
    ensureElement<HTMLElement>('.gallery')
);

const modal = new Modal(
    events,
    ensureElement<HTMLElement>('#modal-container')
);


// ==================================================
// КОМПОНЕНТЫ ИЗ TEMPLATE
// ==================================================

const preview = new CardPreview(
    events,
    cloneTemplate<HTMLElement>('#card-preview')
);

const basketView = new BasketView(
    events,
    cloneTemplate<HTMLElement>('#basket')
);

const orderForm = new OrderForm(
    events,
    cloneTemplate<HTMLFormElement>('#order')
);

const contactsForm = new ContactsForm(
    events,
    cloneTemplate<HTMLFormElement>('#contacts')
);

const success = new Success(
    events,
    cloneTemplate<HTMLElement>('#success')
);


// ==================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ПРЕЗЕНТЕРА
// ==================================================
const renderPreview = () => {
    const product = catalog.getSelectedProduct();

    if (!product) {
        return;
    }

    const isInBasket = basket.hasItem(product.id);
    const isUnavailable = product.price === null;

    preview.render({
        title: product.title,
        price: product.price,
        image: `${CDN_URL}${product.image}`,
        category: product.category,
        description: product.description,
        buttonDisabled: isUnavailable,
        buttonText: isUnavailable
            ? 'Недоступно'
            : isInBasket
                ? 'Удалить из корзины'
                : 'В корзину'
    });
};

const renderBasket = () => {
    const products = basket.getItems();

    const items = products.map((product, index) => {
        const card = new CardBasket(
            events,
            cloneTemplate<HTMLElement>('#card-basket'),
            product.id
        );

        return card.render({
            title: product.title,
            price: product.price,
            index: index + 1
        });
    });

    basketView.render({
        items,
        total: basket.getTotalPrice(),
        buttonDisabled: basket.getCount() === 0
    });
};


// ==================================================
// СОБЫТИЯ МОДЕЛИ CATALOG
// ==================================================

// Изменился массив товаров каталога
events.on('catalog:changed', () => {
    const products = catalog.getProducts();

    const cards = products.map((product) => {
        const card = new CardCatalog(
            events,
            cloneTemplate<HTMLElement>('#card-catalog'),
            product.id
        );

        return card.render({
            title: product.title,
            price: product.price,
            image: `${CDN_URL}${product.image}`,
            category: product.category
        });
    });

    gallery.render({
        catalog: cards
    });
});


// Изменился выбранный товар
events.on('catalog:selected', () => {
    renderPreview();

    modal.render({
        content: preview.render()
    });

    modal.open();
});


// ==================================================
// СОБЫТИЯ МОДЕЛИ BASKET
// ==================================================

// Изменилось содержимое корзины
events.on('basket:changed', () => {
    header.render({
        counter: basket.getCount()
    });

    renderBasket();
    renderPreview();
});


// ==================================================
// СОБЫТИЯ МОДЕЛИ BUYER
// ==================================================

// Изменились данные покупателя
events.on('buyer:changed', () => {
    const data = buyer.getData();
    const errors = buyer.validate();

    const orderErrors = [
        errors.payment,
        errors.address
    ].filter(Boolean);

    const contactsErrors = [
        errors.email,
        errors.phone
    ].filter(Boolean);

    orderForm.render({
        payment: data.payment,
        address: data.address,
        valid: orderErrors.length === 0,
        errors: orderErrors.join('; ')
    });

    contactsForm.render({
        email: data.email,
        phone: data.phone,
        valid: contactsErrors.length === 0,
        errors: contactsErrors.join('; ')
    });
});


// ==================================================
// СОБЫТИЯ VIEW — КАТАЛОГ И КАРТОЧКИ
// ==================================================

// Пользователь выбрал карточку товара
events.on<{ id: string }>('card:select', ({ id }) => {
    const product = catalog.getProductById(id);

    if (product) {
        catalog.setSelectedProduct(product);
    }
});


// Пользователь нажал на кнопку действия в превью карточки («В корзину» / «Удалить из корзины»)
events.on('preview:click', () => {
    const product = catalog.getSelectedProduct();

    if (!product || product.price === null) {
        return;
    }

    if (basket.hasItem(product.id)) {
        basket.removeItem(product.id);
    } else {
        basket.addItem(product);
    }
});


// ==================================================
// СОБЫТИЯ VIEW — КОРЗИНА
// ==================================================

// Пользователь открыл корзину
events.on('basket:open', () => {
    modal.render({
        content: basketView.render()
    });

    modal.open();
});


// Пользователь удалил товар из корзины
events.on<{ id: string }>('basket:item-delete', ({ id }) => {
        basket.removeItem(id);
});


// ==================================================
// СОБЫТИЯ VIEW — ПЕРВЫЙ ЭТАП ОФОРМЛЕНИЯ
// ==================================================

// Пользователь нажал кнопку «Оформить»
events.on('order:open', () => {
    modal.render({
        content: orderForm.render()
    });

    modal.open();
});


// Пользователь выбрал способ оплаты
events.on<{
    field: 'payment';
    value: IBuyer['payment'];
}>(
    'order.payment:change',
    ({ value }) => {
        buyer.setData({
            payment: value
        });
    }
);


// Пользователь изменил адрес доставки
events.on<{
    field: 'address';
    value: string;
}>(
    'order.address:change',
    ({ value }) => {
        buyer.setData({
            address: value
        });
    }
);


// ==================================================
// СОБЫТИЯ VIEW — ВТОРОЙ ЭТАП ОФОРМЛЕНИЯ
// ==================================================

// Пользователь нажал кнопку «Далее»
events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render()
    });

    modal.open();
});


// Пользователь изменил email
events.on<{
    field: 'email';
    value: string;
}>(
    'contacts.email:change',
    ({ value }) => {
        buyer.setData({
            email: value
        });
    }
);


// Пользователь изменил телефон
events.on<{
    field: 'phone';
    value: string;
}>(
    'contacts.phone:change',
    ({ value }) => {
        buyer.setData({
            phone: value
        });
    }
);


// ==================================================
// ОПЛАТА / ЗАВЕРШЕНИЕ ОФОРМЛЕНИЯ ЗАКАЗА
// ==================================================

events.on('contacts:submit', () => {
    const buyerData = buyer.getData();

    const order: IOrderRequest = {
        ...buyerData,
        items: basket.getItems().map(
            (item) => item.id
        ),
        total: basket.getTotalPrice()
    };

    webLarekApi.createOrder(order)
        .then((response) => {
            success.render({
                total: response.total
            });

            modal.render({
                content: success.render()
            });

            modal.open();

            basket.clear();
            buyer.clear();
        })
        .catch((error: unknown) => {
            console.error(
                'Ошибка оформления заказа:',
                error
            );
        });
});


// ==================================================
// СОБЫТИЕ SUCCESS
// ==================================================

// Пользователь закрыл окно успешного заказа
events.on('success:close', () => {
    modal.close();
});


// ==================================================
// ПЕРВОНАЧАЛЬНАЯ ЗАГРУЗКА ПРИЛОЖЕНИЯ
// ==================================================

webLarekApi.getProducts()
    .then((response) => {
        catalog.setProducts(response.items);
    })
    .catch((error: unknown) => {
        console.error(
            'Ошибка получения каталога:',
            error
        );
    });
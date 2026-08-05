import './scss/styles.scss';

//added
import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/API/WebLarekApi';

//added review 2
import { API_URL } from './utils/constants';

// ====================
// Проверка Catalog
// ====================

const catalog = new Catalog();

catalog.setProducts(apiProducts.items);

console.log('Массив товаров из каталога:', catalog.getProducts());

const firstProduct = apiProducts.items[0];

console.log(
    'Товар по ID:',
    catalog.getProductById(firstProduct.id)
);

catalog.setSelectedProduct(firstProduct);

console.log(
    'Выбранный товар:',
    catalog.getSelectedProduct()
);

// ====================
// Проверка Basket
// ====================

const basket = new Basket();

basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);

console.log('Товары в корзине:', basket.getItems());

console.log('Количество товаров в корзине:', basket.getCount());

console.log(
    'Есть ли товар в корзине:',
    basket.hasItem(apiProducts.items[0].id)
);

console.log(
    'Общая стоимость корзины:',
    basket.getTotalPrice()
);

basket.removeItem(apiProducts.items[0]);

console.log(
    'Корзина после удаления товара:',
    basket.getItems()
);

basket.clear();

console.log(
    'Корзина после очистки:',
    basket.getItems()
);

// ====================
// Проверка Buyer
// ====================

const buyer = new Buyer();

buyer.setData({
    address: 'Paris'
});

console.log(
    'Данные покупателя после добавления адреса:',
    buyer.getData()
);

buyer.setData({
    payment: 'card'
});

console.log(
    'Данные покупателя после выбора оплаты:',
    buyer.getData()
);

console.log(
    'Ошибки валидации покупателя:',
    buyer.validate()
);

buyer.setData({
    email: 'test@example.com',
    phone: '+81 90 1234 5678'
});

console.log(
    'Данные покупателя после заполнения формы:',
    buyer.getData()
);

console.log(
    'Ошибки валидации после заполнения:',
    buyer.validate()
);

buyer.clear();

console.log(
    'Данные покупателя после очистки:',
    buyer.getData()
);

//added step4 (corrected review 2)
const api = new Api(API_URL);

const webLarekApi = new WebLarekApi(api);

webLarekApi.getProducts()
    .then((response) => {
        catalog.setProducts(response.items);

        console.log('Каталог:', catalog.getProducts());
    })
    .catch((error) => {
        console.error('Ошибка получения каталога:', error);
    });
import { faker } from '@faker-js/faker';
import fs from 'fs';
import { genSaltSync, hashSync } from 'bcrypt-ts';

const passwords = [];
const merchantIds = Array.from({ length: 50 }, () => faker.string.uuid());
const consumerIds = Array.from({ length: 50 }, () => faker.string.uuid());
const creditIds = Array.from({ length: 50 }, () => faker.string.uuid());
const shopIds = Array.from({ length: 50 }, () => faker.string.uuid());
const productIds = Array.from({ length: 3 }, () => faker.string.uuid());
const PRODUCTS = ['Standard', 'Silver', 'Gold'];
const salt = genSaltSync(10);

const MERCHANT_CONSUMERS = {};
const MERCHANT_SHOPS = {};

// function createRandomMerchant() {
//   return {
//     id: `${merchantIds[merchantIdx++]}`,
//     firstName: faker.person.firstName(),
//     middleName: faker.person.middleName(),
//     lastName: faker.person.lastName(),
//     email: faker.internet.email(),
//     phoneNumber: faker.helpers.regexpStyleStringParse(
//       '07[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
//     ),
//     idNo: faker.helpers.regexpStyleStringParse(
//       '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
//     ),
//     country: faker.location.country(),
//     city: faker.location.city(),
//     town: faker.location.city(),
//     region: faker.location.state(),
//     category: faker.helpers.arrayElement(['Gold', 'Silver', 'Bronze']),
//     postalAddress: faker.location.zipCode(),
//     postalCode: faker.location.zipCode(),
//     createdAt: faker.date.past(),
//   };
// }

let merchantIdx = 0;
function createRandomUser() {
  // users = ['merchant', 'admin']
  const users = [
    {
      id: `${merchantIds[merchantIdx++]}`,
      role: 'User',
      country: faker.location.country(),
      city: faker.location.city(),
      town: faker.location.city(),
      region: faker.location.state(),
      category: faker.helpers.arrayElement(['Gold', 'Silver', 'Bronze']),
      postalAddress: faker.location.zipCode(),
      postalCode: faker.location.zipCode(),
    },
    {
      id: faker.string.uuid(),
      role: 'Admin',
      employeeNumber: `${faker.number.int({ min: 500, max: 2000 })}`,
    },
  ];

  const password = faker.string.alpha(8);
  const username = faker.internet.userName();
  const status = faker.helpers.arrayElement(['Active', 'Inactive']);
  const phoneNumber = faker.helpers.regexpStyleStringParse(
    '07[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
  );
  const user = users[Math.floor(Math.random() * users.length)];

  passwords.push({ username, phoneNumber, password, status, role: user.role });

  const base = {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phoneNumber,
    username,
    idNo: faker.helpers.regexpStyleStringParse(
      '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    status,
    hasInitPassword: faker.datatype.boolean({ probability: 0.5 }),
    password: hashSync(password, salt),
    createdAt: faker.date.past(),
  };

  return {
    ...base,
    ...user,
  };
}

let shopIdx = 0;
function createRandomShop() {
  const name = `${faker.lorem.slug({ min: 1, max: 1 })}`;
  const _name = `${name[0].toUpperCase()}${name.slice(1)}`;

  const id = `${shopIds[shopIdx++]}`;
  const merchantId = faker.helpers.arrayElement(merchantIds);

  if (!MERCHANT_SHOPS[merchantId]) {
    MERCHANT_SHOPS[merchantId] = [];
  }

  MERCHANT_SHOPS[merchantId].push(id);

  return {
    id,
    code: faker.finance.pin(),
    name: _name,
    type: faker.helpers.arrayElement(['Wholesale', 'Retail']),
    phoneNumber: faker.helpers.regexpStyleStringParse(
      '07[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    address: faker.location.streetAddress(),
    postalAddress: faker.location.zipCode(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    merchantId,
    createdAt: faker.date.past(),
  };
}

let consumerIdx = 0;
function createRandomConsumer() {
  const id = `${consumerIds[consumerIdx++]}`;
  const merchantId = faker.helpers.arrayElement(merchantIds);

  if (!MERCHANT_CONSUMERS[merchantId]) {
    MERCHANT_CONSUMERS[merchantId] = [];
  }

  MERCHANT_CONSUMERS[merchantId].push(id);

  return {
    id,
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.helpers.regexpStyleStringParse(
      '07[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    idNo: faker.helpers.regexpStyleStringParse(
      '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    country: faker.location.country(),
    email: faker.internet.email(),
    postalAddress: faker.location.zipCode(),
    postalCode: faker.location.zipCode(),
    city: faker.location.state(),
    town: faker.location.city(),
    region: faker.location.state(),
    merchantId,
    createdAt: faker.date.past(),
  };
}

let productIdx = 0;
function createProduct() {
  const products = [];

  merchantIds.forEach((merchantId) => {
    for (let i = 0; i < 3; i++) {
      products.push({
        id: `${productIds[i]}`,
        name: `${PRODUCTS[i]}`,
        merchantId,
        accessFee: `${faker.number.float({ min: 0, max: 5, precision: 0.1 })}`,
        interestRate: `${faker.number.float({
          min: 0,
          max: 5,
          precision: 0.1,
        })}`,
        term: `${faker.number.int({ min: 0, max: 100 })}`,
        bad: `${faker.number.int({ min: 0, max: 100 })}`,
        lost: `${faker.number.int({ min: 0, max: 100 })}`,
      });
    }
  });

  return products;
}

let creditIdx = 0;
function createRandomCredit() {
  let merchantId = faker.helpers.arrayElement(merchantIds);

  let hasConsumerAndShop =
    MERCHANT_CONSUMERS[merchantId] && MERCHANT_SHOPS[merchantId];

  while (!hasConsumerAndShop) {
    merchantId = faker.helpers.arrayElement(merchantIds);
    hasConsumerAndShop =
      MERCHANT_CONSUMERS[merchantId] && MERCHANT_SHOPS[merchantId];
  }

  const shopId =
    MERCHANT_SHOPS[merchantId][
      Math.floor(Math.random() * MERCHANT_SHOPS[merchantId].length)
    ];

  const consumerId =
    MERCHANT_CONSUMERS[merchantId][
      Math.floor(Math.random() * MERCHANT_CONSUMERS[merchantId].length)
    ];

  return {
    id: `${creditIds[creditIdx++]}`,
    merchantId,
    consumerId,
    shopId,
    productId: faker.helpers.arrayElement(productIds),
    points: `${faker.number.int({ min: 500, max: 2000 })}`,
    status: faker.helpers.arrayElement(['Active', 'Inactive', 'Settled']),
    expiry: faker.date.soon(),
    createdAt: faker.date.past(),
  };
}

function createRandomTransaction() {
  return {
    id: faker.string.uuid(),
    creditId: faker.helpers.arrayElement(creditIds),
    type: faker.helpers.arrayElement(['Issuance', 'Consumption', 'Settlement']),
    credit: `${faker.number.int({ min: 0, max: 2000 })}`,
    debit: `${faker.number.int({ min: 0, max: 2000 })}`,
    interestRate: `${faker.number.float({ min: 0, max: 5, precision: 0.1 })}`,
    accessFee: `${faker.number.float({ min: 0, max: 5, precision: 0.1 })}`,
    createdAt: faker.date.past(),
  };
}

const data = {
  shops: faker.helpers.multiple(createRandomShop, { count: 50 }),
  users: faker.helpers.multiple(createRandomUser, { count: 50 }),
  consumers: faker.helpers.multiple(createRandomConsumer, { count: 50 }),
  credit: faker.helpers.multiple(createRandomCredit, { count: 20 }),
  products: [...createProduct()],
  transactions: faker.helpers.multiple(createRandomTransaction, { count: 50 }),
};

fs.writeFile('db.json', JSON.stringify(data), (err) => {
  if (err) {
    console.error('Error creating db.json file:', err);
  } else {
    console.log('db.json file created successfully.');
  }
});

fs.writeFile('passwords.json', JSON.stringify(passwords), (err) => {
  if (err) {
    console.error('Error creating user-passwords.json file:', err);
  } else {
    console.log('passwords.json file created successfully.');
  }
});

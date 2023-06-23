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

let merchantIdx = 0;
function createRandomMerchant() {
  return {
    id: `${merchantIds[merchantIdx++]}`,
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.helpers.regexpStyleStringParse(
      '07[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    idNo: faker.helpers.regexpStyleStringParse(
      '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    country: faker.location.country(),
    city: faker.location.city(),
    town: faker.location.city(),
    region: faker.location.state(),
    category: faker.helpers.arrayElement(['Gold', 'Silver', 'Bronze']),
    postalAddress: faker.location.zipCode(),
    postalCode: faker.location.zipCode(),
    createdAt: faker.date.past(),
  };
}

let shopIdx = 0;
function createRandomShop() {
  const name = `${faker.lorem.slug({ min: 1, max: 1 })}`;
  const _name = `${name[0].toUpperCase()}${name.slice(1)}`;

  return {
    id: `${shopIds[shopIdx++]}`,
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
    merchantId: faker.helpers.arrayElement(merchantIds),
    createdAt: faker.date.past(),
  };
}

function createRandomUser() {
  const password = faker.string.alpha(8);
  const username = faker.internet.userName();
  const phoneNumber = faker.helpers.regexpStyleStringParse(
    '07[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
  );

  passwords.push({ username, phoneNumber, password });

  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    role: faker.helpers.arrayElement(['Admin', 'User']),
    phoneNumber,
    status: faker.helpers.arrayElement(['Active', 'Inactive']),
    username,
    employeeNumber: `${faker.number.int({ min: 500, max: 2000 })}`,
    hasInitPassword: faker.datatype.boolean({ probability: 0.5 }),
    password: hashSync(password, salt),
    idNo: faker.helpers.regexpStyleStringParse(
      '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    createdAt: faker.date.past(),
  };
}

let consumerIdx = 0;
function createRandomConsumer() {
  return {
    id: `${consumerIds[consumerIdx++]}`,
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
    merchantId: faker.helpers.arrayElement(merchantIds),
    createdAt: faker.date.past(),
  };
}

let productIdx = 0;
function createRandomProduct() {
  return {
    id: `${productIds[productIdx]}`,
    name: `${PRODUCTS[productIdx++]}`,
    accessFee: `${faker.number.float({ min: 0, max: 5, precision: 0.1 })}`,
    interestRate: `${faker.number.float({ min: 0, max: 5, precision: 0.1 })}`,
    term: `${faker.number.int({ min: 0, max: 100 })}`,
    bad: `${faker.number.int({ min: 0, max: 100 })}`,
    lost: `${faker.number.int({ min: 0, max: 100 })}`,
    createdAt: faker.date.past(),
  };
}

let creditIdx = 0;
function createRandomCredit() {
  return {
    id: `${creditIds[creditIdx++]}`,
    consumerId: faker.helpers.arrayElement(consumerIds),
    merchantId: faker.helpers.arrayElement(merchantIds),
    shopId: faker.helpers.arrayElement(shopIds),
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
  merchants: faker.helpers.multiple(createRandomMerchant, { count: 50 }),
  shops: faker.helpers.multiple(createRandomShop, { count: 50 }),
  users: faker.helpers.multiple(createRandomUser, { count: 50 }),
  consumers: faker.helpers.multiple(createRandomConsumer, { count: 50 }),
  credit: faker.helpers.multiple(createRandomCredit, { count: 50 }),
  products: faker.helpers.multiple(createRandomProduct, { count: 3 }),
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

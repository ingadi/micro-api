import { faker } from '@faker-js/faker';
import fs from 'fs';
import { genSaltSync, hashSync } from 'bcrypt-ts';

const salt = genSaltSync(10);
const merchantIds = Array.from({ length: 50 }, () => faker.string.uuid());
const creditIds = Array.from({ length: 50 }, () => faker.string.uuid());
const consumerIds = Array.from({ length: 50 }, () => faker.string.uuid());
const passwords = [];

function createRandomMerchant() {
  return {
    id: faker.helpers.arrayElement(merchantIds),
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

function createRandomShop() {
  return {
    id: faker.string.uuid(),
    code: faker.string.numeric({ length: { max: 5 } }),
    name: faker.lorem.word(),
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

  passwords.push({ username, password });

  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    role: faker.helpers.arrayElement(['Qitabu admin', 'Merchant admin']),
    phoneNumber: faker.helpers.regexpStyleStringParse(
      '07[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    status: faker.helpers.arrayElement(['Active', 'Inactive']),
    username,
    employeeNumber: `${faker.number.int({ min: 500, max: 2000 })}`,
    password: hashSync(password, salt),
    idNo: faker.helpers.regexpStyleStringParse(
      '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    createdAt: faker.date.past(),
  };
}

function createRandomConsumer() {
  return {
    id: faker.helpers.arrayElement(consumerIds),
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

function createRandomCredit() {
  return {
    id: faker.helpers.arrayElement(creditIds),
    consumerId: faker.helpers.arrayElement(consumerIds),
    merchantId: faker.helpers.arrayElement(merchantIds),
    points: `${faker.number.int({ min: 500, max: 2000 })}`,
    interestRate: `${faker.number.float({ min: 0, max: 5, precision: 0.1 })}`,
    status: faker.helpers.arrayElement(['Active', 'Inactive']),
    expiry: faker.date.soon(),
    createdAt: faker.date.past(),
  };
}

const data = {
  merchants: faker.helpers.multiple(createRandomMerchant, { count: 50 }),
  shops: faker.helpers.multiple(createRandomShop, { count: 50 }),
  users: faker.helpers.multiple(createRandomUser, { count: 50 }),
  consumers: faker.helpers.multiple(createRandomConsumer, { count: 50 }),
  credit: faker.helpers.multiple(createRandomCredit, { count: 50 }),
};

fs.writeFile('db.json', JSON.stringify(data), (err) => {
  if (err) {
    console.error('Error creating db.json file:', err);
  } else {
    console.log('db.json file created successfully.');
  }
});

fs.writeFile('user-passwords.json', JSON.stringify(passwords), (err) => {
  if (err) {
    console.error('Error creating user-passwords.json file:', err);
  } else {
    console.log('user-passwords.json file created successfully.');
  }
});

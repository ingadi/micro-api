const { faker } = require('@faker-js/faker');
const fs = require('fs');

const merchantIds = Array.from({ length: 50 }, () => faker.string.uuid());
const creditIds = Array.from({ length: 50 }, () => faker.string.uuid());
const consumerIds = Array.from({ length: 50 }, () => faker.string.uuid());

function createRandomMerchant() {
  return {
    id: faker.helpers.arrayElement(merchantIds),
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    idNo: faker.helpers.regexpStyleStringParse(
      '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    country: faker.location.country(),
    city: faker.location.city(),
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
    name: faker.lorem.word(),
    type: faker.helpers.arrayElement(['Wholesale', 'Retail']),
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(),
    postalAddress: faker.location.zipCode(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    merchantId: faker.helpers.arrayElement(merchantIds),
    createdAt: faker.date.past(),
  };
}

function createRandomUser() {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    role: faker.helpers.arrayElement(['Admin', 'Merchant']),
    phoneNumber: faker.phone.number(),
    status: faker.helpers.arrayElement(['Active', 'Inactive']),
    username: faker.internet.userName(),
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
    phoneNumber: faker.phone.number(),
    idNo: faker.helpers.regexpStyleStringParse(
      '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
    ),
    nationality: faker.location.country(),
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
    amount: faker.finance.amount(),
    points: faker.number.int({ min: 500, max: 2000 }),
    interestRate: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
    status: faker.helpers.arrayElement(['Active', 'Inactive']),
    createdAt: faker.date.past(),
  };
}

const data = {
  merchants: faker.helpers.multiple(createRandomMerchant, { count: 50 }),
  shops: faker.helpers.multiple(createRandomShop, { count: 50 }),
  users: faker.helpers.multiple(createRandomUser, { count: 50 }),
  consumers: faker.helpers.multiple(createRandomConsumer, { count: 50 }),
  credits: faker.helpers.multiple(createRandomCredit, { count: 50 }),
};

fs.writeFile('db.json', JSON.stringify(data), (err) => {
  if (err) {
    console.error('Error creating db.json file:', err);
  } else {
    console.log('db.json file created successfully.');
  }
});

const { faker } = require('@faker-js/faker');
const fs = require('fs');

const merchantIds = Array.from({ length: 50 }, () => faker.string.uuid());

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
  };
}

function createRandomUser() {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    userRole: faker.helpers.arrayElement(['Admin', 'Merchant']),
    phoneNumber: faker.phone.number(),
    status: faker.helpers.arrayElement(['Active', 'Inactive']),
  };
}

const data = {
  merchants: faker.helpers.multiple(createRandomMerchant, { count: 50 }),
  shops: faker.helpers.multiple(createRandomShop, { count: 50 }),
};

fs.writeFile('db.json', JSON.stringify(data), (err) => {
  if (err) {
    console.error('Error creating db.json file:', err);
  } else {
    console.log('db.json file created successfully.');
  }
});

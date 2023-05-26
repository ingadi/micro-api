const { faker } = require('@faker-js/faker');
const fs = require('fs');

function createRandomMerchant() {
  return {
    id: faker.string.uuid(),
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
  };
}

const data = {
  merchants: faker.helpers.multiple(createRandomMerchant, { count: 50 }),
};

fs.writeFile('db.json', JSON.stringify(data), (err) => {
  if (err) {
    console.error('Error creating db.json file:', err);
  } else {
    console.log('db.json file created successfully.');
  }
});

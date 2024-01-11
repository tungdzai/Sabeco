const fs = require('fs');
const numbers=[
    334463911,
];
let existingData = [];
try {
    const existingDataString = fs.readFileSync('account.json', 'utf8');
    existingData = JSON.parse(existingDataString);
} catch (error) {
    console.log(error.data)
}
const newObjects = numbers.map((number,index) => ({
    id: existingData.length+index,
    phone_number: number,
    token: "",
    grab: "",
    shopee: ""
}));
const updatedData = existingData.concat(newObjects);
const jsonString = JSON.stringify(updatedData, null, 2);
fs.writeFileSync('account.json', jsonString);

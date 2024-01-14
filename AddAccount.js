const fs = require('fs');
const numbers=[
    393195948,
    964867432,
    365384689,
    582306993,
    582357040,
    582264484,
    582191681,
    582215292,
    582190409,
    582338227,
    582217765,
    582316338,
    582318180,
    582338183,
    582351043,
    582230754,
    582268734,
    582309774,
    582272083,
    582297597,
    582319895,
    582297461,
    582346537,
    582311905,
    582338025,
    582201900,
    582181461,
    582318503,
    582339275,
    582268783,
    582251350,
    582343820,
    582285184,
    582330197,
    582349737,
    582262144,
    582201650,
    582307365,
    582315576,
    582360601,
    582279187,
    582191186,
    582273973,
    582210301,
    582290781,
    582297653,
    582318428,
    582249170,
    582183581,
    582206527,
    582347075,
    582319679,
    582334131,
    582321686,
    582308677,
    582332118,
    582313953,
    582268810
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
    turn_of_scan: '',
    turn_of_single_play: '',
    turn_of_team_play: '',
    single_play_level: '',
    gems: '',
    grab:'',
    shopee:''

}));
const updatedData = existingData.concat(newObjects);
const jsonString = JSON.stringify(updatedData, null, 2);
fs.writeFileSync('account.json', jsonString);

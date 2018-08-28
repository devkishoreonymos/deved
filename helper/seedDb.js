let User = require('../model/user.model');
let Platform = require('../model/platform.model');
let City = require('../model/city.model');
let Zone = require('../model/zone.model');
let {north, south, east, west} = require('../data/city');

async function seedDb() {
    let users = await User.find();

    console.log(users);

    if (!users || users.length === 0) {
        await createUser();
    }

    let platforms = await Platform.find();

    if (!platforms || platforms.length === 0) {
        await createPlatforms();
    }

    let zones = await Zone.find();

    if (!zones || zones.length === 0) {
        await createZones();
    }
}

async function createUser() {
    console.log('creating users');
    let users = [
        {userId: 'deo', password: 'deo', role: 'deo'},
        {userId: 'validator', password: 'validator', role: 'validator'},
        {userId: 'admin', password: 'admin', role: 'admin'},
        {userId: 'client', password: 'client', role: 'client'}
    ];

    await User.create(users);
}

async function createZones() {
    console.log('Creating zones');

    setZone(north, 'North');
    setZone(south, 'South');
    setZone(east, 'East');
    setZone(west, 'West');

    await Promise.all([City.create(north.cities), City.create(south.cities), City.create(east.cities), City.create(west.cities)]);

    let northCities = await City.find({zone: 'North'});
    let southCities = await City.find({zone: 'South'});
    let eastCities = await City.find({zone: 'East'});
    let westCities = await City.find({zone: 'West'});

    let zones = [
        {name: 'North', cities: northCities},
        {name: 'South', cities: southCities},
        {name: 'East', cities: eastCities},
        {name: 'West', cities: westCities}
    ];

    await Zone.create(zones);
}

function setZone(zoneArray, name) {
    for (let i = 0; i < zoneArray.length; i++) {
        zoneArray[i][zone] = name;
    }
}

async function createPlatforms() {
    console.log('Creating platforms');
    let platforms = [
        {name: 'Amazon', sellers: ['Cloudtail']},
        {name: 'Paytm', sellers: ['TBL']},
        {name: 'Cadbury Gifting', sellers: ['Cadbury Joy']}
    ];

    await Platform.create(platforms);
}

module.exports = {seedDb};
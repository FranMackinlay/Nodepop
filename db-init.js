'use strict';

const connection = require('./lib/connectMongoose');

const Ad = require('./models/Ad');
const User = require('./models/User');

connection.once('open', async () => {
  try {
    await initAds();
    await initUsers();
    connection.close();
  } catch (err) {
    console.error('An error happend:', err);
    process.exit(1);
  }
});

const initAds = async () => {
  await Ad.deleteMany();
  await Ad.insertMany([
    {
      adName: "HoverBike",
      sale: true,
      price: 230,
      photo: "/images/hoverbike.jpg",
      tags: ["lifestyle", "motor"]
    },
    {
      adName: "Ferrari",
      sale: true,
      price: 1500,
      photo: "/images/ferrari.jpg",
      tags: ["lifestyle", "motor", 'work']
    },
    {
      adName: "Motorcycle",
      sale: false,
      price: 830,
      photo: "/images/motorcycle.jpg",
      tags: ["lifestyle", "motor", "mobile"]
    },
    {
      adName: "Yatch",
      sale: false,
      price: 2830,
      photo: "/images/yatch.jpg",
      tags: ["lifestyle"]
    },
    {
      adName: "Black Hole",
      sale: false,
      price: 150000,
      photo: "/images/blackhole.gif",
      tags: ["lifestyle"]
    }
  ]);
};

const initUsers = async () => {
  await User.deleteMany();
  await User.insertMany([
    {
      email: 'user@example.es',
      password: await User.hashPassword('1234'),
    },
    {
      email: 'example@gmail.com',
      password: await User.hashPassword('12345'),
    },
  ]);
};

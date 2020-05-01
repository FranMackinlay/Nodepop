'use strict';

const connection = require('./lib/connectMongoose');

const Ad = require('./models/Ad');

connection.once('open', async () => {
  try {
    await initAds();
    connection.close();
  } catch (err) {
    console.err('An error happend:', err);
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
      photo: "https://cdn.shortpixel.ai/spai/w_1003+h_617+q_lossless+ret_img+to_webp/https://megaricos.com/wp-content/uploads/2018/10/Hoversurf_4.jpg",
      tags: ["lifestyle", "motor"]
    },
    {
      adName: "Ferrari",
      sale: true,
      price: 1500,
      photo: "https://i.pinimg.com/originals/e4/01/c7/e401c730dfdd8187340198d4a9b39b92.jpg",
      tags: ["lifestyle", "motor", 'work']
    },
    {
      adName: "Motorcycle",
      sale: false,
      price: 830,
      photo: "https://i.ytimg.com/vi/ki1UOIqfd10/maxresdefault.jpg",
      tags: ["lifestyle", "motor", "mobile"]
    },
    {
      adName: "Yatch",
      sale: false,
      price: 2830,
      photo: "https://keyassets.timeincuk.net/inspirewp/live/wp-content/uploads/sites/23/2016/05/Epiphany-inset-2.jpg",
      tags: ["lifestyle"]
    },
    {
      adName: "Black Hole",
      sale: false,
      price: 150000,
      photo: "https://www.3dizingof.com/wp-content/uploads/2019/09/nasa-blackhole.gif",
      tags: ["lifestyle"]
    }
  ]);
};

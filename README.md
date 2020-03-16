# Nodepop

Nodepop is an ads API (work in progress).


### Install dependencies

```shell
npm install
```

### Start a mongoDB instance

```shell
<root-mongodb-folder> ./bin/mongod --dbpath ./data/db --directoryperdb
```

### To initialize database you can run:
```shell
npm run db-init
```

### To start the api in dev mode

```shell
npm run dev
```

### API Endopints

**GET: /api/ads**

  > GET is limited by default to 1.000 results 

- Result:

```
[
  {
    "tags": [
      "lifestyle",
      "motor"
    ],
    "_id": "5e6fb453280a2b2a7bbee307",
    "adName": "HoverBike",
    "sale": true,
    "price": 230,
    "photo": "https://megaricos.com/wp-content/uploads/2018/10/Hoversurf-Hoverbike-1.jpg",
    "__v": 0
  },
  {
    "tags": [
      "lifestyle",
      "motor",
      "work"
    ],
    "_id": "5e6fb453280a2b2a7bbee308",
    "adName": "Ferrari",
    "sale": true,
    "price": 1500,
    "photo": "https://i.pinimg.com/originals/e4/01/c7/e401c730dfdd8187340198d4a9b39b92.jpg",
    "__v": 0
  },
]
```

**Available filters**

- /api/ads?**adName=Fooba**
- /api/ads?**price=200-1000**
- /api/ads?**tags=motor-lifestyle-mobile-work**
- /api/ads?**sale=true**

    > All combined: - /api/ads?*adName=Fooba*&*price=200-1000*&*tags=motor-lifestyle-mobile-work*&*sale=true*


**POST: /api/ads**

- Payload required in body:
 
 ```shell
{
  adName: String,
  sale: Boolean,
  price: Number,
  photo: String,
  tags: [String]
}
 ```

**PUT: /api/ads/:id**

To update an Ad, send the payload in the body to me modified:

- Original parameter: 

```shell
{
  price: 3000,
}
```
- New parameter: 

```shell
{
  price: 1000,
}
```

**DELETE: /api/ads/:id**

To delete an Ad provide the id parameter in URL.




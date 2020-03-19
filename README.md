# Nodepop

Nodepop is an ads API (work in progress).

> Suggestion: for VsCode users, you can download Better Comments extension for visualizing better the comments.


### Install dependencies:

```shell
npm install
```

### Start a mongoDB instance:

```shell
<root-mongodb-folder>$ ./bin/mongod --dbpath ./data/db --directoryperdb
```

### To initialize database you can run:
```shell
npm run db-init
```

### To start the api in dev mode:

```shell
npm run dev
```

### API Endopints:

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

**GET: /api/ads/tags**

- Retrieve an array with all known tags from ads collection

- Result:

```shell
[
  "lifestyle",
  "mobile",
  "motor",
  "work"
]
```

**Available filters**

- /api/ads?**adName=Fooba**
  > Starting word, non case-sensitive.
- /api/ads?**price=200**
  > price is equal to 200
- /api/ads?**price=200-1000**
  > price range between 200 to 1000.
- /api/ads?**price=200-**
  > price es equal or greater than 200
- /api/ads?**price=-1000**
  > price es equal or lower than 1000
- /api/ads?**tags=motor-lifestyle-mobile-work**
  > tags splitted by "-".
- /api/ads?**sale=true**
  > or false.
- /api/ads?**limit=2**
  > limit the results into 2
- /api/ads?**sort=price**
  > sort ads by price (lower to greater). With the option "-price" (greater to lower).

- All combined:
  ```shell
   /api/ads?*adName=Fooba*&*price=200-1000*&*tags=motor-lifestyle-mobile-work*&*sale=true*
   ```


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

To update an Ad, provide the id of the Ad to be modified and send the payload in the body to be modified:

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

### Frontend pages:

**"/"** 

Shows the complete ads list.

**"/tags"**

Shows the existing tags in all ads.


### Frontend filters:

**Available filters:**

- /?**adName=Fooba**
  > Starting word, non case-sensitive.
- /?**price=200-1000**
- /?**tags=motor-lifestyle-mobile-work**
- /?**sale=true**

    > All combined: - /?*adName=Fooba*&*price=200-1000*&*tags=motor-lifestyle-mobile-work*&*sale=true*

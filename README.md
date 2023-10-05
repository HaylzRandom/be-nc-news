# Northcoders News API

### Project Summary

A backend API for a Northcoders News app. Allows access to multiple types of application data such as:

- Users
- Topics
- Articles
- Comments

### Live Server

[NorthCoders News API](https://nc-news-api-ga04.onrender.com/api)

### Tech Stack / Requirements

- Node.js - v20.5.1
- PostGres - v14.9
- Express.js
- Jest
  
### To Run Locally

Clone to own computer:

`git clone https://github.com/HaylzRandom/nc-news-api`

Run

`npm install`

Then to run this API locally you will need to do the following:

- Create a .env.test file and add the following line:

    `PGDATABASE=nc_news_test`

- Create a .env.development file and add the following line:

  `PGDATABASE=nc_news`

Once these files have been created run the following scripts in the terminal:

`npm run setup-dbs`

`npm run seed`

### Testing

To run all the unit and tests run the following script in the terminal:

`npm run test`
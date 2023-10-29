# Northcoders News API

### Project Summary

A backend API for a Northcoders News app. Allows access to multiple types of application data such as:

- Users
- Topics
- Articles
- Comments

### Live Server

[NorthCoders News API](https://nc-news-api-ga04.onrender.com/api)

### Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostGres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white)
  
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

### Roadmap

- [ ] Implement ability to create new users
- [ ] Implement ability to update existing user
- [ ] Implement more details to be associated with user
- [ ] Implement function to get all the user's personal comments, articles and votes they have voted
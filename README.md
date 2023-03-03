# gym-review-site-REST-API

This is a group assignment in the api-development course which is part of the front end developer program at Medieinstitutet.

## About the project

The assignment is to create a REST-API for a map/review site using express server and SQLite.

### Built With

node.js
SQLite
Express

## TEAM

Angelica Reuterswärd

Hama Jaff

Anna Boye

## INSTALLATION

1. Clone this repo, in your terminal run the following command : git clone https://github.com/annaboye/gym-review-site-REST-API.git
2. Install all npm packages needed, in your terminal run the following command : npm i
3. Seed your SQLite database with all data, in your terminal run the following command : npm run seedDB
4. Start server, in your terminal run the following command : npm run dev
5. You can now use the Postman Collection and test this application

## Database Design

![database](./dbDesign/dBdesign.png)

## USERS

    full_name: "Anna Andersson",
    user_alias: "AdminAnkan",
    email: "ankanpankan@email.se",
    password: "secret",
    is_admin: TRUE,

    full_name: "Bibbi Bibsson",
    user_alias: "Bibban",
    email: "bibban@email.se",
    password: "secret",
    is_admin: FALSE,

    full_name: "Clarre Clersson",
    user_alias: "Clarre",
    email: "clarreparre@email.se",
    password: "secret",
    is_admin: FALSE,

    full_name: "Ducky Ducksson",
    user_alias: "Ducky",
    email: "ducky@email.se",
    password: "secret",
    is_admin: FALSE,

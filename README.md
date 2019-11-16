# TeamWork

[![Build Status](https://travis-ci.org/gitego-brian/TeamWork.svg?branch=develop)](https://travis-ci.org/gitego-brian/TeamWork) [![Coverage Status](https://coveralls.io/repos/github/gitego-brian/TeamWork/badge.svg?branch=develop)](https://coveralls.io/github/gitego-brian/TeamWork?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/babdaf2abddbdd8d9723/maintainability)](https://codeclimate.com/github/gitego-brian/TeamWork/maintainability)

> ## Documentation
- [Version one](https://documenter.getpostman.com/view/8741834/SVtPXARF?version=latest#de7dbd0a-5fdb-4284-9d22-31a55cfa6a24)
- [Version two](https://documenter.getpostman.com/view/8741834/SVtVTTQj?version=latest)

## What is it?

Teamwork is an internal social network for organizations’ employees. The goal of this application is to facilitate more interaction between colleagues and facilitate team bonding. Employees can use TeamWork to share ideas through articles.

![Screenshot (83)](https://user-images.githubusercontent.com/53472419/65280939-b484e700-db31-11e9-856b-655a42617106.png)

## What does it do?

- Employees can **sign up**
- Employees can **sign in**
- Employees can **view all articles** showing the most recently posted first
- Employees can **write** and/or **share** articles with their colleagues
- Employees can **edit** their articles
- Employees can **delete** their articles

# UI TEMPLATE

## How to Find it

The UI template is hosted on gh-pages and can be found at https://gitego-brian.github.io/TeamWork/

## Usage

- After you've reached the link you get the homepage.
- Click on `Get started` to get to the Signing up page
- From there click `Create account` to get to the login page

- And from the login page, click `Log in` to get to the User Home page

- You can view the article viewing page by clicking on an article title

- You can also contact us by clicking `Contact us` in the footer.

- Know more about us by clicking `About`

# API (still in development)

## Tools:

- Server-side Framework: **Node/Express**
- Linting Library : **Eslint**
- Style Guide : **Airbnb**
- Testing Framework :**Mocha** with **chai**

---

## Other Tools:

- Travis CI for continous intergration
- Babel transpiler for javascript ES6
- nyc for test coverage

---

# Installation:

**Follow the steps below:**

If you do not have node.js and git in your computer, install them first:

- download [node.js](https://nodejs.org/en/download/)

- download [git](https://git-scm.com/downloads)

Clone this project using:

```
$ git clone https://github.com/gitego-brian/TeamWork.git
```

to install all dependencies required for this project run the below command in your terminal:

```
npm install
```

to start the server run the below command in your terminal

```
npm start
```

or

```
npm dev-start
```

to run the tests for this project run the below command in your terminal

```
npm test
```

---

Below is a list of API Endpoints you will find:

- **GET/api/v1/auth/signup** : To sign up an employee

- **GET/api/v1/auth/signin** : Log in an employee

- **GET/api/v1/articles** : Get all articles order from latest

- **GET/api/v1/articles/:articleID** : Viewing a single article

- **POST/api/v1/articles** : Creating a new article

- **PATCH/api/v1/articles/:articleID** : Editing an article

- **DELETE/api/v1/articles/:articleID** : Deleting an article

- **POST/api/v1/articles/:articleID/comments** : Commenting on an article

- **POST/api/v1/articles/:articleID/comments/:commentID** : Flagging a comment

- **DELETE/api/v1/articles/:articleID/comments/:commentID** : Deleting a comment

---

USE **POSTMAN** or any other api client app to test requests other than the GET request.

If POSTMAN is not installed in your computer, DOWNLOAD it [here](https://www.getpostman.com/apps)

## Contribute

---

- To contribute to this project, clone and install the app as instructed above. Then create a new branch off the develop branch on which to make your changes.

- After you're done with the changes, push them upstream to my repo on that same branch and create a pull request and i will consider them.

## Instructions:

navigate to the TeamWork folder and in your terminal, type:

```
git checkout -b branchnameforyourchanges
```

then after making the changes, type:

```
git add .
```

then

```
git commit -m "your commit message"
```

and push like so

```
git push origin branchnameforyourchanges
```

# Author:

**Brian GITEGO**

[gitego-brian](http://github.com/gitego-brian/) - Github

gitegob7@gmail.com - GMAIL

[Brian Gitego](http://facebook.com/brian.gitego) - Facebook

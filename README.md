# AN ONLINE INTERACTIVE QUIZ GAME PLATFORM

<!-- badges -->

[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/mit-license.php)
[![GitHub latest commit](https://img.shields.io/github/last-commit/u-s-c-l/i-t-t-w-s-d-server.svg)](https://github.com/u-s-c-l/i-t-t-w-s-d-server)
[![GitHub forks](https://img.shields.io/github/forks/u-s-c-l/i-t-t-w-s-d-server.svg)](https://github.com/u-s-c-l/i-t-t-w-s-d-server)

This repo hosts the server side of an interactive quiz game.

## Table of Contents

- [Installation & Usage](#installation--usage)
- [Technologies](#technologies)
- [Database Schema](#database-schema)
- [Routes](#routes)

# Installation & Usage

### Installation

- Clone the repo
- Open terminal and navigate to the `/i-t-t-w-s-d-server/api` folder
- Run `npm i` to install dependencies
- Navigate back to the `/i-t-t-w-s-d-server` folder to run bash scripts

### Local Usage (Docker)

`bash _scripts/start.sh`

- Starts api & db services
- Runs db migrations
- Seeds db for development
- Serves api on `localhost:3003`

Note: Press `Ctrl` + `C` to terminate the docker container

`bash _scripts/stop.sh`

- Stops all running services

`bash _scripts/teardown.sh`

- Stops all running services
- Removes containers
- Removes volumes

`bash _scripts/test.sh`

- Starts api & db services
- Runs db migrations
- Attaches to api container and triggers full test run
- No ports mapped to local host

`bash _scripts/coverage.sh`

- Starts api & db services
- Runs db migrations
- Attaches to api container and triggers full test coverage run
- No ports mapped to local host

### Deployment

This server is continuosly deployed at https://ultimate-quiz-game.herokuapp.com/

## **Technologies**

- [Node.js 🔗](https://nodejs.org/)
- [Express 🔗](https://expressjs.com/)
- [Docker 🔗](https://docker.com/)
- [Jest 🔗](https://jestjs.io/)
- [MongoDB 🔗](https://www.mongodb.com/)
- [MongoDB Atlas 🔗](https://www.mongodb.com/atlas/database)
- [Socket.io 🔗](https://socket.io/)

# Database Schema

- `users`

#### Users schema example:

```json
{
  "username": "Frank",
  "password_digest": "$2a$10$tCppT1FG0aL9Hj4sHGyZHh6r5OUTLEvAcIorq"
}
```

- `scores`

#### Scores schema example:

```json
{
  "cat": "maths",
  "username": "Frank",
  "score": 20
}
```

Note: To seed the two MongoDB collections hosted on Atlas, run `node insert-user-data.js` and `node insert-scores-data.js` from terminal.

# Routes

## Auth Routes

| **URL**        | **HTTP Verb** | **Action**     |
| -------------- | ------------- | -------------- |
| /auth/login    | POST          | authentication |
| /auth/register | POST          | authentication |

#### Body for registration request

```json
{
  "username": "new_username",
  "password": "new_password"
}
```

#### Body for login request

```json
{
  "username": "Frank",
  "password": "frank_password"
}
```

## User Routes

| **URL**          | **HTTP Verb** | **Action** |
| ---------------- | ------------- | ---------- |
| /users           | GET           | index      |
| /users/:username | GET           | show       |

## Score Routes

| **URL**                             | **HTTP Verb** | **Action**      |
| ----------------------------------- | ------------- | --------------- |
| /scores                             | GET           | index           |
| /scores/username/:username          | GET           | show            |
| /scores/cat/:cat                    | GET           | show            |
| /scores/username/:username/cat/:cat | GET           | show            |
| /scores/leadersboard                | GET           | show            |
| /scores/post                        | POST/PATCH    | create & update |
| /scores/username/:username          | DELETE        | destroy         |

#### Body for the score POST request

```json
{
  "username": "Frank",
  "cat": "science fiction",
  "score": 28
}
```

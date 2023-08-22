<!-- <p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p> -->
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Ecard API System
<p align="center">
  <a href="#"><img src="https://www.e-card.bg/images/logo.png" width="200" alt="Ecard Logo" /></a>
</p>

This is personal card management system, purpose to allow user of system can update profile and quick share personal infomation with another user.

## Description
- This project built to help everyone create online postcard for themselfs.
- The primary languages of project is Typescript connect to PostgreSQL by firstcode concept combine with NestJS framework, TypeORM.
- Using JWT, SMTP and Queue to process sign up function

## Installation
Open your terminal and run:
```bash
$ git clone https://github.com/PROJECT-ECARD/Ecard-Server.git
```

## Running the app
Go to folder contains project, open terminal
```bash
$ npm run start

# access api document, you can test functions at here
uri: localhost:8000/ecard-api-docs

# build image and start container
$ docker-compose up -d

# review data of tables
uri: localhost:7012
# system: PostgreSQL
# server: ecard_postgres_local, 
# username: admin
# password: admin
# database: postgresdb
```

## Support

If you have any question, please contact me by lvtoan.it2000@gmail.com or 0819490540.

## Stay in touch

- Author - [LeVanToan](https://bio.link/lvtoan)
- Website - [Portfolio](https://portfolio-dev-lvtoan.netlify.app/)
- LinkedIn - [toan-lv](https://www.linkedin.com/in/toan-lv/)


# PennyPincher

## Prerequisites
* Node.js
  * Can be downloaded [here](https://nodejs.org)
* bower
  * After installing node use npm (Node Package Manager) to install
    * `npm install -g bower`

## Installation

```
git clone https://github.com/micman52/pennyPincher.git
cd pennyPincher
npm install
bower install
```

Edit dbConnection.js and scaper/dbUpdater.js by replacing:
* "insertpasswordhere"
*  with the password

*** There is no live DB at the moment so the above lines may also have to be edited so they connect to a db ***

#### To run the server
`node app.js`

#### To run the scraper
`node scraper/dbUpdater.js`

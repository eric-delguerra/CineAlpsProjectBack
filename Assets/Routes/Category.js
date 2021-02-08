const express = require('express');
const app = express();

app.use('category', RoutesCategory)
let RouteCategory = class {

    constructor(_dbCineAlpes){
        this.db = _dbCineAlpes
    }

}

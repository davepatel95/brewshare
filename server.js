'use strict';

const express = require('express');
const app = express();
app.use(express.static('public'));

app.get('/create', (req, res) => {
    res.json()
})



if (require.main === module) {
    app.listen(process.env.PORT || 8080, function() {
        console.info(`App is listening on ${this.address().port}`);
    });
}

module.exports = app;
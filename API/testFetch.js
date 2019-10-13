const fetch = require('node-fetch');

fetch("https://api.spoonacular.com/recipes/findByIngredients?ingredients=tomato&number=10&apiKey=74d571558c8c4b74895f3f8aa62a57a0").then(response => response.json())
.then(data => {
    console.log(data)
})
.catch(err => {
    console.log(err);
})
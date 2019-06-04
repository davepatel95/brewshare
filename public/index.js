let MOCK_COFFEE_REVIEWS = {
    "coffeeReviews": [
    {
        "id": "11111",
        "title": "Ethiopia from Augie's",
        "roasters": "Augie's Coffee Roasters",
        "beansOrigin": "Ethiopia",
        "flavorNotes": ["caramel", "cherry", "citrus"],
        "brewMethod": "Chemex",
        "description": "Delicious coffee with just the right touch of caramel sweetness. The fruitier notes were tougher to identify but overall a great brew. Very smooth and rich."
    },
    {
        "id": "22222",
        "title": "Colombia from Temple",
        "roasters": "Temple Coffee Roasters",
        "beansOrigin": "Colombia",
        "flavorNotes": ["nutty", "lavender", "citrus"],
        "brewMethod": "Kalita",
        "description": "Here is some filler. I love coffee. It keeps me productive. It wakes me up. It pushes me to new limits. It is a nectar I cherish."
    },
    {
        "id": "33333",
        "title": "Guatemala from Augie's",
        "roasters": "Augie's Coffee Roasters",
        "beansOrigin": "Guatemala",
        "flavorNotes": ["grapefruit", "zucchini", "citrus"],
        "brewMethod": "French Press",
        "description": "Here is some filler. I love coffee. It keeps me productive. It wakes me up. It pushes me to new limits. It is a nectar I cherish."
    },
    {
        "id": "44444",
        "title": "Brazil from Augie's",
        "roasters": "Augie's Coffee Roasters",
        "beansOrigin": "Brazil",
        "flavorNotes": ["chocolate", "caramel", "nutty"],
        "brewMethod": "V60",
        "description": "Here is some filler. I love coffee. It keeps me productive. It wakes me up. It pushes me to new limits. It is a nectar I cherish."
    },
]
}

function getCoffeeReviews(callback) {
setTimeout(function() {callback(MOCK_COFFEE_REVIEWS)}, 1);
}

function displayCoffeeReviews(data) {
for (index in data.coffeeReviews) {
    $('body').append(
        '<div class="review-div">' +
        '<p>Roasters: ' + data.coffeeReviews[index].roasters + '</p>' +
        '<p>Beans Origin: ' + data.coffeeReviews[index].beansOrigin + '</p>' +
        '<p>Flavor Notes: ' + data.coffeeReviews[index].flavorNotes + '</p>' +
        '<p>Brew Method: ' + data.coffeeReviews[index].brewMethod + '</p>' +
        '<p>Description: ' + data.coffeeReviews[index].description + '</p></div>');
        console.log(data.coffeeReviews);
    }
}

function getAndDisplayCoffeeReviews() {
getCoffeeReviews(displayCoffeeReviews);
}

$(function() {
getAndDisplayCoffeeReviews();
renderCreatePage();
})
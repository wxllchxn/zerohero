# importing the requests library 
import requests 

# key
# key = "tH5UspPaxlb0mfGCxQ9z​"

# api-endpoint 
URL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=tomato&number=10&apiKey=74d571558c8c4b74895f3f8aa62a57a0"

PARAMS = {}

# sending get request and saving the response as response object 
r = requests.get(url = URL)
  
# extracting data in json format 
data = r.json() 

print(data)
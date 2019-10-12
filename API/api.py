# importing the requests library 
import requests 

# key
key = "42e365dd904d4417a04c250f762d66c6"

# api-endpoint 
URL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=2?apiKey="+key

# sending get request and saving the response as response object 
r = requests.get(url = URL)
  
# extracting data in json format 
data = r.json() 

print(data)
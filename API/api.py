# importing the requests library 
import requests
import json

my_big_list = []

#----------------------------Getting Recipe By Ingredients------------------------------

url = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=5&apiKey=e8faf304b8f54e2088074eb4689a784e"

# sending get request and saving the response as response object 
response = requests.get(url).json()
r_json = json.dumps(response, indent = 4, ensure_ascii=False).encode('utf8')

with open('output.json', 'w') as f:
       f.write(r_json)

with open('output.json', 'r') as r:
       data = json.load(r)


#----------------------------Getting Recipe URL------------------------------
index = 0
for recipe in data:
       # print(recipe)
       recipe_list = {}
       recipe_list["id"] = data[index]["id"]
       recipe_list["imageURL"] = data[index]["image"]
       recipe_list["title"] = data[index]["title"]
       my_big_list.append(recipe_list)
       index += 1


url2 = "https://api.spoonacular.com/recipes/informationBulk?ids="

# print(my_big_list)

index2 = 0
for recipe in my_big_list:
       if index2 != len(my_big_list) - 1:
              url2 += str(my_big_list[index2]["id"]) + ","
       else:
              url2 += str(my_big_list[index2]["id"])
       index2 += 1

url2 += "&apiKey=e8faf304b8f54e2088074eb4689a784e"

# print(url2)

response2 = requests.get(url2).json()
# r_json2 = json.dumps(response2, indent = 4, ensure_ascii=False).encode('utf8')

# with open('output2.json', 'w') as f2:
#        f2.write(r_json2)

index2_1 = 0
for recipe in my_big_list:
       my_big_list[index2_1]["sourceURL"] = response2[index2_1]["sourceUrl"]
       index2_1 += 1


#----------------------------Getting Nutritional Data------------------------------

url3 = "https://api.spoonacular.com/recipes/"
url3_2 = "/nutritionWidget.json?apiKey=e8faf304b8f54e2088074eb4689a784e"

index3 = 0
# print(recipe_list)
for recipe in my_big_list:
       url_temp = url3 + str(my_big_list[index3]["id"]) + url3_2
       response3 = requests.get(url_temp).json()
       # r_json3 = json.dumps(response3, indent = 4, ensure_ascii=False).encode('utf8')
       # f3.write(r_json3)
       new_dict = {'carbs':response3['carbs'],'calories':response3['calories'],'fat':response3['fat'],'protein':response3['protein']}
       my_big_list[index3]["nutrition"] = new_dict
       index3 += 1


# for dicts in my_dict:
#        print(dicts)

with open('output3.json', 'w') as f3:
       json.dump(my_big_list, f3)
       f3.write('\n')
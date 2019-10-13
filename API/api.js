const fetch = require('node-fetch');

async function apicall(list){
    let my_big_list = []
    // ----------------------Getting Recipe By Ingredients-------------------------------
    let str1 = 'https://api.spoonacular.com/recipes/findByIngredients?ingredients=';
    // let str2 = 'apples,';
    // let str3 = 'flour,';
    // let str4 = 'sugar';
    for(let i = 0; i < list.length; ++i){
        if(i != list.length - 1){
            str1 += list[i] + ",";
        }
        else{
            str1 += list[i];
        }
    }
    let res, res2, res3 = [];
    str1 += '&number=10&apiKey=74d571558c8c4b74895f3f8aa62a57a0';
    fetch(str1)
        .then(out => res = out.json())
        .then(json => console.log(json));
    

    // ---------------------Getting Recipe URL by Recipe ID------------------------------

    for(let i = 0; i < res.length; ++i){
        let recipe_list = {};
        recipe_list["id"] = res[i]["id"];
        recipe_list["imageURL"] = res[i]["image"];
        recipe_list["title"] = res[i]["title"];
        my_big_list.push(recipe_list);
    }

    url2 = "https://api.spoonacular.com/recipes/informationBulk?ids=";


    for(let i = 0; i < my_big_list.length; ++i){
        if(i != my_big_list.length - 1){
            url2 += str(my_big_list[i]["id"]) + ",";
        } 
        else{
            url2 += str(my_big_list[i]["id"]);
        }
    }        

    url2 += "&apiKey=74d571558c8c4b74895f3f8aa62a57a0"

    fetch(url2)
        .then(out => res2 = out.json())
        .then(json => console.log(json));

    for(let i = 0; i < my_big_list.length; ++i){
        my_big_list[i]["sourceURL"] = res2[i]["sourceUrl"]
    }    

    // ---------------------Getting Nutrition Data by Recipe ID-------------------------

    url3 = "https://api.spoonacular.com/recipes/";
    url3_2 = "/nutritionWidget.json?apiKey=74d571558c8c4b74895f3f8aa62a57a0";

    for(let i = 0; i < my_big_list.length; ++i){
        url_temp = url3 + str(my_big_list[i]["id"]) + url3_2;
        fetch(url_temp)
            .then(out => res3 = out.json())
            .then(json => console.log(json));
        new_dict = {'carbs':res3['carbs'],'calories':res3['calories'],'fat':res3['fat'],'protein':res3['protein']};
        my_big_list[i]["nutrition"] = new_dict;
    }

    let big_json = JSON.stringify(my_big_list);
    console.log(big_json)
}

apicall(["apple","orange","banana"])
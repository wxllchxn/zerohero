import React from 'react';
import {Button, ImageStore, ImageEditor, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { Linking} from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements'
const fetch = require('node-fetch');

const url = 'https://us-central1-kaggle-160323.cloudfunctions.net/fruits-and-veggies-1';
// const twilioURL = 'https://us-central1-kaggle-160323.cloudfunctions.net/function-1';

let currentString = 0;

let sample_temp = [
    {
       "title":"Brown Butter Apple Crumble",
       "nutrition":{
          "carbs":"57g",
          "calories":"339",
          "protein":"2g",
          "fat":"12g"
       },
       "imageURL":"https://spoonacular.com/recipeImages/534573-312x231.jpg",
       "sourceURL":"http://sarahscucinabella.com/2010/10/06/brown-butter-apple-crumble/",
       "id":534573
    },
    {
       "title":"Cinnamon Apple Crisp",
       "nutrition":{
          "carbs":"64g",
          "calories":"347",
          "protein":"2g",
          "fat":"9g"
       },
       "imageURL":"https://spoonacular.com/recipeImages/47950-312x231.jpg",
       "sourceURL":"http://www.landolakes.com/recipe/3168/cinnamon-apple-crisp",
       "id":47950
    },
    {
       "title":"Apple fritters",
       "nutrition":{
          "carbs":"43g",
          "calories":"280",
          "protein":"4g",
          "fat":"10g"
       },
       "imageURL":"https://spoonacular.com/recipeImages/556470-312x231.jpg",
       "sourceURL":"http://en.julskitchen.com/other/life/apple-fritters",
       "id":556470
    },
    {
       "title":"Apple Crumble Recipe",
       "nutrition":{
          "carbs":"34g",
          "calories":"196",
          "protein":"2g",
          "fat":"6g"
       },
       "imageURL":"https://spoonacular.com/recipeImages/48191-312x231.jpg",
       "sourceURL":"http://www.jamieoliver.com/recipes/fruit-recipes/apple-crumble",
       "id":48191
    },
    {
       "title":"Apple Tart",
       "nutrition":{
          "carbs":"38g",
          "calories":"278",
          "protein":"3g",
          "fat":"13g"
       },
       "imageURL":"https://spoonacular.com/recipeImages/47732-312x231.jpg",
       "sourceURL":"http://orangette.blogspot.com/2008/10/this-old-thing.html",
       "id":47732
    }
 ]

let model_output;

let global_photo;

class HomeScreen extends React.Component  {
    state = {
        text: "",
        imgUrl: "assets/icon.png",
        sample: [{
            "title":"No Recipes Yet! Check back after you take a photo",
            "nutrition":{
               "carbs":"",
               "calories":"",
               "protein":"",
               "fat":""
            },
            "imageURL":"",
            "sourceURL":"",
        }]
    };

    async apicall(list){
        let key = "0ed3927ac03d47348f1a300041d8a565";
        let my_big_list = []
        let promises = []
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
        str1 += '&number=10&apiKey='+key;

        fetch(str1).then(response => response.json())
        .then(data => {
            res = data;
        }).then(()=>{
            for(let i = 0; i < res.length; ++i){
                let recipe_list = {};
                recipe_list["id"] = res[i]["id"];
                recipe_list["imageURL"] = res[i]["image"];
                recipe_list["title"] = res[i]["title"];
                my_big_list.push(recipe_list);
            }

            let url2 = "https://api.spoonacular.com/recipes/informationBulk?ids=";
        
            for(let i = 0; i < my_big_list.length; ++i){
                if(i != my_big_list.length - 1){
                    url2 += my_big_list[i]["id"].toString() + ",";
                } 
                else{
                    url2 += my_big_list[i]["id"].toString();
                }
            }
        
            url2 += "&apiKey="+key;
            
            fetch(url2).then(response => response.json())
                .then(out => {
                    console.log("out")
                    console.log(out)
                    res2 = out
                }).then(()=>{
                    // ---------------------Getting Recipe URL by Recipe ID------------------------------

                    for(let i = 0; i < my_big_list.length; ++i){
                        my_big_list[i]["sourceURL"] = res2[i]["sourceUrl"]
                    }    
                
                    // ---------------------Getting Nutrition Data by Recipe ID-------------------------
                
                    let url3 = "https://api.spoonacular.com/recipes/";
                    let url3_2 = "/nutritionWidget.json?apiKey="+key;
                
                    for(let i = 0; i < my_big_list.length; ++i){
                        let url_temp = url3 + my_big_list[i]["id"].toString() + url3_2;
                        let promise = fetch(url_temp).then(response => response.json())
                            .then(out => res3 = out)
                            .then(()=>{
                                let new_dict = {'carbs':res3['carbs'],'calories':res3['calories'],'fat':res3['fat'],'protein':res3['protein']};
                                console.log("new dict");
                                console.log(new_dict)
                                my_big_list[i]["nutrition"] = new_dict;
                            });
                        promises.push(promise);
                    }

                    Promise.all(promises).then(()=>{
                        console.log("my big list");
                        console.log(my_big_list);
            
                        // sample = JSON.stringify(my_big_list);
                        // this.setState({sample: JSON.stringify(my_big_list)}).then(()=>{
                        //     console.log("this.state.sample");
                        //     console.log(this.state.sample);
                        // });

                        // write 
                        this.props.navigation.navigate('Details', {input: my_big_list})
                    })
                })
        })
        .catch(err => {
            console.log(err);
        })
    }

    async submitToModel(modelURL, imageURI, success) {
        Image.getSize(imageURI, (width, height) => {
            var imageSize = {
                size: {
                    width: width,
                    height: height
                },
                offset: {
                  x: 0,
                  y: 0,
                },
            };
            ImageEditor.cropImage(imageURI, imageSize, (imageURIout) => {
                ImageStore.getBase64ForTag(imageURIout, data => {
                    console.log(data);
                    fetch(modelURL, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            data: data
                        }),
                    }).then(response => model_output = response.json()).then(success);
                }, reason => {
                        console.log("Image Base64 conversion failed");
                        console.log(reason)
                } )
            }, reason => console.log(reason) )
        }, reason => console.log(reason))
    }

    isImpossibleDuplicate(c) {
        if (c !== this.state.text.slice(-1)) return false;
        else return (c !== 'L' && c !== 'P') || (this.state.text.slice(-1) === this.state.text.slice(-2, -1));
    }

    async predict(uri) {
      // this.setState({text: this.state.text + 'x'})
        let response;
        this.submitToModel(url, uri, res => { // submit to model
            // console.log("Model Response")
            // console.log(model_output._55[0].payload)
            response = model_output;
        }).then(()=>{
            // process model output
            // TODO .then api call with model output
            // apicall(["apple","orange","banana"])
            // store result in sample
            let payload = model_output._55[0].payload;
            let fruitlist = [];
            console.log(payload);
            for(let result of payload){
                console.log('Predicted class name: '+result.displayName);
                fruitlist.push(result.displayName);
            }
            this.apicall(fruitlist);
        });
    }

    switch(){
        console.log("switch")
        console.log(this.state.sample)
        this.props.navigation.navigate('Details')
    }

    render() {
        return (
            <View style={styles.container}>
                <CustomCamera ref={ref => this.customCamera = ref} onSnap={img => {
                    const manipulated = ImageManipulator.manipulateAsync(img.uri, [{
                        resize: {
                            width: 500,
                            height: 400
                        },

                    }, {
                        rotate: 0
                    }]);

                    manipulated.then((img2) => {
                        // console.log(img);
                        this.predict(img2.uri);
                        this.setState({imgUrl: img2.uri});
                    });
                }}/>
                <View style={styles.bottomBox}>
                    {/* <Text>{currentString}</Text> */}
                    <Image source={{uri: this.state.imgUrl}} style={{width: 300, height: 250}}/>
                    <Button title="Take Picture of Ingredients" style={{flex: 1}} onPress={() => {
                        if (this.customCamera) this.customCamera.snap()
                    }}/>
                </View>
            </View>
        );
    }
}

class CustomCamera extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    };

    async componentWillMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
    }

    async snap() {
        if (this.camera) {
            let photo = await this.camera.takePictureAsync({
                onPictureSaved: this.props.onSnap,
                skipProcessing: true
            })
            global_photo = photo;
        }
    }

    render() {
        const {hasCameraPermission} = this.state;
        if (hasCameraPermission === null) {
            return <View/>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{flex: 1}}>
                    <Camera style={styles.cameraView}
                            type={this.state.type}
                            ref={ref => {
                                this.camera = ref;
                            }}
                            pictureSize="2560x1440">
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Text
                                    style={{fontSize: 18, marginBottom: 10, color: 'white'}}>
                                    {' '}Flip{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}

class DetailsScreen extends React.Component {
    state = {
        text: [],
    };
    

    process() {
        // implemented with Text and Button as children

        return this.props.navigation.getParam('input', 'default value').map(function(item, i){
            // console.log(item)
            return(<Card
                image={{uri: item.imageURL}}>
                <Text style={{fontSize: 25, marginBottom: 10}}>
                    {item.title}
                </Text>
                <Text style={{fontSize: 15, marginBottom: 10}}>
                    Nutritional Value
                </Text>
                <Text style={{marginBottom: 10}}>
                    Carbs: {item.nutrition.carbs}
                </Text>
                <Text style={{marginBottom: 10}}>
                    Calories: {item.nutrition.calories}
                </Text>
                <Text style={{marginBottom: 10}}>
                    Protein: {item.nutrition.protein}
                </Text>
                <Text style={{marginBottom: 10}}>
                    Fat: {item.nutrition.fat}
                </Text>
                <Button
                    icon={<Icon name='code' color='#ffffff' />}
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    onPress={ ()=> Linking.openURL(item.sourceURL) }
                    title='VIEW RECIPE' />
            </Card>);
        });
    }

    render() {  
      return (  
        <ScrollView style={{ flex: 1, marginBottom: 50, marginTop: 20, marginLeft: 0, marginRight: 0, width: 415}}>
            <Text style={{ flex: 1, fontSize: 30, marginBottom: 10, marginLeft: 20}} >Suggested Recipes</Text>
            {this.process()}
            <Button
                title="Take another Image"
                onPress={() => this.props.navigation.navigate('Home')}
            />
        </ScrollView>
        );
    }
}
  
const RootStack = createStackNavigator({
    Home: HomeScreen,
    Details: DetailsScreen,
});
  
export default createAppContainer(RootStack);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    cameraView: {
        flex: 2,
    },

    bottomBox: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // text: {
    //     flex: 1,
    //     fontSize: 30,
    //     marginBottom: 10,
    // },

    // smallerText: {
    //     flex: 1,
    //     fontSize: 20,
    // },
});
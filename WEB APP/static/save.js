
// var save_button = document.getElementById('save_button');
var specieslist = document.getElementById('specieslist');
var diseaselist = document.getElementById("diseaselist");


var disease = ['Apple','Cherry','Corn (maize)', 'Grape','Peach','Tomato', 'Pepper bell','Potato','Strawberry'];
var Apple =['Apple scab','Black rot','Cedar apple rust','healthy'];
var Cherry = ['healthy','Powdery mildew'];
var Corn = ['Cercospora leaf spot Gray leaf spot','Common rust','healthy','Northern Leaf Blight'];
var Grape = ['Black rot','Esca (Black Measles)','healthy','Leaf blight (Isariopsis Leaf Spot)'];
var Peach = ['Bacterial spot','healthy'];
var Tomato = ['Bacterial spot','Early blight','healthy','Late blight','Leaf Mold','Septoria leaf spot','Spider mites Two-spotted spider mite','Target Spot','Tomato mosaic virus','Tomato Yellow Leaf Curl Virus'];
var Pepper = ['Bacterial spot','healthy'];
var Potato = ['Early blight','healthy','Late blight'];
var Strawberry = ['healthy','Leaf scorch'];

document.getElementById('new_image_button').style.display ='none';
document.getElementById('diseaselist').disabled = true;


for (i=0;i<disease.length;i++) {
  specieslist.options[i] = new Option(disease[i],disease[i]);
} 


function getdiseaselist(){
    var specieslist = document.getElementById('specieslist');
    var diseaselist = document.getElementById("diseaselist");
    var speciesSelectedValue = specieslist.options[specieslist.selectedIndex].value;
	document.getElementById('diseaselist').disabled = false;

     
    if (speciesSelectedValue==disease[0])//'Apple'
    {
        diseaselist.options.length=0;
        for (i=0;i<Apple.length;i++) {
		  diseaselist.options[i] = new Option(Apple[i],Apple[i]);
		}                  
    }
    else if (speciesSelectedValue==disease[1])//'Cherry'
    {
         
        diseaselist.options.length=0;
        for (i=0;i<Cherry.length;i++) {
		  diseaselist.options[i] = new Option(Cherry[i],Cherry[i]);
		} 
         
    }
    else if (speciesSelectedValue==disease[2])//'Corn (maize)'
    {
         
        diseaselist.options.length=0;
        for (i=0;i<Corn.length;i++) {
		  diseaselist.options[i] = new Option(Corn[i],Corn[i]);
		} 
         
    }
    else if (speciesSelectedValue==disease[3])//'Grape'
    {
         
        diseaselist.options.length=0;
        for (i=0;i<Grape.length;i++) {
		  diseaselist.options[i] = new Option(Grape[i],Grape[i]);
		} 
         
    }
    else if (speciesSelectedValue==disease[4])//Peach
    {
         
        diseaselist.options.length=0;
        for (i=0;i<Peach.length;i++) {
		  diseaselist.options[i] = new Option(Peach[i],Peach[i]);
		} 
         
    }
    else if (speciesSelectedValue==disease[5])//'Tomato'
    {
         
        diseaselist.options.length=0;
        for (i=0;i<Tomato.length;i++) {
		  diseaselist.options[i] = new Option(Tomato[i],Tomato[i]);
		} 
         
    }
    else if (speciesSelectedValue==disease[6])//'Pepper'
    {
         
        diseaselist.options.length=0;
        for (i=0;i<Pepper.length;i++) {
		  diseaselist.options[i] = new Option(Pepper[i],Pepper[i]);
		} 
         
    }
    else if (speciesSelectedValue==disease[7])//'Potato'
    {
         
        diseaselist.options.length=0;
        for (i=0;i<Potato.length;i++) {
		  diseaselist.options[i] = new Option(Potato[i],Potato[i]);
		} 
         
    }
    else if (speciesSelectedValue==disease[8])//'Strawberry'
    {
         
        diseaselist.options.length=0;
        for (i=0;i<Strawberry.length;i++) {
		  diseaselist.options[i] = new Option(Strawberry[i],Strawberry[i]);
		} 
         
    }
}




$("#save_image_button").click(function(event){       
    var speciesSelectedValue = specieslist.options[specieslist.selectedIndex].value;
    var diseaseSelectedValue = diseaselist.options[diseaselist.selectedIndex].value;
    var image_saved_response = document.getElementById('image_saved_response');

  
  	var message = {'speciesSelectedValue' : speciesSelectedValue,
  	 				'diseaseSelectedValue': diseaseSelectedValue
  	 			};
	console.log(message)
  	message = JSON.stringify(message);

	$.ajax({
		type: 'POST',
		url: "/folders",
		data: message,
		contentType: 'application/json',
		success: function(){console.log('folders posted successfully!')},
		error: function(){alert('something went wrong during folders post')},
	});


	image_saved_response.innerHTML = 'Image saved successfully!'
	document.getElementById('new_image_button').style.display ='inline';



	}
	
);



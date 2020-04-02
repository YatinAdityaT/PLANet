///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//index.html

var hue_lower = document.getElementById("hue_lower");
var saturation_lower = document.getElementById("saturation_lower");
var value_lower = document.getElementById("value_lower");

var hue_higher = document.getElementById("hue_higher");
var saturation_higher = document.getElementById("saturation_higher");
var value_higher = document.getElementById("value_higher");


var output_hue_lower = document.getElementById("output_hue_lower");
var output_saturation_lower = document.getElementById("output_saturation_lower");
var output_value_lower = document.getElementById("output_value_lower");

var output_hue_higher = document.getElementById("output_hue_higher");
var output_saturation_higher = document.getElementById("output_saturation_higher");
var output_value_higher = document.getElementById("output_value_higher");


var prediction_segmentation = document.getElementById('prediction_segmentation')
if (prediction_segmentation != null) {
	prediction_segmentation.style.display ='none';
}


if (hue_lower != null) {

	output_hue_lower.innerHTML = hue_lower.value; 
	output_saturation_lower.innerHTML = saturation_lower.value; 
	output_value_lower.innerHTML = value_lower.value; 


	output_hue_higher.innerHTML = hue_higher.value; 
	output_saturation_higher.innerHTML = saturation_higher.value; 
	output_value_higher.innerHTML = value_higher.value;

	//display slider values next to sliders
	hue_lower.oninput = function() {
		output_hue_lower.innerHTML = this.value;
	} 

	saturation_lower.oninput = function() {
		output_saturation_lower.innerHTML = this.value;
	} 

	value_lower.oninput = function() {
		output_value_lower.innerHTML = this.value;
	} 

	hue_higher.oninput = function() {
		output_hue_higher.innerHTML = this.value;
	} 

	saturation_higher.oninput = function() {
		output_saturation_higher.innerHTML = this.value;
	} 

	value_higher.oninput = function() {
		output_value_higher.innerHTML = this.value;		
	} 

	//post slider values
	$('.slider').change(function(){
		var data_out = {

				"R_l" : $("#hue_lower").val(),
				"G_l" : $("#saturation_lower").val(),
				"B_l" : $("#value_lower").val(),

				"R_h" : $("#hue_higher").val(),
				"G_h" : $("#saturation_higher").val(),
				"B_h" : $("#value_higher").val()

			}

		//console.log(data_out)

		$.ajax({
			type: 'POST',
			url: "/jsondata",
			data: data_out,
			success: function(){console.log('ajax posted successfully!')},
			error: function(){alert('something went wrong during ajax post')},
		});

	});

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//save.html

// var save_button = document.getElementById('save_button');
var specieslist = document.getElementById('specieslist');
var diseaselist = document.getElementById("diseaselist");

var species = ['Apple','Cherry','Corn (maize)', 'Grape','Peach','Tomato', 'Pepper bell','Potato','Strawberry'];
var Apple =['Apple scab','Black rot','Cedar apple rust','healthy'];
var Cherry = ['healthy','Powdery mildew'];
var Corn = ['Cercospora leaf spot Gray leaf spot','Common rust','healthy','Northern Leaf Blight'];
var Grape = ['Black rot','Esca (Black Measles)','healthy','Leaf blight (Isariopsis Leaf Spot)'];
var Peach = ['Bacterial spot','healthy'];
var Tomato = ['Bacterial spot','Early blight','healthy','Late blight','Leaf Mold','Septoria leaf spot','Spider mites Two-spotted spider mite','Target Spot','Tomato mosaic virus','Tomato Yellow Leaf Curl Virus'];
var Pepper = ['Bacterial spot','healthy'];
var Potato = ['Early blight','healthy','Late blight'];
var Strawberry = ['healthy','Leaf scorch'];

//diable disease dropdown until species is selected
var diseaselist = document.getElementById('diseaselist')
if (diseaselist != null) {
	diseaselist.disabled = true;
}

//hide the new image button for now
var new_image_button = document.getElementById('new_image_button')
if (new_image_button != null) {
	new_image_button.style.display ='none';
}

//add all species to the species dropdown
if (specieslist != null) {
	for (i=0;i<species.length;i++) {
	  specieslist.options[i] = new Option(species[i],species[i]);
	} 
}

//function add diseases wrt the species selected
function getdiseaselist(){
    var specieslist = document.getElementById('specieslist');
    var diseaselist = document.getElementById("diseaselist");
    var speciesSelectedValue = specieslist.options[specieslist.selectedIndex].value;
	document.getElementById('diseaselist').disabled = false;

    if (speciesSelectedValue==species[0])//'Apple'
    {
        diseaselist.options.length=0;
        for (i=0;i<Apple.length;i++) {
		  diseaselist.options[i] = new Option(Apple[i],Apple[i]);
		}                  
    }
    else if (speciesSelectedValue==species[1])//'Cherry'
    {         
        diseaselist.options.length=0;
        for (i=0;i<Cherry.length;i++) {
		  diseaselist.options[i] = new Option(Cherry[i],Cherry[i]);
		} 
         
    }
    else if (speciesSelectedValue==species[2])//'Corn (maize)'
    {         
        diseaselist.options.length=0;
        for (i=0;i<Corn.length;i++) {
		  diseaselist.options[i] = new Option(Corn[i],Corn[i]);
		} 
         
    }
    else if (speciesSelectedValue==species[3])//'Grape'
    {         
        diseaselist.options.length=0;
        for (i=0;i<Grape.length;i++) {
		  diseaselist.options[i] = new Option(Grape[i],Grape[i]);
		} 
         
    }
    else if (speciesSelectedValue==species[4])//Peach
    {         
        diseaselist.options.length=0;
        for (i=0;i<Peach.length;i++) {
		  diseaselist.options[i] = new Option(Peach[i],Peach[i]);
		} 
         
    }
    else if (speciesSelectedValue==species[5])//'Tomato'
    {         
        diseaselist.options.length=0;
        for (i=0;i<Tomato.length;i++) {
		  diseaselist.options[i] = new Option(Tomato[i],Tomato[i]);
		} 
         
    }
    else if (speciesSelectedValue==species[6])//'Pepper'
    {
        diseaselist.options.length=0;
        for (i=0;i<Pepper.length;i++) {
		  diseaselist.options[i] = new Option(Pepper[i],Pepper[i]);
		} 
         
    }
    else if (speciesSelectedValue==species[7])//'Potato'
    {   
        diseaselist.options.length=0;
        for (i=0;i<Potato.length;i++) {
		  diseaselist.options[i] = new Option(Potato[i],Potato[i]);
		} 
         
    }
    else if (speciesSelectedValue==species[8])//'Strawberry'
    {
        diseaselist.options.length=0;
        for (i=0;i<Strawberry.length;i++) {
		  diseaselist.options[i] = new Option(Strawberry[i],Strawberry[i]);
		}      
    }
}

//once save image button is clicked, post the species and disease info to /folders api
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//predict.html

//add species to the species dropdown list
var specieslist_predict = document.getElementById('specieslist_predict');
if (specieslist_predict != null) {
	for (i=0;i<species.length;i++) {
	  specieslist_predict.options[i] = new Option(species[i],species[i]);
	} 
}

//display the selected image
var base64Image; // defining a variable called base64Image that has a scope in this block only
$("#image-selector").change(function(){ // checking if a change occured in image-selector
        let reader = new FileReader(); // gets a filereader object and assigns it to reader
        reader.onload = function(e){//triggered when read operation is compleated successfully
	            let dataURL= reader.result; // returns the file's contents

	            $('#selected-image').attr('src',dataURL); // sets src of selected-image to be the dataURL of the image
	            base64Image = dataURL.replace("data:image/png;base64,","");
	            console.log('base64Image',base64Image)
	        }
        reader.readAsDataURL($("#image-selector")[0].files[0]);
    }
);

//hide the loading screen
var loader_wrapper = document.getElementById('loader_wrapper')
var hide = document.getElementById('hide')

if (loader_wrapper != null) {
	loader_wrapper.style.display='none';
}

//post image and species to /predict
$("#predict-button").click(function(event)
	{    
		var speciesSelectedValue_predict = specieslist_predict.options[specieslist_predict.selectedIndex].value;
		var message = {
			image: base64Image,
			SelectedValue:speciesSelectedValue_predict
		}; 

		message = JSON.stringify(message);
		hide.style.display='none';
		loader_wrapper.style.display='inline';

		$.ajax({
			type: 'POST',
			url: "/predict",
			data: message,
			contentType: 'application/json',
			success: function(){console.log('image posted successfully!')},
			error: function(){alert('something went wrong during image post')},
		});
	}
);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

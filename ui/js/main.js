$(document).ready(function(){

  /*
  * gets executed when "Submit Button is clicked"
  */
  $('.findButton').click(function () {
    var data=$('form').serialize();

    // AJAX request to api1 to get list of symptom
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function() {
      if(this.readyState==4 && this.status==200){
        let res=JSON.parse(this.responseText);
        let doc;

        if('_id' in res){
          // If the DB already contain desired Symptom
          console.log('Already Present');
          doc=JSON.parse(this.responseText);
          // If the DB already contain desired Symptom
        }
        else{
          // If the DB doesn't contain the desired Symptom
          $('.displayInfo').html('Fetching Diagnosis');

          /*
          * API 2 is responsible for fetching multiple
          * available Diagnosis for given Symptom
          */
          ajaxCall('http://localhost:3000/api2',"GET",'');  // AJAX call to second API

          /*
          * API 3 is responsible for fetching various treatment
          * available for Diagnosis AND store in DB
          */
          doc=ajaxCall('http://localhost:3000/api3',"GET",'');  // AJAX call to third API

          if(doc===undefined){
            alert('Internal Server Error');
          }

        }
        fillInformation(doc);

      }
      else if(this.readyState==4 && this.status==401){
        // Symtpom not found
        $('.load').hide();
        $('.displayInfo').html('Symptom Not Found');
      }
      else if(this.status==500){
        // Server Error :(
        $('.load').hide();
        $('.displayInfo').html('Internal Server Error');
      }
      else{
        $('.loader').show();
      }
    };
    xhttp.open("POST", "http://localhost:3000/api1", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(data);

  });

  /*
  * function gets executed when "Find Me Nearest Doctor" is clicked
  */
  $('.fetchDoc').click(function() {
    // verifies if the user browser supports GeoLocation feature or not
    if(navigator.geolocation){
      // supports
      navigator.geolocation.getCurrentPosition(function (position) {
        let symp=$('.symptomInfo').text();
        let url='http://localhost:3000/api4?loc='+position.coords.latitude+','+position.coords.longitude+'&symptom='+symp;
        let res=ajaxCall(encodeURI(url),"GET",'');
        writeInfo(res,position.coords.latitude,position.coords.longitude);
      });
    }
    else{
      alert('Sorry! geolocation is not supported in your brower.');
    }
  });

  /*
  * function gets executed when "Go to Symptom form" is clicked
  */
  $('.backToForm').click(function () {
    $('.tableContainer').hide();
    $('.formContainer').show();
    $('.loader').hide();
  });
});

/*
* function used for multiple AJAX calls
*/
function ajaxCall(url,method,data) {
  let response='';
  let xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange=function () {
    if(this.readyState==4 && this.status==200){
      response=JSON.parse(this.responseText);
    }
    else if(this.status==500){
      response=undefined;
    }
  };
  xhttp.open(method, url, false);
  xhttp.send();
  return response;
}

/*
* function used to fill Information about a symptom
*/
function fillInformation(response) {
  $('.symptomInfo').html(response.symptom.toUpperCase());

  let data=`<table class="table"><thead><tr>
  <th>Diagnosis</th><th>Diagnosis Prof. Name</th><th>Treatment</th>
  </tr></thead><tbody>`;
  let arr=response.diagnosis;

  for(i=0;i<arr.length;i++){
    let ol=`<ol>`;

    for(j=0;j<arr[i].treatment.length;j++){
      ol+=`<li>`+arr[i].treatment[j]+`</li>`;
    }

    ol+=`</ol>`;

    data+=`<tr>
    <td>`+arr[i].diagName+`</td><td>`+arr[i].diagProfName+
    `</td><td>`+ol+`</td></tr>`;
  }
  data+=`</tbody></table>`;
  $('.fillInfo').html(data);

  $('.formContainer').hide();
  $('.tableContainer').show();
}

/*
* function used to find Doctor Info
*/
function writeInfo(response,lat,long) {
  if(response.length==0){
    alert('No Data Available');
  }
  var data='';
  for(i=0;i<response.length;i++){
    data+=`<div class="card" style="margin-bottom:2%;">
      <div class="card-header">
        <span class="font-weight-light" style="font-size:1.3em;">`
              +response[i].formatted_address+
        `</span>
      </div>
      <div class="card-body">
        <h3 style="color:#1da1f2;">`+response[i].name+`</h3><br>
      </div>
      <div class="card-footer">
            Rating `+response[i].rating+`<br>
            Distance `+distance(lat,long,response[i].geometry.location.lat,response[i].geometry.location.lng,'K')+` Km.
          </div>
        </div>


      </div>
    </div>`;
  }
  $('.docInfo').html(data);
}

/*
* function used to calculate Distance to doctor
*/
function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return Math.floor(dist)
}

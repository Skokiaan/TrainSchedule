  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCIcKzSXZ9Neh5UA1ymT3gYnr8OFjYPJP8",
    authDomain: "train-schedule-63e8c.firebaseapp.com",
    databaseURL: "https://train-schedule-63e8c.firebaseio.com",
    storageBucket: "train-schedule-63e8c.appspot.com",
    messagingSenderId: "641487078542"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // button for adding new train
$("#add-train-btn").on("click", function(event){
  		event.preventDefault();

// captures user input
  	var trainName = $("#train-name-input").val().trim();
  	var trainDestination = $("#destination-input").val().trim();
	var trainFirst = moment($("#first-train-input").val().trim(),"HH:mm").format("X");
	var trainFrequency = $("#frequency-input").val().trim();

//Temporary object to hold train data
	var newTrain = {
		name: trainName,
		dest: trainDestination,
		first: trainFirst,
		freq: trainFrequency
	};

// Upload train data to database
	database.ref().push(newTrain);

//cosole logs
	console.log(newTrain.name);
	console.log(newTrain.dest);
	console.log(newTrain.first);
	console.log(newTrain.freq);

	// alert("New train successfully added");

// Clear text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

   // Prevents moving to new page
  return false;

  });

//  Firebase event for adding new train to the database 
//  Adds a row in the html when a user adds a train 

database.ref().on("child_added", function(childSnapshot, parent){
	console.log(childSnapshot.val());

// Storage variables
	var trainName = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().dest;
	var trainFirst = childSnapshot.val().first;
	var trainFrequency = childSnapshot.val().freq;

//Train info
	console.log(trainName);
	console.log(trainDestination);
	console.log(trainFirst);
	console.log(trainFrequency);

// trainFirst (pushed back 1 year to make sure it comes before current time)
    var trainFirstConverted = moment.unix(trainFirst, "HH:mm").subtract(1, "years");
    console.log(trainFirstConverted);

// Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

// Difference between the times
	// console.log('here, have a moment: ', moment());
    var diffTime = moment().diff(moment.unix(trainFirstConverted), "minutes");
    console.log("Difference in time: " + diffTime);
  
// Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

// Minutes Until Train
    var minutesTillTrain = trainFrequency - tRemainder;
    console.log("Minutes to Next Train: " + minutesTillTrain);

// Next Train
    var nextTrain = moment().add(minutesTillTrain, "minutes").format("hh:mm A");
    console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

  // Add each train's data into the table
	$("#schedule-table > tbody").append("<tr><td>" + trainName + "</td><td>" 
	+ trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain 
	+ "</td><td>" + minutesTillTrain + "</td></tr>");

});

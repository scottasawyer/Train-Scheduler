var timeNow;
var userTime;
var userHour;
var userMinute;
var trainName;
var trainDestination;
var trainTime;
var trainFrequency;

function checkTime() {
    console.log("userTime: " + userTime);
    console.log("timeNow: " + timeNow);

    // adds to userTime until it's after timeNow
    while (moment(userTime).isBefore(timeNow)) {
        userTime = moment(userTime, "YYYY/MM/DD kk:mm").add(trainFrequency, "minutes").format("YYYY/MM/DD kk:mm");
    }
    console.log("New userTime: " + userTime);
}


// Initialize Firebase
var config = {
    apiKey: "AIzaSyA3E4pjpmoNSODWfH1eGCd1bVPztXTPd7c",
    authDomain: "train-scheduler-cb86a.firebaseapp.com",
    databaseURL: "https://train-scheduler-cb86a.firebaseio.com",
    projectId: "train-scheduler-cb86a",
    storageBucket: "",
    messagingSenderId: "114829565839"
};
firebase.initializeApp(config);

var database = firebase.database();

//adding train lines
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();


    trainName = $("#display-train-name").val().trim();
    trainDestination = $("#display-destination").val().trim();
    trainTime = $("#display-first-train-time").val().trim();
    trainFrequency = $("#display-frequency").val().trim();

    if (!trainName) {

    } else {

        // sets timeNow when you click submit
        timeNow = moment().format("YYYY/MM/DD kk:mm");

        // gets First Train Time from user input | sets date to today
        userHour = trainTime.substring(0, 2);
        userMinute = trainTime.substring(3, 5);
        userTime = moment().set("hour", userHour).set("minute", userMinute).format("YYYY/MM/DD kk:mm");


        checkTime();

        var userTimeFormatted = moment(new Date(userTime));
        var timeNowFormatted = moment(new Date(timeNow));

        // gets difference between Next Train Coming and timeNow
        var timeDifference = moment.duration(userTimeFormatted.diff(timeNowFormatted));
        var hoursRemaining = Math.floor(timeDifference.asHours());
        var minutesRemainingUnchanged = timeDifference.asMinutes();
        var minutesRemaining = minutesRemainingUnchanged - (hoursRemaining * 60);

        // combines hrs and mins into a string
        var timeRemaining;
        if (hoursRemaining > 0) {
            timeRemaining = hoursRemaining + " hrs " + minutesRemaining + " mins";
        } else {
            timeRemaining = minutesRemaining + " mins";
        }


        var newTrain = {
            name: trainName,
            destination: trainDestination,
            frequency: trainFrequency,
            nextArrival: userTime,
            minutesAway: timeRemaining
        };
    };

    // Uploads train data to firebase 
    database.ref().push(newTrain);

    // Clears all of the input fields
    $("#display-train-name").val("");
    $("#display-destination").val("");
    $("#display-first-train-time").val("");
    $("#display-frequency").val("");


});


database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var trainNextArrival = childSnapshot.val().nextArrival;
    var trainMinutesAway = childSnapshot.val().minutesAway;


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(trainNextArrival.substring(11, 16)),
        $("<td>").text(trainMinutesAway),
    );

    // Append the new row to the table
    $("#display-new-row").append(newRow);

});
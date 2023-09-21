let selectedAttendees = [];
let registrationCounter = 0;

// allows close modal from the popup  
window.closeModal = function () {
    $('#addAttendeeModal1').modal('hide');
};

$(document).ready(function(){

    let courseId = "{{request.params['id'] | xml_escape}}";

    //Get the image
    webapi.safeAjax({
        type: "GET",
        url: "/_api/msdynce_courses({{request.params['id']}})/msdynce_entityimage/?size=full",
        contentType: "application/json",
        success: function (res, status) {
            if (res){
                imgBaseString = res.value;
                $(".image-view").attr("src", "data:image/png;base64," + imgBaseString);
            }
        }
    });

    $(".card-body span.date").each(function(){
        var date = moment.utc(this.innerHTML);
        $(this).text(moment(date).local().format("MMMM DD"));
    });

    $(".card-body span.time").each(function(){
        var time = moment.utc(this.innerHTML);
        $(this).text(moment(time).local().format("hh:mm a"));
    });

    {% if user and user.roles contains 'C1 ASP' %}
    $(".back-container a").attr("href", "{{ sitemarkers['C1 Home'].url }}");
    $(".back-container a>span").text("{{snippets['Text/Back to my courses']}}");
    {% endif %}

    $(".child-selection-container input[type='checkbox']").on("change", function(){
        if (this.checked)
            selectedAttendees.push(this.value);
        else {
            var pos = selectedAttendees.indexOf(this.value);
            selectedAttendees.splice(pos, 1);
        }
    });

    {% if user %}
    {% unless user.roles contains 'C1 ASP' %}
    $(".child-selection-container img:not(.child-selection-container img:last-child)").each(function(){
        var imgURL = "";
        var objectId = this.dataset.contact;
        var currentElement = this;
        webapi.safeAjax({
        type: "GET",
        url: "/_api/contacts(" + objectId + ")?$select=entityimage",
        contentType: "application/json",
        success: function (res, status) {
            if (res.entityimage){
                var imgBaseString = res.entityimage;
                var imgHTML = "";
                imgURL = "data:image/png;base64," + imgBaseString;
                $(currentElement).attr("src", imgURL);
            }   
        }
        });
    });
    {% endunless %}
    {% endif %}

    $("#registerBtn").on("click", function(e){
        e.preventDefault();
        {% if user %}
        {% unless user.roles contains 'C1 ASP' %}
        //Remove any alerts
        $(".alert-danger").remove();
        registrationCounter = 0;
        if (selectedAttendees.length > 0){
            //Validate that there are still spots available
            webapi.safeAjax({
            type: "GET",
            url: "/_api/msdynce_courses(" + courseId + ")?$select=msdynce_registeredparticipants,msdynce_filledpercent," +
            "msdynce_registerationmaxcapacity,msdynce_registerationdeadline,msdynce_coursestartdateandtime,msdynce_courseenddateandtime," +
            "msdynce_coursename",
            contentType: "application/json",
            success: function (res) {
                var deadline = res.msdynce_registerationdeadline;
                var maxCapacity = res.msdynce_registerationmaxcapacity;
                var startDate = res.msdynce_coursestartdateandtime;
                var endDate = res.msdynce_courseenddateandtime;
                var courseTitle = res.msdynce_coursename;
                if (res.msdynce_registeredparticipants)
                   var  regParticipants = res.msdynce_registeredparticipants;
                else 
                    var regParticipants = 0;
                if (regParticipants < maxCapacity) {
                spots = maxCapacity - regParticipants;
                if (selectedAttendees.length <= spots){
                    var now = moment().local().format("YYYY-MM-DD");
                    var limit = moment(deadline).local().format("YYYY-MM-DD");
                    if (moment(now).isBefore(limit) || moment(now).isSame(limit)){
                    document.getElementById("registerBtn").disabled = true;
                    document.getElementById("registerBtn").innerText = "Processing...";
                    selectedAttendees.forEach(function(element, index, array){
                        createRegistrationRecord(element, courseId , array.length, regParticipants, maxCapacity, startDate, endDate, courseTitle);
                    });
                    } else {
                    showErrorMessage("The registration deadline for this course has expired.");
                    }
                } else{
                    showErrorMessage("There aren't enough spots left for the amount of people selected.");
                }
                }
                else{
                showErrorMessage("This course is full");
                }
            },
            error: function (res) {
                console.log(res.responseText);
                showErrorMessage("We’re sorry. Your request didn’t go through. Please try again.");
            }
            });
        } else {
            showErrorMessage("Please fill out all required fields to complete your registration.");
        }
        {% endunless %}
        {% endif %}
    });

});

    function createRegistrationRecord(attendee, courseId, length, participants, capacity, startDate, endDate, courseTitle){

      var dataObject = {
        "msdynce_courseid@odata.bind": "/msdynce_courses(" + courseId + ")",
        "msdynce_AttendeeName@odata.bind": "/contacts(" + attendee + ")",
        "msdynce_coursestartdate": startDate,
        "msdynce_courseenddate": endDate,
        "msdynce_name": courseTitle,
        "msdynce_Parent@odata.bind": "/contacts({{user.contactid}})"
      }

      //Call the API
        webapi.safeAjax({
          type: "POST",
          url: "/_api/msdynce_registrations",
          contentType: "application/json",
          data: JSON.stringify(dataObject),
          success: function (res, status, xhr) {
            //print id of newly created table record
            registrationCounter++;
            if (registrationCounter == length){
              var newParticipants = participants + length;
              var newFilled = (newParticipants * 100) / capacity;
              updateCourseParticipants(courseId,newParticipants,newFilled);
            }
          },
          error: function (res, status, xhr) {
            console.log(res.responseText);
            showErrorMessage("We’re sorry. Your request didn’t go through. Please try again.");
          }
        });
    }

    function updateCourseParticipants(courseId, participants, filled){
      webapi.safeAjax({
        type: "PATCH",
        url: "/_api/msdynce_courses(" + courseId + ")",
        contentType: "application/json",
        data: JSON.stringify({
          "msdynce_registeredparticipants": participants
        }),
        success: function (res) {
          window.location.href = "{{sitemarkers['Registration Success'].url}}?id=" + courseId;
        },
        error: function (res) {
          console.log(res.responseText);
          showErrorMessage("We’re sorry. Your request didn’t go through. Please try again.");
        }
      });
    }

    function showErrorMessage(message){
        $(".child-selection-container").before("<div class='alert alert-danger validation-alert' role='alert'>" +
      "<img src='/validation-icon.svg' style='margin-bottom:5px;' alt='validation alert icon'>" +
      "<b>" + message + "</b>" +
      "<br></div>");
    }

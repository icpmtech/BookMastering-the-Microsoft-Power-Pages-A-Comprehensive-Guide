 $(".actions").append("<button class='btn button2' id='cancelChildButton'>Cancel</div>");
    $(".validation-summary.alert.alert-error.alert-danger.alert-block").addClass('validation-alert');


    $("#cancelChildButton").click(function(e){
        e.preventDefault();
        window.parent.closeModal();
    });

    
    var documentbodyContents;
    var attendeeImageType;
    var attendeeImageName = '';

    //File upload function called by the PCF
    window.uploadImagePCF = function (name, memetype, body) {
        attendeeImageType = memetype;
        attendeeImageName = name;
        documentbodyContents = body.substring(body.indexOf(',') + 1);           
    }

    // Apply Client Side Validation on birthdate
    if (window.jQuery) {
    (function ($) {
        $(document).ready(function () {
            if (typeof (Page_Validators) == 'undefined') return;
            // Create new validator
            var newValidator = document.createElement('span');
            newValidator.style.display = "none";
            newValidator.id = "birthdateValidator";
            newValidator.controltovalidate = "birthdate";
            newValidator.errormessage = "<a href='#birthdate_label'>{{snippets['Error/Future DOB']}}</a>";
            newValidator.validationGroup = ""; // Set this if you have set ValidationGroup on the form
            newValidator.initialvalue = "";
            newValidator.evaluationfunction = function () {
                var birthdateValue = moment(document.getElementById("birthdate").value); 
                if (moment(birthdateValue).isAfter(moment()))          
                    return false;  // return false mean apply validation            
                else 
                    return true;   // return true mean successful         
            };
            // Add the new validator to the page validators array:
            Page_Validators.push(newValidator);
            // Wire-up the click event handler of the validation summary link
            $("a[href='#birthdate_label']").on("click", function () { scrollToAndFocus('birthdate_label','Birthdate'); });
        });
    }(window.jQuery));
    }

    function addChildProfile() {
        var bDate = null;
        if (document.getElementById("birthdate_datepicker_description").value){
            bDate = moment(Date.parse(document.getElementById("birthdate_datepicker_description").value)).format('YYYY-MM-DD');
        } 

        //Create child data object
        var firstName = "";
        var lastName = "";
        if (document.getElementById("firstname").value)
            firstName = document.getElementById("firstname").value
        if (document.getElementById("lastname").value)
            lastName = document.getElementById("lastname").value
        let dataObject = {
            "firstname": firstName,
            "lastname": lastName,
            "birthdate": bDate,
            "parentcustomerid_contact@odata.bind": "/contacts({{user.contactid}})"
        }

        if (documentbodyContents){
          dataObject['entityimage'] =  documentbodyContents;
          dataObject['msdynce_entityimage_file_name'] = attendeeImageName;
          dataObject['msdynce_entityimage_file_type'] = attendeeImageType.substring(attendeeImageType.indexOf('/') + 1);
        }


        //Call the API
        webapi.safeAjax({
            type: "POST",
            url: "/_api/contacts",
            contentType: "application/json",
            data: JSON.stringify(dataObject),
            success: function (res, status, xhr) {
                window.top.location.reload();                 
            },
            error: function (res, status, xhr) {
                console.log(res.responseText);
            }
        });
    }
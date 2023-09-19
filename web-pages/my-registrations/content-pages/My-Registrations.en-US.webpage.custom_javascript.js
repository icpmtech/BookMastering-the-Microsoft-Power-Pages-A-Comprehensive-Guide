// Allows close modal from the popup  
window.closeModal = function() {
    $('#unregisterModal').modal('hide');
};

$(function() {
    $(document).ready(function() {
        var active = sessionStorage.getItem("aspFocused");
        if (active) {
            e = document.getElementById(active).focus();
        }
    });

    var seasonFilter = "{{request.params['season'] | xml_escape }}";
    var attendeeFilterString = "{{request.params['attendees'] | xml_escape }}";
    var attendeeFilterArray;

    if (attendeeFilterString != "" && attendeeFilterString.includes(","))
        attendeeFilterArray = attendeeFilterString.split(",")
    else if (attendeeFilterString != "")
        attendeeFilterArray = [attendeeFilterString];
    else
        attendeeFilterArray = [];


    // Get the course image
    $(".card-flex-right").each(function() {
        let imgURL = "";
        const courseid = this.dataset.courseid;
        const regid = this.dataset.regid;
        webapi.safeAjax({
            type: "GET",
            url: "/_api/msdynce_courses(" + courseid + ")/msdynce_entityimage/?size=full",
            contentType: "application/json",
            success: function(res, status) {
                let imgHTML = "";
                if (res) {
                    imgURL = "data:image/png;base64," + res.value;
                    imgHTML = "<img class='image-right'  src=" + imgURL + "  alt='course photo'>";
                } else {
                    imgHTML = "<img class='image-right'  src='/card-placeholder.svg'  alt='course photo'>";
                }
                $("#div" + regid).append(imgHTML);
            }
        });

    });

    // Load user's card image
    $(".sub-left img").each(function() {
        loadImage(this.dataset.attendee, this);
    });

    // Load user's mobile card image
    $(".mobile-right img").each(function() {
        loadImage(this.dataset.attendee, this);
    });

    // Load user's image
    $(".child-filter-card img:not(.child-filter-card img:first-child)").each(function() {
        loadImage(this.dataset.contact, this);
    });


    //Load checked attendees
    for (let a = 0; a < attendeeFilterArray.length; a++) {
        $("input[class='checkAttendeeMobile'][value='" + attendeeFilterArray[a] + "']").parent().addClass("filterSelected");
        $("input[class='checkAttendeeMobile'][value='" + attendeeFilterArray[a] + "']").prop('checked', true);
        $("input[class='checkAttendee'][value='" + attendeeFilterArray[a] + "']").prop('checked', true);
    }


    /* START ATTENDEE FILTER */
    $(".child-filter input[type='checkbox']").on("change", function() {
        //resetForFilter();
        if (this.checked) {
            attendeeFilterArray.push(this.value);
            $("input[class='checkAttendeeMobile'][value='" + this.value + "']").parent().addClass("filterSelected");
            $("input[class='checkAttendeeMobile'][value='" + this.value + "']").prop('checked', true);

        } else {
            $("input[class='checkAttendeeMobile'][value='" + this.value + "']").parent().removeClass("filterSelected");
            $("input[class='checkAttendeeMobile'][value='" + this.value + "']").prop('checked', false);
            const pos = attendeeFilterArray.indexOf(this.value);
            attendeeFilterArray.splice(pos, 1);
        }
        var elemId = this.id;
        sessionStorage.setItem("aspFocused", elemId);
        attendeeFilterString = arrayToString(attendeeFilterArray);
        buildUrl(seasonFilter, attendeeFilterString);
    });

    /* START ATTENDEE MOBILE FILTER */
    $('.checkAttendeeMobile').on("change", function() {
        if (this.checked) {
            $(this).parent().addClass("filterSelected");
            attendeeFilterArray.push(this.value);
            $("input[class='checkAttendee'][value='" + this.value + "']").prop('checked', true);
        } else {
            $(this).parent().removeClass("filterSelected");
            const pos = attendeeFilterArray.indexOf(this.value);
            attendeeFilterArray.splice(pos, 1);
            $("input[class='checkAttendee'][value='" + this.value + "']").prop('checked', false);
        }
    });

    /* HANDLE APPLY IN MOBILE FILTER */
    $('#applyAttendee').on("click", function() {
        attendeeFilterString = arrayToString(attendeeFilterArray);
        buildUrl(seasonFilter, attendeeFilterString);
    });

    $(document).on('click', '.dropdown-filters .dropdown-menu', function(e) {
        e.stopPropagation();
    });


    //Keep the filter dropdowns from collapsing after clicking an option
    $(document).on('click', '.catalog-dropdown-filters .dropdown-menu', function(e) {
        e.stopPropagation();
    });

    $("#courseSeason+ul li").on("click", function() {
        seasonFilter = this.dataset.val;
        buildUrl(seasonFilter, attendeeFilterString);
    });

    //Season filter
    $("#applySeasonCatalog").on("click", function() {
        //Get the selected season value
        const selectedSeason = $("input:radio[name='SeasonMobile']:checked").val();
        seasonFilter = selectedSeason;
        buildUrl(seasonFilter, attendeeFilterString);
    });

    $('.radioSeasonMobile').on("change", function() {
        if (this.checked) {
            $('input[name="SeasonMobile"]').parent().removeClass("filterSelected");
            $(this).parent().addClass("filterSelected");
        } else
            $(this).parent().removeClass("filterSelected");
    });

    //Search
    $("#btnsearch").on("click", function() {
        const txt = $("#txtsearch");
        buildUrlSearch(txt.val());
    });

    $('#txtsearch').on("change", function() {
        if (this.value.length == 0) {
            let url = window.location.href;
            url = url.replace(window.location.search, "");
            if (url != "")
                window.location.href = url;
        }
    });
});

function loadImage(objectId, selector) {
    var imgURL = "";
    webapi.safeAjax({
        type: "GET",
        url: "/_api/contacts(" + objectId + ")?$select=entityimage",
        contentType: "application/json",
        success: function(res, status) {
            if (res.entityimage) {
                var imgBaseString = res.entityimage;
                var imgHTML = "";
                imgURL = "data:image/png;base64," + imgBaseString;
                $(selector).attr("src", imgURL);
            }
        }
    });
}

function changeParameterValue(url, parameter, newValue) {
    if (url.includes(parameter)) {
        const i = url.indexOf(parameter) + parameter.length;
        url = replaceAt(url, i, newValue);
    }
    return url;
}

function replaceAt(str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

//Season filter and Search
function buildUrl(season, attendees) {
    let queryUrl = window.location.href;
    //Remove all queries
    queryUrl = queryUrl.replace(window.location.search, "");
    //Set the page to 1
    queryUrl = queryUrl + "?page=1";

    if (season && season != "")
        queryUrl = queryUrl + "&season=" + season;
    if (attendees && attendees != "")
        queryUrl = queryUrl + "&attendees=" + attendees;

    window.location.href = queryUrl;
}

function buildUrlSearch(search) {
    let queryUrl = window.location.href;
    //Remove all queries
    queryUrl = queryUrl.replace(window.location.search, "");
    //Set the page to 1
    queryUrl = queryUrl + "?page=1";

    if (search && search != "")
        queryUrl = queryUrl + "&search=" + search;

    window.location.href = queryUrl;
}

function arrayToString(arrayVar) {
    var stringVar = "";
    arrayVar.forEach(function(element, i, array) {
        var auxString = arrayVar[i].toString();
        if (i == 0)
            stringVar = auxString;
        else
            stringVar = stringVar + "," + auxString;
    });
    //If nothing was selected, set the variable to null or the API will throw an error
    if (stringVar == "")
        stringVar = null;

    return stringVar;
}

const updateButton = document.getElementById('updateDetails');
const unregisterDialog = document.getElementById('unregisterDialog');
const outputBox = document.querySelector('output');

// If a browser doesn't support the dialog, then hide the
// dialog contents by default.
if (typeof unregisterDialog.showModal !== 'function') {
  unregisterDialog.hidden = true;
  /* a fallback script to allow this dialog/form to function
     for legacy browsers that do not support <dialog>
     could be provided here.
  */
}
// "Update details" button opens the <dialog> modally
updateButton.addEventListener('click', () => {
  if (typeof unregisterDialog.showModal === "function") {
    unregisterDialog.showModal();
  } else {
    outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
  }
});

// "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
unregisterDialog.addEventListener('close', () => {
  outputBox.value = `${unregisterDialog.returnValue} button clicked - ${(new Date()).toString()}`;
});


function showUnregisterModal(registrationId) {
    $('#unregister-wrapper-iframe').attr('src', '/unregister-attendee?id=' + registrationId);
    if (typeof unregisterDialog.showModal === "function") {
        unregisterDialog.showModal();
      } else {
        outputBox.value = "Sorry, the <dialog> API is not supported by this browser.";
      }
}
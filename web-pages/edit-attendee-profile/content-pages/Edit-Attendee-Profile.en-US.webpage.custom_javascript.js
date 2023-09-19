function getAttendees() {
  webapi.safeAjax({
    type: 'GET',
    url: "/_api/contacts({{request.params['id']}})/entityimage/?size=full",
    contentType: 'application/json',
    success: function (res, status) {
      if (res) {
        imgBaseString = res.value;
        $('.image-preview-area img').attr('src', 'data:image/png;base64,' + imgBaseString);
      }
    },
  });
}

var documentbodyContents;
var attendeeImageType;
var attendeeImageName = '';

//File upload function called by the PCF
window.uploadImagePCF = function (name, memetype, body) {
  attendeeImageType = memetype;
  attendeeImageName = name;
  documentbodyContents = body.substring(body.indexOf(',') + 1);
};

function editChildProfile() {
  let bDate = null;
  if (document.getElementById('birthdate_datepicker_description').value) {
    bDate = moment(Date.parse(document.getElementById('birthdate_datepicker_description').value)).format(
      'YYYY-MM-DD'
    );
  }

  //Create child data object
  let firstName = '';
  let lastName = '';
  if (document.getElementById('firstname').value) firstName = document.getElementById('firstname').value;
  if (document.getElementById('lastname').value) lastName = document.getElementById('lastname').value;
  let dataObject = {
    firstname: firstName,
    lastname: lastName,
    birthdate: bDate,
    'parentcustomerid_contact@odata.bind': '/contacts({{user.contactid}})',
  };

  if (documentbodyContents) {
    dataObject['entityimage'] = documentbodyContents;
    dataObject['msdynce_entityimage_file_name'] = attendeeImageName;
    dataObject['msdynce_entityimage_file_type'] = attendeeImageType.substring(
      attendeeImageType.indexOf('/') + 1
    );
  }

  //Call the API
  webapi.safeAjax({
    type: 'PATCH',
    url: "/_api/contacts({{request.params['id']}})",
    contentType: 'application/json',
    data: JSON.stringify(dataObject),
    success: function (res, status, xhr) {
      window.top.location.reload();
    },
    error: function (res, status, xhr) {
      console.log(res.responseText);
    },
  });
}

function deleteChildProfile() {
  webapi.safeAjax({
    type: 'DELETE',
    url: "/_api/contacts({{request.params['id']}})",
    contentType: 'application/json',
    success: function (res, status, xhr) {
      window.top.location.reload();
    },
    error: function (res, status, xhr) {
      console.log(res.responseText);
    },
  });
}

const editDialog = document.getElementById('editDialog');

// allows close modal from the popup
window.closeModal = function () {
  $('#addAttendeeModal').modal('hide');
  $('#editAttendeeModal').modal('hide');
};

window.showEditForm = function (elem) {
  const frame = $('#edit-child-wrapper');
  if (frame) {
    frame.attr('src', '/edit-attendee?id=' + elem.id);
    if (typeof editDialog.showModal === 'function') {
      if (typeof editDialog.showModal === 'function') {
        editDialog.showModal();
      } else {
        outputBox.value = 'Sorry, the <dialog> API is not supported by this browser.';
      }
    } else {
      outputBox.value = 'Sorry, the <dialog> API is not supported by this browser.';
    }

    // $('#editAttendeeModal').modal('show');
  }
};

// Load all attendees
const queryURL =
  '/_api/contacts?$select=firstname,lastname,contactid,_parentcustomerid_value,birthdate' +
  '&$filter=(_parentcustomerid_value eq {{user.contactid}})';

//Get the user's attendees
webapi.safeAjax({
  type: 'GET',
  url: queryURL,
  contentType: 'application/json',
  success: function (res, status) {
    const attendees = res.value;
    attendees.forEach(function (element, index, array) {
      var birthday = '';
      var birthdayHTML = '';
      if (element.birthdate) {
        birthday = moment(element.birthdate).local().format('MM/DD/YY');
        birthdayHTML = '<p class="card-text-date text-center">' + birthday + '</p>';
      }
      var firstName = element.firstname || '';
      var lastName = element.lastname || '';
      if (firstName.length >= 1 && lastName) {
        lastName = lastName.slice(0, 1);
      }
      $('#attendees-container').append(
        '<div class="col-md-1 child-card">' +
          '<img id="childImg' +
          index +
          '" src="/child-filler.svg" alt=" ' +
          firstName +
          ' ' +
          lastName +
          ' profile photo">' +
          '<p class="card-text-large text-center">' +
          firstName +
          ' ' +
          lastName +
          '</p>' +
          birthdayHTML +
          '<button aria-label="Edit Attendee ' +
          firstName +
          ' ' +
          lastName +
          '" id="' +
          element.contactid +
          '" class="btn-link" onclick="showEditForm(this);">Edit</button>' +
          '</div>'
      );
      loadImage(element.contactid, '#childImg' + index);
    });
  },
  error: function (res, status) {},
});

function loadImage(objectId, selector) {
  //Get the image
  let imgURL = '';
  webapi.safeAjax({
    type: 'GET',
    url: '/_api/contacts(' + objectId + ')?$select=entityimage',
    contentType: 'application/json',
    success: function (res, status) {
      if (res.entityimage) {
        const imgBaseString = res.entityimage;
        imgURL = 'data:image/png;base64,' + imgBaseString;
        $(selector).css('content', 'url(' + imgURL + ')');
      } else {
      }
    },
  });
}

const updateButton = document.getElementById('updateDetails');
const favDialog = document.getElementById('favDialog');
const outputBox = document.querySelector('output');
const selectEl = favDialog.querySelector('select');
const confirmBtn = favDialog.querySelector('#confirmBtn');

// If a browser doesn't support the dialog, then hide the
// dialog contents by default.
if (typeof favDialog.showModal !== 'function') {
  favDialog.hidden = true;
  /* a fallback script to allow this dialog/form to function
     for legacy browsers that do not support <dialog>
     could be provided here.
  */
}
// "Update details" button opens the <dialog> modally
updateButton.addEventListener('click', () => {
  if (typeof favDialog.showModal === 'function') {
    favDialog.showModal();
  } else {
    outputBox.value = 'Sorry, the <dialog> API is not supported by this browser.';
  }
});

// "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
favDialog.addEventListener('close', () => {
  outputBox.value = `${favDialog.returnValue} button clicked - ${new Date().toString()}`;
});

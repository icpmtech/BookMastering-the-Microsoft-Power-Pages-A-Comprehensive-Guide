$(function(){
    $(".form-custom-actions").prepend("<div class='col-sm-6 clearfix'><div class='form-action-container-left'><button class='btn btn-secondary' id='cancelUnregisterButton'>Keep</button></div></div>");
    $("button.deactivate-link.btn-default.btn").addClass("btn-primary");

    $("#cancelUnregisterButton").click(function(e){
        e.preventDefault();
        window.parent.closeModal();
    });
    
    $(".deactivate-link.btn-default.btn.btn-primary").click(function(e){
        window.parent.location.href = "/my-registrations";
    });
})
{% if request.params['id'] | xml_escape %}
{% assign courseid = request.params['id'] | xml_escape %}
{% else %}
{% assign courseid = "" %}
{% endif %}
{% block main %}


$(document).ready(function () {     

    $("#delete-wrapper").contents().find("div.navbar").hide(); 
    $("#UpdateButton").prop('value', 'Cancel course');
    $(".deactivate-link.btn-default.btn").hide();
    
    $("#UpdateButton").click(function(){
        if($("#msdynce_cancellationreasons").val() != "" && $("#msdynce_cancellationreasons").val() != null){
            $(".deactivate-link.btn-default.btn").click();
            $("#cancelCourseModal").modal("hide");
            window.parent.location.href = "/admin-home?cancelled=true&id={{courseid}}";    
        } else{
            $("#delete-wrapper",parent.document).css('height','480');
        }
    }); 


});
{% endblock %}

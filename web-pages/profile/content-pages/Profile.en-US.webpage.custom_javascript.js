$( document ).ready(function() {
    // Hide marketing preference checkbox for a fax and mail
    $('#ContentContainer_MainContent_MainContent_ContentBottom_MarketingOptionsPanel input[title="Fax"]').parent().parent().parent().hide();
    $('#ContentContainer_MainContent_MainContent_ContentBottom_MarketingOptionsPanel input[title="Mail"]').parent().parent().parent().hide();
    $(".checkbox > label").addClass("checkbox-container");
    $(".checkbox-container > span:first-child").append( "<span class='checkmark'></span>" );
    $("#ContentContainer_MainContent_MainContent_ContentBottom_SubmitButton").prop("value","Save & proceed");


    //hiding unwanted fields
    $('#adx_preferredlanguageid_name').parent().parent().parent().hide();
    $('#adx_organizationname').parent().parent().hide();
    $('#telephone1').parent().parent().hide();
    $('#nickname').parent().parent().hide();
    $('#jobtitle').parent().parent().hide();
    $('#websiteurl').parent().parent().hide();
    $('#adx_publicprofilecopy').parent().parent().hide();
});
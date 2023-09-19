$(document).ready(function() {

    //var notify = false;

    //get the access denied block and put in inside the entity list
    var accessDenied = $('.view-access-denied');
    $('.view-access-denied').remove();
    $('.view-grid').append(accessDenied);

    //get empty message inside the entity list
    var emptyMessage = $('.view-empty');
    $('.view-empty').remove();
    $('.view-grid').append(emptyMessage);

    //get the loading spinner inside the entity list
    var loadingMessage = $('.view-loading');
    $('.view-loading').remove();
    $('.view-grid').append(loadingMessage);


    //to format the filters
    $('option[label=" "]').remove();
    $('#dropdown_0').prepend('<option value="" label="Start Date">Start Date</option>')
    $('#dropdown_1').prepend('<option value="" label="Status">Status</option>');
    $('#dropdown_0').val('');
    $('#dropdown_1').val('');


    $('#editedModal').on('hidden.bs.modal', function() {
        window.location.href = "/admin-home";
    });

    $('#createdModal').on('hidden.bs.modal', function() {
        window.location.href = "/admin-home";
    });

    //Entity list function begin
    $('.entitylist').on("loaded", function() {
        $('.details-link').attr("target", "_blank");


        // Adding ID to the filter list items
        // $("#entitylist-filters").children("li").each(function(i, e) {
        //   $(this).children("ul").attr("id","filter"+i);
        // });

        // Adding collapse class and styles
        // $('.btn-entitylist-filter-submit').addClass("btn-primary");
        // $('#filter1').addClass("collapse");
        // $('#filter0').addClass("collapse");

        // Adding logic to collapse the filters
        // $("#entitylist-filters > li >label").each(function(i, e) {
        //     $(this).addClass("collapsed");
        //     $(this).addClass("btn-collapse");
        //     $(this).attr("data-toggle","collapse");
        //     $(this).attr("data-target","#filter"+i);
        // });

        //Removed collabsible filter above and added label to tab index
        $('#entitylist-filters > li > label').attr('tabindex', 0);


        //to display - between start date and time
        $(this).children(".view-grid").find("td[data-attribute='msdynce_coursestartdateandtime']").each(function(i, e) {
            $(this).text($(this).text().replace(" ", " - "));
        });

        // Getting page url
        var pageURL = window.location.href;

        // Validating if url contains query string created=true
        if (pageURL.indexOf('created=true') !== -1) {
            //var courseId= new URL(pageURL).searchParams.get('id');
            $('#createdModal').modal('show');

        }
        // Validating if url contains query string edited=true
        if (pageURL.indexOf('edited=true') !== -1) {
            $('#editedModal').modal('show');

        }

        // Validating if url contains query string cancelled=true
        if (pageURL.indexOf('cancelled=true') !== -1) {
            //var courseId= new URL(pageURL).searchParams.get('id');
            $('#cancelledModal').modal('show');

        }



        // Adding edit icon and duplicate icon
        $(this).children(".view-grid").find("tr[data-id]").each(function(i, e) {
            var id = $(this).attr("data-id");
            var label = $(this).find("td:nth-child(1)").attr("aria-label");
            $(this).append('<td class="el-buttons"><a href ="/edit-course?id=' + id + '" ><img class="el-icon" id="el-edit-icon" src="/EditIcon.png" alt="Edit ' + label + ' course"/></a></td><td class="el-buttons"><a href ="/duplicate-course?id=' + id + '" ><img class="el-icon" src="/DuplicateIcon.png" alt="Duplicate ' + label + ' course"/></a></td>');
        });

        $(".col-md-3.filter-vertical").css("margin-top", $(".view-grid").position().top + 10);



        // Adding Filters heading to filter section
        if ($('.panel-heading').length == 0)
            $('<div class="panel-heading">Filters</div>').insertBefore('.panel-body');


        // Adding Reset button

        if ($('#btnReset').length == 0) {
            $('<button id="btnReset" type="button" class="button2">Reset</button>')
                .insertBefore('.btn-entitylist-filter-submit').on("click", function() {
                    $("input[name='1']").prop("checked", false);
                    $("input[name='0']").prop("checked", false);
                    $('.btn-entitylist-filter-submit').click();
                });
        }

    }); //entity list loaded function ends




}); //document.ready ends

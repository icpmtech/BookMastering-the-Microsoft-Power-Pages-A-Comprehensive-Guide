$(function(){
    var categoryFilter = "{{request.params['category'] | xml_escape }}";
    var seasonFilter = "{{request.params['season'] | xml_escape }}";
    var gradeFilterString = "{{request.params['level'] | xml_escape }}";
    var gradeFilterArray;
    var typeFilterString = "{{request.params['type'] | xml_escape }}";
    var typeFilterArray;

    let CATEGORY_NAME = 'Category';
    let SEASON_NAME = 'Season';
    let GRADE_NAME = 'Grade Level';
    let TYPE_NAME = 'Course Type';

    // todo-cj : need to consolidate mobile and desktop

    // Desktop selectors
    let $courseFilters = $('.course-selector');

    let filters = {
        category: CATEGORY_NAME,
        season: SEASON_NAME,
        grade: GRADE_NAME,
        type: TYPE_NAME
    };

    $courseFilters.each(function(idx) {
        $(this).on('change', function(e) {
            e.preventDefault();
            let targetName = e.target.name;
            let value = $(this).val();

            switch (targetName) {
                case filters.category:
                    categoryFilter = value;
                    buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
                    break;
                case filters.season:
                    seasonFilter = value;
                    buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
                    break;
                case filters.grade:
                    gradeFilterString = value;
                    buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
                    break;
                case filters.type:
                    typeFilterString = value;
                    buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
                    break;
                default:
                    console.log('nothing selected');
            }
        });
    });

    if (gradeFilterString != "" && gradeFilterString.includes(","))
        gradeFilterArray = gradeFilterString.split(",")
    else if (gradeFilterString != "")
        gradeFilterArray = [gradeFilterString];
    else
        gradeFilterArray = [];

    if (typeFilterString != "" && typeFilterString.includes(","))
        typeFilterArray = typeFilterString.split(",")
    else if (typeFilterString != "")
        typeFilterArray = [typeFilterString];
    else
        typeFilterArray = [];
    

    //Get each of the course's images
    $(".course-card-img").each(function(){
        const id = this.dataset.courseid;
        const current = this;
        webapi.safeAjax({
            type: "GET",
            url: "/_api/msdynce_courses("+ id +")/msdynce_entityimage/?size=full",
            contentType: "application/json",
            success: function (res, status) {
                if (res){
                    const imgURL =  "data:image/png;base64," + res.value;
                    const imgHTML = "<img class='card-img-top gradient-image' src=" + imgURL + " alt='course photo'></img>";
                    $(current).html(imgHTML);
                }
            }
        });
    });

    //Keep the filter dropdowns from collapsing after clicking an option
    $(document).on('click', '.catalog-dropdown-filters .dropdown-menu', function (e) {
        e.stopPropagation();
    });

    // Close modal popups if user clicks outside the modal, on mobile
    $(document).on("click",'.modal-backdrop', function(e) {
        e.preventDefault();
        e.stopPropagation();        
        window.location.href=window.location.href
    })

     $("#courseSeason+ul li").on("click", function(){
      
        seasonFilter = this.dataset.val;
        buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
    });

    //Season mobile filter
    $("#applySeasonCatalog").on("click", function(){
      //Get the selected season value
      var selectedSeason = $("input:radio[name='SeasonMobile']:checked").val();
      seasonFilter = selectedSeason;
        buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
    });

    $('.radioSeasonMobile').on("change", function() {

      if(this.checked)
      {
        $('input[name="SeasonMobile"]').parent().removeClass("filterSelected");
        $(this).parent().addClass("filterSelected");
      }
      else
      $(this).parent().removeClass("filterSelected");
      
    });

    $("#courseGrades+ul input[type='checkbox']").on("change", function(){
        if (this.checked){
            gradeFilterArray.push(this.value);
        } else {
            var pos = gradeFilterArray.indexOf(this.value);
            gradeFilterArray.splice(pos, 1);
        }
        gradeFilterString = arrayToString(gradeFilterArray);
        buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
    });

    // Grade filter for mobile
    $('#applyLevel').on("click", function(){
      
        gradeFilterString = $("input[name=LevelMobile]:checked").map(function () {
                return ($(this).val());
        }).get().join(',');

        buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
    
    });

    $('.checkLevelMobile').on("change", function() {

      if(this.checked){
        $(this).parent().addClass("filterSelected");
      }
      else {
        $(this).parent().removeClass("filterSelected");
      }
    });

    $("#courseTypes+ul input[type='checkbox']").on("change", function(){
        if (this.checked){
            typeFilterArray.push(this.value);
        } else {
            var pos = typeFilterArray.indexOf(this.value);
            typeFilterArray.splice(pos, 1);
        }
        typeFilterString = arrayToString(typeFilterArray);
        buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
    });

    $('#applyType').on("click", function(){
      
        typeFilterString = $("input[name=TypeMobile]:checked").map(function () {
                return ($(this).val());
            }).get().join(',');

        buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);

    });

    $('.checkTypeMobile').on("change", function() {

      if(this.checked){
        $(this).parent().addClass("filterSelected");
      }
      else {
        $(this).parent().removeClass("filterSelected");
      }
    });

    //Category desktop version configuration 
    $('.categoryListItem').focusin(function() {
        $(this).addClass('categorySelected');
        let category = $(this).children().children().attr('value');
        categoryFilter = category;
        $(this).keydown(function (e) {
            if (e.key == " " || e.key == "Enter") {
                buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
            }
        })
    });

    $('.categoryListItem').focusout(function() {
        $(this).removeClass('categorySelected');
        $(this).off("keydown", "input");
    });

    $('#applyCategoryDesktop').on('click', function() {
        buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
    });

    $('#categoryAll').on('click', function() {
        categoryFilter = '';
        buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
    });

    //Season selection desktop version configuration

    $('#courseSeason+ul li').focusin(function() {
        $(this).addClass('selectedSeason');
        $(this).keydown(function(e) {
            if (e.key == " " || e.key == "Enter") {
                seasonFilter = this.dataset.val;
                buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
                
            }
        })
    })

    $('#courseSeason+ul li').focusout(function() {
        $(this).removeClass('selectedSeason')
    })

    //Grade selection desktop configuration

    $("#courseGrades+ul input[type='checkbox']").focusin(function() {
        $(this).parent().addClass('selectedGrade');
        $(this).keydown(function(e) {
            if (e.key == " " || e.key == "Enter") {
                e.preventDefault();
                e.stopPropagation();  
                if (!this.checked) {
                    this.checked = true;
                    gradeFilterArray.push(this.value)
                } else {
                    this.checked = false;
                    var pos = gradeFilterArray.indexOf(this.value);
                    gradeFilterArray.splice(pos, 1);
                }
                $('#gradeDropdown').on('hide.bs.dropdown', function() {
                    e.preventDefault();
                    e.stopPropagation(); 
                    gradeFilterString = arrayToString(gradeFilterArray);
                    buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
                })
                $(this).keydown(function(e) {
                    if (e.key == "Escape") {
                    e.preventDefault();
                    e.stopPropagation(); 
                    gradeFilterString = arrayToString(gradeFilterArray);
                    buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
                    }
                })
            } else if (e.key == "Escape") {
                $('#gradeDropdown').dropdown('toggle');
            }
        })
    });

    $("#courseGrades+ul input[type='checkbox']").focusout(function() {
        $(this).parent().removeClass('selectedGrade');
        $(this).off("keydown", "input");
    })

    //Type selection desktop configuration
    $("#courseTypes+ul input[type='checkbox']").focusin(function() {
        $(this).parent().addClass('selectedType');
        $(this).keydown(function(e) {
            if (e.key == " " || e.key == "Enter") {
                e.preventDefault();
                e.stopPropagation();  
                if (!this.checked) {
                    this.checked = true;
                    typeFilterArray.push(this.value)
                } else {
                    this.checked = false;
                    var pos = typeFilterArray.indexOf(this.value);
                    typeFilterArray.splice(pos, 1);
                }
                $('#typeDropdown').on('hide.bs.dropdown', function() {
                    e.preventDefault();
                    e.stopPropagation(); 
                    typeFilterString = arrayToString(typeFilterArray);
                    buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
                })
                $(this).keydown(function(e) {
                    if (e.key == "Escape") {
                    e.preventDefault();
                    e.stopPropagation(); 
                    typeFilterString = arrayToString(typeFilterArray);
                    buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
                    }
                })
            } else if (e.key == "Escape") {
                $('#typeDropdown').dropdown('toggle');
            }
        })
    });

    $("#courseTypes+ul input[type='checkbox']").focusout(function() {
        $(this).parent().removeClass('selectedType');
        $(this).off("keydown", "input");
    })

    //Dropdown button CSS
    $('#courseSeason, #courseGrades, #courseTypes').focusin(function() {
        $(this).addClass('categorySelected');
    });

    $('#courseSeason, #courseGrades, #courseTypes').focusout(function() {
        $(this).removeClass('categorySelected');
    });

    //Category mobile filter
    $("#applyCategory").on("click", function(){
        var checkedValue = $("input:radio[name='CategoryMobile']:checked").val();
        categoryFilter = checkedValue;

        buildUrl(categoryFilter, seasonFilter, gradeFilterString, typeFilterString);
    });

    $('.radioCategoryMobile').on("change", function() {

      if(this.checked)
      {
        $('input[name="CategoryMobile"]').parent().removeClass("filterSelected");
        $(this).parent().addClass("filterSelected");
      }
      else
      $(this).parent().removeClass("filterSelected");
      
    });

    //Search
    $("#btnSearch").on("click", function(){
        var txt = $("#txtsearch");
        buildUrlSearch(txt.val());
    });

    // Trigger search on press of Enter key
    var input = document.getElementById("txtsearch");
    input.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.key === " ") {
        if (input.value.length > 0){
          // Trigger the button element with a click
          document.getElementById("btnSearch").click();
        }
      }
    });

    $('#txtsearch').on("change", function(){
      if(this.value.length == 0){
        var url = window.location.href;

        url = url.replace(window.location.search, "");

        if (url != "")
        window.location.href = url;
      }
    });

});

    function buildUrl(category, season, grades, types){
        console.log(category)
        var queryUrl = window.location.href;
        //Remove all queries
        queryUrl = queryUrl.replace(window.location.search, "");
        //Set the page to 1
        queryUrl = queryUrl + "?page=1";
        if (category && category != "")
            queryUrl = queryUrl + "&category=" + category;
        if (season && season != "")
            queryUrl = queryUrl + "&season=" + season;
        if (grades && grades != "")
            queryUrl = queryUrl + "&level=" + grades;
        if (types && types != "")
            queryUrl = queryUrl + "&type=" + types;

        window.location.href = queryUrl;
    }

    function buildUrlSearch(search){
        var queryUrl = window.location.href;
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
        arrayVar.forEach(function (element, i, array) {
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
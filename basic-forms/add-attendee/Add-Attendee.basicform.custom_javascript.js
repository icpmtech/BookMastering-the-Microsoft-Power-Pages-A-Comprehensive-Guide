$(document).ready(function () {

$("div.actions").append(`<button type='button' id='btnSaveValidate' name='btnSaveValidate' class='btn button1' 
onclick="javascript: if (typeof entityFormClientValidate === 'function') {
        if (entityFormClientValidate()) {
            if (typeof Page_ClientValidate === 'function') {
                if (Page_ClientValidate('')) {
                    clearIsDirty();
                    disableButtons();
                    this.value = 'Processing...';
                    if (typeof addChildProfile === 'function') {
                        addChildProfile();
                        clearIsDirty();       
                        this.disabled = false;    
                    }
                }
            } else {
                clearIsDirty();
                disableButtons();
                this.value = 'Processing...';
            }
        } else {
            return false;
        }
    } else {
        if (typeof Page_ClientValidate === 'function') {
            if (Page_ClientValidate('')) {
                clearIsDirty();
                disableButtons();
                this.value = 'Processing...';
            }
        } else {
            clearIsDirty();
            disableButtons();
            this.value = 'Processing...';
        }
    };"
>Add</button>`);

});

    
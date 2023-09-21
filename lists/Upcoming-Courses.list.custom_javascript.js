$(document).ready(function () {
    $(".entitylist").on("loaded", function () {
        const table = this.getElementsByClassName('table')[0];
        if (table) {
            const totalRowCount = table.tBodies && table.tBodies.length && table.tBodies[0].rows ? table.tBodies[0].rows.length : 0;
            const srMsg = "Found " + totalRowCount + " records";

            // Add status for screen reader
            $("#tableFilterAlert").remove();
            if (totalRowCount > 0 && !document.getElementById("SearchCountTextnull")) {
                $("<div id='tableFilterAlert' class='sr-only' role='alert' aria-label='" + srMsg + "'></div>").insertAfter(table);
            }

            table.setAttribute('aria-label', srMsg);
        }
    });
});

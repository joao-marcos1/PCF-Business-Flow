async function saveToLog(executionContext) {
    try {
        const trackerNumber = executionContext.getFormContext().getAttribute("wcs_sampletrackernumber").getValue();
        const userName = Xrm.Utility.getGlobalContext().userSettings.userName;
        const BPFStage = Xrm.Page.data.process.getActiveStage();

        const fetchXml = [
            "<fetch>",
                "<entity name='wcs_barcodescannerapp_tempdirectory'>",
                    "<filter>",
                        "<condition attribute='wcs_sampletrackernumber' operator='eq' value='", trackerNumber, "'/>",
                        "<condition attribute='wcs_user' operator='eq' value='", userName, "'/>",
                        "<condition attribute='wcs_commitchange' operator='eq' value='0'/>",
                    "</filter>",
                "</entity>",
            "</fetch>",
        ].join("");

        const fetchUrl = Xrm.Page.context.getClientUrl()
            + "/api/data/v9.2/wcs_barcodescannerapp_tempdirectories?fetchXml="
            + encodeURIComponent(fetchXml);

        const data = await fetch(
            fetchUrl,
            {
                credentials: "same-origin",
                headers: {
                    Prefer: 'odata.include-annotations="*"'
                }
            }
        )
        .then(response => response.json());

        if (data.error) {
            throw Error(data.error.message);
        }

console.log(data.value.length);
        if (data.value.length) {
            showObj(ArrayLength, userName, trackerNumber, BPFStage);
        }
    } catch(e) {
        Xrm.Navigation.openAlertDialog("Error: " + e.message);
    }
}

function showObj(userName, trackerNumber, BPFStage) {
    window.open(
        'https://apps.powerapps.com/play/03b28197-7202-4c88-8046-b1ecb01b5fad?source=JS&user='
        + userName + '&record=' + trackerNumber + '&stage=' + BPFStage, '&FormType="Sample"' + "",
        "width=800,height=600",
        "menubar=no",
        "toolbar=no"
    );
}

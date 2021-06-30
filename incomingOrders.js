GlobalFormContext;

function onLoad(executionContext) {
    GlobalFormContext = executionContext.getFormContext();

    verifyWeight();
}

function onSave(executionContext) {
    try {
        const formContext = executionContext.getFormContext();
        const receivedWeight = formContext.getAttribute("wcs_receivedweightg").getValue();
        // It will be available, just hardcode it for now
        const reportedWeight = 10;
        // const reportedWeight = formContext.getAttribute("wcs_reportedweightg").getValue();
        const verifiedWeight = reportedWeight - receivedWeight;
        const QCAllowance = formContext.getAttribute("wcs_qcreceivedweightallowance").getValue();
        formContext.getAttribute("wcs_qcreceivedweightverification").setValue(verifiedWeight);
        formContext.getAttribute("wcs_qcweightverified").setValue(verifiedWeight <= QCAllowance);

        verifyWeight();
    } catch (e) {
        Xrm.Utility.alertDialog(e.message, { height: 120 });
    }
}

function verifyWeight() {
    const wcs_ordernumber = GlobalFormContext.data.entity.getId();
    let fetchXml = [
        "<fetch>",
          "<entity name='wcs_sampletracker'>",
            "<filter>",
              "<condition attribute='wcs_ordernumber' operator='eq' value='", wcs_ordernumber, "'/>",
              "<filter>",
                "<condition attribute='wcs_qcweightverified' operator='eq' value='0'/>",
              "</filter>",
            "</filter>",
          "</entity>",
        "</fetch>",
    ].join("");

//debug

    const fetchUrl = Xrm.Page.context.getClientUrl()
        + "/api/data/v9.0/wcs_sampletrackers?fetchXml="
        + encodeURIComponent(fetchXml);

    fetch(
        fetchUrl,
        {
            credentials: "same-origin",
            headers: {
                Prefer: 'odata.include-annotations="*"'
            }
        }
    )
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw Error(data.error.message);
        }
        // need to create column in sample tracker ??
        GlobalFormContext.getAttribute("wcs_sampleweightsverified").setValue(!data.value.length);
    })
    .catch(error => Xrm.Utility.alertDialog("Error: " + error.message, { height: 120 }));
}

///Decide On Select/Save/PostSave/Load and Clean Up any ASync Issues

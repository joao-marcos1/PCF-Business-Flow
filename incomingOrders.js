GlobalFormContext;

function onLoad(executionContext) {
    GlobalFormContext = executionContext.getFormContext();

    verifyWeight();
}

async function onSave(executionContext) {
    try {
        const formContext = executionContext.getFormContext();
        const receivedWeight = formContext.getAttribute("wcs_receivedweightg").getValue();
        const reportedWeight = formContext.getAttribute("wcs_reportedweightg").getValue();
        const QCAllowance = formContext.getAttribute("wcs_qcreceivedweightallowance").getValue();

        const isWeightVerified = Math.abs(reportedWeight - receivedWeight) <= Math.abs(QCAllowance);

        formContext.getAttribute("wcs_qcweightverified").setValue(isWeightVerified);

        await formContext.data.save();
        verifyWeight();
    } catch (e) {
        Xrm.Utility.alertDialog(e.message, { height: 150 });
    }
}

async function verifyWeight() {
    const wcs_ordernumber = GlobalFormContext.data.entity.getId();
    const trackingStatus = 799530000;    // Awaiting Arrival tracking status
    let fetchXml = [
        "<fetch>",
          "<entity name='wcs_sampletracker'>",
            "<filter>",
              "<condition attribute='wcs_ordernumber' operator='eq' value='", wcs_ordernumber, "'/>",
              "<condition attribute='wcs_sampletrackingstatus' operator='eq' value='", trackingStatus, "'/>",
              "<condition attribute='wcs_qcweightverified' operator='eq' value='0'/>",
            "</filter>",
          "</entity>",
        "</fetch>",
    ].join("");

    const fetchUrl = Xrm.Page.context.getClientUrl()
        + "/api/data/v9.0/wcs_sampletrackers?fetchXml="
        + encodeURIComponent(fetchXml);

    try {
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
        // need to create column in sample tracker ??
        GlobalFormContext.getAttribute("wcs_sampleweightsverified").setValue(!data.value.length);
    } catch(e) {
        Xrm.Utility.alertDialog("Error: " + e.message, { height: 150 });
    };
}

///Decide On Select/Save/PostSave/Load and Clean Up any ASync Issues

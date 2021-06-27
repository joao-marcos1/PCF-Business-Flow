GlobalFormContext;

function onLoad(executionContext) {
    GlobalFormContext = executionContext.getFormContext();

    const GetRecord = GlobalFormContext.data.entity.getId();
    WtVerify(GetRecord);
}

function RunOnSelected(executionContext) {  ///May need to change to onSAVE or Post Save
    try {
        const { attributes } = executionContext.getFormContext().data.entity;
        const QCVerify = attributes.getByName("wcs_qcreceivedweightverification").getValue();
        const QCAllowance = attributes.getByName("wcs_qcreceivedweightallowance").getValue();

        attributes.getByName("wcs_qcweightverified").setValue(QCVerify <= QCAllowance);
        alert(QCVerify <= QCAllowance);

        const gv = GlobalFormContext.data.entity.getId();
        WtVerify(gv);
    } catch (e) {
        Xrm.Utility.alertDialog(e.message);
    }
}

function WtVerify(wcs_ordernumber) { //Is this being called in the previous function ok? Is that function complete (and the value updated) before this is called??
console.log('WtVerify', wcs_ordernumber);
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
    .then(({ value }) => {
        // need to create column in sample tracker ??
        GlobalFormContext.getAttribute("wcs_sampleweightsverified").setValue(!value.length); 
console.log(value.length);
    })
    .catch(error => Xrm.Utility.alertDialog("Error: " + error.message));
}

///Decide On Select/Save/PostSave/Load and Clean Up any ASync Issues

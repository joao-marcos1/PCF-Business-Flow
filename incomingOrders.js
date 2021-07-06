let GlobalFormContext;
let saving = {};

function onLoad(executionContext) {
    GlobalFormContext = executionContext.getFormContext();

    verifyWeight();
}

async function onSave(executionContext) {
    const formContext = executionContext.getFormContext();
    const trackerId = formContext.data.entity.getId();

    if (saving[trackerId]?.isSaving) {
        if (saving[trackerId].value !== formContext.getAttribute("wcs_receivedweightg").getValue()) {
            formContext.getAttribute("wcs_receivedweightg").setValue(saving[trackerId].value);
        }
        return;
    }

    saving[trackerId] = ({ isSaving: true });

    try {
        await updateWeightVerified(formContext, trackerId);
        await formContext.data.save();
        verifyWeight();
    } catch (e) {
        Xrm.Utility.alertDialog(e.message, { height: 150 });
    }
    delete saving[trackerId];
}

async function updateWeightVerified(formContext, trackerId) {
    const receivedWeight = formContext.getAttribute("wcs_receivedweightg").getValue();
    saving[trackerId]['value'] = receivedWeight;

    const { reportedWeight, weightAllowance } = await getReportedWeight(trackerId);
    const isWeightVerified = Math.abs(reportedWeight - receivedWeight) <= Math.abs(weightAllowance);

    formContext.getAttribute("wcs_qcweightverified").setValue(isWeightVerified);
}

async function getReportedWeight(wcs_sampletrackerid) {
    const fetchXml = [
        "<fetch>",
            "<entity name='wcs_sampletracker'>",
                "<attribute name='wcs_reportedweightg' />",
                "<attribute name='wcs_qcreceivedweightallowance' />",
                "<filter>",
                    "<condition attribute='wcs_sampletrackerid' operator='eq' value='", wcs_sampletrackerid, "' />",
                "</filter>",
            "</entity>",
        "</fetch>"
    ].join("");

    const data = await fetchData(fetchXml);

    return {
        reportedWeight: data?.value[0].wcs_reportedweightg,
        weightAllowance: data?.value[0].wcs_qcreceivedweightallowance
    };
}

async function verifyWeight() {
    const wcs_ordernumber = GlobalFormContext.data.entity.getId();
    const trackingStatus = 799530000;    // Awaiting Arrival tracking status
    const fetchXml = [
        "<fetch>",
            "<entity name='wcs_sampletracker'>",
                "<filter>",
                    "<condition attribute='wcs_ordernumber' operator='eq' value='", wcs_ordernumber, "' />",
                    "<condition attribute='wcs_sampletrackingstatus' operator='eq' value='", trackingStatus, "' />",
                    "<condition attribute='wcs_qcweightverified' operator='eq' value='0' />",
                "</filter>",
            "</entity>",
        "</fetch>"
    ].join("");

    const data = await fetchData(fetchXml);
    const isSampleWeightsVerified = !!data && !data.value.length;

    GlobalFormContext.getAttribute("wcs_sampleweightsverified").setValue(isSampleWeightsVerified);
}

async function fetchData(fetchXml) {
    const fetchUrl = Xrm.Page.context.getClientUrl()
        + "/api/data/v9.2/wcs_sampletrackers?fetchXml="
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

        return data;
    } catch(e) {
        Xrm.Utility.alertDialog("Error: " + e.message, { height: 150 });
    }
}

///Decide On Select/Save/PostSave/Load and Clean Up any ASync Issues

let GlobalFormContext;

function onLoad(executionContext) {
    GlobalFormContext = executionContext.getFormContext();

    verifyWeight();
}

async function onChange(executionContext) {
    const gridContext = executionContext.getFormContext();

    try {
        await updateWeightVerified(gridContext);
        await gridContext.data.save();
        verifyWeight();
    } catch (e) {
        Xrm.Navigation.openAlertDialog("Error: " + e.message);
    }
}

async function updateWeightVerified(gridContext) {
    const recordedWeight = gridContext.getAttribute("wcs_recordedweightg").getValue();
    const samlpeId = gridContext.getAttribute("wcs_sampleid").getValue();

    const { reportedWeight, allowedWeightVariance } = await getRecordDetails(samlpeId);
    const weightVariance = reportedWeight * allowedWeightVariance / 100;
    const isWeightVerified = Math.abs(reportedWeight - recordedWeight) <= Math.abs(weightVariance);

    gridContext.getAttribute("wcs_weightverified").setValue(isWeightVerified);
}

async function getRecordDetails(wcs_sampleid) {
    const fetchXml = [
        "<fetch>",
            "<entity name='wcs_laboratorysamples'>",
                "<attribute name='wcs_reportedweightg' />",
                "<attribute name='wcs_allowedweightvariancepct' />",
                "<filter>",
                    "<condition attribute='wcs_sampleid' operator='eq' value='", wcs_sampleid, "' />",
                "</filter>",
            "</entity>",
        "</fetch>"
    ].join("");

    const data = await fetchData(fetchXml);

    return {
        reportedWeight: data?.value[0].wcs_reportedweightg,
        allowedWeightVariance: data?.value[0].wcs_allowedweightvariancepct
    };
}

async function verifyWeight() {
    try {
        const wcs_ordernumber = GlobalFormContext.data.entity.getId();
        const fetchXml = [
            "<fetch>",
                "<entity name='wcs_laboratorysamples'>",
                    "<filter>",
                        "<condition attribute='wcs_ordernumber' operator='eq' value='", wcs_ordernumber, "' />",
                        "<condition attribute='wcs_weightverified' operator='eq' value='0' />",
                    "</filter>",
                "</entity>",
            "</fetch>"
        ].join("");

        const data = await fetchData(fetchXml);
        const isSampleWeightsVerified = !!data && !data.value.length;

        GlobalFormContext.getAttribute("wcs_sampleweightsverified").setValue(isSampleWeightsVerified);
    } catch(e) {
        Xrm.Navigation.openAlertDialog("Error: " + e.message);
    }
}

async function fetchData(fetchXml) {
    const fetchUrl = Xrm.Page.context.getClientUrl()
        + "/api/data/v9.2/wcs_laboratorysampleses?fetchXml="
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
        Xrm.Navigation.openAlertDialog("Error: " + e.message);
    }
}

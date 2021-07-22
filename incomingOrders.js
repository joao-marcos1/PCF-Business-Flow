let GlobalFormContext;

function onLoad(executionContext) {
    try {
        GlobalFormContext = executionContext.getFormContext();
        GlobalFormContext.getControl("Subgrid_1").addOnLoad(subGridOnLoad);
    } catch(e) {
        Xrm.Navigation.openAlertDialog("Error: " + e.message);
    }
}

async function subGridOnLoad(executionContext) {
    const formContext = executionContext.getFormContext();
    const subGridControl = formContext.getControl("Subgrid_1");
    const gridRows = subGridControl.getGrid().getRows();
    const sampleTrackerNumbers = [];

    gridRows.forEach(row => {
        const sampleTrackerNumberAttr = row.getAttribute("wcs_sampletrackernumber");

        if (sampleTrackerNumberAttr !== null && sampleTrackerNumberAttr.getValue() === null) {
            sampleTrackerNumbers.push(row.getAttribute("wcs_sampleid").getValue() + '-0');
        }
    });

    if (sampleTrackerNumbers.length) {
        const sampleIds = await getSampleTrackerRecordsDetails(sampleTrackerNumbers);

        if (Object.keys(sampleIds).length) {
            gridRows.forEach(row => {
                const sampleIdAttr = row.getAttribute("wcs_sampleid");
                const sampleIdObj = sampleIds[sampleIdAttr.getValue()];

                if (typeof sampleIdObj !== 'undefined') {
                    row.getAttribute("wcs_sampletrackernumber").setValue([{
                        id: sampleIdObj.id,
                        name: sampleIdObj.name,
                        entityType: 'wcs_sampletracker'
                    }]);
                }
            });
            await formContext.data.save();
        }
    }

    subGridControl.removeOnLoad(subGridOnLoad);
}

async function onChange(executionContext) {
    try {
        const gridContext = executionContext.getFormContext();

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

async function getSampleTrackerRecordsDetails(sampleTrackerNumbers) {
    const fetchXml = [
        "<fetch>",
            "<entity name='wcs_sampletracker'>",
                "<attribute name='wcs_sampletrackernumber' />",
                "<attribute name='wcs_sampleid' />",
                "<filter>",
                    "<condition attribute='wcs_sampletrackernumber' operator='in'>",
                        ...sampleTrackerNumbers.map(number => `<value>${number}</value>`),
                    "</condition>",
                "</filter>",
            "</entity>",
        "</fetch>"
    ].join("");

    const data = await fetchData(fetchXml, 'wcs_sampletrackers');

    let result = {};
    data.value.forEach(value => {
        result[value['_wcs_sampleid_value@OData.Community.Display.V1.FormattedValue']] = {
            id: value['wcs_sampletrackerid'],
            name: value['wcs_sampletrackernumber']
        }
    });

    return result;
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

async function fetchData(fetchXml, tableName = 'wcs_laboratorysampleses') {
    const fetchUrl = Xrm.Page.context.getClientUrl()
        + `/api/data/v9.2/${tableName}?fetchXml=`
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

import { IInputs, IOutputs } from './generated/ManifestTypes';

import React from 'react';
import ReactDOM from 'react-dom';

import { Props } from './types';
import SeatsApp from './SeatsApp';

export class SeatsAppControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  private _context: ComponentFramework.Context<IInputs>;
  private _container: HTMLDivElement;
  private _props: Props;

  /**
   * Empty constructor.
   */
  constructor () {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public async init (
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): Promise<void> {
    this._context   = context;
    this._container = container;
    this._props = {
      allItems: [],
      columns: [],
      seatsSchema: {},
      allFreeSeatsIds: [],
      message: {
        type: null
      }
    };
console.log(`context`, context)
    await this._initProps();

    ReactDOM.render(
      React.createElement(SeatsApp, this._props),
      this._container
    );
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView (context: ComponentFramework.Context<IInputs>): void {}

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs (): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy (): void {
    ReactDOM.unmountComponentAtNode(this._container);
  }

  private async _initProps (): Promise<void> {
    this._initColumns();
    try {
      await Promise.all([
        this._initDetailsList(),
        this._initSeatsSchema()
      ]);
    } catch({ type, text }) {
      this._props.message = { type, text };
    }
  }

  private _initColumns (): void {
    this._props.columns = [
      { key: 'sampleTrackerNumber', name: 'Sample Tracker Number', fieldName: 'sampleTrackerNumber' },
      { key: 'platePositionNumber', name: 'Plate Position Number', fieldName: 'platePositionNumber' }
    ].map(({ key, name, fieldName }) => ({
      key,
      name,
      fieldName,
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    }));
  }

  private async _initDetailsList (): Promise<void> {
    const errorMessage = 'Contact Your Administrator with Error: "FetchXML did not return Details List".';
    const {
      detailsEntity,
      sampleTrackerNumber,
      platePositionNumber,
      binLocation
    } = this._context.parameters;

    try {
      this._validateProperty(detailsEntity, 'Entity for Details List Property');
      this._validateProperty(sampleTrackerNumber, 'Sample Tracker Number');
      this._validateProperty(platePositionNumber, 'Plate Position Number');
      this._validateProperty(binLocation, 'Bin Location', true);
    } catch(error) {
      throw {
        type: 'error',
        text: `${errorMessage} Reason: "${error}"`
      };
    }

    let fetchXML: string = "";
    fetchXML += "<fetch mapping='logical'>";
    fetchXML += `<entity name='${detailsEntity.raw}'>`;
    fetchXML += `<attribute name='${sampleTrackerNumber.raw}' />`;
    fetchXML += `<attribute name='${platePositionNumber.raw}' />`;
    fetchXML += "<filter>";
    // @ts-ignore
      fetchXML += `<condition attribute='${binLocation.attributes.LogicalName}' operator='not-null' />`;
    fetchXML += "</filter>";
    fetchXML += "</entity>";
    fetchXML += "</fetch>";

    const data = await this._fetchData(
      // @ts-ignore
      detailsEntity.raw,
      fetchXML,
      errorMessage
    );

    if (!data.length) {
      throw {
        type: 'warning',
        text: 'No Samples to Load'
      };
    }

    this._props.allItems = data.map((entity, index) => ({
      key: index,
      // @ts-ignore
      sampleTrackerNumber: entity[sampleTrackerNumber.raw],
      // @ts-ignore
      platePositionNumber: entity[platePositionNumber.raw] || null
    }));
  }

  private async _initSeatsSchema (): Promise<void> {
    const errorMessage = 'Contact Your Administrator with Error: "FetchXML did not return Seats Schema".';
    const {
      schemaEntity,
      schemaRowId,
      schemaSeatName,
      schemaSeatStatus
    } = this._context.parameters;

    try {
      this._validateProperty(schemaEntity, 'Entity for Seats Schema Property');
      this._validateProperty(schemaRowId, 'Schema Row Id');
      this._validateProperty(schemaSeatName, 'Schema Seat Name');
      this._validateProperty(schemaSeatStatus, 'Schema Seat Status');
    } catch(error) {
      throw {
        type: 'error',
        text: `${errorMessage} Reason: "${error}"`
      };
    }

    let fetchXML: string = "";
    fetchXML += "<fetch mapping='logical'>";
    fetchXML += `<entity name='${schemaEntity.raw}'>`;
    fetchXML += `<attribute name='${schemaRowId.raw}' />`;
    fetchXML += `<attribute name='${schemaSeatName.raw}' />`;
    fetchXML += `<attribute name='${schemaSeatStatus.raw}' />`;
    fetchXML += "</entity>";
    fetchXML += "</fetch>";

    const data = await this._fetchData(
      // @ts-ignore
      schemaEntity.raw,
      fetchXML,
      errorMessage
    );

    if (!data.length) {
      throw {
        type: 'warning',
        text: 'No Seats Schema to Load'
      };
    }

    const seatsByRows: any = {};

    data.forEach(entity => {
      // @ts-ignore
      const rowId = entity[schemaRowId.raw];
      // @ts-ignore
      const seatName = entity[schemaSeatName.raw];
      const seatStatus = entity[
        `${schemaSeatStatus.raw}@OData.Community.Display.V1.FormattedValue`
      ].toLowerCase();

      if (!seatsByRows[rowId]) {
        seatsByRows[rowId] = [];
      }
      seatsByRows[rowId].push({
        name: seatName,
        status: seatStatus
      });

      if (seatStatus === 'free') {
        this._props.allFreeSeatsIds.push(seatName);
      }
    });

    this._props.seatsSchema = { seats: { sections: [{ subsections: [{ seats_by_rows: seatsByRows }] }] } };
  }

  private async _fetchData (
    entityType: string,
    fetchXML: string,
    errorMessage: string
  ): Promise<ComponentFramework.WebApi.Entity[]> {
    let response: ComponentFramework.WebApi.RetrieveMultipleResponse;

    try {
      response = await this._context.webAPI.retrieveMultipleRecords(
        entityType,
        `?fetchXml=${encodeURIComponent(fetchXML)}`
      );
console.log(response)
    } catch(error) {
console.log(`error`, error)
      throw {
        type: 'error',
        text: `${errorMessage} Reason: "${error.title || error}"`
      };
    }

    return response.entities;
  }

  private _validateProperty (property: any, name: string, isOptionSet: boolean = false): void {
    if (!property || !(property instanceof Object)) {
      throw `Unknown ${name}`;
    }
    if (
      (!isOptionSet && typeof property.raw !== 'string' || property.raw === '') ||
      (isOptionSet && typeof property.attributes?.LogicalName !== 'string')
    ) {
      throw `Incorrect ${name} Value`;
    }
  }
}

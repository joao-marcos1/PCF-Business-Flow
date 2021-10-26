import { IInputs, IOutputs } from './generated/ManifestTypes';

import React from 'react';
import ReactDOM from 'react-dom';

import { Props, Message } from './types';
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
      allChangeableSeatsNames: {},
      message: {
        type: null
      },
      saveData: this._saveData.bind(this)
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
      const errorMessage = 'Contact Your Administrator with Error: "Bin Location Option Set".';
      const { binLocation } = this._context.parameters;

      try {
        if (!binLocation || !(binLocation instanceof Object)) {
          throw "Unknown Bin Location";
        }
        if (typeof binLocation.attributes?.LogicalName !== 'string') {
          throw "Incorrect Bin Location Logical Name";
        }
      } catch(error) {
        throw {
          type: 'error',
          text: `${errorMessage} Reason: "${error}"`
        };
      }

      if (
        typeof binLocation.raw       !== 'number' ||
        typeof binLocation.formatted !== 'string'
      ) {
        throw {
          type: 'warning',
          text: 'No Samples to Load'
        };
      }

      await Promise.all([
        this._initDetailsList(binLocation.attributes.LogicalName, binLocation.raw),
        this._initSeatsSchema(binLocation.formatted)
      ]);
    } catch({ type, text }) {
      this._props.message = { type, text } as Message;
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

  private async _initDetailsList (binLocationName: string, binLocationValue: number): Promise<void> {
    const errorMessage = 'Contact Your Administrator with Error: "FetchXML did not return Details List".';

    let fetchXML: string = (
      `<fetch mapping='logical'>
        <entity name='wcs_sampletracker'>
          <attribute name='wcs_sampletrackernumber' />
          <attribute name='wcs_platepositionnumber' />
          <filter>
            <condition attribute='${binLocationName}' operator='eq' value='${binLocationValue}' />
          </filter>
        </entity>
      </fetch>`
    );

    const data = await this._fetchData(
      'wcs_sampletracker',
      fetchXML,
      errorMessage
    );
console.log(data)
    if (!data.length) {
      throw {
        type: 'warning',
        text: 'No Samples to Load'
      };
    }

    this._props.allItems = data.map(entity => ({
      key: entity['wcs_sampletrackerid'],
      sampleTrackerNumber: entity['wcs_sampletrackernumber'],
      platePositionNumber: entity['wcs_platepositionnumber'] || null,
      section: null
    }));
  }

  private async _initSeatsSchema (binLocationFormattedValue: string): Promise<void> {
    const errorMessage = 'Contact Your Administrator with Error: "FetchXML did not return Seats Schema".';

    let fetchXML: string = (
      `<fetch mapping='logical'>
        <entity name='wcs_seatsschema'>
          <attribute name='wcs_id' />
          <attribute name='wcs_seatname' />
          <attribute name='wcs_rowid' />
          <attribute name='wcs_trayid' />
          <attribute name='wcs_seatstatus' />
          <attribute name='wcs_seatsize' />
          <order descending='false' attribute='wcs_id'/>
          <link-entity name='wcs_seatssubsection' from='wcs_seatssubsectionid' to='wcs_subsectionid' link-type='inner'>
            <attribute name='wcs_name' />
            <order descending='false' attribute='wcs_id'/>
            <filter>
              <condition attribute='wcs_name' operator='eq' value='${binLocationFormattedValue}' />
            </filter>
          </link-entity>
        </entity>
      </fetch>`
      // `<fetch mapping='logical'>
      //   <entity name='wcs_seatsschema'>
      //     <attribute name='wcs_seatname' />
      //     <attribute name='wcs_rowid' />
      //     <attribute name='wcs_trayid' />
      //     <attribute name='wcs_seatstatus' />
      //     <order descending='false' attribute='wcs_seatname'/>
      //     <link-entity name='wcs_seatssubsection' from='wcs_seatssubsectionid' to='wcs_subsectionid' link-type='inner'>
      //       <attribute name='wcs_name' />
      //       <order descending='false' attribute='wcs_name'/>
      //       <link-entity name='wcs_seatssection' from='wcs_seatssectionid' to='wcs_sectionid' link-type='inner'>
      //         <attribute name='wcs_name' />
      //         <filter>
      //           <condition attribute='wcs_id' operator='eq' value='3' />
      //         </filter>
      //       </link-entity>
      //     </link-entity>
      //   </entity>
      // </fetch>`
              // <condition attribute='${binLocation.attributes.LogicalName}' operator='eq' value='${}' />
    );

    const data = await this._fetchData(
      'wcs_seatsschema',
      fetchXML,
      errorMessage
    );
console.log(data)
    if (!data.length) {
      throw {
        type: 'warning',
        text: 'No Seats Schema to Load'
      };
    }

    const sections: any = {};

    data.sort((a, b) => a['wcs_id'] - b['wcs_id']).forEach(entity => {
      const sectionName = entity['wcs_seatssubsection1.wcs_name'];
      if (!sections[sectionName]) {
        sections[sectionName] = {};
      }

      const trayId = entity['wcs_trayid'];
      if (!sections[sectionName][trayId]) {
        sections[sectionName][trayId] = {
          name: trayId,
          seats_by_rows: {}
        };
      }

      const rowId = entity['wcs_rowid'];
      if (!sections[sectionName][trayId].seats_by_rows[rowId]) {
        sections[sectionName][trayId].seats_by_rows[rowId] = [];
      }

      const seatName = entity['wcs_seatname'];
      const seatStatus = entity[
        'wcs_seatstatus@OData.Community.Display.V1.FormattedValue'
      ].toLowerCase();

      sections[sectionName][trayId].seats_by_rows[rowId].push({
        id: entity['wcs_seatsschemaid'],
        name: seatName,
        size: entity['wcs_seatsize@OData.Community.Display.V1.FormattedValue'].toLowerCase(),
        status: seatStatus
      });

      if (!this._props.allChangeableSeatsNames[sectionName]) {
        this._props.allChangeableSeatsNames[sectionName] = {
          free: {},
          booked: []
        };
      }
      if (!this._props.allChangeableSeatsNames[sectionName]['free'][trayId]) {
        this._props.allChangeableSeatsNames[sectionName]['free'][trayId] = [];
      }
      if (seatStatus === 'free') {
        this._props.allChangeableSeatsNames[sectionName]['free'][trayId].push(seatName);
      }

      if (!this._props.allChangeableSeatsNames[sectionName]['booked']) {
        this._props.allChangeableSeatsNames[sectionName]['booked'] = [];
      }
      if (seatStatus === 'booked') {
        this._props.allChangeableSeatsNames[sectionName]['booked'].push(seatName);
      }
    });

    Object.keys(sections).forEach(name => {
      this._props.seatsSchema[name] = {
        name: name,
        subsections: Object.values(sections[name])
      };
    });
console.log(`this._props.seatsSchema`, this._props.seatsSchema)
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
    } catch(error: any) {
      throw {
        type: 'error',
        text: `${errorMessage} Reason: "${error.title || error}"`
      };
    }

    return response.entities;
  }

  private async _saveData (data: any): Promise<void> {
    const errorMessage = 'Contact Your Administrator with Error: "Something went wrong while saving".';
    const status: any = {
      free: 799530000,
      booked: 799530001
    };
console.group("_saveData")
console.log('data :>> ', data);
    try {
      await Promise.all(
        Object.keys(data.items).map(
          id => this._context.webAPI.updateRecord(
            'wcs_sampletracker',
            id,
            { wcs_platepositionnumber: data.items[id] }
          )
        ).concat(
          Object.keys(data.seats).map(
            id => this._context.webAPI.updateRecord(
              'wcs_seatsschema',
              id,
              { wcs_seatstatus: status[data.seats[id]] }
            )
          )
        )
      );
    } catch(error: any) {
console.log('error', error)
      throw {
        type: 'error',
        text: `${errorMessage} Reason: "${error.title || error}"`
      };
    }
console.groupEnd()
  }
}

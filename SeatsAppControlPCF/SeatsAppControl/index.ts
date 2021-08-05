import { IInputs, IOutputs } from './generated/ManifestTypes';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { DetailsListItem, Column, MappedItem, MapSelectedItems } from './types';
import SeatsDetailsList from './SeatsDetailsList';

type Props = {
  allItems: DetailsListItem[];
  columns: Column[];
  mapSelectedItems: MapSelectedItems;
};

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
      mapSelectedItems: this._mapSelectedItems
    };
console.log(`context`, context)
    const errorMessage = 'Contact Your Administrator with Error: "FetchXML did not return Details List"';
    try {
      // this._props.allItems = await this._getSeatsDetails();
      this._props.allItems = [{
        sampleTrackerNumber: 'Sample Tracker Number 1',
        platePositionNumber: null,
        binLocation: 'Bin Location 1'
      }, {
        sampleTrackerNumber: 'Sample Tracker Number 2',
        platePositionNumber: null,
        binLocation: 'Bin Location 2'
      }];
      this._props.columns = this._getColumns();
    } catch(error) {
      alert(`${errorMessage}\nReason: "${error}"`);
      return;
    }
    if (!this._props.allItems.length) {
      alert(`${errorMessage}\nReason: "Empty array"`);
      return;
    }

    ReactDOM.render(
      React.createElement(SeatsDetailsList, this._props),
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

  private async _getSeatsDetails(): Promise<Array<DetailsListItem>> {

    const {
      entityProperty,
      sampleTrackerNumber,
      platePositionNumber,
      zoneLocation,
      binLocation
    } = this._context.parameters;

    try {
      this._validateProperty(entityProperty, 'Entity Property');
      this._validateProperty(sampleTrackerNumber, 'Sample Tracker Number');
      this._validateProperty(platePositionNumber, 'Plate Position Number');
      this._validateProperty(zoneLocation, 'Zone Location');
      this._validateProperty(binLocation, 'Bin Location', true);
    } catch(error) {
      throw error;
    }

    let fetchXML: string = "";
    fetchXML += "<fetch mapping='logical'>";
    fetchXML += `<entity name='${entityProperty.raw}'>`;
    fetchXML += `<attribute name='${sampleTrackerNumber.raw}' />`;
    fetchXML += `<attribute name='${platePositionNumber.raw}' />`;
    fetchXML += `<attribute name='${zoneLocation.raw}' />`;
    // @ts-ignore
    fetchXML += `<attribute name='${binLocation.attributes.LogicalName}' />`;
    fetchXML += "</entity>";
    fetchXML += "</fetch>";

    let response: ComponentFramework.WebApi.RetrieveMultipleResponse;
    try {
      response = await this._context.webAPI.retrieveMultipleRecords(
        // @ts-ignore
        entityProperty.raw,
        `?fetchXml=${encodeURIComponent(fetchXML)}`
      );
console.log(response)
      const result: DetailsListItem[] = [];

      response.entities.forEach(entity => {
        // @ts-ignore
        const binLocationValue: string | undefined = entity[binLocation.attributes.LogicalName];

        if (binLocationValue) {
          result.push({
            // key: index,
            // @ts-ignore
            sampleTrackerNumber: entity[sampleTrackerNumber.raw],
            // @ts-ignore
            platePositionNumber: entity[platePositionNumber.raw] || null,
            binLocation: binLocationValue
          });
        }
      });

      return result;
    } catch(error) {
console.log(`error`, error)
      throw error.title;
    }
  }

  private _validateProperty(property: any, name: string, isOptionSet: boolean = false): void {
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

  private _getColumns = () => {
    return [
      { key: 'sampleTrackerNumber', name: 'Sample Tracker Number', fieldName: 'sampleTrackerNumber', },
      { key: 'platePositionNumber', name: 'Plate Position Number', fieldName: 'platePositionNumber', },
      // { key: 'zoneLocation', name: 'Zone Location', fieldName: 'zoneLocation', },
      // { key: 'binLocation', name: 'Bin Location', fieldName: 'binLocation', }
    ];
  }

  private _mapSelectedItems = ({ binLocation }: { binLocation: string }): MappedItem => ({ binLocation });
}

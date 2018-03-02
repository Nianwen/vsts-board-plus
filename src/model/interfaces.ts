import { TemplateInputTypes } from "./configuration/inputs";

export type Direction = "horizontal" | "vertical";

export interface IFieldValueMap {
    [key: string]: boolean | number | string | Date;
}

export interface IItem {
    id: number;

    values: IFieldValueMap;
}

export interface IEntry {
    id: string;
}

export interface IPartition {
    /** 
     * Label to display for legend
     */
    label: string;

    /** 
     * How to render the legend
     */
    legendType: PartitionProviderLegendType;

    // TODO
    value: string | number | boolean | Date;

    fieldName: string;

    displayData?: any;
}

export interface IItemPlacement {
    [x: number]: { [y: number]: IItem[] };
}

export interface IItemPlacementLocation {
    x: number;
    y: number;
}

export interface IPartitionProvider {
    readonly type: PartitionProviderType;

    getRequiredFields(configuration: IPartitionProviderConfiguration): Promise<string[]>;

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]>;
}

export interface IPartitionProviderInputs {
    // tslint:disable-next-line:no-any
    [key: string]: any;
}

export interface IPartitionProviderTemplate {
    /** Unique identifier */
    id: string;

    displayName: string;

    description: string;

    inputs: IPartitionProviderTemplateInput[];

    type: PartitionProviderType;

    legendType: PartitionProviderLegendType;
}

export interface IPartitionProviderTemplateInput {
    type: TemplateInputTypes;

    inputKey?: string;

    label?: string;

    description?: string;

    inputs?: Object;

    group?: IPartitionProviderTemplateInput[];

    /** If true, allows multiple inputs of the type */
    multiple?: boolean;
}

export enum PartitionProviderType {
    FieldValue,
    Static,
    Parent,

    Iterations,
    Team,
    TeamMembers
}

export enum PartitionProviderLegendType {
    Text,
    Card
}

export interface IPartitionProviderConfiguration {
    type: PartitionProviderType;

    inputs?: IPartitionProviderInputs;
}

export interface IBoardConfiguration {
    id: string;
    name: string;

    queryId: string;

    horizontalPartitionProviders: IPartitionProviderConfiguration[];
    verticalPartitionProviders: IPartitionProviderConfiguration[];
}

// TODO...
export interface IDropLocation {
    partitions: IPartition[];

    index?: number;
}

export interface IFieldReference {
    referenceName: string;

    displayName: string;
}

export interface ITeamReference {
    id: string;

    name: string;
}

export const enum DataSourceType {
    Query,
    Backlog
}

export interface IDataSource {
    type: DataSourceType;

    getItems(): Promise<number[]>;
}
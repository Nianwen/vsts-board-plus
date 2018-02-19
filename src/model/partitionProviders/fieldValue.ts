import { IPartitionProvider, IPartitionProviderConfiguration, IPartition, IItem } from "../interfaces";

/**
 * Partition provider that creates one partition for every unique field value
 */
const FieldValuePartitionProvider: IPartitionProvider = {
    type: "fieldValue",

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        const set = new Set(items.map(item => item.values[configuration.fieldName]));

        return Promise.resolve(
            Array.from(set).map(value => ({
                label: value.toString(),
                value: value.toString(),
                fieldName: configuration.fieldName
            }))
        );
    }
};

export default FieldValuePartitionProvider;
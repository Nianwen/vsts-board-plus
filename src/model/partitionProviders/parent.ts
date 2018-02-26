import {
    IPartitionProvider,
    IPartitionProviderConfiguration,
    IPartition,
    IItem,
    PartitionProviderType,
    PartitionProviderLegendType
} from "../interfaces";

/**
 * Partition provider that creates one partition for every unique field value
 */
const ParentPartitionProvider: IPartitionProvider = {
    type: PartitionProviderType.Parent,

    getRequiredFields(configuration: IPartitionProviderConfiguration): Promise<string[]> {
        // TODO: Run extra query here to determine parent for items?
        return Promise.resolve([]);
    },

    getPartitions(configuration: IPartitionProviderConfiguration, items: IItem[]): Promise<IPartition[]> {
        return Promise.resolve(
            [{
                fieldName: "Parent",
                label: "Parent",
                value: null,
                legendType: PartitionProviderLegendType.Card,
            } as IPartition]
        );
    }
};

export default ParentPartitionProvider;
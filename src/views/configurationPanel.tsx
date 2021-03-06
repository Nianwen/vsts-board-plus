import "./configurationPanel.scss";
import * as React from "react";
import { connect } from "react-redux";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { IState } from "../reducers";
import { PartitionProviderList } from "../components/configuration/partitionProviderList";
import { autobind } from "@uifabric/utilities";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button";
import { cancelBoardConfiguration } from "../actions/nav.actionsCreators";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Direction, PartitionProviderType, IPartitionProviderConfiguration, IPartitionProviderInputs, DataSourceType } from "../model/interfaces";
import { addTemplate, removeTemplate, updateName, updateQuery, updateInputs, saveConfig, updateDataSource } from "../actions/configuration.actionsCreators";
import { ChoiceGroup, IChoiceGroupOption } from "office-ui-fabric-react/lib/ChoiceGroup";
import { QueryPicker } from "../components/configuration/dataSources/queryPicker";

interface IConfigurationPanelProps {
    showPanel: boolean;

    name: string;
    dataSource: DataSourceType;
    queryId: string;
    horizontalPartitionProviders: IPartitionProviderConfiguration[];
    verticalPartitionProviders: IPartitionProviderConfiguration[];

    save(): void;
    close(): void;

    add(direction: Direction, type: PartitionProviderType): void;
    remove(direction: Direction, index: number): void;

    onUpdateInputs(
        direction: Direction,
        index: number,
        inputs: IPartitionProviderInputs
    ): void;

    onNameChanged(name: string): void;
    onQueryChanged(queryId: string): void;
    onDataSourceChanged(dataSource: DataSourceType): void;
}

class ConfigurationPanel extends React.Component<IConfigurationPanelProps> {
    render() {
        const {
            showPanel,
            add,
            remove,
            name,
            onUpdateInputs,
            dataSource = DataSourceType.Query,
            queryId,
            horizontalPartitionProviders,
            verticalPartitionProviders,
            onNameChanged,
            onQueryChanged
        } = this.props;

        return (
            <Panel
                className="configure-panel"
                isOpen={showPanel}
                headerText="Configure Board"
                type={PanelType.medium}
                isFooterAtBottom={true}
                onRenderFooterContent={this._renderFooter}
            >
                <TextField label="Name" value={name} onChanged={onNameChanged} />

                <h3>Data Source</h3>

                <ChoiceGroup
                    selectedKey={dataSource.toString()}
                    options={[
                        {
                            key: DataSourceType.Query.toString(),
                            text: "Query",
                            iconProps: { iconName: "QueryList" },
                        },
                        {
                            key: DataSourceType.Backlog.toString(),
                            text: "Backlog",
                            iconProps: { iconName: "Backlog" }
                        }
                    ]}
                    onChange={this._onDataSourceChanged}
                />

                {dataSource === DataSourceType.Query && <QueryPicker onChanged={onQueryChanged} defaultSelectedQueryId={queryId} />}

                <h3>Partitions</h3>

                <h4>Horizontal</h4>
                <PartitionProviderList
                    partitionProviders={horizontalPartitionProviders}
                    onAdd={add.bind(this, "horizontal")}
                    onRemove={remove.bind(this, "horizontal")}
                    onUpdate={onUpdateInputs.bind(this, "horizontal")}
                />

                <h4>Vertical</h4>
                <PartitionProviderList
                    partitionProviders={verticalPartitionProviders}
                    onAdd={add.bind(this, "vertical")}
                    onRemove={remove.bind(this, "vertical")}
                    onUpdate={onUpdateInputs.bind(this, "vertical")}
                />
            </Panel>
        );
    }

    @autobind
    private _renderFooter(): JSX.Element {
        const { save, close } = this.props;

        return (
            <div className="configure-panel--footer">
                <PrimaryButton onClick={save}>
                    Save
                </PrimaryButton>
                <DefaultButton onClick={close}>
                    Cancel
                </DefaultButton>
            </div>
        );
    }

    @autobind
    private _onDataSourceChanged(_, item: IChoiceGroupOption) {
        let dataSource: DataSourceType;

        switch (item.key) {
            case DataSourceType.Backlog.toString():
                dataSource = DataSourceType.Backlog;
                break;

            case DataSourceType.Query.toString():
                dataSource = DataSourceType.Query;
                break;
        }

        const { onDataSourceChanged } = this.props;
        onDataSourceChanged(dataSource);
    }
}

export default connect(
    (state: IState) => {
        const {
            name,
            dataSource,
            queryId,
            horizontalPartitionProviders,
            verticalPartitionProviders
        } = state.configuration;

        return {
            showPanel: state.nav.configurationOpen,
            name,
            dataSource,
            queryId,
            horizontalPartitionProviders,
            verticalPartitionProviders
        };
    },
    (dispatch) => ({
        save: () => { dispatch(saveConfig()); },
        close: () => { dispatch(cancelBoardConfiguration()); },

        add: (direction: Direction, type: PartitionProviderType) => { dispatch(addTemplate(direction, type)); },
        remove: (direction: Direction, index: number) => { dispatch(removeTemplate(direction, index)); },

        onNameChanged: (name: string) => { dispatch(updateName(name)); },
        onQueryChanged: (queryId: string) => { dispatch(updateQuery(queryId)); },
        onDataSourceChanged: (dataSource: DataSourceType) => { dispatch(updateDataSource(dataSource)); },

        onUpdateInputs: (
            direction: Direction,
            index: number,
            inputs: IPartitionProviderInputs
        ) => { dispatch(updateInputs(direction, index, inputs)); }
    }))(ConfigurationPanel);
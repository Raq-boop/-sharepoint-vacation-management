<<<<<<< HEAD
import * as React from 'react';
import styles from './PedidoFerias.module.scss';
import type { IPedidoFeriasProps } from './IPedidoFeriasProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class PedidoFerias extends React.Component<IPedidoFeriasProps> {
  public render(): React.ReactElement<IPedidoFeriasProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.pedidoFerias} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
          </p>
          <h4>Learn more about SPFx development:</h4>
          <ul className={styles.links}>
            <li><a href="https://aka.ms/spfx" target="_blank" rel="noreferrer">SharePoint Framework Overview</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank" rel="noreferrer">Use Microsoft Graph in your solution</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank" rel="noreferrer">Build for Microsoft Teams using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank" rel="noreferrer">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank" rel="noreferrer">Publish SharePoint Framework applications to the marketplace</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank" rel="noreferrer">SharePoint Framework API reference</a></li>
            <li><a href="https://aka.ms/m365pnp" target="_blank" rel="noreferrer">Microsoft 365 Developer Community</a></li>
          </ul>
        </div>
      </section>
    );
  }
}
=======
import * as React from "react";
import { PeoplePicker, PrincipalType, IPeoplePickerUserItem } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PrimaryButton } from "@fluentui/react";
import PedidoList from "./PedidoList";

interface IPeoplePickerContextOverride {
  pageContext: WebPartContext["pageContext"];
  spHttpClient: WebPartContext["spHttpClient"];
  msGraphClientFactory: WebPartContext["msGraphClientFactory"];
  absoluteUrl: string;
}

export interface IPedidoFeriasProps {
  context: WebPartContext;
}

const PedidoFerias: React.FC<IPedidoFeriasProps> = ({ context }) => {
  const [selectedUser, setSelectedUser] = React.useState<IPeoplePickerUserItem | undefined>(undefined);
  const [refresh, setRefresh] = React.useState(false);

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Pedidos de Férias</h2>

      <PeoplePicker
        context={{
          pageContext: context.pageContext,
          spHttpClient: context.spHttpClient,
          msGraphClientFactory: context.msGraphClientFactory,
          absoluteUrl: context.pageContext.web.absoluteUrl
        } as IPeoplePickerContextOverride}
        titleText="Filtrar por colaborador"
        personSelectionLimit={1}
        showtooltip={true}
        principalTypes={[PrincipalType.User]}
        onChange={(items: IPeoplePickerUserItem[]) =>
          setSelectedUser(items.length ? items[0] : undefined)
        }
      />

      <PrimaryButton
        text="Aplicar filtro"
        style={{ marginTop: 10 }}
        onClick={() => setRefresh(!refresh)}
      />

      <PedidoList
        context={context}
        selectedUser={selectedUser}
        refresh={refresh}
      />
    </div>
  );
};

export default PedidoFerias;

>>>>>>> ed49af9442b53acecaf6b7a0f33b49d4177ff268

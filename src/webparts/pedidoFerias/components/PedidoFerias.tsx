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


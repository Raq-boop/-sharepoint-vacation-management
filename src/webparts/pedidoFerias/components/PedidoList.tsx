import * as React from "react";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  DetailsList,
  IColumn,
  Stack,
  PrimaryButton,
  DefaultButton,
  Persona,
  PersonaSize,
  Text
} from "@fluentui/react";
import { IPeoplePickerUserItem } from "@pnp/spfx-controls-react/lib/PeoplePicker";

interface IPedidoListProps {
  context: WebPartContext;
  selectedUser?: IPeoplePickerUserItem;
  refresh: boolean;
}

interface IPedido {
  Id: number;
  Title: string;
  Colaborador: { Title: string; Email: string; Id: number };
  Datalnicio: string; // <- nome interno correto no seu SharePoint
  Estado: string;
}

export default function PedidoList({
  context,
  selectedUser,
  refresh
}: IPedidoListProps): JSX.Element {
  const [pedidos, setPedidos] = React.useState<IPedido[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sortAsc, setSortAsc] = React.useState<boolean>(true);
  const [updating, setUpdating] = React.useState<number | null>(null);

  const sp = spfi().using(SPFx(context));

  React.useEffect(() => {
    loadPedidos().catch(console.error);
  }, [selectedUser, refresh, sortAsc]);

  async function loadPedidos(): Promise<void> {
    setLoading(true);
    try {
      let query = sp.web.lists
        .getByTitle("PedidoFerias") // ✅ nome da lista corrigido
        .items.select(
          "Id",
          "Title",
          "Colaborador/Title",
          "Colaborador/Email",
          "Colaborador/Id",
          "Datalnicio",
          "Estado"
        )
        .expand("Colaborador");

      if (selectedUser?.secondaryText) {
        const email = selectedUser.secondaryText;
        query = query.filter(`Colaborador/EMail eq '${email}'`);
      }

      query = query.orderBy("Datalnicio", !sortAsc);

      const results: IPedido[] = await query();
      setPedidos(results);
      console.log("📦 Pedidos carregados:", results);

    } catch (err) {
      console.error("❌ Erro ao carregar pedidos:", err);
      alert("Erro ao carregar pedidos: " + err);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarEstado(id: number, estado: string): Promise<void> {
    setUpdating(id);
    try {
      console.log("🔄 Atualizando item:", id, "para estado:", estado);
      await sp.web.lists
        .getByTitle("PedidoFerias") // ✅ nome da lista corrigido
        .items.getById(id)
        .update({ Estado: estado });
      await loadPedidos();
    } catch (err) {
      console.error("❌ Erro ao atualizar estado:", err);
      alert("Erro ao atualizar estado: " + err);
    } finally {
      setUpdating(null);
    }
  }

  const columns: IColumn[] = [
    { key: "colab", name: "Colaborador", fieldName: "Colaborador", minWidth: 150, isResizable: true },
    { key: "titulo", name: "Título", fieldName: "Title", minWidth: 150, isResizable: true },
    { key: "data", name: "Data Início", fieldName: "Datalnicio", minWidth: 120 },
    { key: "estado", name: "Estado", fieldName: "Estado", minWidth: 100 },
    { key: "acoes", name: "Ações", fieldName: "", minWidth: 200 }
  ];

  return (
    <div style={{ marginTop: 20 }}>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <DetailsList
          items={pedidos}
          columns={columns}
          selectionMode={0}
          onRenderItemColumn={(item: IPedido, index: number, column: IColumn) => {
            switch (column.key) {
              case "colab":
                return (
                  <Persona
                    text={item.Colaborador?.Title}
                    secondaryText={item.Colaborador?.Email}
                    size={PersonaSize.size32}
                  />
                );
              case "acoes":
                return (
                  <Stack horizontal tokens={{ childrenGap: 8 }}>
                    <PrimaryButton
                      text="Aprovar"
                      disabled={updating === item.Id}
                      onClick={() => atualizarEstado(item.Id, "Aprovado").catch(console.error)}
                    />
                    <DefaultButton
                      text="Rejeitar"
                      disabled={updating === item.Id}
                      onClick={() => atualizarEstado(item.Id, "Rejeitado").catch(console.error)}
                    />
                  </Stack>
                );
              case "data":
                return new Date(item.Datalnicio).toLocaleDateString("pt-BR");
              default:
                return item[column.fieldName as keyof IPedido] || "";
            }
          }}
        />
      )}
      <Stack
        horizontal
        tokens={{ childrenGap: 8 }}
        verticalAlign="center"
        styles={{ root: { marginTop: 10 } }}
      >
        <PrimaryButton
          text={sortAsc ? "Ordenar ↑" : "Ordenar ↓"}
          onClick={() => setSortAsc(!sortAsc)}
        />
        <DefaultButton
          text="Atualizar"
          onClick={() => loadPedidos().catch(console.error)}
        />
      </Stack>
    </div>
  );
}

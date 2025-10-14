import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import PedidoFerias from './components/PedidoFerias';
import { IPedidoFeriasProps } from './components/IPedidoFeriasProps';
import { spfi, SPFx } from "@pnp/sp";

export default class PedidoFeriasWebPart extends BaseClientSideWebPart<{}> {

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      // Inicializa o contexto do PnPjs
      spfi().using(SPFx(this.context));
    });
  }

  public render(): void {
    const element: React.ReactElement<IPedidoFeriasProps> = React.createElement(PedidoFerias, {
      context: this.context
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}

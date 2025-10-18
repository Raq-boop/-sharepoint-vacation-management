// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module '@pnp/sp' {
  export function spfi(options?: any): any;
  export function SPFx(context: any): any;
  export type SPFI = any;
}

declare module '@pnp/sp/webs';
declare module '@pnp/sp/lists';
declare module '@pnp/sp/items';
declare module '@pnp/sp/site-users';
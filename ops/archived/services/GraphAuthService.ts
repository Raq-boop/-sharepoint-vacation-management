/**
 * Arquivo arquivado: GraphAuthService (Enterprise)
 * Movido para ops/archived para simplificar o repositório principal.
 */
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IUserProfile {
  id: string;
  displayName: string;
  mail: string;
  roles: string[];
  permissions: string[];
}

export class GraphAuthService {
  private _context: WebPartContext | undefined;
  private currentUser: IUserProfile | undefined;

  constructor(context?: WebPartContext) {
    this._context = context;

    if (context) {
      this.currentUser = {
        id: context.pageContext.user.loginName,
        displayName: context.pageContext.user.displayName,
        mail: context.pageContext.user.email || '',
        roles: ['employee'],
        permissions: ['vacation.read.own', 'vacation.write.own']
      };
      console.log('GraphAuthService (archived) initialized for user:', this.currentUser.displayName);
    } else {
      console.log('GraphAuthService (archived) initialized (no context)');
    }
  }

  public hasPermission(permission: string): boolean {
    const hasAccess = this.currentUser ? this.currentUser.permissions.indexOf(permission) > -1 : false;
    console.log(`Permission check (archived): ${permission} = ${hasAccess}`, { user: this.currentUser?.displayName, permissions: this.currentUser?.permissions });
    return hasAccess;
  }

  public hasRole(role: string): boolean {
    const hasRole = this.currentUser ? this.currentUser.roles.indexOf(role) > -1 : false;
    console.log(`Role check (archived): ${role} = ${hasRole}`, { user: this.currentUser?.displayName, roles: this.currentUser?.roles });
    return hasRole;
  }

  public getCurrentUser(): IUserProfile | undefined {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    const authenticated = !!this.currentUser;
    console.log(`Authentication status (archived): ${authenticated}`);
    return authenticated;
  }
}

export const useAuthentication = (context?: WebPartContext) => {
  const authService = new GraphAuthService(context);
  return {
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    hasPermission: (permission: string) => authService.hasPermission(permission),
    hasRole: (role: string) => authService.hasRole(role)
  };
};

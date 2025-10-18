/**
 * SERVIÇO DE FOTOS DE USUÁRIOS VIA MICROSOFT GRAPH API
 * 
 * Este serviço integra com o Microsoft Graph para buscar fotos de perfil
 * dos colaboradores no Azure AD/Microsoft 365.
 * 
 * Funcionalidades:
 * - Cache em memória para otimizar performance
 * - Fallback para avatar padrão quando foto não disponível
 * - Busca individual ou em lote
 * - Tratamento de erros e permissões
 * 
 * Permissões necessárias no manifesto:
 * - User.Read.All ou User.ReadBasic.All
 * 
 * @class GraphPhotoService
 * @author Sistema SPFx Pedidos Férias
 */
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * Interface que representa os dados de foto de um usuário
 * 
 * @interface IUserPhoto
 */
export interface IUserPhoto {
  /** ID único do usuário no Azure AD */
  userId: string;
  
  /** Email do usuário (usado como chave de cache) */
  email: string;
  
  /** URL da foto em base64 ou blob URL (opcional) */
  photoUrl?: string;
  
  /** Indica se o usuário possui foto de perfil */
  hasPhoto: boolean;
}

/**
 * Classe principal do serviço de fotos
 * 
 * Implementa padrão Singleton por contexto do SPFx
 * Mantém cache em memória durante sessão do usuário
 * 
 * @class GraphPhotoService
 */
export class GraphPhotoService {
  /** Contexto do SharePoint Framework */
  private _context: WebPartContext;
  
  /** Cliente do Microsoft Graph (lazy loading) */
  private _graphClient: MSGraphClientV3 | undefined;
  
  /** Cache em memória para fotos já carregadas */
  private _photoCache: Map<string, IUserPhoto> = new Map();

  /**
   * Construtor do serviço
   * 
   * @param context Contexto do WebPart SPFx
   */
  constructor(context: WebPartContext) {
    this._context = context;
  }

  /**
   * Inicializa o cliente do Microsoft Graph de forma lazy
   * 
   * O cliente é criado apenas quando necessário para otimizar performance
   * Utiliza a factory do SPFx para obter o cliente autenticado
   * 
   * @private
   * @returns Promise com o cliente MSGraphClientV3 configurado
   * @throws Error se não conseguir autenticar ou obter permissões
   */
  private async _getGraphClient(): Promise<MSGraphClientV3> {
    if (!this._graphClient) {
      // Cria cliente Graph v3 com autenticação automática via SPFx
      this._graphClient = await this._context.msGraphClientFactory.getClient('3');
    }
    return this._graphClient;
  }

  /**
   * Busca a foto de um usuário pelo email com sistema de cache
   * 
   * Fluxo de execução:
   * 1. Verifica cache em memória primeiro
   * 2. Se não encontrado, busca via Microsoft Graph API
   * 3. Converte resposta binária para base64 Data URL
   * 4. Armazena no cache para próximas consultas
   * 5. Retorna dados da foto ou fallback
   * 
   * @public
   * @param email Email do usuário para buscar foto
   * @param userId ID opcional do usuário (para otimização)
   * @returns Promise com dados da foto do usuário
   */
  public async getUserPhoto(email: string, userId?: string): Promise<IUserPhoto> {
    const cacheKey = email.toLowerCase();
    
    // Verificar cache primeiro
    if (this._photoCache.has(cacheKey)) {
      return this._photoCache.get(cacheKey)!;
    }

    const userPhoto: IUserPhoto = {
      userId: userId || '',
      email: email,
      hasPhoto: false
    };

    try {
      const graphClient = await this._getGraphClient();
      
      // Tentar buscar foto do usuário
      const photoResponse = await graphClient
        .api(`/users/${email}/photo/$value`)
        .get();

      if (photoResponse) {
        // Converter blob para URL
        const photoUrl = URL.createObjectURL(photoResponse);
        userPhoto.photoUrl = photoUrl;
        userPhoto.hasPhoto = true;
      }
    } catch (error) {
      console.log(`Foto não encontrada para ${email}:`, error);
      // Não é um erro crítico, usuário pode não ter foto
    }

    // Salvar no cache
    this._photoCache.set(cacheKey, userPhoto);
    return userPhoto;
  }

  /**
   * Busca fotos de múltiplos usuários
   */
  public async getUserPhotos(emails: string[]): Promise<Map<string, IUserPhoto>> {
    const results = new Map<string, IUserPhoto>();
    
    // Processar em paralelo para melhor performance
    const photoPromises = emails.map(async (email) => {
      const photo = await this.getUserPhoto(email);
      results.set(email.toLowerCase(), photo);
    });

    await Promise.all(photoPromises);
    return results;
  }

  /**
   * Gera URL de avatar padrão baseado nas iniciais do usuário
   */
  public getDefaultAvatar(displayName: string, email: string): string {
    const initials = this._getInitials(displayName);
    const backgroundColor = this._getColorFromEmail(email);
    
    // Criar SVG de avatar com iniciais
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="${backgroundColor}"/>
        <text x="20" y="26" font-family="Segoe UI, system-ui, sans-serif" 
              font-size="14" font-weight="600" text-anchor="middle" fill="white">
          ${initials}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Extrai iniciais do nome
   */
  private _getInitials(displayName: string): string {
    if (!displayName) return '?';
    
    const names = displayName.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Gera cor baseada no email para consistência
   */
  private _getColorFromEmail(email: string): string {
    const colors = [
      '#0078d4', '#00bcf2', '#40e0d0', '#008080',
      '#00c896', '#10893e', '#bad80a', '#ffb900',
      '#ff8c00', '#d13438', '#e3008c', '#b146c2',
      '#8764b8', '#744da9', '#486bba', '#0086bf'
    ];
    
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = ((hash << 5) - hash) + email.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  /**
   * Limpa o cache de fotos (útil para refresh)
   */
  public clearCache(): void {
    // Revogar URLs de objeto para liberar memória
    this._photoCache.forEach(photo => {
      if (photo.photoUrl && photo.photoUrl.indexOf('blob:') === 0) {
        URL.revokeObjectURL(photo.photoUrl);
      }
    });
    
    this._photoCache.clear();
  }

  /**
   * Verifica se o usuário tem permissão para acessar fotos
   */
  public async checkGraphPermissions(): Promise<boolean> {
    try {
      const graphClient = await this._getGraphClient();
      await graphClient.api('/me').get();
      return true;
    } catch (error) {
      console.warn('Sem permissão para acessar Microsoft Graph:', error);
      return false;
    }
  }
}
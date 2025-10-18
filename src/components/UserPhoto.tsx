/**
 * COMPONENTE DE FOTO DE USUÁRIO COM INTEGRAÇÃO MICROSOFT GRAPH
 * 
 * Este componente React exibe a foto de perfil de um usuário obtida
 * via Microsoft Graph API, com fallback para avatar gerado automaticamente.
 * 
 * Funcionalidades:
 * - Carregamento assíncrono de fotos via Graph API
 * - Estados de loading com spinner
 * - Fallback automático para iniciais do nome
 * - Suporte a diferentes tamanhos (PersonaSize)
 * - Exibição opcional do nome do usuário
 * - Indicadores de presença (online/offline)
 * - Cache automático via GraphPhotoService
 * 
 * @component UserPhoto
 * @author Sistema SPFx Pedidos Férias
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Persona, PersonaSize, PersonaPresence } from '@fluentui/react/lib/Persona';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { GraphPhotoService, IUserPhoto } from '../services/GraphPhotoService';
import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * Props do componente UserPhoto
 * 
 * @interface IUserPhotoProps
 */
export interface IUserPhotoProps {
  /** Email do usuário (obrigatório para buscar foto) */
  email: string;
  
  /** Nome de exibição do usuário */
  displayName: string;
  
  /** ID opcional do usuário (para otimização) */
  userId?: string;
  
  /** Contexto do SPFx (necessário para Graph API) */
  context: WebPartContext;
  
  /** Tamanho do componente Persona (padrão: size40) */
  size?: PersonaSize;
  
  /** Se deve mostrar o nome junto com a foto (padrão: false) */
  showName?: boolean;
  
  /** Indicador de presença do usuário (online/offline) */
  presence?: PersonaPresence;
  
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Componente funcional UserPhoto
 * 
 * Utiliza React Hooks para gerenciar estado e efeitos colaterais
 * Implementa padrão de loading/error states para melhor UX
 * 
 * @param props Propriedades do componente
 * @returns JSX.Element Componente renderizado
 */
export const UserPhoto: React.FC<IUserPhotoProps> = ({
  email,
  displayName,
  userId,
  context,
  size = PersonaSize.size40,
  showName = false,
  presence,
  className
}) => {
  // Estado para armazenar dados da foto do usuário
  const [userPhoto, setUserPhoto] = useState<IUserPhoto | null>(null);
  
  // Estado de loading para exibir spinner durante carregamento
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Instância do serviço Graph (criada apenas uma vez via lazy initialization)
  const [graphService] = useState<GraphPhotoService>(() => new GraphPhotoService(context));

  /**
   * Hook useEffect para carregar foto do usuário quando componente monta
   * ou quando email/userId mudam
   * 
   * Dependências: [email, userId, graphService]
   */
  useEffect(() => {
    /**
     * Função assíncrona para carregar foto do usuário
     * 
     * Fluxo:
     * 1. Valida se email foi fornecido
     * 2. Chama GraphPhotoService para buscar foto
     * 3. Atualiza estado com resultado
     * 4. Trata erros e remove loading state
     */
    const loadUserPhoto = async (): Promise<void> => {
      // Validação: email é obrigatório
      if (!email) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const photo = await graphService.getUserPhoto(email, userId);
        setUserPhoto(photo);
      } catch (error) {
        console.error('Erro ao carregar foto do usuário:', error);
        setUserPhoto({
          userId: userId || '',
          email: email,
          hasPhoto: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPhoto().catch(error => {
      console.error('Erro no useEffect:', error);
      setIsLoading(false);
    });
  }, [email, userId, graphService]);

  const getImageUrl = (): string => {
    if (userPhoto?.hasPhoto && userPhoto.photoUrl) {
      return userPhoto.photoUrl;
    }
    return graphService.getDefaultAvatar(displayName, email);
  };

  if (isLoading) {
    return (
      <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <Spinner size={SpinnerSize.small} />
        {showName && <span>{displayName}</span>}
      </div>
    );
  }

  return (
    <Persona
      className={className}
      imageUrl={getImageUrl()}
      text={showName ? displayName : undefined}
      secondaryText={showName ? email : undefined}
      size={size}
      presence={presence}
      imageAlt={`Foto de ${displayName}`}
      styles={{
        root: {
          cursor: showName ? 'default' : 'pointer'
        },
        primaryText: {
          fontSize: '14px',
          fontWeight: '600'
        },
        secondaryText: {
          fontSize: '12px',
          color: '#666'
        }
      }}
    />
  );
};

export default UserPhoto;
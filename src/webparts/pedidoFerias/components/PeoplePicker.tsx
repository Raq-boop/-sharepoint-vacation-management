import * as React from 'react';
import {
  TextField,
  Callout,
  DirectionalHint,
  List,
  Stack,
  Text,
  Spinner,
  SpinnerSize,
  PersonaCoin,
  PersonaSize,
  IconButton,
  mergeStyles,

  FocusTrapZone
} from '@fluentui/react';
import { IColaborador } from '../../../models/IPedidoFerias';

export interface IPeoplePickerProps {
  label?: string;
  placeholder?: string;
  selectedPeople?: IColaborador[];
  multiSelect?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onSelectionChanged?: (selectedPeople: IColaborador[]) => void;
  onSearchUsers?: (searchText: string) => Promise<IColaborador[]>;
  errorMessage?: string;
}

export interface IPeoplePickerState {
  searchText: string;
  searchResults: IColaborador[];
  isSearching: boolean;
  isCalloutVisible: boolean;
  selectedItems: IColaborador[];
}

const suggestionItemStyles = mergeStyles({
  padding: '8px 12px',
  cursor: 'pointer',
  borderBottom: '1px solid #edebe9',
  ':hover': {
    backgroundColor: '#f3f2f1'
  },
  ':last-child': {
    borderBottom: 'none'
  }
});

const selectedItemStyles = mergeStyles({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 8px',
  margin: '2px',
  backgroundColor: '#deecf9',
  borderRadius: '2px',
  border: '1px solid #0078d4'
});

const PeoplePicker: React.FC<IPeoplePickerProps> = ({
  label,
  placeholder = "Digite o nome do colaborador...",
  selectedPeople = [],
  multiSelect = false,
  required = false,
  disabled = false,
  className,
  onSelectionChanged,
  onSearchUsers,
  errorMessage
}) => {
  const textFieldRef = React.useRef<HTMLDivElement>(null);
  
  const [state, setState] = React.useState<IPeoplePickerState>({
    searchText: '',
    searchResults: [],
    isSearching: false,
    isCalloutVisible: false,
    selectedItems: selectedPeople
  });

  // Debounce timer para busca
  const searchTimerRef = React.useRef<number | null>(null);

  /**
   * Atualizar estado local
   */
  const updateState = React.useCallback((updates: Partial<IPeoplePickerState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  /**
   * Sincronizar selectedPeople externo com estado interno
   */
  React.useEffect(() => {
    if (JSON.stringify(selectedPeople) !== JSON.stringify(state.selectedItems)) {
      updateState({ selectedItems: selectedPeople });
    }
  }, [selectedPeople, state.selectedItems, updateState]);

  /**
   * Buscar usuários com debounce
   */
  const performSearch = React.useCallback(async (searchText: string) => {
    if (!searchText.trim() || !onSearchUsers) {
      updateState({ searchResults: [], isSearching: false });
      return;
    }

    try {
      updateState({ isSearching: true });
      const results = await onSearchUsers(searchText.trim());
      
      // Filtrar usuários já selecionados
      const filteredResults = results.filter(user => 
        !state.selectedItems.some(selected => selected.Id === user.Id)
      );
      
      updateState({ 
        searchResults: filteredResults,
        isSearching: false 
      });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      updateState({ 
        searchResults: [],
        isSearching: false 
      });
    }
  }, [onSearchUsers, state.selectedItems, updateState]);

  /**
   * Manipular mudanças no campo de busca
   */
  const handleSearchTextChange = React.useCallback((
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    const searchText = newValue || '';
    updateState({ 
      searchText,
      isCalloutVisible: searchText.length > 0
    });

    // Cancelar busca anterior
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // Iniciar nova busca com debounce
    if (searchText.length >= 2) {
      searchTimerRef.current = setTimeout(() => {
        performSearch(searchText).catch(error => {
          console.error('Erro na busca de colaboradores:', error);
          updateState({ isSearching: false });
        });
      }, 300);
    } else {
      updateState({ searchResults: [], isSearching: false });
    }
  }, [performSearch, updateState]);

  /**
   * Manipular foco no campo de busca
   */
  const handleSearchFocus = React.useCallback(() => {
    if (state.searchText.length > 0) {
      updateState({ isCalloutVisible: true });
    }
  }, [state.searchText, updateState]);

  /**
   * Selecionar usuário
   */
  const handleSelectUser = React.useCallback((user: IColaborador) => {
    let newSelectedItems: IColaborador[];
    
    if (multiSelect) {
      // Verificar se já está selecionado
      const isAlreadySelected = state.selectedItems.some(item => item.Id === user.Id);
      if (!isAlreadySelected) {
        newSelectedItems = [...state.selectedItems, user];
      } else {
        newSelectedItems = state.selectedItems;
      }
    } else {
      newSelectedItems = [user];
    }

    updateState({
      selectedItems: newSelectedItems,
      searchText: '',
      searchResults: [],
      isCalloutVisible: false
    });

    // Notificar mudança
    if (onSelectionChanged && JSON.stringify(newSelectedItems) !== JSON.stringify(state.selectedItems)) {
      onSelectionChanged(newSelectedItems);
    }
  }, [multiSelect, state.selectedItems, onSelectionChanged, updateState]);

  /**
   * Remover usuário selecionado
   */
  const handleRemoveUser = React.useCallback((userId: number) => {
    const newSelectedItems = state.selectedItems.filter(item => item.Id !== userId);
    
    updateState({ selectedItems: newSelectedItems });

    // Notificar mudança
    if (onSelectionChanged) {
      onSelectionChanged(newSelectedItems);
    }
  }, [state.selectedItems, onSelectionChanged, updateState]);

  /**
   * Fechar callout
   */
  const handleDismissCallout = React.useCallback(() => {
    updateState({ isCalloutVisible: false });
  }, [updateState]);

  /**
   * Renderizar item de sugestão
   */
  const renderSuggestionItem = React.useCallback((user: IColaborador, index?: number) => (
    <div
      key={user.Id}
      className={suggestionItemStyles}
      onClick={() => handleSelectUser(user)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelectUser(user);
        }
      }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <PersonaCoin
          text={user.Title}
          size={PersonaSize.size24}
        />
        <Stack>
          <Text variant="medium">{user.Title}</Text>
          {user.EMail && (
            <Text variant="small" style={{ color: '#605E5C' }}>
              {user.EMail}
            </Text>
          )}
          {user.JobTitle && (
            <Text variant="small" style={{ color: '#605E5C' }}>
              {user.JobTitle}
            </Text>
          )}
        </Stack>
      </Stack>
    </div>
  ), [handleSelectUser]);

  /**
   * Renderizar usuário selecionado
   */
  const renderSelectedItem = React.useCallback((user: IColaborador) => (
    <div key={user.Id} className={selectedItemStyles}>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
        <PersonaCoin
          text={user.Title}
          size={PersonaSize.size24}
        />
        <Text variant="small">{user.Title}</Text>
        {!disabled && (
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel={`Remover ${user.Title}`}
            onClick={() => handleRemoveUser(user.Id)}
            styles={{
              root: { 
                width: 16, 
                height: 16, 
                minWidth: 16,
                marginLeft: 4
              },
              icon: { fontSize: 10 }
            }}
          />
        )}
      </Stack>
    </div>
  ), [disabled, handleRemoveUser]);

  /**
   * Limpar timer ao desmontar
   */
  React.useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  return (
    <Stack className={className} tokens={{ childrenGap: 4 }}>
      {/* Campo de busca */}
      <div ref={textFieldRef}>
        <TextField
          label={label}
          placeholder={placeholder}
          value={state.searchText}
          onChange={handleSearchTextChange}
          onFocus={handleSearchFocus}
          required={required}
          disabled={disabled}
          errorMessage={errorMessage}
          iconProps={state.isSearching ? { iconName: 'Sync' } : { iconName: 'Search' }}
        />
      </div>

      {/* Usuários selecionados */}
      {state.selectedItems.length > 0 && (
        <Stack horizontal wrap tokens={{ childrenGap: 4 }}>
          {state.selectedItems.map(renderSelectedItem)}
        </Stack>
      )}

      {/* Callout com sugestões */}
      {state.isCalloutVisible && textFieldRef.current && (
        <Callout
          target={textFieldRef.current}
          onDismiss={handleDismissCallout}
          directionalHint={DirectionalHint.bottomLeftEdge}
          isBeakVisible={false}
          gapSpace={4}
          setInitialFocus={false}
        >
          <FocusTrapZone>
            <div style={{ maxWidth: 300, maxHeight: 200, overflowY: 'auto' }}>
              {state.isSearching ? (
                <Stack 
                  horizontalAlign="center" 
                  verticalAlign="center" 
                  tokens={{ padding: 16 }}
                >
                  <Spinner size={SpinnerSize.small} label="Buscando..." />
                </Stack>
              ) : state.searchResults.length > 0 ? (
                <List
                  items={state.searchResults}
                  onRenderCell={renderSuggestionItem}
                />
              ) : state.searchText.length >= 2 ? (
                <Stack tokens={{ padding: 16 }}>
                  <Text variant="small" style={{ color: '#605E5C' }}>
                    Nenhum colaborador encontrado
                  </Text>
                </Stack>
              ) : (
                <Stack tokens={{ padding: 16 }}>
                  <Text variant="small" style={{ color: '#605E5C' }}>
                    Digite pelo menos 2 caracteres para buscar
                  </Text>
                </Stack>
              )}
            </div>
          </FocusTrapZone>
        </Callout>
      )}
    </Stack>
  );
};

export default PeoplePicker;
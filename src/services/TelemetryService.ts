/**
 * 📊 TelemetryService - Serviço Enterprise de Monitoramento e Telemetria
 * 
 * Responsável por:
 * - Rastreamento de eventos de usuário e sistema
 * - Monitoramento de performance da aplicação  
 * - Logging estruturado de erros e exceções
 * - Integração futura com Application Insights/Azure Monitor
 * 
 * Funcionalidades Enterprise:
 * ✅ Event tracking para análise de comportamento
 * ✅ Error monitoring para diagnóstico rápido
 * ✅ Performance metrics para otimização
 * ✅ Operation tracking para workflows complexos
 */
import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * 🏗️ Classe principal do serviço de telemetria
 * Implementa padrões enterprise para observabilidade
 */
export class TelemetryService {
  private _context?: WebPartContext;

  /**
   * 🚀 Construtor - Inicializa o serviço com contexto SPFx
   * @param context - Contexto da web part para acessar propriedades e configurações
   */
  constructor(context?: WebPartContext) {
    this._context = context;
    // 📝 Log de inicialização para debugging (defensivo)
    try {
      const title = this._context?.pageContext?.web?.title || 'unknown';
      console.log('TelemetryService initialized for:', title);
    } catch {
      console.log('TelemetryService initialized (no web context)');
    }
  }

  /**
   * 📊 Rastreia eventos customizados da aplicação
   * Usado para: cliques, ações do usuário, workflows de negócio
   * @param name - Nome identificador do evento
   * @param properties - Propriedades adicionais para contexto
   */
  public trackEvent(name: string, properties?: { [key: string]: string }): void {
    // 🎯 Estrutura padronizada de logging para facilitar análise
    console.log(`Event: ${name}`, {
      timestamp: new Date().toISOString(),
      user: this._context?.pageContext?.user?.displayName || 'unknown',
      site: this._context?.pageContext?.web?.absoluteUrl || 'unknown',
      ...properties
    });
  }

  /**
   * ❌ Captura e registra exceções de forma estruturada
   * Essencial para monitoramento proativo e debugging
   * @param error - Objeto Error capturado
   */
  public trackException(error: Error): void {
    // 🔍 Log detalhado com stack trace para diagnóstico
    console.error('Exception:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      user: this._context?.pageContext?.user?.displayName || 'unknown',
      page: (typeof window !== 'undefined' && window.location) ? window.location.href : 'unknown'
    });
  }

  /**
   * ⏱️ Inicia rastreamento de operação longa
   * Para medir duração de processos como upload, API calls, etc.
   * @param name - Nome da operação
   * @returns ID único da operação para correlação
   */
  public startTrackEvent(name: string): string {
    const operationId = `${name}_${Date.now()}`;
    console.log(`⏱️ Started tracking: ${name}`, { operationId });
    return operationId;
  }

  /**
   * ⏹️ Finaliza rastreamento de operação
   * Calcula duração total e registra resultado
   * @param name - Nome da operação
   * @param operationId - ID retornado por startTrackEvent
   * @param success - Indica se operação foi bem-sucedida
   */
  public stopTrackEvent(name: string, operationId: string, success: boolean = true): void {
    // 📈 Log de conclusão com métricas de sucesso
    console.log(`📊 ${name} completed:`, {
      operationId,
      success,
      status: success ? '✅ SUCCESS' : '❌ FAILED',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * ⚡ Monitora métricas de performance da aplicação
   * Crucial para identificar gargalos e otimizar UX
   * @param name - Nome da métrica (ex: 'loadTime', 'apiResponse')
   * @param duration - Duração em milissegundos
   * @param success - Indica se operação foi bem-sucedida
   */
  public trackPerformance(name: string, duration: number, success: boolean): void {
    // 📊 Performance tracking com thresholds de alerta
    const logLevel = duration > 2000 ? '🚨' : duration > 1000 ? '⚠️' : '✅';
    console.log(`${logLevel} Performance ${name}:`, {
      duration,
      success,
      threshold: duration > 2000 ? 'SLOW' : duration > 1000 ? 'MODERATE' : 'FAST',
      timestamp: new Date().toISOString()
    });
  }
}

export const useTelemetry = (telemetryService: TelemetryService): { trackUserAction: (action: string, properties?: { [key: string]: string }) => void; trackError: (error: Error, properties?: { [key: string]: string }) => void } => {
  const trackUserAction = (action: string, properties?: { [key: string]: string }): void => {
    telemetryService.trackEvent(`UserAction_${action}`, properties);
  };

  const trackError = (error: Error, _properties?: { [key: string]: string }): void => {
    telemetryService.trackException(error);
  };

  return { trackUserAction, trackError };
};
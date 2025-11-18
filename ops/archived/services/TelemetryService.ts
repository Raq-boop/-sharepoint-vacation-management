/**
 * Arquivo arquivado: TelemetryService (Enterprise)
 * Movido para ops/archived para simplificar o repositório principal.
 * Mantido como cópia para recuperação futura.
 */
import { WebPartContext } from '@microsoft/sp-webpart-base';

export class TelemetryService {
  private _context?: WebPartContext;

  constructor(context?: WebPartContext) {
    this._context = context;
    try {
      const title = this._context?.pageContext?.web?.title || 'unknown';
      console.log('TelemetryService (archived) initialized for:', title);
    } catch {
      console.log('TelemetryService (archived) initialized (no web context)');
    }
  }

  public trackEvent(name: string, properties?: { [key: string]: string }): void {
    console.log(`Event: ${name}`, {
      timestamp: new Date().toISOString(),
      user: this._context?.pageContext?.user?.displayName || 'unknown',
      site: this._context?.pageContext?.web?.absoluteUrl || 'unknown',
      ...properties
    });
  }

  public trackException(error: Error): void {
    console.error('Exception:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      user: this._context?.pageContext?.user?.displayName || 'unknown',
      page: (typeof window !== 'undefined' && window.location) ? window.location.href : 'unknown'
    });
  }

  public startTrackEvent(name: string): string {
    const operationId = `${name}_${Date.now()}`;
    console.log(`Started tracking: ${name}`, { operationId });
    return operationId;
  }

  public stopTrackEvent(name: string, operationId: string, success: boolean = true): void {
    console.log(`${name} completed:`, {
      operationId,
      success,
      status: success ? 'SUCCESS' : 'FAILED',
      timestamp: new Date().toISOString()
    });
  }

  public trackPerformance(name: string, duration: number, success: boolean): void {
    const logLevel = duration > 2000 ? 'SLOW' : duration > 1000 ? 'MODERATE' : 'FAST';
    console.log(`Performance ${name}:`, { duration, success, threshold: logLevel, timestamp: new Date().toISOString() });
  }
}

export const useTelemetry = (telemetryService: TelemetryService) => {
  const trackUserAction = (action: string, properties?: { [key: string]: string }): void => {
    telemetryService.trackEvent(`UserAction_${action}`, properties);
  };

  const trackError = (error: Error): void => {
    telemetryService.trackException(error);
  };

  return { trackUserAction, trackError };
};

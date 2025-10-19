/* eslint-env node */
/**
 * 🚀 Lighthouse CI Configuration - Performance & Accessibility Testing
 * 
 * Configuração enterprise para testes automatizados de:
 * - Performance (score mínimo: 80%)
 * - Acessibilidade (score mínimo: 95%)
 * - Boas práticas (score mínimo: 80%)
 * - SEO (score mínimo: 80%)
 */

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4321/temp/workbench.html'
      ],
      startServerCommand: 'npm run serve',
      startServerReadyPattern: 'Finished subtask',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'categories:pwa': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
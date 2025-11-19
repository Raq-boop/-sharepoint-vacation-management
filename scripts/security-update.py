#!/usr/bin/env python3
"""
SCRIPT DE ATUALIZAÇÃO DE SEGURANÇA SPFx
Automatiza a correção de vulnerabilidades e atualizações de dependências
Autor: Sistema SPFx Pedidos Férias
Versão: 1.0.0
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List


class SPFxSecurityUpdater:
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.package_json_path = self.project_root / "package.json"

    def log(self, message: str, level: str = "INFO"):
        """Log formatado com timestamp"""
        import datetime
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")

    def load_package_json(self) -> Dict:
        """Carrega o package.json"""
        try:
            with open(self.package_json_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            self.log(f"Erro ao carregar package.json: {e}", "ERROR")
            sys.exit(1)

    def save_package_json(self, data: Dict):
        """Salva o package.json"""
        try:
            with open(self.package_json_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            self.log("package.json atualizado com sucesso")
        except Exception as e:
            self.log(f"Erro ao salvar package.json: {e}", "ERROR")

    def run_command(self, cmd: List[str]) -> bool:
        """Executa comando e retorna sucesso"""
        try:
            self.log(f"Executando: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True, cwd=self.project_root)
            if result.returncode != 0:
                self.log(f"Erro no comando: {result.stderr}", "ERROR")
                return False
            return True
        except Exception as e:
            self.log(f"Erro ao executar comando: {e}", "ERROR")
            return False

    def check_npm_audit(self) -> Dict:
        """Verifica vulnerabilidades do npm"""
        self.log("Verificando vulnerabilidades npm...")
        try:
            result = subprocess.run(['npm', 'audit', '--json'], capture_output=True, text=True, cwd=self.project_root)
            if result.stdout:
                return json.loads(result.stdout)
            return {}
        except Exception as e:
            self.log(f"Erro ao verificar npm audit: {e}", "WARNING")
            return {}

    def fix_npm_vulnerabilities(self):
        """Corrige vulnerabilidades automaticamente"""
        self.log("Corrigindo vulnerabilidades npm...")

        # Tenta correção automática primeiro
        if self.run_command(['npm', 'audit', 'fix']):
            self.log("Vulnerabilidades corrigidas automaticamente")

        # Verifica se ainda há vulnerabilidades críticas
        audit_data = self.check_npm_audit()
        if audit_data.get('metadata', {}).get('vulnerabilities', {}).get('critical', 0) > 0:
            self.log("Ainda há vulnerabilidades críticas, tentando forçar correção...")
            self.run_command(['npm', 'audit', 'fix', '--force'])

    def update_spfx_dependencies(self):
        """Atualiza dependências SPFx para versões seguras"""
        self.log("Atualizando dependências SPFx...")

        package_data = self.load_package_json()

        # Dependências seguras atualizadas
        safe_updates = {
            "dependencies": {
                "@fluentui/react": "^8.110.10",
                "@microsoft/sp-component-base": "1.21.1",
                "@microsoft/sp-core-library": "1.21.1",
                "@microsoft/sp-webpart-base": "1.21.1",
                "@pnp/sp": "^4.16.0",
                "@pnp/graph": "^4.16.0",
                "react": "17.0.1",
                "react-dom": "17.0.1"
            },
            "devDependencies": {
                "@microsoft/eslint-config-spfx": "1.21.1",
                "@microsoft/sp-build-web": "1.21.1",
                "@types/react": "17.0.80",
                "@types/react-dom": "17.0.25",
                "eslint": "8.57.1",
                "typescript": "~5.3.3",
                "jest": "^29.7.0",
                "ts-jest": "^29.2.5"
            }
        }

        # Atualiza dependências
        for dep_type, deps in safe_updates.items():
            if dep_type in package_data:
                for pkg, version in deps.items():
                    if pkg in package_data[dep_type]:
                        package_data[dep_type][pkg] = version
                        self.log(f"Atualizado {pkg} para {version}")

        self.save_package_json(package_data)

    def add_security_scripts(self):
        """Adiciona scripts de segurança ao package.json"""
        self.log("Adicionando scripts de segurança...")

        package_data = self.load_package_json()

        security_scripts = {
            "security:audit": "npm audit --audit-level=moderate",
            "security:fix": "npm audit fix",
            "security:check": "npm audit --audit-level=high --dry-run",
            "security:update": "npm update && npm audit fix",
            "deps:check": "npm outdated",
            "deps:update": "npm update --save",
            "vulnerability:scan": "npm audit --json > security-audit.json"
        }

        if "scripts" not in package_data:
            package_data["scripts"] = {}

        package_data["scripts"].update(security_scripts)
        self.save_package_json(package_data)

    def create_nvmrc(self):
        """Cria arquivo .nvmrc para versão Node.js"""
        self.log("Criando .nvmrc...")
        nvmrc_path = self.project_root / ".nvmrc"
        with open(nvmrc_path, 'w') as f:
            f.write("22.20.0\n")
        self.log(".nvmrc criado")

    def create_security_config(self):
        """Cria configuração de segurança"""
        self.log("Criando configurações de segurança...")

        security_config = {
            "security": {
                "csp": {
                    "default-src": ["'self'"],
                    "script-src": ["'self'", "'unsafe-inline'", "*.sharepoint.com", "*.microsoft.com"],
                    "style-src": ["'self'", "'unsafe-inline'", "*.sharepoint.com"],
                    "img-src": ["'self'", "data:", "*.sharepoint.com", "*.microsoft.com"],
                    "connect-src": ["'self'", "*.sharepoint.com", "*.microsoft.com", "*.microsoftonline.com"],
                    "font-src": ["'self'", "*.sharepoint.com"],
                    "frame-ancestors": ["'self'", "*.sharepoint.com"]
                },
                "headers": {
                    "X-Content-Type-Options": "nosniff",
                    "X-Frame-Options": "SAMEORIGIN",
                    "X-XSS-Protection": "1; mode=block",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "audit": {
                    "level": "moderate",
                    "excludePackages": [],
                    "allowedLicenses": ["MIT", "Apache-2.0", "BSD-3-Clause", "ISC"]
                }
            }
        }

        security_path = self.project_root / "config" / "security.json"
        security_path.parent.mkdir(exist_ok=True)

        with open(security_path, 'w', encoding='utf-8') as f:
            json.dump(security_config, f, indent=2)

        self.log("Configuração de segurança criada")

    def update_gitignore(self):
        """Atualiza .gitignore com padrões de segurança"""
        gitignore_path = self.project_root / ".gitignore"

        security_patterns = [
            "\n# Security Files",
            "*.key", "*.pem", "*.p12", "*.pfx",
            ".env", ".env.local", ".env.*.local",
            "secrets/", "security-audit.json",
            "npm-debug.log*", "yarn-debug.log*", "yarn-error.log*",
            ".nyc_output/", "coverage-audit.json"
        ]

        if gitignore_path.exists():
            with open(gitignore_path, 'a', encoding='utf-8') as f:
                f.write('\n'.join(security_patterns))

        self.log(".gitignore atualizado")

    def run_full_update(self):
        """Executa atualização completa de segurança"""
        self.log("Iniciando atualização completa de segurança...")

        steps = [
            ("Criando .nvmrc", self.create_nvmrc),
            ("Criando configuração de segurança", self.create_security_config),
            ("Atualizando .gitignore", self.update_gitignore),
            ("Adicionando scripts de segurança", self.add_security_scripts),
            ("Atualizando dependências SPFx", self.update_spfx_dependencies),
            ("Instalando dependências", lambda: self.run_command(['npm', 'install'])),
            ("Corrigindo vulnerabilidades", self.fix_npm_vulnerabilities),
            ("Executando audit final", lambda: self.run_command(['npm', 'audit', '--audit-level=moderate']))
        ]

        for step_name, step_func in steps:
            self.log(f"{step_name}...")
            try:
                step_func()
                self.log(f"{step_name} - Concluído")
            except Exception as e:
                self.log(f"{step_name} - Erro: {e}", "ERROR")

        self.log("Atualização de segurança concluída!")
        self.log("Execute 'npm run security:audit' para verificar o status")


def main():
    """Função principal"""
    import argparse

    parser = argparse.ArgumentParser(description="Atualizar segurança do projeto SPFx")
    parser.add_argument("--project-root", default=".", help="Caminho do projeto")
    parser.add_argument("--audit-only", action="store_true", help="Apenas verificar vulnerabilidades")

    args = parser.parse_args()

    updater = SPFxSecurityUpdater(args.project_root)

    if args.audit_only:
        audit_data = updater.check_npm_audit()
        print(json.dumps(audit_data, indent=2))
    else:
        updater.run_full_update()


if __name__ == "__main__":
    main()
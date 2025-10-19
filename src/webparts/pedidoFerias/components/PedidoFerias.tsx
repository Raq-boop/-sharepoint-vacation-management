import * as React from 'react';
import styles from './PedidoFerias.module.scss';
import type { IPedidoFeriasProps } from './IPedidoFeriasProps';

const PedidoFerias: React.FC<IPedidoFeriasProps> = (props) => {
  return (
    <div className={styles.pedidoFerias}>
      <div className={styles.container}>
        <div className={styles.filterSection}>
          <div className={styles.filterIcon}>🔍</div>
          <h3>Filtros</h3>
          <div className={styles.filterControls}>
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="Buscar por colaborador, motivo..."
            />
            <select className={styles.statusFilter}>
              <option>Todos os estados</option>
              <option>Pendente</option>
              <option>Aprovado</option>
              <option>Rejeitado</option>
            </select>
          </div>
        </div>

        <div className={styles.requestsList}>
          <div className={styles.listHeader}>
            <span className={styles.listIcon}>📋</span>
            <h3>Pedidos de Férias (3 itens)</h3>
          </div>

          <div className={styles.requestItem + ' ' + styles.pending}>
            <div className={styles.requestHeader}>
              <div className={styles.userInfo}>
                <div className={styles.avatar + ' ' + styles.avatarJS}>JS</div>
                <div className={styles.userDetails}>
                  <h4>João Silva</h4>
                  <p>joao.silva@hnlcompany.onmicrosoft.com</p>
                </div>
              </div>
              <div className={styles.requestMeta}>
                <span className={styles.requestDate}>📅 Solicitado em: 15/06/2025 11:00</span>
                <span className={styles.statusBadge + ' ' + styles.statusPending}>PENDENTE</span>
              </div>
            </div>
            <div className={styles.requestBody}>
              <div className={styles.vacationPeriod}>
                <span className={styles.periodIcon}>📅</span>
                <span>01/07/2025 — 15/07/2025 (15 dias)</span>
              </div>
              <div className={styles.vacationReason}>
                <span className={styles.reasonIcon}>💬</span>
                <span>&quot;Férias de verão com a família&quot;</span>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.approveBtn}>✓ Aprovar</button>
                <button className={styles.rejectBtn}>✗ Rejeitar</button>
                <button className={styles.detailsBtn}>👁 Detalhes</button>
              </div>
            </div>
          </div>

          <div className={styles.requestItem + ' ' + styles.approved}>
            <div className={styles.requestHeader}>
              <div className={styles.userInfo}>
                <div className={styles.avatar + ' ' + styles.avatarMS}>MS</div>
                <div className={styles.userDetails}>
                  <h4>Maria Santos</h4>
                  <p>maria.santos@hnlcompany.onmicrosoft.com</p>
                </div>
              </div>
              <div className={styles.requestMeta}>
                <span className={styles.requestDate}>📅 Solicitado em: 01/11/2025 14:30</span>
                <span className={styles.statusBadge + ' ' + styles.statusApproved}>APROVADO</span>
              </div>
            </div>
            <div className={styles.requestBody}>
              <div className={styles.vacationPeriod}>
                <span className={styles.periodIcon}>📅</span>
                <span>20/12/2025 — 30/12/2025 (10 dias)</span>
              </div>
              <div className={styles.vacationReason}>
                <span className={styles.reasonIcon}>💬</span>
                <span>&quot;Festividades de fim de ano&quot;</span>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.approveBtn} disabled>✓ Aprovar</button>
                <button className={styles.rejectBtn} disabled>✗ Rejeitar</button>
                <button className={styles.detailsBtn}>👁 Detalhes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoFerias;
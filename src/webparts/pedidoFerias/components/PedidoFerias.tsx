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
            <div className={styles.filterGroup}>
              <label>👤 Colaborador:</label>
              <select className={styles.peoplePickerSim}>
                <option value="">Todos os colaboradores</option>
                <option value="joao.silva">João Silva</option>
                <option value="maria.santos">Maria Santos</option>
                <option value="ana.costa">Ana Costa</option>
                <option value="ricardo.oliveira">Ricardo Oliveira</option>
                <option value="fernanda.lima">Fernanda Lima</option>
                <option value="pedro.rodrigues">Pedro Rodrigues</option>
                <option value="lucas.carvalho">Lucas Carvalho</option>
                <option value="carla.souza">Carla Souza</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>📊 Status:</label>
              <select className={styles.statusFilter}>
                <option value="">Todos os estados</option>
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="🔍 Buscar por motivo..."
            />
          </div>
        </div>

        <div className={styles.requestsList}>
          <div className={styles.listHeader}>
            <span className={styles.listIcon}>📋</span>
            <h3>Pedidos de Férias (8 itens)</h3>
            <div className={styles.sortControls}>
              <label>Ordenar por:</label>
              <select className={styles.sortSelect}>
                <option value="dataInicio">Data de Início</option>
                <option value="dataSolicitacao">Data da Solicitação</option>
                <option value="colaborador">Colaborador</option>
                <option value="status">Status</option>
              </select>
            </div>
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

          <div className={styles.requestItem + ' ' + styles.pending}>
            <div className={styles.requestHeader}>
              <div className={styles.userInfo}>
                <div className={styles.avatar + ' ' + styles.avatarAC}>AC</div>
                <div className={styles.userDetails}>
                  <h4>Ana Costa</h4>
                  <p>ana.costa@hnlcompany.onmicrosoft.com</p>
                </div>
              </div>
              <div className={styles.requestMeta}>
                <span className={styles.requestDate}>📅 Solicitado em: 18/10/2025 09:15</span>
                <span className={styles.statusBadge + ' ' + styles.statusPending}>PENDENTE</span>
              </div>
            </div>
            <div className={styles.requestBody}>
              <div className={styles.vacationPeriod}>
                <span className={styles.periodIcon}>📅</span>
                <span>25/11/2025 — 06/12/2025 (12 dias)</span>
              </div>
              <div className={styles.vacationReason}>
                <span className={styles.reasonIcon}>💬</span>
                <span>&quot;Viagem para Europa&quot;</span>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.approveBtn}>✓ Aprovar</button>
                <button className={styles.rejectBtn}>✗ Rejeitar</button>
                <button className={styles.detailsBtn}>👁 Detalhes</button>
              </div>
            </div>
          </div>

          <div className={styles.requestItem + ' ' + styles.rejected}>
            <div className={styles.requestHeader}>
              <div className={styles.userInfo}>
                <div className={styles.avatar + ' ' + styles.avatarRO}>RO</div>
                <div className={styles.userDetails}>
                  <h4>Ricardo Oliveira</h4>
                  <p>ricardo.oliveira@hnlcompany.onmicrosoft.com</p>
                </div>
              </div>
              <div className={styles.requestMeta}>
                <span className={styles.requestDate}>📅 Solicitado em: 12/10/2025 16:45</span>
                <span className={styles.statusBadge + ' ' + styles.statusRejected}>REJEITADO</span>
              </div>
            </div>
            <div className={styles.requestBody}>
              <div className={styles.vacationPeriod}>
                <span className={styles.periodIcon}>📅</span>
                <span>01/11/2025 — 08/11/2025 (8 dias)</span>
              </div>
              <div className={styles.vacationReason}>
                <span className={styles.reasonIcon}>💬</span>
                <span>&quot;Descanso pessoal&quot;</span>
              </div>
              <div className={styles.rejectionReason}>
                <span className={styles.reasonIcon}>❌</span>
                <span>Motivo da rejeição: Período de alta demanda de projeto</span>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.approveBtn} disabled>✓ Aprovar</button>
                <button className={styles.rejectBtn} disabled>✗ Rejeitar</button>
                <button className={styles.detailsBtn}>👁 Detalhes</button>
              </div>
            </div>
          </div>

          <div className={styles.requestItem + ' ' + styles.pending}>
            <div className={styles.requestHeader}>
              <div className={styles.userInfo}>
                <div className={styles.avatar + ' ' + styles.avatarFL}>FL</div>
                <div className={styles.userDetails}>
                  <h4>Fernanda Lima</h4>
                  <p>fernanda.lima@hnlcompany.onmicrosoft.com</p>
                </div>
              </div>
              <div className={styles.requestMeta}>
                <span className={styles.requestDate}>📅 Solicitado em: 05/10/2025 13:20</span>
                <span className={styles.statusBadge + ' ' + styles.statusPending}>PENDENTE</span>
              </div>
            </div>
            <div className={styles.requestBody}>
              <div className={styles.vacationPeriod}>
                <span className={styles.periodIcon}>📅</span>
                <span>15/01/2026 — 29/01/2026 (15 dias)</span>
              </div>
              <div className={styles.vacationReason}>
                <span className={styles.reasonIcon}>💬</span>
                <span>&quot;Férias de janeiro - descanso anual&quot;</span>
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
                <div className={styles.avatar + ' ' + styles.avatarPR}>PR</div>
                <div className={styles.userDetails}>
                  <h4>Pedro Rodrigues</h4>
                  <p>pedro.rodrigues@hnlcompany.onmicrosoft.com</p>
                </div>
              </div>
              <div className={styles.requestMeta}>
                <span className={styles.requestDate}>📅 Solicitado em: 28/09/2025 10:30</span>
                <span className={styles.statusBadge + ' ' + styles.statusApproved}>APROVADO</span>
              </div>
            </div>
            <div className={styles.requestBody}>
              <div className={styles.vacationPeriod}>
                <span className={styles.periodIcon}>📅</span>
                <span>10/11/2025 — 17/11/2025 (8 dias)</span>
              </div>
              <div className={styles.vacationReason}>
                <span className={styles.reasonIcon}>💬</span>
                <span>&quot;Casamento do irmão&quot;</span>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.approveBtn} disabled>✓ Aprovar</button>
                <button className={styles.rejectBtn} disabled>✗ Rejeitar</button>
                <button className={styles.detailsBtn}>👁 Detalhes</button>
              </div>
            </div>
          </div>

          <div className={styles.requestItem + ' ' + styles.pending}>
            <div className={styles.requestHeader}>
              <div className={styles.userInfo}>
                <div className={styles.avatar + ' ' + styles.avatarLC}>LC</div>
                <div className={styles.userDetails}>
                  <h4>Lucas Carvalho</h4>
                  <p>lucas.carvalho@hnlcompany.onmicrosoft.com</p>
                </div>
              </div>
              <div className={styles.requestMeta}>
                <span className={styles.requestDate}>📅 Solicitado em: 20/10/2025 15:45</span>
                <span className={styles.statusBadge + ' ' + styles.statusPending}>PENDENTE</span>
              </div>
            </div>
            <div className={styles.requestBody}>
              <div className={styles.vacationPeriod}>
                <span className={styles.periodIcon}>📅</span>
                <span>02/12/2025 — 16/12/2025 (15 dias)</span>
              </div>
              <div className={styles.vacationReason}>
                <span className={styles.reasonIcon}>💬</span>
                <span>&quot;Férias de fim de ano&quot;</span>
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
                <div className={styles.avatar + ' ' + styles.avatarCS}>CS</div>
                <div className={styles.userDetails}>
                  <h4>Carla Souza</h4>
                  <p>carla.souza@hnlcompany.onmicrosoft.com</p>
                </div>
              </div>
              <div className={styles.requestMeta}>
                <span className={styles.requestDate}>📅 Solicitado em: 25/09/2025 08:00</span>
                <span className={styles.statusBadge + ' ' + styles.statusApproved}>APROVADO</span>
              </div>
            </div>
            <div className={styles.requestBody}>
              <div className={styles.vacationPeriod}>
                <span className={styles.periodIcon}>📅</span>
                <span>05/11/2025 — 12/11/2025 (8 dias)</span>
              </div>
              <div className={styles.vacationReason}>
                <span className={styles.reasonIcon}>💬</span>
                <span>&quot;Aniversário de casamento&quot;</span>
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
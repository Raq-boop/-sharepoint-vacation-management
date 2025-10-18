import * as React from 'react';
import styles from './PedidoFerias.module.scss';
import type { IPedidoFeriasProps } from './IPedidoFeriasProps';

const PedidoFerias: React.FC<IPedidoFeriasProps> = (props) => {
  return (
    <div className={styles.pedidoFerias}>
      <div className={styles.container}>
        <div className={styles.welcome}>
          <div className={styles.welcomeImage}></div>
          <h2>🏖️ Sistema de Gestão de Férias</h2>
          <p className={styles.description}>
            Gerencie pedidos de férias da sua equipe de forma simples e eficiente
          </p>
        </div>

        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.employeeCard}>
              <div className={styles.employeeHeader}>
                <div className={styles.employeePhoto}>AS</div>
                <div className={styles.employeeInfo}>
                  <h3>Ana Silva</h3>
                  <p>Desenvolvedora Senior</p>
                  <div className={styles.employeeDepartment}>Tecnologia</div>
                </div>
              </div>
              <div className={styles.vacationInfo}>
                <div className={styles.vacationDates}>
                  <strong>15/11/2025 - 25/11/2025</strong>
                  <span className={styles.vacationDays}>10 dias</span>
                </div>
                <p className={styles.vacationReason}>Viagem em família para Europa</p>
                <div className={`${styles.vacationStatus} ${styles.pending}`}>
                  ⏳ Pendente
                </div>
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.employeeCard}>
              <div className={styles.employeeHeader}>
                <div className={styles.employeePhoto}>CS</div>
                <div className={styles.employeeInfo}>
                  <h3>Carlos Santos</h3>
                  <p>Analista de Sistemas</p>
                  <div className={styles.employeeDepartment}>Tecnologia</div>
                </div>
              </div>
              <div className={styles.vacationInfo}>
                <div className={styles.vacationDates}>
                  <strong>20/12/2025 - 30/12/2025</strong>
                  <span className={styles.vacationDays}>10 dias</span>
                </div>
                <p className={styles.vacationReason}>Férias de fim de ano com a família</p>
                <div className={`${styles.vacationStatus} ${styles.approved}`}>
                  ✅ Aprovado
                </div>
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.employeeCard}>
              <div className={styles.employeeHeader}>
                <div className={styles.employeePhoto}>BC</div>
                <div className={styles.employeeInfo}>
                  <h3>Beatriz Costa</h3>
                  <p>UX Designer</p>
                  <div className={styles.employeeDepartment}>Design</div>
                </div>
              </div>
              <div className={styles.vacationInfo}>
                <div className={styles.vacationDates}>
                  <strong>01/11/2025 - 10/11/2025</strong>
                  <span className={styles.vacationDays}>10 dias</span>
                </div>
                <p className={styles.vacationReason}>Descanso pessoal e relaxamento</p>
                <div className={`${styles.vacationStatus} ${styles.rejected}`}>
                  ❌ Rejeitado
                </div>
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.employeeCard}>
              <div className={styles.employeeHeader}>
                <div className={styles.employeePhoto}>RO</div>
                <div className={styles.employeeInfo}>
                  <h3>Rafael Oliveira</h3>
                  <p>Product Manager</p>
                  <div className={styles.employeeDepartment}>Produto</div>
                </div>
              </div>
              <div className={styles.vacationInfo}>
                <div className={styles.vacationDates}>
                  <strong>15/12/2025 - 22/12/2025</strong>
                  <span className={styles.vacationDays}>7 dias</span>
                </div>
                <p className={styles.vacationReason}>Festividades natalinas</p>
                <div className={`${styles.vacationStatus} ${styles.pending}`}>
                  ⏳ Pendente
                </div>
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.employeeCard}>
              <div className={styles.employeeHeader}>
                <div className={styles.employeePhoto}>FL</div>
                <div className={styles.employeeInfo}>
                  <h3>Fernanda Lima</h3>
                  <p>Analista de Marketing</p>
                  <div className={styles.employeeDepartment}>Marketing</div>
                </div>
              </div>
              <div className={styles.vacationInfo}>
                <div className={styles.vacationDates}>
                  <strong>18/11/2025 - 25/11/2025</strong>
                  <span className={styles.vacationDays}>7 dias</span>
                </div>
                <p className={styles.vacationReason}>Casamento de familiar</p>
                <div className={`${styles.vacationStatus} ${styles.approved}`}>
                  ✅ Aprovado
                </div>
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.employeeCard}>
              <div className={styles.employeeHeader}>
                <div className={styles.employeePhoto}>PR</div>
                <div className={styles.employeeInfo}>
                  <h3>Pedro Rocha</h3>
                  <p>Desenvolvedor Frontend</p>
                  <div className={styles.employeeDepartment}>Tecnologia</div>
                </div>
              </div>
              <div className={styles.vacationInfo}>
                <div className={styles.vacationDates}>
                  <strong>02/12/2025 - 09/12/2025</strong>
                  <span className={styles.vacationDays}>7 dias</span>
                </div>
                <p className={styles.vacationReason}>Viagem de lazer</p>
                <div className={`${styles.vacationStatus} ${styles.pending}`}>
                  ⏳ Pendente
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.linkContainer}>
          <a 
            href="https://hnlcompany-my.sharepoint.com/personal/raquel_hnlcompany_onmicrosoft_com/Lists/PedidoFerias/AllItems.aspx" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.sharepointLink}
          >
            🔗 Abrir Lista Completa no SharePoint
          </a>
        </div>
      </div>
    </div>
  );
};

export default PedidoFerias;
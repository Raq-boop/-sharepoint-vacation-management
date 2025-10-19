import * as React from 'react';
import styles from './PedidoFerias.module.scss';
import type { IPedidoFeriasProps } from './IPedidoFeriasProps';

const PedidoFerias: React.FC<IPedidoFeriasProps> = (props) => {
  return (
    <div className={styles.pedidoFerias}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>🏖️ Solicitações de Férias</h1>
          <p>Gestão completa das férias da equipe</p>
        </div>

        
        <div className={styles.vacationGrid}>
          <div className={styles.vacationCard}>
            <div className={styles.avatar}>MS</div>
            <h3>Maria Silva</h3>
            <p>Desenvolvedora</p>
            <div className={styles.dates}>15/nov - 25/nov</div>
            <div className={styles.statusPending}>Pendente</div>
          </div>

          <div className={styles.vacationCard}>
            <div className={styles.avatar}>JS</div>
            <h3>João Santos</h3>
            <p>Analista de Sistemas</p>
            <div className={styles.dates}>20/dez - 30/dez</div>
            <div className={styles.statusApproved}>Aprovado</div>
          </div>

          <div className={styles.vacationCard}>
            <div className={styles.avatar}>AC</div>
            <h3>Ana Costa</h3>
            <p>Designer UI/UX</p>
            <div className={styles.dates}>01/nov - 10/nov</div>
            <div className={styles.statusRejected}>Negado</div>
          </div>

          <div className={styles.vacationCard}>
            <div className={styles.avatar}>RO</div>
            <h3>Ricardo Oliveira</h3>
            <p>Gerente de Produto</p>
            <div className={styles.dates}>15/dez - 22/dez</div>
            <div className={styles.statusPending}>Pendente</div>
          </div>

          <div className={styles.vacationCard}>
            <div className={styles.avatar}>FL</div>
            <h3>Fernanda Lima</h3>
            <p>Analista de Marketing</p>
            <div className={styles.dates}>18/nov - 25/nov</div>
            <div className={styles.statusApproved}>Aprovado</div>
          </div>

          <div className={styles.vacationCard}>
            <div className={styles.avatar}>PR</div>
            <h3>Pedro Rodrigues</h3>
            <p>Desenvolvedor Frontend</p>
            <div className={styles.dates}>02/dez - 09/dez</div>
            <div className={styles.statusPending}>Pendente</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoFerias;
    export default function SummaryCard({ totalIncome, totalExpense, profit }) {
    const profitPositive = profit >= 0;

    return (
        <div style={styles.grid}>
        <div style={styles.metricCard}>
            <div style={styles.label}>Income</div>
            <div style={{ ...styles.value, color: '#15803d' }}>
            ${totalIncome.toFixed(2)}
            </div>
        </div>

        <div style={styles.metricCard}>
            <div style={styles.label}>Expenses</div>
            <div style={{ ...styles.value, color: '#c80815' }}>
            ${totalExpense.toFixed(2)}
            </div>
        </div>

        <div
            style={{
            ...styles.metricCard,
            ...styles.profitCard,
            background: profitPositive ? '#c80815' : '#111',
            boxShadow: profitPositive
                ? '0 10px 24px rgba(200,8,21,0.2)'
                : '0 10px 24px rgba(0,0,0,0.15)',
            }}
        >
            <div style={{ ...styles.label, color: 'rgba(255,255,255,0.7)' }}>
            Net Profit
            </div>
            <div style={{ ...styles.value, color: '#fff' }}>
            {profitPositive ? '+' : ''}${profit.toFixed(2)}
            </div>
            {!profitPositive && (
            <div style={styles.lossNote}>Expenses exceed income for this period</div>
            )}
        </div>
        </div>
    );
    }

    const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '4px',
    },
    metricCard: {
        background: '#fff',
        border: '1px solid #ededed',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    profitCard: {
        gridColumn: '1 / -1',
        border: 'none',
    },
    label: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        marginBottom: '8px',
    },
    value: {
        fontSize: '26px',
        fontWeight: '900',
        color: '#111',
        letterSpacing: '-0.5px',
        lineHeight: 1,
    },
    lossNote: {
        marginTop: '6px',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.7)',
    },
    };
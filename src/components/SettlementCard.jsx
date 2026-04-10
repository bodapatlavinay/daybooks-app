    export default function SettlementCard({ partners, expenses }) {
    if (!partners.length) {
        return (
        <div style={styles.empty}>
            <p style={styles.emptyText}>Add partners above to see settlement calculations.</p>
        </div>
        );
    }

    // Total expenses across all time (always unfiltered)
    const totalExpenses = expenses.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
    );

    // Build paid map: key is partner name (lowercased for safe matching)
    // Also bucket the shop owner's expenses under their email key
    const paidMap = {};
    expenses.forEach((expense) => {
        const key = (expense.paid_by || '').trim().toLowerCase();
        paidMap[key] = (paidMap[key] || 0) + Number(expense.amount || 0);
    });

    // Equity total for warning
    const equityTotal = partners.reduce((sum, p) => sum + Number(p.equity_pct || 0), 0);

    return (
        <div style={styles.wrapper}>
        <h3 style={styles.title}>Partner Settlement</h3>

        <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Total Expenses (All Time)</span>
            <strong style={styles.summaryValue}>${totalExpenses.toFixed(2)}</strong>
        </div>

        {Math.abs(equityTotal - 100) > 0.01 && (
            <div style={styles.warning}>
            ⚠️ Equity totals {equityTotal.toFixed(0)}% — should be 100% for accurate settlement.
            </div>
        )}

        {partners.map((partner) => {
            const equity = Number(partner.equity_pct || 0);
            const fairShare = (totalExpenses * equity) / 100;

            // Match by partner name (case-insensitive)
            const partnerKey = partner.name.trim().toLowerCase();
            const paid = paidMap[partnerKey] || 0;
            const balance = paid - fairShare;

            return (
            <div key={partner.id} style={styles.card}>
                <div style={styles.nameRow}>
                <span style={styles.partnerName}>{partner.name}</span>
                <span style={styles.equityBadge}>{equity.toFixed(0)}% stake</span>
                </div>

                <div style={styles.divider} />

                <div style={styles.row}>
                <span style={styles.rowLabel}>Expenses Paid</span>
                <span style={styles.rowValue}>${paid.toFixed(2)}</span>
                </div>

                <div style={styles.row}>
                <span style={styles.rowLabel}>Fair Share ({equity.toFixed(0)}%)</span>
                <span style={styles.rowValue}>${fairShare.toFixed(2)}</span>
                </div>

                <div style={styles.balanceRow}>
                <span style={styles.rowLabel}>Balance</span>
                <span
                    style={{
                    ...styles.balanceValue,
                    color: balance >= 0 ? '#15803d' : '#c80815',
                    background: balance >= 0 ? '#f0faf4' : '#fff0f0',
                    border: `1px solid ${balance >= 0 ? '#bbf0d4' : '#fccaca'}`,
                    }}
                >
                    {balance >= 0
                    ? `+$${balance.toFixed(2)} overpaid`
                    : `-$${Math.abs(balance).toFixed(2)} owes`}
                </span>
                </div>
            </div>
            );
        })}

        <p style={styles.note}>
            Based on all recorded expenses. Expenses logged with a partner's name are attributed to them.
        </p>
        </div>
    );
    }

    const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '16px',
    },
    title: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '800',
        color: '#111',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 14px',
        border: '1px solid #ececec',
        borderRadius: '12px',
        background: '#fafafa',
    },
    summaryLabel: {
        fontSize: '13px',
        color: '#555',
    },
    summaryValue: {
        fontSize: '15px',
        color: '#111',
    },
    warning: {
        background: '#fffbea',
        border: '1px solid #f5d77a',
        color: '#7a5c00',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px',
        fontWeight: '600',
    },
    card: {
        border: '1px solid #ececec',
        borderRadius: '14px',
        padding: '14px',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    nameRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    partnerName: {
        fontWeight: '800',
        fontSize: '15px',
        color: '#111',
    },
    equityBadge: {
        background: '#fff3f3',
        color: '#c80815',
        fontSize: '11px',
        fontWeight: '700',
        padding: '3px 8px',
        borderRadius: '20px',
        border: '1px solid #fccaca',
    },
    divider: {
        height: '1px',
        background: '#f0f0f0',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
    },
    rowLabel: {
        color: '#666',
    },
    rowValue: {
        fontWeight: '600',
        color: '#111',
    },
    balanceRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        marginTop: '2px',
    },
    balanceValue: {
        fontWeight: '800',
        fontSize: '13px',
        padding: '4px 10px',
        borderRadius: '8px',
    },
    empty: {
        textAlign: 'center',
        padding: '16px',
        border: '1.5px dashed #e4e4e4',
        borderRadius: '12px',
        background: '#fafafa',
        marginTop: '12px',
    },
    emptyText: {
        margin: 0,
        color: '#888',
        fontSize: '13px',
    },
    note: {
        margin: 0,
        fontSize: '11px',
        color: '#aaa',
        textAlign: 'center',
        lineHeight: '1.5',
    },
    };
    export default function ReportsCard({ entries, expenses, totals, filter }) {
    // Fixed: service breakdown now shows REVENUE per service type, not count
    const serviceRevenue = entries.reduce((acc, item) => {
        const key = item.service_type || 'General';
        acc[key] = (acc[key] || 0) + Number(item.amount || 0);
        return acc;
    }, {});

    // Also track count separately
    const serviceCounts = entries.reduce((acc, item) => {
        const key = item.service_type || 'General';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const expenseCategories = expenses.reduce((acc, item) => {
        const key = item.category || 'misc';
        acc[key] = (acc[key] || 0) + Number(item.amount || 0);
        return acc;
    }, {});

    // Find top service by revenue
    const topService = Object.entries(serviceRevenue).sort((a, b) => b[1] - a[1])[0];

    // Find top expense category
    const topCategory = Object.entries(expenseCategories).sort((a, b) => b[1] - a[1])[0];

    const filterLabel = {
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
        all: 'All Time',
    }[filter] || filter;

    return (
        <div style={styles.wrapper}>
        <h3 style={styles.title}>Reports — {filterLabel}</h3>

        {/* Summary */}
        <div style={styles.card}>
            <MetricRow label="Total Income" value={`$${Number(totals.totalIncome).toFixed(2)}`} valueColor="#15803d" />
            <MetricRow label="Total Expenses" value={`$${Number(totals.totalExpense).toFixed(2)}`} valueColor="#c80815" />
            <div style={styles.divider} />
            <MetricRow
            label="Net Profit"
            value={`$${Number(totals.profit).toFixed(2)}`}
            valueColor={totals.profit >= 0 ? '#15803d' : '#c80815'}
            bold
            />
            <div style={styles.divider} />
            <MetricRow label="Income Entries" value={entries.length} />
            <MetricRow label="Expense Entries" value={expenses.length} />
            {topService && (
            <MetricRow label="Top Service" value={`${topService[0]} ($${topService[1].toFixed(2)})`} />
            )}
            {topCategory && (
            <MetricRow label="Top Expense Category" value={`${topCategory[0]} ($${topCategory[1].toFixed(2)})`} />
            )}
        </div>

        {/* Service revenue breakdown */}
        <div style={styles.card}>
            <h4 style={styles.subTitle}>Income by Service</h4>
            {Object.keys(serviceRevenue).length === 0 ? (
            <p style={styles.empty}>No income entries for this period.</p>
            ) : (
            Object.entries(serviceRevenue)
                .sort((a, b) => b[1] - a[1])
                .map(([service, revenue]) => (
                <div key={service} style={styles.row}>
                    <div style={styles.rowLeft}>
                    <span style={styles.rowLabel}>{service}</span>
                    <span style={styles.rowCount}>{serviceCounts[service]} job{serviceCounts[service] !== 1 ? 's' : ''}</span>
                    </div>
                    <strong style={{ color: '#15803d' }}>${revenue.toFixed(2)}</strong>
                </div>
                ))
            )}
        </div>

        {/* Expense category breakdown */}
        <div style={styles.card}>
            <h4 style={styles.subTitle}>Expenses by Category</h4>
            {Object.keys(expenseCategories).length === 0 ? (
            <p style={styles.empty}>No expenses for this period.</p>
            ) : (
            Object.entries(expenseCategories)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => (
                <div key={category} style={styles.row}>
                    <span style={styles.rowLabel}>{category}</span>
                    <strong style={{ color: '#c80815' }}>${amount.toFixed(2)}</strong>
                </div>
                ))
            )}
        </div>
        </div>
    );
    }

    function MetricRow({ label, value, valueColor, bold }) {
    return (
        <div style={styles.row}>
        <span style={styles.rowLabel}>{label}</span>
        <span
            style={{
            fontWeight: bold ? '800' : '600',
            color: valueColor || '#111',
            fontSize: bold ? '15px' : '14px',
            }}
        >
            {value}
        </span>
        </div>
    );
    }

    const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    title: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '800',
        color: '#111',
    },
    subTitle: {
        margin: '0 0 8px',
        fontSize: '14px',
        fontWeight: '800',
        color: '#111',
    },
    card: {
        border: '1px solid #ececec',
        borderRadius: '16px',
        padding: '16px',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    divider: {
        height: '1px',
        background: '#f0f0f0',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: '#333',
    },
    rowLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
    },
    rowLabel: {
        color: '#444',
        fontSize: '13px',
        textTransform: 'capitalize',
    },
    rowCount: {
        color: '#aaa',
        fontSize: '11px',
    },
    empty: {
        margin: 0,
        color: '#aaa',
        fontSize: '13px',
    },
    };
import Pagenation from './Pagenation'
const TableComponent = ({ columns = [], rows = [], actions = [], currentPage, setCurrentPage, totalPages }) => {
    return (
        <>
            <div className="table-responsive-md">
                <table className="table text-nowrap mb-0">
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx}>{col.label}</th>
                            ))}
                            {actions.length > 0 && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col.render ? col.render(rowIndex, currentPage) : row[col.key]}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="table-icons">
                                        {actions.map((action, actionIndex) => (
                                            <span
                                                key={actionIndex}
                                                onClick={() => action.handler(row)}
                                                style={{ marginRight: 8, cursor: 'pointer' }}
                                                title={action.tooltip}
                                            >
                                                <i className={action.icon}></i>
                                            </span>
                                        ))}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagenation
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </>
    )
}

export default TableComponent

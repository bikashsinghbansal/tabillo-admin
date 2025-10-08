export function DataTable(props: any) {
  const { headerGroups, getTableProps, rows, getTableBodyProps, prepareRow } =
    props;
  return (
    <table id="table-to-xls" {...getTableProps()} className="table my-0">
      <thead>
        {headerGroups.map((headerGroup: any) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {!column.disableSortBy
                    ? column.isSorted && true
                      ? column.isSortedDesc
                        ? " ▾"
                        : " ▴"
                      : "▴▾"
                    : ""}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row: any) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell: any) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

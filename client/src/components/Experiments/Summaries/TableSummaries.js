import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

function EnhancedTableHead({headers, selected, sample}) {
  return (
    <TableHead>
      <TableRow>
          {selected &&<TableCell>
            Mark
          </TableCell>}
          <TableCell padding="none">
            {headers[0].label}
          </TableCell>
        {headers.slice(1).map(header => (
          <TableCell key={header.id + header.type ==="array" ? header.index: '' }>
            {header.id === 'answers' ? header.labelFormat(sample && sample.data.answers[header.index].id) : header.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function TableSummaries({
  selected,
  onChangeSelected,
  headers,
  rows,
  initPageSize
}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(initPageSize || 5);

  const handleClick = (event, name) => {
    if(!selected) 
      return;
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    onChangeSelected && onChangeSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = name => selected && selected.indexOf(name) !== -1;


  return (
    <div className={classes.root}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead headers={headers} selected={selected} sample={rows[0]}/>
            <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const data = row.data;
                  return (
                    <TableRow
                      hover
                      style={{backgroundColor: row.disabled ? '#cccccc': null}}
                      onClick={event => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={data.name}
                      selected={isItemSelected}
                    >
                      {selected && <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>}
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {data.name}
                      </TableCell>
                      {headers.slice(1).map(
                        header => {
                          const type = header.type;
                          const dataEntry = data[header.id];
                          const isArrayType = type==='array'

                          return <TableCell key={`${isArrayType ? header.id + header.index :  header.id}-${index}`} align={isArrayType ? "right"  : "left"}>{
                            type ==='date' && dataEntry ?
                              new Date(dataEntry).toLocaleDateString() :
                              type ==='array' && dataEntry[header.index]? 
                              header.format(dataEntry[header.index], rows[0].data.answers[header.index].id) :
                              type ==='custom' && dataEntry? 
                              header.format(dataEntry) :
                              dataEntry}</TableCell>
                        }
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </div>
  );
}

TableSummaries.propTypes = {
  onChangeSelected: PropTypes.func,
  selected: PropTypes.array,
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired
};
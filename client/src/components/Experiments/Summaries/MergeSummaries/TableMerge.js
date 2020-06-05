import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Slider from './SliderWithValueBox';


const useStyles = makeStyles({
  table: {
    minWidth: 350,
  },
});

export default function SimpleTable({
  mergeInput, setPercentageOf,
}) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell >Type</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">Weight</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mergeInput.map((row,index) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.type}
              </TableCell>
              <TableCell component="th" scope="row" align="right">
              </TableCell>
              <TableCell align="right">
                        <Slider
                            setPercentage={setPercentageOf(index)}
                            rowIndex={index}
                            />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

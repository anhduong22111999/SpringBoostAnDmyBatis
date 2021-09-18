import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Card,
  CardMedia,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { filter } from 'lodash';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import AddBookForm from '../components/_dashboard/book/addNewBookForm';
import bookApi from '../api/bookApi';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
import AddUserForm from '../components/_dashboard/userManager/addNewUserForm';
//
import USERLIST from '../_mocks_/user';
import categoryApi from '../api/categoryApi';
import BookMoreMenu from '../components/_dashboard/book/BookMoreMenu';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'author', label: 'Author', alignRight: false },
  { id: 'owner', label: 'Owner', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'cover', label: 'Cover', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Books() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [listBook, setListBook] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [filterName, setFilterName] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
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
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const debouncedSave = useRef(
    debounce((nextValue) => {
      setPage(0);
      setSearchKey(nextValue);
    }, 500)
  ).current;
  const handleFilterByName = (event) => {
    const { value: nextValue } = event.target;
    debouncedSave(nextValue);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = listBook.length === 0;

  async function getlistBook() {
    const condition = {
      page: page + 1,
      limit: rowsPerPage,
      sort_column: orderBy,
      sort_direction: '',
      search: searchKey
    };
    const result = await bookApi.getListBook({ condition });
    setTotalRows(result.books.totalDocs);
    setListBook(result.books.docs);
  }
  useEffect(() => {
    getlistBook();
    return () => {};
  }, [page, rowsPerPage, orderBy, searchKey]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  async function getListCategory() {
    const result = await categoryApi.getAllCategory();
    if (result) {
      setListCategory(result);
    }
  }
  useEffect(() => {
    getListCategory();
    return () => {};
  }, []);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            New Book
          </Button>
        </Stack>

        {/* dialog add new user */}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We will send
              updates occasionally.
            </DialogContentText>
            <AddBookForm getlistBook={getlistBook} listCategory={listCategory} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            labelSearch="Search book"
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {listBook.map((row) => {
                    const { _id, title, author, owner, description, cover, lastChangedPassword } =
                      row;
                    const isItemSelected = selected.indexOf(title) !== -1;
                    // const newCover = 'http://localhost:3000/'.concat(
                    //   cover.replace(/[\\]/g, '/') || ''
                    // );
                    const newCover = cover
                      ? 'http://localhost:3000/'.concat(cover.replace(/[\\]/g, '/'))
                      : '123';
                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell align="left">{title}</TableCell>
                        <TableCell align="left">{author}</TableCell>
                        <TableCell align="left">
                          {owner.firstName} {owner.lastName}
                        </TableCell>
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="left">
                          <CardMedia
                            sx={{ height: 120, width: 120 }}
                            image={newCover}
                            title="Cover"
                          />
                        </TableCell>
                        <TableCell align="left">{lastChangedPassword}</TableCell>
                        <TableCell align="right">
                          <BookMoreMenu
                            listCategory={listCategory}
                            setPage={getlistBook}
                            _id={_id}
                            book={row}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

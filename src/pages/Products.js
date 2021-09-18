import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

import { makeStyles } from '@material-ui/styles';
// material
import { Container, Pagination, Stack, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../components/_dashboard/products';
//
import PRODUCTS from '../_mocks_/products';
import bookApi from '../api/bookApi';
// import { UserListToolbar } from 'src/components/_dashboard/user';
import { UserListToolbar } from '../components/_dashboard/user';

// ----------------------------------------------------------------------
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '170px'
    }
  }
}));
export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);
  const [books, setBooks] = useState(PRODUCTS);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [page, setPage] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [filterName, setFilterName] = useState('');
  const [categorySort, setCategorySort] = useState(null);
  const [totalDocs, setTotalDocs] = useState(0);

  async function getListBook() {
    const condition = {
      page: page + 1,
      limit: rowsPerPage,
      // sort_column: orderBy,
      sort_direction: '',
      search: filterName,
      sortByCategory: categorySort
    };
    const result = await bookApi.homePaging({ condition });
    console.log(result);
    if (result.code === 200) {
      setBooks(result.books.docs);
      setTotalDocs(Math.ceil(result.books.totalDocs / 8));
    }
  }

  const debouncedSave = useRef(
    debounce((nextValue) => {
      setPage(0);
      setSearchKey(nextValue);
    }, 500)
  ).current;
  const handleFilterByName = (event) => {
    const { value: nextValue } = event.target;
    debouncedSave(nextValue);
    setFilterName(nextValue);
  };
  useEffect(() => {
    getListBook();
    return () => {};
  }, [searchKey, categorySort, page]);
  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => {
      setOpenFilter(false);
    }
  });

  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };
  function filterByCategory(params) {
    setCategorySort(params);
  }
  function handleChangePage(event, page) {
    setPage(page - 1);
  }
  const classes = useStyles();
  return (
    <Page title="Dashboard: Home | Minimal-UI">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Home
        </Typography>
        <UserListToolbar
          // numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          labelSearch="Search book...."
        />
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort onChildChange={filterByCategory} />
          </Stack>
        </Stack>

        <ProductList products={books} />
        <ProductCartWidget />
      </Container>
      <div className={classes.root}>
        <Pagination
          count={totalDocs}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </Page>
  );
}

// material
import { Alert, Autocomplete, Input, Snackbar, Stack, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import bookApi from '../../../api/bookApi';
import store from '../../../app/store';
// ----------------------------------------------------------------------
EditBookForm.propTypes = {
  getlistBook: PropTypes.func,
  listCategory: PropTypes.array,
  book: PropTypes.object
};
EditBookForm.defaultProps = {
  getlistBook: null,
  listCategory: null,
  book: null
};
export default function EditBookForm(props) {
  const { getlistBook, listCategory, book } = props;
  const [open, setopen] = useState(false);
  const [file, setFile] = useState('');
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState('');
  const RegisterSchema = Yup.object().shape({
    title: Yup.string().required('Title required'),
    description: Yup.string().required('Description required'),
    author: Yup.string().required('User name is required')
  });
  function handleClose() {
    setopen(!open);
  }
  const initialValues = {
    title: '',
    description: '',
    author: ''
  };
  if (book) {
    initialValues.title = book.title;
    initialValues.description = book.description;
    initialValues.author = book.author;
  }
  const formik = useFormik({
    initialValues,
    validationSchema: RegisterSchema,
    onSubmit: () => {
      handleFormSubmit();
    }
  });
  const { errors, touched, handleSubmit, values, isSubmitting, getFieldProps } = formik;
  async function handleFormSubmit() {
    const formData = new FormData();
    if (file !== '') {
      formData.append('file', file);
    }
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('author', values.author);
    formData.append('owner', store.getState().user.current.data.user._id);
    formData.append('category', categoryId);
    const result = await bookApi.editBook(formData, book._id);
    if (result.code === 200) {
      getlistBook();
      setopen(true);
      formik.resetForm();
      props.onChildClick();
    }
    console.log(result);
  }
  return (
    <FormikProvider value={formik}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success">
          Add new Book succsess !
        </Alert>
      </Snackbar>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Title"
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
            />

            <TextField
              fullWidth
              label="Description"
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            />
          </Stack>
          <TextField
            fullWidth
            autoComplete="author"
            label="Author"
            {...getFieldProps('author')}
            error={Boolean(touched.author && errors.author)}
            helperText={touched.author && errors.author}
          />
          <Autocomplete
            options={listCategory}
            defaultValue={listCategory.find((category) =>
              category._id === book.category._id ? category.title : book.category.title
            )}
            getOptionLabel={(category) => category.title}
            style={{ width: 300 }}
            onChange={(event, newValue) => {
              setCategoryId(newValue._id);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Combo box" variant="outlined" fullWidth />
            )}
          />
          <input
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={(event) => {
              if (event.target.files) {
                const { 0: file } = event.target.files;
                setFile(file);
              }
            }}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Edit
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

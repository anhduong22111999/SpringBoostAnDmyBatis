import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import {
  Menu,
  Button,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import categoryApi from '../../../api/categoryApi';
// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' }
];
const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));
export default function ShopProductSort(props) {
  const [open, setOpen] = useState(null);
  const classes = useStyles();
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([{ _id: '123', title: 'Không có gì cả' }]);
  // const handleOpen = (event) => {
  //   setOpen(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setOpen(null);
  // };
  async function getListCategory() {
    const result = await categoryApi.getAllCategory();
    if (result) {
      setCategories(result);
    }
  }
  useEffect(() => {
    getListCategory();
    return () => {};
  }, []);
  const handleChange = (event) => {
    setCategory(event.target.value);
    props.onChildChange(event.target.value);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const getValue = (value) => {
    console.log(value);
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        // endIcon={<Icon icon={open ? chevronUpFill : chevronDownFill} />}
      >
        Sort By:&nbsp;
        {/* <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          Newest
        </Typography> */}
      </Button>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">category</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={category}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Default</em>
          </MenuItem>
          {categories.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === 'newest'}
            onClick={handleClose}
            sx={{ typography: 'body2' }}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu> */}
    </>
  );
}

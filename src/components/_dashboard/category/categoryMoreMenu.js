import editFill from '@iconify/icons-eva/edit-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import categoryApi from '../../../api/categoryApi';
import EditUserForm from '../userManager/editUserForm';
import EditCategoryForm from './editCategoryForm';

// ----------------------------------------------------------------------
CategoryMoreMenu.propTypes = {
  _id: PropTypes.string,
  setPage: PropTypes.func,
  category: PropTypes.object
};
CategoryMoreMenu.defaultProps = {
  _id: '',
  setPage: null,
  category: null
};

export default function CategoryMoreMenu(props) {
  const ref = useRef(null);
  const { _id, setPage, category } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [open, setOpen] = useState(false);
  async function deleteCategory() {
    const result = await categoryApi.deleteCategory(_id);
    if (result.code === 200) {
      setOpen(false);
      setPage();
    }
  }
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenEditForm = () => {
    setOpenEditForm(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleEditlose = () => {
    setPage();
    setOpenEditForm(false);
  };
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleClickOpen}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleClickOpenEditForm}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>

      {/* dialog delete */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Did you want delete this category ?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={deleteCategory} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {/* dialog edit */}
      <Dialog open={openEditForm} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <EditCategoryForm category={category} onChildClick={handleEditlose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditlose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

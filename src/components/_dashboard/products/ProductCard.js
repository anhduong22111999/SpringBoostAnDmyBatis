import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
//
import Label from '../../Label';
import ColorPreview from '../../ColorPreview';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

export default function ShopProductCard({ product }) {
  // const { name, cover, price, colors, status, priceSale } = product;
  const { _id, title, author, owner, description, cover } = product;
  const newCover = cover ? 'http://localhost:3000/'.concat(cover.replace(/[\\]/g, '/')) : '123';
  const linkToDetail = `/dashboard/products/${_id}`;
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {author && (
          <Label
            variant="filled"
            // color={(status === 'sale' && 'error') || 'info'}
            color="info"
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            {author}
          </Label>
        )}
        <ProductImgStyle alt={title} src={newCover} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkToDetail} color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}
          {/* <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through'
              }}
            >
              {priceSale && fCurrency(priceSale)}
            </Typography>
            &nbsp;
            {fCurrency(price)}
          </Typography> */}
        </Stack>
      </Stack>
    </Card>
  );
}

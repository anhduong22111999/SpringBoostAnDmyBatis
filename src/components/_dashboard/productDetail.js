import { Avatar, Card, CardContent, Grid, Link } from '@material-ui/core';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import bookApi from '../../api/bookApi';
//
import SvgIconStyle from '../SvgIconStyle';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2)
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});
const GridStyle = styled('div')({
  display: 'flex',
  padding: '0px 200px'
});
const MyTitleStyle = styled('div')({
  marginLeft: '20px'
});
// ----------------------------------------------------------------------

ProductDetailCard.propTypes = {
  product: PropTypes.object,
  index: PropTypes.number
};
ProductDetailCard.default = {
  product: {
    cover: '123',
    title: 'test',
    author: '1',
    owner: '1',
    description: 'anhduong'
  }
};
export default function ProductDetailCard(props) {
  const [product, setProduct] = useState({
    cover: '123',
    title: 'test',
    author: '1',
    owner: '1',
    description: 'anhduong'
  });
  async function getBookById() {
    const result = await bookApi.getBookById(id);
    setProduct(result.data.book);
  }
  const { id } = useParams();
  useEffect(() => {
    getBookById();
    return () => {};
  }, [id]);
  const { cover, title, owner, description, author } = product;
  const newCover = cover
    ? 'http://localhost:3000/'.concat(cover.replace(/[\\]/g, '/'))
    : 'http://localhost:3000/src/public/images/0.9830988789584152FB_IMG_1540036075425.jpg';

  return (
    <GridStyle>
      <Grid item xs={12} sm={6}>
        <Card sx={{ position: 'relative' }}>
          <CardMediaStyle
          // sx=
          //   '&:after': {
          //     top: 0,
          //     content: "''",
          //     width: '100%',
          //     height: '100%',
          //     position: 'absolute',
          //     bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
          //   }
          >
            <SvgIconStyle
              color="paper"
              src="/static/icons/shape-avatar.svg"
              sx={{
                width: 80,
                height: 36,
                zIndex: 9,
                bottom: -15,
                position: 'absolute'
              }}
            />
            <AvatarStyle
              alt={author.name}
              src={author.avatarUrl}
              sx={{
                zIndex: 9,
                top: 24,
                left: 24,
                width: 40,
                height: 40
              }}
            />

            <CoverImgStyle alt={title} src={newCover} />
          </CardMediaStyle>

          <CardContent
            sx={{
              pt: 4,
              bottom: 0,
              width: '100%',
              position: 'absolute'
            }}
          >
            <TitleStyle
              to="#"
              color="inherit"
              variant="subtitle2"
              underline="hover"
              component={RouterLink}
            >
              {title}
            </TitleStyle>
          </CardContent>
        </Card>
      </Grid>
      <MyTitleStyle color="inherit" variant="subtitle2">
        <h2>{title}</h2>
        <h2>{description}</h2>
        <h2>Tác giả : {author}</h2>
      </MyTitleStyle>
    </GridStyle>
  );
}

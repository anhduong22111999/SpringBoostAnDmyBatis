import { Card, Container, Stack, Typography } from '@material-ui/core';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { MHidden } from '../components/@material-extend';
import { ChangePasswordForm } from '../components/authentication/changepassword';
// components
import Page from '../components/Page';
// layouts
import AuthLayout from '../layouts/AuthLayout';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ChangePassword() {
  return (
    <RootStyle title="Login | Minimal-UI">
      <AuthLayout>
        {/* Don’t have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          Get started
        </Link> */}
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Profile setting
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Change password
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter your password below.</Typography>
          </Stack>
          <ChangePasswordForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}

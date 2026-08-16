import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ShopPage from './pages/ShopPage';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div>Google Login</div>,
}));

test('does not redirect to the shop page for invalid credentials', async () => {
  const user = userEvent.setup();
  const router = createMemoryRouter(
    [
      { path: '/login', element: <LoginPage /> },
      { path: '/shop', element: <ShopPage /> },
    ],
    { initialEntries: ['/login'] }
  );

  render(<RouterProvider router={router} />);

  await user.type(screen.getByLabelText(/emailOrPhone/i), 'wrong@email.com');
  await user.type(screen.getByLabelText(/password/i), 'short');
  await user.click(screen.getByRole('button', { name: /signInHere/i }));

  expect(screen.getByText(/signInHere/i)).toBeInTheDocument();
  expect(screen.queryByText(/Organic Products, Market Rates./i)).not.toBeInTheDocument();
});

test('redirects to the shop page for valid credentials', async () => {
  const user = userEvent.setup();
  const router = createMemoryRouter(
    [
      { path: '/login', element: <LoginPage /> },
      { path: '/shop', element: <ShopPage /> },
    ],
    { initialEntries: ['/login'] }
  );

  render(<RouterProvider router={router} />);

  await user.type(screen.getByLabelText(/emailOrPhone/i), 'priya@email.com');
  await user.type(screen.getByLabelText(/password/i), '123456');
  await user.click(screen.getByRole('button', { name: /signInHere/i }));

  expect(await screen.findByText(/Organic Products, Market Rates./i)).toBeInTheDocument();
});

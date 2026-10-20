import { useNavigate, useParams, useLocation } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    pathname: location.pathname,
  };
}

export function notFound() {
  throw new Error('NEXT_NOT_FOUND');
}

export { useParams, useLocation };


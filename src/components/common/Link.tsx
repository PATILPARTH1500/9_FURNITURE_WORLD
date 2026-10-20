import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, onClick, ...props }, ref) => {
    // If external link, mailto, tel, or anchor hash on same page
    const isExternal =
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:');

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          className={className}
          onClick={onClick}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    // Hash anchor navigation or smooth scrolling
    if (href.startsWith('#')) {
      const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) onClick(e);
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', href);
        }
      };

      return (
        <a
          ref={ref}
          href={href}
          className={className}
          onClick={handleAnchorClick}
          {...props}
        >
          {children}
        </a>
      );
    }

    // In page navigation that starts with /# (e.g. /#living)
    if (href.startsWith('/#')) {
      const handleSlashAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) onClick(e);
        if (window.location.pathname === '/') {
          const targetId = href.substring(2);
          const element = document.getElementById(targetId);
          if (element) {
            e.preventDefault();
            element.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', href.substring(1));
          }
        }
      };

      return (
        <RouterLink
          ref={ref}
          to={href}
          className={className}
          onClick={handleSlashAnchorClick}
          {...props}
        >
          {children}
        </RouterLink>
      );
    }

    return (
      <RouterLink
        ref={ref}
        to={href}
        className={className}
        onClick={onClick}
        {...props}
      >
        {children}
      </RouterLink>
    );
  }
);

Link.displayName = 'Link';
export default Link;

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ComponentName} from './{ComponentName}';

describe('{ComponentName}', () => {
  it('renders children correctly', () => {
    render(<{ComponentName}>Test Content</{ComponentName}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default variant and size', () => {
    const { container } = render(<{ComponentName}>Default</{ComponentName}>);
    const element = container.firstChild;
    
    expect(element).toHaveClass('variant-primary');
    expect(element).toHaveClass('size-md');
  });

  describe('variants', () => {
    it('renders primary variant', () => {
      const { container } = render(
        <{ComponentName} variant="primary">Primary</{ComponentName}>
      );
      expect(container.firstChild).toHaveClass('variant-primary');
    });

    it('renders secondary variant', () => {
      const { container } = render(
        <{ComponentName} variant="secondary">Secondary</{ComponentName}>
      );
      expect(container.firstChild).toHaveClass('variant-secondary');
    });

    it('renders tertiary variant', () => {
      const { container } = render(
        <{ComponentName} variant="tertiary">Tertiary</{ComponentName}>
      );
      expect(container.firstChild).toHaveClass('variant-tertiary');
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      const { container } = render(
        <{ComponentName} size="sm">Small</{ComponentName}>
      );
      expect(container.firstChild).toHaveClass('size-sm');
    });

    it('renders medium size', () => {
      const { container } = render(
        <{ComponentName} size="md">Medium</{ComponentName}>
      );
      expect(container.firstChild).toHaveClass('size-md');
    });

    it('renders large size', () => {
      const { container } = render(
        <{ComponentName} size="lg">Large</{ComponentName}>
      );
      expect(container.firstChild).toHaveClass('size-lg');
    });
  });

  it('accepts custom className', () => {
    const { container } = render(
      <{ComponentName} className="custom-class">Custom</{ComponentName}>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('accepts custom style', () => {
    const customStyle = { marginTop: '10px' };
    const { container } = render(
      <{ComponentName} style={customStyle}>Styled</{ComponentName}>
    );
    expect(container.firstChild).toHaveStyle(customStyle);
  });

  it('spreads additional props', () => {
    render(
      <{ComponentName} data-testid="test-component">Props</{ComponentName}>
    );
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  // Add component-specific tests here
  // Example: interaction tests, edge cases, accessibility tests
});

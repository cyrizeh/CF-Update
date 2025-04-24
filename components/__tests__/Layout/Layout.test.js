import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../../Layout/index';

describe('Layout Component', () => {
  it('renders child elements', () => {
    render(
      <Layout>
        <div>child component</div>
      </Layout>
    );
    expect(screen.getByText('child component')).toBeInTheDocument();
  });
});

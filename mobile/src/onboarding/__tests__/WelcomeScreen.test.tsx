/**
 * Snapshot test for WelcomeScreen
 * Uses react-test-renderer to avoid extra testing dependencies.
 */

import React from 'react';
import renderer from 'react-test-renderer';
import { WelcomeScreen } from '../WelcomeScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('WelcomeScreen', () => {
  it('renders consistently', () => {
    const tree = renderer.create(<WelcomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});


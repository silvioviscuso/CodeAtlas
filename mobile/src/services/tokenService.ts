/**
 * Token Service
 * Manages authentication tokens without creating circular dependencies
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';

export class TokenService {
  /**
   * Get the current authentication token
   */
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Set a new authentication token
   */
  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token:', error);
      throw new Error('Failed to save authentication token');
    }
  }

  /**
   * Remove the authentication token
   */
  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw new Error('Failed to remove authentication token');
    }
  }

  /**
   * Check if a token exists
   */
  static async hasToken(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return token !== null && token.length > 0;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  }
}
// services/authService.js
const axios = require('axios');

class AuthService {
  constructor() {
    this.baseURL = 'https://fra.cloud.appwrite.io/v1';
    this.projectId = '6907958f002f3cc167a1';
    this.apiKey = 'standard_30239d788d929235eabfcf754df2c517e138367d746fa57503f23f56ddc3b6b0b37366827b2eae093e50576fc6ea491be498c6ab69c2309544372f24552288139e058b405303940ff8097943176e29a11608cc606e93aba473fd24908717dc8d5518ab4b19356dff1a344c79a0cc61ec83c940da2ca28dc33d67f4634793df17';
  }

  async verifyToken(token) {
    try {
      const response = await axios.get(
        `${this.baseURL}/account`,
        {
          headers: {
            'X-Appwrite-Project': this.projectId,
            'X-Appwrite-JWT': token
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error.response?.data || error.message);
      
      // For development, allow mock users
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Development mode: Using mock user');
        return {
          $id: 'dev-user-123',
          email: 'ajumobiabdulquyum@gmail.com',
          name: 'Abdulquyum Development User'
        };
      }
      
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = new AuthService();
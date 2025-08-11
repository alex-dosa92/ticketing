import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm } from '../utils/validation';
import type { ValidationErrors } from '../utils/validation';
import ErrorDisplay from '../components/ErrorDisplay';

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    padding: '32px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    minWidth: '300px',
  },
  title: {
    textAlign: 'center' as const,
    margin: '0 0 16px 0',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    const validationErrors = validateRegisterForm(name, email, password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const authData = await register(name, email, password);
      doLogin(authData.token, authData.user);
      navigate('/tickets');
    } catch (err: any) {
      console.error('Registration failed', err);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setErrors({ form: [errorMessage] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Register</h2>
        
        <ErrorDisplay errors={errors.form} />
        
        <div>
          <input 
            style={{
              ...styles.input,
              borderColor: errors.name ? '#dc3545' : '#ddd'
            }}
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Full Name"
            disabled={isSubmitting}
          />
          <ErrorDisplay errors={errors.name} />
        </div>
        
        <div>
          <input 
            style={{
              ...styles.input,
              borderColor: errors.email ? '#dc3545' : '#ddd'
            }}
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            type="email"
            disabled={isSubmitting}
          />
          <ErrorDisplay errors={errors.email} />
        </div>
        
        <div>
          <input 
            style={{
              ...styles.input,
              borderColor: errors.password ? '#dc3545' : '#ddd'
            }}
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password"
            disabled={isSubmitting}
          />
          <ErrorDisplay errors={errors.password} />
        </div>
        
        <div>
          <input 
            style={{
              ...styles.input,
              borderColor: errors.confirmPassword ? '#dc3545' : '#ddd'
            }}
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Confirm Password"
            disabled={isSubmitting}
          />
          <ErrorDisplay errors={errors.confirmPassword} />
        </div>
        
        <button 
          style={{
            ...styles.button,
            backgroundColor: isSubmitting ? '#ccc' : '#007bff'
          }} 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

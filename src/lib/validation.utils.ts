import * as z from 'zod';

const PASSWORD_FORMAT = /^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/;

export class ZUtils {
  static integerId = () => {
    return z
      .number({ required_error: 'ID is required.' })
      .int({ message: 'ID must be an integer.' })
      .positive({ message: 'ID must be a positive number.' });
  };

  static url = () => {
    return z.string().url({ message: 'Please enter a valid URL.' });
  };

  static positiveNumber = () => {
    return z
      .number()
      .int({ message: 'Please enter an integer.' })
      .positive({ message: 'Please enter a positive number.' });
  };

  static price = () => {
    return z.number().nonnegative({ message: 'Please enter price valid.' });
  };

  static password = () => {
    return z
      .string()
      .regex(PASSWORD_FORMAT, {
        message:
          'Password must contain only letters, numbers, and at least one special character (!@#$%^&*(),.?":{}|<>)',
      })
      .min(6, 'Password must be at least 6 characters.')
      .max(50, 'Password must not exceed 50 characters.');
  };

  static email = () => {
    return z.string().email({ message: 'The value is not a valid email address.' });
  };
}

/**
 * @fileoverview Swagger / OpenAPI 3.0 configuration
 * @module config/swagger
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'NeoClinic Healthcare API',
    version: '1.0.0',
    description: 'Comprehensive RESTful API documentation for NeoClinic Healthcare Management System. Use the "Authorize" button to set your JWT token (`Bearer <token>`).',
    contact: {
      name: 'NeoClinic Development Team'
    }
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 8000}`,
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          email: { type: 'string', format: 'email', example: 'doctor1@healthcare.com' },
          role: { type: 'string', enum: ['patient', 'doctor', 'admin', 'biologist'], example: 'doctor' },
          first_name: { type: 'string', example: 'John' },
          last_name: { type: 'string', example: 'Smith' },
          phone: { type: 'string', example: '+1234567891' },
          specialization: { type: 'string', example: 'Cardiology' },
          license_number: { type: 'string', example: 'DOC123456' },
          blood_type: { type: 'string', example: 'O+' },
          allergies: { type: 'string', example: 'None' }
        }
      },
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          patient_id: { type: 'integer', example: 5 },
          doctor_id: { type: 'integer', example: 2 },
          appointment_date: { type: 'string', format: 'date-time', example: '2026-11-25T10:00:00.000Z' },
          status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'], example: 'scheduled' },
          type: { type: 'string', enum: ['consultation', 'follow-up', 'emergency'], example: 'consultation' },
          notes: { type: 'string', example: 'Regular cardiac checkup' }
        }
      },
      MedicalRecord: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          patient_id: { type: 'integer', example: 5 },
          doctor_id: { type: 'integer', example: 2 },
          diagnosis: { type: 'string', example: 'Hypertension Stage 1' },
          prescription: { type: 'string', example: 'Lisinopril 10mg daily' },
          notes: { type: 'string', example: 'Patient advised to reduce sodium intake.' }
        }
      },
      TestResult: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          patient_id: { type: 'integer', example: 5 },
          doctor_id: { type: 'integer', example: 2 },
          biologist_id: { type: 'integer', example: 4 },
          test_name: { type: 'string', example: 'Complete Blood Count (CBC)' },
          status: { type: 'string', enum: ['ordered', 'in_progress', 'completed', 'cancelled'], example: 'completed' },
          result: { type: 'string', example: 'Hemoglobin 14.2 g/dL' },
          reference_range: { type: 'string', example: '13.8 - 17.2 g/dL' },
          notes: { type: 'string', example: 'Normal values across all metrics.' }
        }
      },
      HealthParameter: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          patient_id: { type: 'integer', example: 5 },
          parameter_type: { type: 'string', example: 'blood_pressure_systolic' },
          value: { type: 'number', example: 120 },
          unit: { type: 'string', example: 'mmHg' },
          notes: { type: 'string', example: 'Morning reading' }
        }
      },
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 5 },
          type: { type: 'string', example: 'test_result' },
          title: { type: 'string', example: 'New Test Results Available' },
          content: { type: 'string', example: 'Your CBC results have been uploaded.' },
          is_read: { type: 'boolean', example: false }
        }
      },
      Message: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          sender_id: { type: 'integer', example: 2 },
          receiver_id: { type: 'integer', example: 5 },
          content: { type: 'string', example: 'Please remember to take your medication with breakfast.' },
          is_read: { type: 'boolean', example: false }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Operation failed' }
        }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'role', 'first_name', 'last_name'],
                properties: {
                  email: { type: 'string', example: 'newuser@healthcare.com' },
                  password: { type: 'string', example: 'securePass123' },
                  role: { type: 'string', enum: ['patient', 'doctor', 'admin', 'biologist'], example: 'patient' },
                  first_name: { type: 'string', example: 'Alex' },
                  last_name: { type: 'string', example: 'Taylor' },
                  phone: { type: 'string', example: '+1234567899' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User created successfully' },
          400: { description: 'Validation error or email already in use' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in and obtain JWT access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'doctor1@healthcare.com' },
                  password: { type: 'string', example: 'doctor123' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' },
          400: { description: 'Invalid credentials' }
        }
      }
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'List all users (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of users' },
          403: { description: 'Forbidden' }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user details by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'User profile details' },
          404: { description: 'User not found' }
        }
      },
      put: {
        tags: ['Users'],
        summary: 'Update user profile (Self or Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  first_name: { type: 'string' },
                  last_name: { type: 'string' },
                  phone: { type: 'string' },
                  emergency_contact: { type: 'string' },
                  blood_type: { type: 'string' },
                  allergies: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'User updated successfully' }
        }
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user account (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'User deleted' }
        }
      }
    },
    '/api/appointments': {
      get: {
        tags: ['Appointments'],
        summary: 'List appointments for authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of appointments' }
        }
      },
      post: {
        tags: ['Appointments'],
        summary: 'Create a new appointment',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['doctor_id', 'appointment_date'],
                properties: {
                  doctor_id: { type: 'integer', example: 2 },
                  appointment_date: { type: 'string', format: 'date-time', example: '2026-11-30 14:00:00' },
                  notes: { type: 'string', example: 'Follow up on laboratory results' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Appointment scheduled' },
          400: { description: 'Conflict or invalid parameters' }
        }
      }
    },
    '/api/appointments/{id}': {
      put: {
        tags: ['Appointments'],
        summary: 'Update appointment status or notes',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'], example: 'completed' },
                  notes: { type: 'string', example: 'Appointment completed successfully.' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Appointment updated' }
        }
      },
      delete: {
        tags: ['Appointments'],
        summary: 'Cancel an appointment',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Appointment cancelled' }
        }
      }
    },
    '/api/medical-records': {
      get: {
        tags: ['Medical Records'],
        summary: 'Get medical records for current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Medical records retrieved' }
        }
      },
      post: {
        tags: ['Medical Records'],
        summary: 'Create medical record (Doctor only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['patient_id', 'diagnosis', 'prescription'],
                properties: {
                  patient_id: { type: 'integer', example: 5 },
                  diagnosis: { type: 'string', example: 'Upper Respiratory Infection' },
                  prescription: { type: 'string', example: 'Amoxicillin 500mg 3x/day for 7 days' },
                  notes: { type: 'string', example: 'Drink plenty of fluids.' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Medical record created' }
        }
      }
    },
    '/api/medical-records/{id}': {
      get: {
        tags: ['Medical Records'],
        summary: 'Get single medical record by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Record details' }
        }
      },
      put: {
        tags: ['Medical Records'],
        summary: 'Update medical record (Doctor only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  diagnosis: { type: 'string' },
                  prescription: { type: 'string' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Medical record updated' }
        }
      }
    },
    '/api/test-results': {
      get: {
        tags: ['Test Results'],
        summary: 'List lab tests and results',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'patient_id', schema: { type: 'integer' } },
          { in: 'query', name: 'status', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of test results' }
        }
      }
    },
    '/api/test-results/order': {
      post: {
        tags: ['Test Results'],
        summary: 'Order lab test for a patient (Doctor only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['patient_id', 'test_name'],
                properties: {
                  patient_id: { type: 'integer', example: 5 },
                  test_name: { type: 'string', example: 'Lipid Profile' },
                  notes: { type: 'string', example: 'Fasting 12 hours required' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Test ordered' }
        }
      }
    },
    '/api/test-results/{id}': {
      get: {
        tags: ['Test Results'],
        summary: 'Get test result details by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Test result details' }
        }
      },
      put: {
        tags: ['Test Results'],
        summary: 'Submit test results (Biologist only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['result', 'reference_range'],
                properties: {
                  result: { type: 'string', example: 'Total Cholesterol: 185 mg/dL' },
                  reference_range: { type: 'string', example: '< 200 mg/dL' },
                  notes: { type: 'string', example: 'Normal lipid levels' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Test results updated' }
        }
      }
    },
    '/api/health-parameters': {
      get: {
        tags: ['Health Parameters'],
        summary: 'Retrieve health vitals for a patient',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'patient_id', schema: { type: 'integer' } },
          { in: 'query', name: 'type', schema: { type: 'string' } },
          { in: 'query', name: 'startDate', schema: { type: 'string' } },
          { in: 'query', name: 'endDate', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of vitals' }
        }
      },
      post: {
        tags: ['Health Parameters'],
        summary: 'Record new health vital sign',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['parameter_type', 'value', 'unit'],
                properties: {
                  patient_id: { type: 'integer', example: 5 },
                  parameter_type: { type: 'string', example: 'heart_rate' },
                  value: { type: 'number', example: 72 },
                  unit: { type: 'string', example: 'bpm' },
                  notes: { type: 'string', example: 'Resting pulse' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Vital recorded' }
        }
      }
    },
    '/api/health-parameters/stats': {
      get: {
        tags: ['Health Parameters'],
        summary: 'Get min, max, avg statistics for a parameter',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'patient_id', schema: { type: 'integer' } },
          { in: 'query', name: 'type', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Aggregated statistics' }
        }
      }
    },
    '/api/health-parameters/trends': {
      get: {
        tags: ['Health Parameters'],
        summary: 'Get chronological trends for a parameter',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'patient_id', schema: { type: 'integer' } },
          { in: 'query', name: 'type', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Trend records' }
        }
      }
    },
    '/api/health-parameters/alerts': {
      get: {
        tags: ['Health Parameters'],
        summary: 'Get vitals that triggered threshold alerts',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'patient_id', schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Alert list' }
        }
      }
    },
    '/api/health-parameters/thresholds': {
      post: {
        tags: ['Health Parameters'],
        summary: 'Set alert threshold for a vital sign',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['parameter_type'],
                properties: {
                  parameter_type: { type: 'string', example: 'heart_rate' },
                  min_value: { type: 'number', example: 50 },
                  max_value: { type: 'number', example: 110 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Threshold saved' }
        }
      }
    },
    '/api/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Get current user notifications',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'read', schema: { type: 'boolean' } }
        ],
        responses: {
          200: { description: 'List of notifications' }
        }
      },
      post: {
        tags: ['Notifications'],
        summary: 'Send a notification (Admin / Doctor)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user_id', 'type', 'title', 'content'],
                properties: {
                  user_id: { type: 'integer', example: 5 },
                  type: { type: 'string', example: 'reminder' },
                  title: { type: 'string', example: 'Appointment Tomorrow' },
                  content: { type: 'string', example: 'You have an appointment tomorrow at 10 AM.' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Notification sent' }
        }
      }
    },
    '/api/notifications/{id}/read': {
      put: {
        tags: ['Notifications'],
        summary: 'Mark single notification as read',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Notification updated' }
        }
      }
    },
    '/api/notifications/read-all': {
      put: {
        tags: ['Notifications'],
        summary: 'Mark all notifications as read',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'All notifications marked as read' }
        }
      }
    },
    '/api/notifications/unread-count': {
      get: {
        tags: ['Notifications'],
        summary: 'Get count of unread notifications',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Unread notification count' }
        }
      }
    },
    '/api/messages': {
      get: {
        tags: ['Messages'],
        summary: 'Retrieve messages for user',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'with_user', schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Message thread' }
        }
      },
      post: {
        tags: ['Messages'],
        summary: 'Send a message to another user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['receiver_id', 'content'],
                properties: {
                  receiver_id: { type: 'integer', example: 5 },
                  content: { type: 'string', example: 'Your latest prescription has been updated.' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Message sent' }
        }
      }
    },
    '/api/messages/{id}/read': {
      put: {
        tags: ['Messages'],
        summary: 'Mark message as read',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Message marked as read' }
        }
      }
    },
    '/api/messages/unread': {
      get: {
        tags: ['Messages'],
        summary: 'Get unread message count',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Unread count' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: [] // Pre-defined openapi spec above ensures full typed coverage
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};

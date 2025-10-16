# IDEF Internacional - Backend Integration Contracts

## Frontend Mock Data (to be replaced)
Location: `/app/frontend/src/mock.js`

### Mock Functions to Remove:
- `submitContactForm()` - Currently simulates form submission with setTimeout

## Backend API Endpoints to Implement

### 1. Contact Form Submission
**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "phone": "string (optional)",
  "subject": "string (required)",
  "message": "string (required)"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Consulta recibida correctamente",
  "id": "mongodb_object_id"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["field validation errors"]
}
```

### 2. Get Contact Submissions (Optional Admin)
**Endpoint:** `GET /api/contact`

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "subject": "string",
    "message": "string",
    "created_at": "datetime",
    "status": "pending|reviewed|responded"
  }
]
```

## MongoDB Collections

### contacts
```
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String (optional),
  subject: String,
  message: String,
  status: String (default: "pending"),
  created_at: DateTime,
  updated_at: DateTime
}
```

## Frontend Integration Changes

### File: `/app/frontend/src/components/ContactSection.jsx`

**Changes Required:**
1. Remove import of `submitContactForm` from mock.js
2. Replace mock function with actual API call using axios
3. Update API endpoint to: `${BACKEND_URL}/api/contact`
4. Handle real error responses from backend
5. Add proper form validation error display

**Integration Code:**
```javascript
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await axios.post(`${BACKEND_URL}/api/contact`, formData);
    
    if (response.data.success) {
      toast({
        title: '¡Mensaje enviado!',
        description: 'Nos pondremos en contacto contigo pronto.',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: error.response?.data?.message || 'Hubo un problema al enviar el mensaje.',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

## Validation Rules

### Backend Validation:
- **name**: Required, min 2 chars, max 100 chars
- **email**: Required, valid email format
- **phone**: Optional, valid phone format if provided
- **subject**: Required, min 5 chars, max 200 chars
- **message**: Required, min 10 chars, max 2000 chars

### Frontend Validation:
- Use HTML5 validation attributes
- Show inline error messages
- Disable submit button while submitting

## Testing Checklist

### Backend Tests:
- [ ] POST /api/contact with valid data returns success
- [ ] POST /api/contact with missing fields returns validation errors
- [ ] POST /api/contact with invalid email returns error
- [ ] Data is correctly saved to MongoDB
- [ ] GET /api/contact returns all submissions

### Integration Tests:
- [ ] Form submission from frontend saves to backend
- [ ] Success toast appears on successful submission
- [ ] Error toast appears on failed submission
- [ ] Form clears after successful submission
- [ ] Loading state works correctly

## Implementation Priority

1. **Backend API** - Implement contact endpoints
2. **MongoDB Models** - Create contact schema
3. **Frontend Integration** - Replace mock with real API
4. **Testing** - Verify end-to-end functionality

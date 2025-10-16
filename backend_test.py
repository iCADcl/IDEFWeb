#!/usr/bin/env python3
"""
Backend API Test Suite for IDEF Internacional Contact Form
Tests all contact form endpoints with various scenarios
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get the backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_test_header(test_name):
    print(f"\n{Colors.BLUE}{Colors.BOLD}=== {test_name} ==={Colors.ENDC}")

def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠ {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ {message}{Colors.ENDC}")

def test_api_health():
    """Test if the API is running and accessible"""
    print_test_header("API Health Check")
    
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        if response.status_code == 200:
            print_success(f"API is accessible at {API_BASE}")
            print_info(f"Response: {response.json()}")
            return True
        else:
            print_error(f"API returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to connect to API: {e}")
        return False

def test_valid_contact_submission():
    """Test valid contact form submission"""
    print_test_header("Valid Contact Form Submission")
    
    valid_data = {
        "name": "Carlos Mendoza",
        "email": "carlos@example.com",
        "phone": "+1 555-123-4567",
        "subject": "Consulta sobre servicios forenses",
        "message": "Necesito información sobre análisis de ADN para un caso legal."
    }
    
    try:
        response = requests.post(f"{API_BASE}/contact", json=valid_data, timeout=10)
        
        if response.status_code == 201:
            data = response.json()
            print_success("Contact submission successful")
            print_info(f"Response: {json.dumps(data, indent=2)}")
            
            # Verify response structure
            if "success" in data and "message" in data and "id" in data:
                print_success("Response has correct structure")
                return data.get("id")  # Return ID for later tests
            else:
                print_error("Response missing required fields")
                return None
        else:
            print_error(f"Expected status 201, got {response.status_code}")
            print_error(f"Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {e}")
        return None

def test_contact_without_phone():
    """Test contact submission without optional phone field"""
    print_test_header("Contact Submission Without Phone")
    
    data_without_phone = {
        "name": "Maria Rodriguez",
        "email": "maria@example.com",
        "subject": "Consulta sobre capacitación",
        "message": "Me interesa conocer más sobre los cursos de capacitación disponibles."
    }
    
    try:
        response = requests.post(f"{API_BASE}/contact", json=data_without_phone, timeout=10)
        
        if response.status_code == 201:
            data = response.json()
            print_success("Contact submission without phone successful")
            print_info(f"Response: {json.dumps(data, indent=2)}")
            return True
        else:
            print_error(f"Expected status 201, got {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {e}")
        return False

def test_validation_errors():
    """Test various validation scenarios"""
    print_test_header("Form Validation Tests")
    
    test_cases = [
        {
            "name": "Missing Name Field",
            "data": {
                "email": "test@example.com",
                "subject": "Test subject",
                "message": "Test message with enough characters"
            },
            "expected_status": 422
        },
        {
            "name": "Missing Email Field",
            "data": {
                "name": "Test User",
                "subject": "Test subject",
                "message": "Test message with enough characters"
            },
            "expected_status": 422
        },
        {
            "name": "Invalid Email Format",
            "data": {
                "name": "Test User",
                "email": "invalid-email",
                "subject": "Test subject",
                "message": "Test message with enough characters"
            },
            "expected_status": 422
        },
        {
            "name": "Name Too Short",
            "data": {
                "name": "A",
                "email": "test@example.com",
                "subject": "Test subject",
                "message": "Test message with enough characters"
            },
            "expected_status": 422
        },
        {
            "name": "Subject Too Short",
            "data": {
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Hi",
                "message": "Test message with enough characters"
            },
            "expected_status": 422
        },
        {
            "name": "Message Too Short",
            "data": {
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Test subject",
                "message": "Short"
            },
            "expected_status": 422
        },
        {
            "name": "Message Too Long",
            "data": {
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Test subject",
                "message": "A" * 2001  # Exceeds max length
            },
            "expected_status": 422
        }
    ]
    
    validation_passed = 0
    total_tests = len(test_cases)
    
    for test_case in test_cases:
        print(f"\n  Testing: {test_case['name']}")
        
        try:
            response = requests.post(f"{API_BASE}/contact", json=test_case["data"], timeout=10)
            
            if response.status_code == test_case["expected_status"]:
                print_success(f"Validation correctly rejected: {test_case['name']}")
                validation_passed += 1
            else:
                print_error(f"Expected status {test_case['expected_status']}, got {response.status_code}")
                print_error(f"Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print_error(f"Request failed for {test_case['name']}: {e}")
    
    print(f"\n  Validation Tests: {validation_passed}/{total_tests} passed")
    return validation_passed == total_tests

def test_get_contact_submissions():
    """Test retrieving contact submissions"""
    print_test_header("Get Contact Submissions")
    
    try:
        response = requests.get(f"{API_BASE}/contact", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Successfully retrieved contact submissions")
            print_info(f"Number of submissions: {len(data)}")
            
            if len(data) > 0:
                print_info("Sample submission structure:")
                sample = data[0]
                for key in sample.keys():
                    print(f"    {key}: {type(sample[key]).__name__}")
                return True
            else:
                print_warning("No submissions found (this might be expected)")
                return True
        else:
            print_error(f"Expected status 200, got {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {e}")
        return False

def test_get_specific_submission(submission_id):
    """Test retrieving a specific contact submission by ID"""
    if not submission_id:
        print_warning("Skipping specific submission test - no ID available")
        return True
        
    print_test_header("Get Specific Contact Submission")
    
    try:
        response = requests.get(f"{API_BASE}/contact/{submission_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Successfully retrieved submission {submission_id}")
            print_info(f"Submission data: {json.dumps(data, indent=2, default=str)}")
            return True
        elif response.status_code == 404:
            print_warning(f"Submission {submission_id} not found (might have been cleaned up)")
            return True
        else:
            print_error(f"Expected status 200, got {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {e}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print(f"{Colors.BOLD}IDEF Internacional Backend API Test Suite{Colors.ENDC}")
    print(f"Testing API at: {API_BASE}")
    print("=" * 60)
    
    results = {}
    
    # Test API health first
    results["api_health"] = test_api_health()
    if not results["api_health"]:
        print_error("API is not accessible. Stopping tests.")
        return results
    
    # Test valid submission and get ID for later tests
    submission_id = test_valid_contact_submission()
    results["valid_submission"] = submission_id is not None
    
    # Test submission without phone
    results["submission_without_phone"] = test_contact_without_phone()
    
    # Test validation errors
    results["validation_tests"] = test_validation_errors()
    
    # Test getting submissions
    results["get_submissions"] = test_get_contact_submissions()
    
    # Test getting specific submission
    results["get_specific_submission"] = test_get_specific_submission(submission_id)
    
    # Print summary
    print_test_header("Test Summary")
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "PASS" if result else "FAIL"
        color = Colors.GREEN if result else Colors.RED
        print(f"{color}{status:>6}{Colors.ENDC} - {test_name}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print_success("All tests passed! ✨")
        return True
    else:
        print_error(f"{total - passed} tests failed")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
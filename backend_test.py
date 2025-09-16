#!/usr/bin/env python3
"""
Backend API Testing Suite for TZG Artwork System
Tests all artwork-related API endpoints including authentication, file uploads, and CRUD operations.
"""

import requests
import json
import os
import tempfile
from io import BytesIO
import time

# Get backend URL from environment
BACKEND_URL = "https://tzg-virtual-lodge.preview.emergentagent.com/api"

class ArtworkAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.auth_token = None
        self.test_user_email = "christopher.king@artlodge.com"
        self.test_user_password = "CreativePassion2024!"
        self.test_user_name = "Christopher Royal King"
        
        # Test results tracking
        self.results = {
            "health_check": False,
            "user_registration": False,
            "user_login": False,
            "get_all_suites": False,
            "get_specific_suite": False,
            "upload_painting": False,
            "upload_music": False,
            "upload_writing": False,
            "get_suite_artworks": False,
            "get_specific_artwork": False,
            "get_public_gallery": False,
            "like_artwork": False,
            "update_artwork": False,
            "delete_artwork": False,
            "error_handling": False
        }
        
        self.errors = []
        self.created_artworks = []  # Track created artworks for cleanup

    def log_error(self, test_name, error_msg):
        """Log an error for a specific test"""
        error_entry = f"{test_name}: {error_msg}"
        self.errors.append(error_entry)
        print(f"❌ {error_entry}")

    def log_success(self, test_name, message=""):
        """Log a successful test"""
        self.results[test_name] = True
        print(f"✅ {test_name}: {message}")

    def test_health_check(self):
        """Test if backend is running and accessible"""
        print("\n🔍 Testing API Health Check...")
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_success("health_check", "Backend is healthy and database connected")
                    return True
                else:
                    self.log_error("health_check", f"Unhealthy status: {data}")
            else:
                self.log_error("health_check", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("health_check", f"Connection failed: {str(e)}")
        return False

    def test_user_registration(self):
        """Test user registration"""
        print("\n👤 Testing User Registration...")
        try:
            # First try to register a new user
            user_data = {
                "name": self.test_user_name,
                "email": self.test_user_email,
                "password": self.test_user_password
            }
            
            response = requests.post(f"{self.base_url}/auth/register", json=user_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.auth_token = data["access_token"]
                    self.log_success("user_registration", f"User registered successfully")
                    return True
                else:
                    self.log_error("user_registration", "No access token in response")
            elif response.status_code == 400 and "already registered" in response.text:
                # User already exists, try to login instead
                self.log_success("user_registration", "User already exists (expected)")
                return True
            else:
                self.log_error("user_registration", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("user_registration", f"Request failed: {str(e)}")
        return False

    def test_user_login(self):
        """Test user login"""
        print("\n🔐 Testing User Login...")
        try:
            login_data = {
                "email": self.test_user_email,
                "password": self.test_user_password
            }
            
            response = requests.post(f"{self.base_url}/auth/login", json=login_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.auth_token = data["access_token"]
                    self.log_success("user_login", f"Login successful, token obtained")
                    return True
                else:
                    self.log_error("user_login", "No access token in response")
            else:
                self.log_error("user_login", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("user_login", f"Request failed: {str(e)}")
        return False

    def get_auth_headers(self):
        """Get authorization headers"""
        if not self.auth_token:
            return {}
        return {"Authorization": f"Bearer {self.auth_token}"}

    def test_get_all_suites(self):
        """Test getting all artist suites"""
        print("\n🏠 Testing Get All Suites...")
        try:
            response = requests.get(f"{self.base_url}/suites", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) == 6:
                    # Verify suite structure
                    required_fields = ["id", "suite_name", "artist_name", "room_number", "initials"]
                    suite_ids = [suite["id"] for suite in data]
                    expected_ids = [f"suite-{i}" for i in range(1, 7)]
                    
                    if all(field in data[0] for field in required_fields) and set(suite_ids) == set(expected_ids):
                        self.log_success("get_all_suites", f"All 6 suites returned with correct structure")
                        return True
                    else:
                        self.log_error("get_all_suites", "Suite structure or IDs incorrect")
                else:
                    self.log_error("get_all_suites", f"Expected 6 suites, got {len(data) if isinstance(data, list) else 'non-list'}")
            else:
                self.log_error("get_all_suites", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("get_all_suites", f"Request failed: {str(e)}")
        return False

    def test_get_specific_suite(self):
        """Test getting specific suite information"""
        print("\n🎨 Testing Get Specific Suite...")
        try:
            # Test valid suite
            response = requests.get(f"{self.base_url}/suites/suite-1", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("id") == "suite-1" and data.get("artist_name") == "Christopher Royal King":
                    self.log_success("get_specific_suite", "Suite-1 data retrieved correctly")
                    
                    # Test invalid suite
                    invalid_response = requests.get(f"{self.base_url}/suites/invalid-suite", timeout=10)
                    if invalid_response.status_code == 404:
                        self.log_success("get_specific_suite", "Invalid suite properly returns 404")
                        return True
                    else:
                        self.log_error("get_specific_suite", "Invalid suite should return 404")
                else:
                    self.log_error("get_specific_suite", "Suite data incorrect")
            else:
                self.log_error("get_specific_suite", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("get_specific_suite", f"Request failed: {str(e)}")
        return False

    def create_test_file(self, content_type, content):
        """Create a temporary test file"""
        if content_type.startswith('image/'):
            # Create a simple test image (1x1 pixel PNG)
            png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc\xf8\x00\x00\x00\x01\x00\x01\x00\x00\x00\x00IEND\xaeB`\x82'
            return BytesIO(png_data)
        elif content_type.startswith('text/'):
            return BytesIO(content.encode('utf-8'))
        elif content_type.startswith('audio/'):
            # Create minimal WAV file
            wav_data = b'RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00'
            return BytesIO(wav_data)
        else:
            return BytesIO(content.encode('utf-8'))

    def test_upload_artwork(self, suite_id, artwork_type, content_type, filename):
        """Test artwork upload"""
        print(f"\n📤 Testing Upload {artwork_type.title()} to {suite_id}...")
        
        if not self.auth_token:
            self.log_error(f"upload_{artwork_type}", "No auth token available")
            return False
            
        try:
            # Create test file
            test_content = f"Test {artwork_type} content for {suite_id}"
            file_data = self.create_test_file(content_type, test_content)
            
            # Prepare form data
            files = {
                'file': (filename, file_data, content_type)
            }
            
            form_data = {
                'title': f'Test {artwork_type.title()} - {suite_id}',
                'description': f'A test {artwork_type} uploaded to {suite_id}',
                'artwork_type': artwork_type,
                'tags': json.dumps([artwork_type, 'test', 'api']),
                'is_public': 'true'
            }
            
            response = requests.post(
                f"{self.base_url}/suites/{suite_id}/artworks",
                files=files,
                data=form_data,
                headers=self.get_auth_headers(),
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("id") and data.get("type") == artwork_type:
                    self.created_artworks.append(data["id"])
                    self.log_success(f"upload_{artwork_type}", f"Successfully uploaded {artwork_type}")
                    return True
                else:
                    self.log_error(f"upload_{artwork_type}", "Response missing required fields")
            else:
                self.log_error(f"upload_{artwork_type}", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error(f"upload_{artwork_type}", f"Request failed: {str(e)}")
        return False

    def test_get_suite_artworks(self):
        """Test getting artworks for a specific suite"""
        print("\n🖼️ Testing Get Suite Artworks...")
        
        if not self.auth_token:
            self.log_error("get_suite_artworks", "No auth token available")
            return False
            
        try:
            response = requests.get(
                f"{self.base_url}/suites/suite-1/artworks",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_success("get_suite_artworks", f"Retrieved {len(data)} artworks from suite-1")
                    return True
                else:
                    self.log_error("get_suite_artworks", "Response is not a list")
            else:
                self.log_error("get_suite_artworks", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("get_suite_artworks", f"Request failed: {str(e)}")
        return False

    def test_get_specific_artwork(self):
        """Test getting specific artwork by ID"""
        print("\n🎯 Testing Get Specific Artwork...")
        
        if not self.created_artworks:
            self.log_error("get_specific_artwork", "No artworks available to test")
            return False
            
        try:
            artwork_id = self.created_artworks[0]
            response = requests.get(f"{self.base_url}/artworks/{artwork_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("id") == artwork_id:
                    self.log_success("get_specific_artwork", f"Retrieved artwork {artwork_id}")
                    return True
                else:
                    self.log_error("get_specific_artwork", "Artwork ID mismatch")
            else:
                self.log_error("get_specific_artwork", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("get_specific_artwork", f"Request failed: {str(e)}")
        return False

    def test_get_public_gallery(self):
        """Test getting public gallery"""
        print("\n🌐 Testing Get Public Gallery...")
        try:
            response = requests.get(f"{self.base_url}/public-gallery", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_success("get_public_gallery", f"Retrieved {len(data)} public artworks")
                    return True
                else:
                    self.log_error("get_public_gallery", "Response is not a list")
            else:
                self.log_error("get_public_gallery", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("get_public_gallery", f"Request failed: {str(e)}")
        return False

    def test_like_artwork(self):
        """Test liking an artwork"""
        print("\n❤️ Testing Like Artwork...")
        
        if not self.auth_token or not self.created_artworks:
            self.log_error("like_artwork", "No auth token or artworks available")
            return False
            
        try:
            artwork_id = self.created_artworks[0]
            response = requests.post(
                f"{self.base_url}/artworks/{artwork_id}/like",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_success("like_artwork", f"Successfully liked artwork {artwork_id}")
                    return True
                else:
                    self.log_error("like_artwork", "No success message in response")
            else:
                self.log_error("like_artwork", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("like_artwork", f"Request failed: {str(e)}")
        return False

    def test_update_artwork(self):
        """Test updating artwork details"""
        print("\n✏️ Testing Update Artwork...")
        
        if not self.auth_token or not self.created_artworks:
            self.log_error("update_artwork", "No auth token or artworks available")
            return False
            
        try:
            artwork_id = self.created_artworks[0]
            update_data = {
                "title": "Updated Test Artwork Title",
                "description": "This artwork has been updated via API test",
                "tags": ["updated", "test", "api"]
            }
            
            response = requests.put(
                f"{self.base_url}/artworks/{artwork_id}",
                json=update_data,
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("title") == update_data["title"]:
                    self.log_success("update_artwork", f"Successfully updated artwork {artwork_id}")
                    return True
                else:
                    self.log_error("update_artwork", "Title not updated correctly")
            else:
                self.log_error("update_artwork", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("update_artwork", f"Request failed: {str(e)}")
        return False

    def test_delete_artwork(self):
        """Test deleting artwork"""
        print("\n🗑️ Testing Delete Artwork...")
        
        if not self.auth_token or not self.created_artworks:
            self.log_error("delete_artwork", "No auth token or artworks available")
            return False
            
        try:
            # Only delete the last artwork to keep some for other tests
            artwork_id = self.created_artworks[-1]
            response = requests.delete(
                f"{self.base_url}/artworks/{artwork_id}",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.created_artworks.remove(artwork_id)
                    self.log_success("delete_artwork", f"Successfully deleted artwork {artwork_id}")
                    return True
                else:
                    self.log_error("delete_artwork", "No success message in response")
            else:
                self.log_error("delete_artwork", f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_error("delete_artwork", f"Request failed: {str(e)}")
        return False

    def test_error_handling(self):
        """Test various error conditions"""
        print("\n⚠️ Testing Error Handling...")
        
        error_tests_passed = 0
        total_error_tests = 3
        
        try:
            # Test 1: Invalid suite ID for artwork upload
            if self.auth_token:
                files = {'file': ('test.jpg', BytesIO(b'fake image'), 'image/jpeg')}
                form_data = {
                    'title': 'Test',
                    'artwork_type': 'painting',
                    'tags': '[]'
                }
                
                response = requests.post(
                    f"{self.base_url}/suites/invalid-suite/artworks",
                    files=files,
                    data=form_data,
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 404:
                    error_tests_passed += 1
                    print("  ✅ Invalid suite ID properly returns 404")
                else:
                    print(f"  ❌ Invalid suite ID test failed: {response.status_code}")
            
            # Test 2: Unauthorized access
            response = requests.get(f"{self.base_url}/suites/suite-1/artworks", timeout=10)
            if response.status_code == 401:
                error_tests_passed += 1
                print("  ✅ Unauthorized access properly returns 401")
            else:
                print(f"  ❌ Unauthorized access test failed: {response.status_code}")
            
            # Test 3: Invalid artwork ID
            response = requests.get(f"{self.base_url}/artworks/invalid-id", timeout=10)
            if response.status_code == 404:
                error_tests_passed += 1
                print("  ✅ Invalid artwork ID properly returns 404")
            else:
                print(f"  ❌ Invalid artwork ID test failed: {response.status_code}")
            
            if error_tests_passed == total_error_tests:
                self.log_success("error_handling", f"All {total_error_tests} error handling tests passed")
                return True
            else:
                self.log_error("error_handling", f"Only {error_tests_passed}/{total_error_tests} error tests passed")
                
        except Exception as e:
            self.log_error("error_handling", f"Error testing failed: {str(e)}")
        return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting TZG Artwork API Test Suite")
        print("=" * 50)
        
        # Core API tests
        if not self.test_health_check():
            print("\n❌ Backend health check failed. Stopping tests.")
            return self.generate_report()
        
        # Authentication tests
        self.test_user_registration()
        if not self.test_user_login():
            print("\n❌ Authentication failed. Some tests will be skipped.")
        
        # Suite information tests
        self.test_get_all_suites()
        self.test_get_specific_suite()
        
        # Artwork upload tests (different types)
        self.test_upload_artwork("suite-1", "painting", "image/png", "test_painting.png")
        self.test_upload_artwork("suite-2", "music", "audio/wav", "test_music.wav")
        self.test_upload_artwork("suite-4", "writing", "text/plain", "test_writing.txt")
        
        # Artwork retrieval tests
        self.test_get_suite_artworks()
        self.test_get_specific_artwork()
        self.test_get_public_gallery()
        
        # Artwork interaction tests
        self.test_like_artwork()
        self.test_update_artwork()
        self.test_delete_artwork()
        
        # Error handling tests
        self.test_error_handling()
        
        return self.generate_report()

    def generate_report(self):
        """Generate final test report"""
        print("\n" + "=" * 50)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 50)
        
        passed_tests = sum(1 for result in self.results.values() if result)
        total_tests = len(self.results)
        
        print(f"\n✅ Passed: {passed_tests}/{total_tests} tests")
        print(f"❌ Failed: {total_tests - passed_tests}/{total_tests} tests")
        
        if self.errors:
            print(f"\n🚨 ERRORS ENCOUNTERED ({len(self.errors)}):")
            for error in self.errors:
                print(f"  • {error}")
        
        # Detailed results
        print(f"\n📋 DETAILED RESULTS:")
        for test_name, passed in self.results.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"  {test_name}: {status}")
        
        # Cleanup info
        if self.created_artworks:
            print(f"\n🧹 Created {len(self.created_artworks)} test artworks (cleanup may be needed)")
        
        success_rate = (passed_tests / total_tests) * 100
        print(f"\n🎯 Overall Success Rate: {success_rate:.1f}%")
        
        return {
            "success_rate": success_rate,
            "passed_tests": passed_tests,
            "total_tests": total_tests,
            "errors": self.errors,
            "results": self.results
        }


if __name__ == "__main__":
    tester = ArtworkAPITester()
    report = tester.run_all_tests()
    
    # Exit with appropriate code
    if report["success_rate"] >= 80:
        print(f"\n🎉 Test suite completed successfully!")
        exit(0)
    else:
        print(f"\n⚠️ Test suite completed with issues.")
        exit(1)
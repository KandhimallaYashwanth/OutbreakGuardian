#!/usr/bin/env python3
"""
Test script for OutbreakGuardian ML API
"""
import requests
import json
import time

API_BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_model_info():
    """Test model info endpoint"""
    print("\n📊 Testing model info endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/model/info")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Model info failed: {e}")
        return False

def test_prediction():
    """Test prediction endpoint"""
    print("\n🔮 Testing prediction endpoint...")
    try:
        test_data = {
            "temperature": 25.5,
            "humidity": 60.0,
            "populationDensity": 1500.0,
            "previousCases": 20,
            "wastewaterLevels": 45.0,
            "socialMediaSentiment": 0.6,
            "timestamp": "2024-01-01T12:00:00Z"
        }
        
        response = requests.post(f"{API_BASE_URL}/predict", json=test_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Prediction failed: {e}")
        return False

def test_optimization():
    """Test optimization endpoint"""
    print("\n⚡ Testing optimization endpoint...")
    try:
        test_data = {
            "beds": 85,
            "nurses": 120,
            "doctors": 35,
            "equipment": 90,
            "currentWaitTimes": [78, 45, 62, 35, 41],
            "patientFlow": [120, 80, 90, 150, 60]
        }
        
        response = requests.post(f"{API_BASE_URL}/optimize", json=test_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Optimization failed: {e}")
        return False

def test_batch_prediction():
    """Test batch prediction endpoint"""
    print("\n📦 Testing batch prediction endpoint...")
    try:
        test_data = {
            "inputs": [
                {
                    "temperature": 25.5,
                    "humidity": 60.0,
                    "populationDensity": 1500.0,
                    "previousCases": 20,
                    "wastewaterLevels": 45.0,
                    "socialMediaSentiment": 0.6,
                    "timestamp": "2024-01-01T12:00:00Z"
                },
                {
                    "temperature": 22.0,
                    "humidity": 55.0,
                    "populationDensity": 1200.0,
                    "previousCases": 15,
                    "wastewaterLevels": 35.0,
                    "socialMediaSentiment": 0.5,
                    "timestamp": "2024-01-01T13:00:00Z"
                }
            ]
        }
        
        response = requests.post(f"{API_BASE_URL}/predict/batch", json=test_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Batch prediction failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing OutbreakGuardian ML API")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health),
        ("Model Info", test_model_info),
        ("Prediction", test_prediction),
        ("Optimization", test_optimization),
        ("Batch Prediction", test_batch_prediction)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 50)
    print("📋 Test Results:")
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the API server and model files.")

if __name__ == "__main__":
    main()


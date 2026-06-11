#!/usr/bin/env python3
"""
Backend server starter for CarScan
Runs from the backend folder with proper Python paths
"""
import sys
import os

# Set up Python path so backend module can be imported
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    import uvicorn
    
    print("=" * 60)
    print("🚗 CarScan Backend Server")
    print("=" * 60)
    print(f"📁 Running from: {backend_dir}")
    print(f"🔧 Python path set: {backend_dir}")
    print("🌐 Starting server on http://0.0.0.0:8001")
    print("=" * 60)
    
    uvicorn.run(
        "app.main:app",  # Use import string for reload to work
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )

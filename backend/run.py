#!/usr/bin/env python3
"""
Production-ready server runner for Recovery Services API
"""
import uvicorn
import os
import sys

def main():
    """Start the FastAPI server with production settings"""
    
    # Default configuration
    config = {
        "app": "app:app",
        "host": os.getenv("HOST", "127.0.0.1"),
        "port": int(os.getenv("PORT", 8001)),
        "reload": os.getenv("RELOAD", "true").lower() == "true",
        "log_level": os.getenv("LOG_LEVEL", "info"),
    }
    
    # Check if we're in development or production
    if os.getenv("ENVIRONMENT") == "production":
        config.update({
            "reload": False,
            "workers": int(os.getenv("WORKERS", 4)),
            "host": "0.0.0.0"
        })
    
    print("Recovery Services API")
    print(f"Server: http://{config['host']}:{config['port']}")
    print(f"API Docs: http://{config['host']}:{config['port']}/docs")
    print(f"Hot Reload: {'ON' if config['reload'] else 'OFF'}")
    print("=" * 50)
    
    try:
        uvicorn.run(**config)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

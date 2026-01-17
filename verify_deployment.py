#!/usr/bin/env python3
"""
Deployment Verification Script
Checks if everything is ready for deployment
"""

import os
import sys
import json
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def check_file(path, name):
    """Check if a file exists"""
    if Path(path).exists():
        print(f"{Colors.GREEN}✅{Colors.END} {name}")
        return True
    else:
        print(f"{Colors.RED}❌{Colors.END} {name} - MISSING")
        return False

def check_content(path, content, name):
    """Check if file contains specific content"""
    try:
        with open(path, 'r') as f:
            file_content = f.read()
            if content in file_content:
                print(f"{Colors.GREEN}✅{Colors.END} {name}")
                return True
    except:
        pass
    print(f"{Colors.RED}❌{Colors.END} {name} - NOT FOUND")
    return False

def main():
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}Email Tracker - Deployment Verification{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")
    
    checks = {
        "Backend Files": [
            ("backend/Procfile", None, "Procfile exists"),
            ("backend/runtime.txt", None, "runtime.txt exists"),
            ("backend/requirements.txt", "gunicorn", "gunicorn in requirements"),
            ("backend/requirements.txt", "psycopg2", "psycopg2 in requirements"),
            ("backend/app/core/config.py", "get_settings", "get_settings() function"),
            ("backend/app/core/config.py", "FRONTEND_URL", "FRONTEND_URL in config"),
            ("backend/app/main.py", "CORS", "CORS configuration"),
            ("backend/app/main.py", "/health", "Health check endpoint"),
        ],
        "Frontend Files": [
            ("frontend/.env.production", None, ".env.production exists"),
            ("frontend/package.json", None, "package.json exists"),
            ("frontend/vite.config.js", None, "vite.config.js exists"),
        ],
        "Root Files": [
            (".gitignore", None, ".gitignore exists"),
            (".gitignore", ".env", ".env in .gitignore"),
            (".gitignore", "node_modules", "node_modules in .gitignore"),
            ("README.md", None, "README.md exists"),
            ("DEPLOYMENT_GUIDE.md", None, "DEPLOYMENT_GUIDE.md exists"),
            ("DEPLOYMENT_CHECKLIST.md", None, "DEPLOYMENT_CHECKLIST.md exists"),
            ("DEPLOYMENT_SUMMARY.md", None, "DEPLOYMENT_SUMMARY.md exists"),
            ("DATA_FLOW.md", None, "DATA_FLOW.md exists"),
        ]
    }
    
    total = 0
    passed = 0
    
    for category, file_checks in checks.items():
        print(f"\n{Colors.YELLOW}{category}{Colors.END}:")
        for item in file_checks:
            total += 1
            if len(item) == 3 and item[1] is None:
                path, _, name = item
                if check_file(path, name):
                    passed += 1
            else:
                path, content, name = item
                if check_content(path, content, name):
                    passed += 1
    
    # Summary
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"Results: {passed}/{total} checks passed")
    
    if passed == total:
        print(f"{Colors.GREEN}✅ All deployment files are ready!{Colors.END}")
        print(f"\n{Colors.BLUE}Next steps:{Colors.END}")
        print(f"1. Push to GitHub: git add . && git commit -m 'Ready for deploy' && git push")
        print(f"2. Follow DEPLOYMENT_SUMMARY.md for step-by-step deployment")
        print(f"3. Expected time: 45 minutes")
        return 0
    else:
        print(f"{Colors.RED}❌ Some files are missing!{Colors.END}")
        print(f"Please check DEPLOYMENT_GUIDE.md for required files")
        return 1

if __name__ == "__main__":
    sys.exit(main())

@echo off
REM Create directories
mkdir admin-service\app\config
mkdir admin-service\app\models
mkdir admin-service\app\database\repositories
mkdir admin-service\app\services
mkdir admin-service\app\api\routes
mkdir admin-service\app\utils

REM Create files
type nul > admin-service\app\__init__.py
type nul > admin-service\app\main.py
type nul > admin-service\app\config\__init__.py
type nul > admin-service\app\config\settings.py
type nul > admin-service\app\models\__init__.py
type nul > admin-service\app\models\admin.py
type nul > admin-service\app\database\__init__.py
type nul > admin-service\app\database\connection.py
type nul > admin-service\app\database\repositories\__init__.py
type nul > admin-service\app\database\repositories\admin_repository.py
type nul > admin-service\app\services\__init__.py
type nul > admin-service\app\services\admin_service.py
type nul > admin-service\app\api\__init__.py
type nul > admin-service\app\api\dependencies.py
type nul > admin-service\app\api\routes\__init__.py
type nul > admin-service\app\api\routes\admin.py
type nul > admin-service\app\utils\__init__.py
type nul > admin-service\app\utils\logger.py
type nul > admin-service\requirements.txt
type nul > admin-service\.env.example
type nul > admin-service\Dockerfile
type nul > admin-service\.dockerignore
type nul > admin-service\README.md

echo Directory structure